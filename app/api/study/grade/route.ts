import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

let ai: GoogleGenAI | null = null;
const initAI = () => {
    if (!ai && process.env.GEMINI_API_KEY) {
        ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return ai;
};

export async function POST(req: NextRequest) {
    try {
        const { question, modelAnswer, studentAnswer, gradingCriteria } = await req.json();

        if (!question || !modelAnswer || !studentAnswer) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        const aiClient = initAI();
        if (!aiClient) {
            return NextResponse.json({ error: 'AI integration missing config' }, { status: 503 });
        }

        const prompt = `
You are an expert academic examiner. 
Your task is to grade a student's answer to a short-answer question based on a model answer and specific grading criteria.

QUESTION:
${question}

MODEL ANSWER:
${modelAnswer}

GRADING CRITERIA:
${gradingCriteria?.join(', ') || 'General accuracy and completeness'}

STUDENT'S ANSWER:
${studentAnswer}

YOUR TASK:
1. Assign a score out of 10.
2. Provide brief, constructive feedback.
3. Highlight what they got right and what was missing.

OUTPUT FORMAT:
Return ONLY a raw JSON object.
{
  "score": 8,
  "feedback": "...",
  "missingPoints": ["...", "..."],
  "correctPoints": ["...", "..."]
}
`;

        const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { temperature: 0.2 }
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

        let evaluation;
        try {
            evaluation = JSON.parse(rawResponseText.trim());
        } catch (parseError) {
            console.error('Failed to parse AI response:', rawResponseText);
            throw new Error('Invalid JSON format from AI');
        }

        return NextResponse.json(evaluation);

    } catch (error: any) {
        console.error('Grading API error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
