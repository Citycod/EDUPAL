import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';
import pdf from 'pdf-parse/lib/pdf-parse';
import mammoth from 'mammoth';
import { checkRateLimit } from '@/lib/rate-limit';

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

// In-memory cache for extracted document text to speed up multi-turn chats
// Maps resourceId -> extracted text
// In production, use Redis or a DB column. This is a simple memory cache for the MVP session.
const textCache = new Map<string, { text: string; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

export async function POST(req: NextRequest) {
    try {
        // Rate Limiting (Stricter for chat: 30 msgs per hour)
        const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
        const { success, reset } = await checkRateLimit(ip, 'ai-chat', 30, 60 * 60 * 1000);

        if (!success) {
            return NextResponse.json(
                { error: `Chat rate limit exceeded. Try again after ${reset.toLocaleTimeString()}.` },
                { status: 429, headers: { 'Retry-After': Math.ceil((reset.getTime() - Date.now()) / 1000).toString() } }
            );
        }

        const { resourceId, messages } = await req.json();

        if (!resourceId || !messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
        }

        const aiClient = initAI();
        if (!aiClient) {
            return NextResponse.json({ error: 'AI integration missing config' }, { status: 503 });
        }

        let extractedText = "";

        // Check Cache First
        const cached = textCache.get(resourceId);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
            extractedText = cached.text;
        } else {
            // Fresh Extraction
            const { data: resource, error: resourceError } = await supabaseAdmin
                .from('hub_resources')
                .select('*')
                .eq('id', resourceId)
                .single();

            if (resourceError || !resource || !resource.file_url) {
                return NextResponse.json({ error: 'Resource not found or has no file' }, { status: 404 });
            }

            const filePath = resource.file_url.split('/resources/')[1];
            if (!filePath) return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });

            const { data: fileData, error: fileError } = await supabaseAdmin.storage.from('resources').download(filePath);
            if (fileError || !fileData) return NextResponse.json({ error: 'Failed to read file from storage' }, { status: 500 });

            const arrayBuffer = await fileData.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const lowerCasePath = filePath.toLowerCase();

            if (lowerCasePath.endsWith('.pdf')) {
                const pdfData = await pdf(buffer);
                extractedText = pdfData.text;
            } else if (lowerCasePath.endsWith('.docx')) {
                const docData = await mammoth.extractRawText({ buffer });
                extractedText = docData.value;
            } else {
                extractedText = buffer.toString('utf-8');
                if (extractedText.includes('\x00')) {
                    return NextResponse.json({ error: 'Unsupported file format for chat.' }, { status: 400 });
                }
            }

            if (!extractedText || extractedText.trim().length < 50) {
                return NextResponse.json({ error: 'Not enough text to chat about.' }, { status: 400 });
            }

            // Save to memory cache
            textCache.set(resourceId, { text: extractedText, timestamp: Date.now() });
        }

        const safeText = extractedText.substring(0, 80000); // 80k chars to leave room for history

        // Prepare System Instruction
        const systemInstruction = `
You are an expert academic tutor natively integrated into the EduPal learning platform.
You are helping a student understand their course material, which may include Past Exam Questions. 
I will provide you with the full text of the student's study document.
YOUR RULES:
1. You MUST base your answers PRIMARILY on the provided document text.
2. If the user uploads an image (Snap & Solve) or asks you to solve a specific question, provide a clear, step-by-step solution. Be educational and explain the reasoning.
3. If the user asks something completely unrelated to the text or the uploaded image, politely decline and steer them back to the topic.
4. Use markdown (bold, bullets, code blocks, math equations using LaTeX syntax if applicable) to format your responses beautifully. Do not output raw JSON.
5. Keep answers concise but comprehensive.

--- STUDY DOCUMENT TEXT ---
${safeText}
--- END DOCUMENT TEXT ---
`;

        // We use GoogleGenAI SDK's multi-turn approach
        // Map the frontend messages array [{role: 'user' | 'model', text: string, image?: string, image_mime_type?: string }]
        const formattedHistory = messages.map((m: any) => {
            const parts: any[] = [];
            
            if (m.text) {
                parts.push({ text: m.text });
            } else if (m.image) {
                // If there is an image but no text, add a default prompt so Gemini knows what to do
                parts.push({ text: "Please solve or explain this image." });
            }

            if (m.image && m.image_mime_type) {
                parts.push({
                    inlineData: {
                        mimeType: m.image_mime_type,
                        data: m.image
                    }
                });
            }

            return {
                role: m.role === 'ai' || m.role === 'model' ? 'model' : 'user',
                parts
            };
        });

        // The newest message is usually the last one
        const userPrompt = formattedHistory.pop();

        if (!userPrompt || userPrompt.role !== 'user') {
            return NextResponse.json({ error: 'Invalid message sequence' }, { status: 400 });
        }

        const chatSession = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                { role: 'user', parts: [{ text: systemInstruction }] },
                { role: 'model', parts: [{ text: "Understood. I will act as the tutor based on the provided document." }] },
                ...formattedHistory,
                userPrompt
            ],
            config: { temperature: 0.3 }
        });

        const rawResponseText = chatSession.text;

        return NextResponse.json({ reply: rawResponseText });
    } catch (error: any) {
        console.error('Chat API error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error during chat' }, { status: 500 });
    }
}
