import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';
import pdf from 'pdf-parse/lib/pdf-parse';
import mammoth from 'mammoth';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialize Gemini
// Note: We'll initialize this inside the route so it doesn't crash on boot if the key is missing yet
let ai: GoogleGenAI | null = null;
const initAI = () => {
    if (!ai && process.env.GEMINI_API_KEY) {
        ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return ai;
};

export async function POST(req: NextRequest) {
    try {
        const { resourceId, type, forceRegenerate } = await req.json();

        if (!resourceId || !type || !['flashcards', 'quiz'].includes(type)) {
            return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
        }

        const aiClient = initAI();
        if (!aiClient) {
            return NextResponse.json({ error: 'AI integration is not configured yet (Missing GEMINI_API_KEY)' }, { status: 503 });
        }

        // 1. Check if we already generated this (Cache Hit)
        const { data: existingQuiz } = await supabaseAdmin
            .from('hub_ai_quizzes')
            .select('id, content') // select ID so we can update it later instead of insert
            .eq('resource_id', resourceId)
            .eq('type', type)
            .single();

        if (existingQuiz && !forceRegenerate) {
            return NextResponse.json({
                cached: true,
                content: existingQuiz.content
            });
        }

        // 2. Fetch the resource details to get the file path
        const { data: resource, error: resourceError } = await supabaseAdmin
            .from('hub_resources')
            .select('*')
            .eq('id', resourceId)
            .single();

        if (resourceError || !resource) {
            return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
        }

        const fileUrl = resource.file_url;
        if (!fileUrl) {
            return NextResponse.json({ error: 'Resource has no file attached' }, { status: 400 });
        }

        // 3. Download the file buffer from Supabase Storage
        // Extract the exact path from the public URL
        const filePath = fileUrl.split('/resources/')[1];
        if (!filePath) {
            return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
        }

        const { data: fileData, error: fileError } = await supabaseAdmin
            .storage
            .from('resources')
            .download(filePath);

        if (fileError || !fileData) {
            console.error("Storage download error:", fileError);
            return NextResponse.json({ error: 'Failed to read file from storage' }, { status: 500 });
        }

        const arrayBuffer = await fileData.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 4. Extract Text
        let extractedText = "";

        // Depending on file extension, we use different parsers
        const lowerCasePath = filePath.toLowerCase();

        if (lowerCasePath.endsWith('.pdf')) {
            try {
                const pdfData = await pdf(buffer);
                extractedText = pdfData.text;
            } catch (err) {
                console.error("PDF Parsing error:", err);
                return NextResponse.json({ error: 'Failed to parse PDF text' }, { status: 500 });
            }
        } else if (lowerCasePath.endsWith('.docx')) {
            try {
                const docData = await mammoth.extractRawText({ buffer });
                extractedText = docData.value;
            } catch (err) {
                console.error("DOCX Parsing error:", err);
                return NextResponse.json({ error: 'Failed to parse DOCX text. Make sure it is a valid .docx file.' }, { status: 500 });
            }
        } else {
            // For other files, try parsing as UTF-8 plaintext
            extractedText = buffer.toString('utf-8');

            // Quick sanity check if it's binary junk (e.g. ppt, xls, images)
            // A simple heuristic is looking for null bytes which are extremely rare in valid utf-8 text.
            if (extractedText.includes('\x00')) {
                return NextResponse.json({ error: 'AI generation currently only supports PDF, DOCX, and TXT files.' }, { status: 400 });
            }
        }

        if (!extractedText || extractedText.trim().length < 50) {
            return NextResponse.json({ error: 'Not enough text found in the document to generate study materials.' }, { status: 400 });
        }

        // Truncate text if it's too massive (Gemini has a big context window, but let's be safe for latency)
        // 100,000 chars is roughly 20-30 pages of dense text.
        const safeText = extractedText.substring(0, 100000);

        // 5. Build the AI Prompt based on type
        let prompt = "";
        if (type === 'flashcards') {
            prompt = `
You are an expert academic tutor. I will provide you with text extracted from a student's study material.
Your task is to generate 15 highly effective flashcards based ONLY on the provided text.

OUTPUT FORMAT:
You MUST return ONLY a raw JSON array. DO NOT wrap the JSON in markdown code blocks like \`\`\`json. DO NOT add any conversational text.
It must exactly match this structure:
[
  { "front": "Question or term here?", "back": "Answer or definition here." },
  { "front": "Another question?", "back": "Another answer." }
]

TEXT CONTENT:
${safeText}
`;
        } else if (type === 'quiz') {
            prompt = `
You are an expert academic tutor. I will provide you with text extracted from a student's study material.
Your task is to generate a 10-question multiple-choice quiz based ONLY on the provided text.
Make the questions challenging but fair. Ensure there is only one obviously correct answer.

OUTPUT FORMAT:
You MUST return ONLY a raw JSON array. DO NOT wrap the JSON in markdown code blocks like \`\`\`json. DO NOT add any conversational text.
It must exactly match this structure:
[
  {
    "question": "What is the main concept?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswerIndex": 1,
    "explanation": "Option B is correct because the text states..."
  }
]

TEXT CONTENT:
${safeText}
`;
        }

        // 6. Call Gemini
        const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.2, // Low temp for factual extraction
            }
        });

        let rawResponseText = response.text;

        // Clean up markdown block if the LLM hallucinated it despite instructions
        if (rawResponseText?.startsWith('```json')) {
            rawResponseText = rawResponseText.replace(/```json\n?/, '').replace(/```\n?$/, '');
        }

        if (!rawResponseText) {
            throw new Error("Empty response from Gemini");
        }

        // Parse JSON
        let generatedContent;
        try {
            generatedContent = JSON.parse(rawResponseText.trim());
        } catch (parseError) {
            console.error("AI JSON Parse Error:", rawResponseText);
            return NextResponse.json({ error: 'The AI generated an invalid format. Please try again.' }, { status: 500 });
        }

        // 7. Save to Database Cache
        let dbError = null;
        if (existingQuiz) {
            // Update the existing record instead of inserting a new one to prevent uniqueness violations
            const { error: updateError } = await supabaseAdmin
                .from('hub_ai_quizzes')
                .update({
                    content: generatedContent,
                    generated_at: new Date().toISOString()
                })
                .eq('id', existingQuiz.id);
            dbError = updateError;
        } else {
            const { error: insertError } = await supabaseAdmin
                .from('hub_ai_quizzes')
                .insert({
                    resource_id: resourceId,
                    type: type,
                    content: generatedContent
                });
            dbError = insertError;
        }

        if (dbError) {
            // We don't strictly need to fail the request if the cache fails, but we should log it
            console.error("Failed to cache AI quiz:", dbError);
        }

        // 8. Return to Frontend
        return NextResponse.json({
            cached: false,
            content: generatedContent
        });

    } catch (error: any) {
        console.error('AI Generation API error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error during AI generation' }, { status: 500 });
    }
}
