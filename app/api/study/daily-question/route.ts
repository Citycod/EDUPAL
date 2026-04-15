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

// Ensure time is calculated properly (UTC+1 handling for Nigeria)
const getTodayDateString = () => {
    // Return standard ISO format YYYY-MM-DD but using the Africa/Lagos timezone
    const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Africa/Lagos',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    return formatter.format(new Date());
};

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
        if (authError || !user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

        const today = getTodayDateString();

        // 1. Check if answered today
        const { data: logEntry } = await supabaseAdmin
            .from('hub_daily_question_logs')
            .select('id, earned_points')
            .eq('user_id', user.id)
            .eq('answered_date', today)
            .maybeSingle();

        if (logEntry) {
            return NextResponse.json({ 
                status: 'completed', 
                answered: true,
                points: logEntry.earned_points
            });
        }

        // 2. Check Cache first
        const { data: cached } = await supabaseAdmin
            .from('hub_daily_question_cache')
            .select('question_data, _secure_hash')
            .eq('user_id', user.id)
            .eq('question_date', today)
            .maybeSingle();

        if (cached) {
            return NextResponse.json({
                status: 'pending',
                answered: false,
                questionData: cached.question_data,
                _secure_hash: cached._secure_hash
            });
        }

        // 3. Fetch User Profile for Department Info
        const { data: profile } = await supabaseAdmin
            .from('hub_profiles')
            .select('department_name, level')
            .eq('id', user.id)
            .single();

        let context = "general academic success, logic, foundational university-level critical thinking, or basic everyday science.";
        if (profile?.department_name) {
            context = `introductory/foundational concepts in ${profile.department_name} (Level: ${profile.level || '100'}). Make it interesting and strictly related to their major but easy enough for a daily quick-hit.`;
        }

        // 4. Generate Question
        const aiClient = initAI();
        if (!aiClient) return NextResponse.json({ error: 'AI unavailable' }, status: 503);

        const prompt = `
You are an engaging academic coach for a university student.
Generate ONE multiple choice question for today's 'Question of the Day'.
Topic focus: ${context}
Rules:
1. It must be educational, challenging but solvable in 10-20 seconds.
2. Provide exactly 4 options (A, B, C, D).
3. Provide the correct answer (A, B, C, or D).
4. Provide a very short, friendly 1-sentence explanation of why it's correct.

Return ONLY a raw JSON object with this exact structure (no markdown blocks):
{
  "question": "What is...?",
  "options": {
    "A": "Option 1",
    "B": "Option 2",
    "C": "Option 3",
    "D": "Option 4"
  },
  "correct_answer": "B",
  "explanation": "Because..."
}`;

        const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { temperature: 0.7 }
        });

        let rawText = response.text;
        if (!rawText) throw new Error('Empty AI response');
        
        // Clean markdown mapping
        if (rawText.includes('```')) {
            const matches = rawText.match(/```(?:json)?([\s\S]*?)```/);
            if (matches && matches[1]) rawText = matches[1];
        }

        const generatedData = JSON.parse(rawText.trim());
        const secureHash = Buffer.from(JSON.stringify(generatedData)).toString('base64');
        const questionData = {
            question: generatedData.question,
            options: generatedData.options
        };

        // 5. Save to Cache
        await supabaseAdmin.from('hub_daily_question_cache').insert({
            user_id: user.id,
            question_date: today,
            question_data: questionData,
            _secure_hash: secureHash
        });

        // 6. Return the payload to frontend (OMIT the correct answer for security)
        return NextResponse.json({
            status: 'pending',
            answered: false,
            questionData,
            _secure_hash: secureHash
        });

    } catch (e: any) {
        console.error('Daily Q GET error:', e);
        return NextResponse.json({ error: 'Failed to generate question' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { userAnswer, _secure_hash } = await req.json();

        // Decode the generated context
        if (!_secure_hash) return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
        const decodedString = Buffer.from(_secure_hash, 'base64').toString('utf-8');
        const questionData = JSON.parse(decodedString);

        if (!userAnswer || !['A', 'B', 'C', 'D'].includes(userAnswer)) {
            return NextResponse.json({ error: 'Invalid answer format' }, { status: 400 });
        }

        const authHeader = req.headers.get('Authorization');
        if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
        if (authError || !user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

        const today = getTodayDateString();
        const isCorrect = userAnswer === questionData.correct_answer;
        const rewardPoints = isCorrect ? 20 : 0; // Only award points if correct

        // 1. Check if already answered independently
        const { data: existing } = await supabaseAdmin
            .from('hub_daily_question_logs')
            .select('id')
            .eq('user_id', user.id)
            .eq('answered_date', today)
            .maybeSingle();

        if (existing) {
             return NextResponse.json({ error: 'Already answered today' }, { status: 400 });
        }

        // First get the snapshot of their streak to log historically
        const { data: userStats } = await supabaseAdmin
            .from('hub_user_stats')
            .select('current_streak')
            .eq('user_id', user.id)
            .single();
            
        const currentStreakSnapshot = (userStats?.current_streak || 0) + 1;

        // 2. Log completion
        await supabaseAdmin.from('hub_daily_question_logs').insert({
            user_id: user.id,
            answered_date: today,
            question_text: questionData.question,
            correct_answer: questionData.correct_answer,
            user_answer: userAnswer,
            earned_points: rewardPoints,
            current_streak: currentStreakSnapshot
        });

        // 3. Award Points (using existing RPC/function via Supabase logic)
        // Award via postgres function `academic.award_points`
        await supabaseAdmin.rpc('award_points', {
            p_user_id: user.id,
            p_points: rewardPoints,
            p_credits: 0,
            p_type: 'daily_question',
            p_desc: 'Completed daily question of the day',
            p_ref_id: null
        });

        // Update streak quietly 
        await supabaseAdmin.rpc('update_daily_streak');

        return NextResponse.json({
            success: true,
            isCorrect,
            correctAnswer: questionData.correct_answer,
            explanation: questionData.explanation,
            pointsEarned: rewardPoints
        });

    } catch (e: any) {
        console.error('Daily Q POST error:', e);
        return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
    }
}
