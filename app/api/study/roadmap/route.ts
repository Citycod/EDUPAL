import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';
import pdf from 'pdf-parse/lib/pdf-parse';
import mammoth from 'mammoth';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

let ai: GoogleGenAI | null = null;
const initAI = () => {
    if (!ai && process.env.GEMINI_API_KEY) {
        ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return ai;
};

export async function POST(req: NextRequest) {
    try {
        const { resourceId, userId, examDate } = await req.json();

        if (!resourceId || !userId || !examDate) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        const aiClient = initAI();
        if (!aiClient) {
            return NextResponse.json({ error: 'AI integration missing config' }, { status: 503 });
        }

        // 1. Fetch Resource
        const { data: resource, error: resourceError } = await supabaseAdmin
            .from('hub_resources')
            .select('*')
            .eq('id', resourceId)
            .single();

        if (resourceError || !resource || !resource.file_url) {
            return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
        }

        // 2. Download and Extract Text
        const filePath = resource.file_url.split('/resources/')[1];
        const { data: fileData, error: fileError } = await supabaseAdmin.storage.from('resources').download(filePath);
        if (fileError || !fileData) return NextResponse.json({ error: 'Failed to read file' }, { status: 500 });

        const arrayBuffer = await fileData.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const lowerCasePath = filePath.toLowerCase();
        let extractedText = "";

        if (lowerCasePath.endsWith('.pdf')) {
            const pdfData = await pdf(buffer);
            extractedText = pdfData.text;
        } else if (lowerCasePath.endsWith('.docx')) {
            const docData = await mammoth.extractRawText({ buffer });
            extractedText = docData.value;
        } else {
            extractedText = buffer.toString('utf-8');
        }

        const safeText = extractedText.substring(0, 50000);

        // 3. Build Prompt
        const today = new Date().toISOString().split('T')[0];
        const prompt = `
You are a highly efficient academic coach. 
I have a student who needs a study plan for an exam on ${examDate}. 
Today is ${today}.
I will provide you with the content of their study material.

YOUR TASK:
Create a daily study roadmap from tomorrow until the exam date. 
Break down the material into logical chunks and assign specific tasks for each day.
Each day should have:
1. "topic": What to focus on.
2. "tasks": List of specific actions (e.g., "Read pages 1-10", "Review flashcards", "Take mock quiz").
3. "goal": The learning objective for that day.

OUTPUT FORMAT:
Return ONLY a raw JSON array of objects, one per day. 
Example structure:
[
  { "date": "2024-03-10", "topic": "Introduction to X", "tasks": ["Task 1", "Task 2"], "goal": "Understand basics" }
]

STUDY MATERIAL:
${safeText}
`;

        const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { temperature: 0.4 }
        });

        let rawResponseText = response.text;
        if (!rawResponseText) {
            throw new Error('Empty response from AI');
        }

        // Clean up markdown block if the LLM hallucinated it despite instructions
        if (rawResponseText.includes('```')) {
            const matches = rawResponseText.match(/```(?:json)?([\s\S]*?)```/);
            if (matches && matches[1]) {
                rawResponseText = matches[1];
            }
        }

        let generatedRoadmap;
        try {
            generatedRoadmap = JSON.parse(rawResponseText.trim());
        } catch (parseError) {
            console.error('Failed to parse AI response:', rawResponseText);
            throw new Error('Invalid JSON format from AI');
        }

        // 4. Save to DB
        const { data, error } = await supabaseAdmin
            .from('hub_study_roadmaps')
            .upsert({
                user_id: userId,
                resource_id: resourceId,
                exam_date: examDate,
                roadmap: generatedRoadmap,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id,resource_id' })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ roadmap: data.roadmap });

    } catch (error: any) {
        console.error('Roadmap API error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
