import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

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
        const { courseCode: rawCourseCode, userId, examDate } = await req.json();
        const courseCode = rawCourseCode?.toUpperCase();

        if (!courseCode || !userId || !examDate) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        const aiClient = initAI();
        if (!aiClient) {
            return NextResponse.json({ error: 'AI integration missing config' }, { status: 503 });
        }

        // 1. Fetch course objectives from catalog (using public views)
        const { data: course, error: courseError } = await supabaseAdmin
            .from('national_courses_view')
            .select(`
                id,
                course_code_standard,
                title_standard,
                national_topics_view (topic_name, learning_objectives)
            `)
            .eq('course_code_standard', courseCode)
            .maybeSingle() as any;

        if (courseError || !course) {
            return NextResponse.json({ error: 'Course not found in NUC Catalog' }, { status: 404 });
        }

        const objectives = course.national_topics_view?.[0]?.learning_objectives || [];
        const objectivesText = objectives.map((obj: string, i: number) => `${i + 1}. ${obj}`).join('\n');

        // 2. Build Prompt
        const today = new Date().toISOString().split('T')[0];
        const prompt = `
You are a highly efficient academic coach. 
I have a student who needs a study plan for an exam on ${examDate} for the course: "${course.course_code_standard}: ${course.title_standard}".
Today is ${today}.

YOUR TASK:
Create a daily study roadmap from tomorrow until the exam date based on these NUC curriculum objectives:
${objectivesText}

STRICT GUIDELINES:
1. Break down the material into logical chunks and assign specific tasks for each day.
2. Each day should have:
   - "topic": What to focus on.
   - "tasks": List of specific actions (e.g., "Read Chapter 1", "Practice MCQ", "Draw Diagram").
   - "goal": The learning objective for that day.
3. Ensure the workload is balanced and realistic.
4. If there are few objectives and many days, include review and mock exam days.

OUTPUT FORMAT:
Return ONLY a raw JSON array of objects, one per day. No markdown code blocks.
Example structure:
[
  { "date": "2024-03-10", "topic": "Introduction to X", "tasks": ["Task 1", "Task 2"], "goal": "Understand basics" }
]
`;

        const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { temperature: 0.4 }
        });

        let rawResponseText = response.text;
        if (!rawResponseText) throw new Error('Empty response from AI');

        // Clean up markdown block if hallucinated
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

        // 3. Save to DB
        const { data, error } = await supabaseAdmin
            .from('hub_study_roadmaps')
            .upsert({
                user_id: userId,
                catalog_course_code: courseCode,
                resource_id: null,
                exam_date: examDate,
                roadmap: generatedRoadmap,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id,catalog_course_code' })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ roadmap: data.roadmap });

    } catch (error: any) {
        console.error('Catalog Roadmap API error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
