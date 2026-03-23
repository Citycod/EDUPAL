import { NextRequest, NextResponse } from 'next/server';
// Triggering recompile for logs - v2
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
        const { courseCode: rawCourseCode, type, forceRegenerate } = await req.json();
        const courseCode = rawCourseCode?.toUpperCase();

        if (!courseCode || !type || !['flashcards', 'quiz', 'notes', 'mock-exam'].includes(type)) {
            return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
        }

        const aiClient = initAI();
        if (!aiClient) {
            return NextResponse.json({ error: 'AI integration is not configured' }, { status: 503 });
        }

        // 1. Check Cache First
        const { data: existingCache, error: cacheError } = await supabaseAdmin
            .from('hub_ai_quizzes')
            .select('content')
            .eq('catalog_course_code', courseCode)
            .eq('type', type)
            .maybeSingle();

        console.log(`[CacheCheck] ${courseCode} (${type}): ${existingCache ? 'HIT' : 'MISS'}`);

        if (existingCache && !forceRegenerate) {
            return NextResponse.json({ content: existingCache.content, cached: true });
        }

        // 2. Fetch course objectives from catalog (using public views)
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
            console.error("Course fetch error:", courseError);
            return NextResponse.json({ error: 'Course not found in NUC Catalog' }, { status: 404 });
        }

        const objectives = course.national_topics_view?.[0]?.learning_objectives || [];
        if (objectives.length === 0) {
            return NextResponse.json({ error: 'No learning objectives found for this course.' }, { status: 400 });
        }

        const objectivesText = objectives.map((obj: string, i: number) => `${i + 1}. ${obj}`).join('\n');

        // 3. Build Prompt
        let prompt = "";
        if (type === 'notes') {
            prompt = `
You are a world-class university professor writing a comprehensive study guide for Nigerian university students.
Generate detailed, explanatory study notes for the course: "${course.course_code_standard}: ${course.title_standard}".

These notes MUST thoroughly cover the following official NUC (National Universities Commission) learning objectives:
${objectivesText}

STRICT STRUCTURE — Follow this format exactly:

# ${course.course_code_standard}: ${course.title_standard}

## Introduction
Write a 2-3 paragraph overview explaining **what this course is about**, **why it matters** in the real world, and **how the topics connect** to each other. Make it engaging and motivating.

## [Section for EACH Learning Objective]
For EVERY learning objective listed above, create a dedicated section with:
- **Heading**: A clear, descriptive H2 heading (not just the objective text verbatim).
- **Explanation**: A thorough, multi-paragraph explanation of the concept. Do NOT just define it — **teach it**. Explain the "why" and "how", not just the "what".
- **Key Terms**: Bold and define important terminology inline.
- **Examples**: Provide at least 1-2 concrete examples. Where appropriate, use examples relevant to Nigeria or Africa (e.g., Nigerian banking systems for databases, NIMC for data management, MTN/Glo networks for networking).
- **Common Misconceptions**: If relevant, address what students often get wrong.
- **Diagrams in Text**: Where helpful, describe relationships using simple ASCII tables or structured lists.

## Summary
A concise recap of ALL key points covered, written as a numbered list.

## Review Questions
Generate 5 thought-provoking questions (mix of short-answer and analytical) that test deep understanding, not memorization.

IMPORTANT RULES:
- Write at a level appropriate for a 200-400 level Nigerian university student.
- Be thorough — each section should be at least 3-4 paragraphs. Do NOT be superficial.
- Use a warm, professional academic tone — like a lecturer who genuinely wants students to understand.
- Format everything in clean Markdown with proper headings (H1, H2, H3), bold, lists, and code blocks where relevant.
- Do NOT include any preamble, conversational filler, or meta-commentary. Start directly with the H1 title.
- The total output should be comprehensive — aim for the depth of a textbook chapter, not a Wikipedia summary.
`;
        } else if (type === 'flashcards') {
            prompt = `
You are an expert academic tutor. Generate 15 high-quality flashcards for the course: "${course.course_code_standard}: ${course.title_standard}".
Base these flashcards STRICTLY on these learning objectives:
${objectivesText}

OUTPUT FORMAT:
Return ONLY a raw JSON array. No markdown code blocks.
Structure: [{ "front": "Question?", "back": "Answer." }]
`;
        } else if (type === 'quiz') {
            prompt = `
You are an expert academic examiner. Generate a 10-question multiple-choice quiz for the course: "${course.course_code_standard}: ${course.title_standard}".
The quiz must test the student's mastery of these official learning objectives:
${objectivesText}

OUTPUT FORMAT:
Return ONLY a raw JSON array of 10 objects. No markdown code blocks.
Structure: [{ "question": "...", "options": ["...", "...", "...", "..."], "correctAnswerIndex": 0, "explanation": "..." }]
`;
        } else if (type === 'mock-exam') {
            prompt = `
You are a senior university professor designing a final examination for the course: "${course.course_code_standard}: ${course.title_standard}".
Based on the following curriculum objectives, generate a comprehensive 40-question mock exam:
${objectivesText}

STRICT EXAM GUIDELINES:
1. Generate exactly 40 Multiple Choice Questions (MCQs).
2. Distribute questions across all learning objectives for balanced coverage.
3. Mix difficulty levels: Easy (10), Medium (20), Hard (10).
4. Each question must have 4 options and one clear correct answer.
5. Provide a brief academic explanation for each correct answer.

OUTPUT FORMAT:
Return ONLY a raw JSON array of 40 objects. No markdown code blocks.
Structure: [{ "question": "...", "options": ["...", "...", "...", "..."], "correctAnswerIndex": 0, "explanation": "..." }]
`;
        }

        // 4. Call Gemini
        const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.3,
            }
        });

        let rawResponseText = response.text;

        if (!rawResponseText) {
            throw new Error('AI failed to return any content.');
        }

        // Clean up markdown block if hallucinated
        if (rawResponseText.trim().startsWith('```json')) {
            rawResponseText = rawResponseText.trim().replace(/```json\n?/, '').replace(/```\n?$/, '');
        }

        // For "notes" type, we don't parse JSON
        let content = rawResponseText;
        if (type !== 'notes') {
            try {
                content = JSON.parse(rawResponseText.trim());
            } catch (pErr) {
                console.error("AI JSON Parse Error:", rawResponseText);
                return NextResponse.json({ error: 'AI generated invalid format. Try again.' }, { status: 500 });
            }
        }

        // 5. Save to Cache
        try {
            if (existingCache) {
                 const { error: updateErr } = await supabaseAdmin
                    .from('hub_ai_quizzes')
                    .update({ content, generated_at: new Date().toISOString() })
                    .eq('catalog_course_code', courseCode)
                    .eq('type', type);
                
                if (updateErr) console.error("Cache Update Error:", updateErr);
                else console.log(`[Cache] Updated ${courseCode} (${type})`);
            } else {
                const { error: insertErr } = await supabaseAdmin
                    .from('hub_ai_quizzes')
                    .insert({
                        catalog_course_code: courseCode,
                        type,
                        content,
                        resource_id: null
                    });
                
                if (insertErr) console.error("Cache Insert Error:", insertErr);
                else console.log(`[Cache] Inserted ${courseCode} (${type})`);
            }
        } catch (saveError) {
            console.error("Failed to save to AI cache (Exception):", saveError);
        }

        return NextResponse.json({ content, cached: false });

    } catch (error: any) {
        console.error('API /study/generate-from-catalog Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
