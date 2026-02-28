import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const { resourceId, type, score, totalQuestions } = await req.json();

        if (!resourceId || !type || score === undefined || !totalQuestions) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Get the current user from the Authorization header
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        // 1. Find the quiz_id from ai_quizzes
        const { data: quiz, error: quizError } = await supabaseAdmin
            .from('hub_ai_quizzes')
            .select('id')
            .eq('resource_id', resourceId)
            .eq('type', type)
            .single();

        if (quizError || !quiz) {
            return NextResponse.json({ error: 'Quiz not found for this resource' }, { status: 404 });
        }

        // 2. Save the result to user_quiz_results
        const { error: insertError } = await supabaseAdmin
            .from('hub_user_quiz_results')
            .insert({
                user_id: user.id,
                quiz_id: quiz.id,
                score: score,
                total_questions: totalQuestions,
            });

        if (insertError) {
            console.error('Failed to save quiz result:', insertError);
            return NextResponse.json({ error: 'Failed to save score' }, { status: 500 });
        }

        // 3. Fetch updated user stats (points are awarded automatically by DB trigger)
        const { data: stats } = await supabaseAdmin
            .from('hub_user_stats')
            .select('total_points, download_credits, current_streak')
            .eq('user_id', user.id)
            .single();

        // 4. Fetch updated rank
        const { data: rankData } = await supabaseAdmin
            .from('hub_leaderboard')
            .select('institution_rank, total_points')
            .eq('user_id', user.id)
            .single();

        return NextResponse.json({
            success: true,
            pointsAwarded: 20,
            stats: stats || null,
            rank: rankData?.institution_rank || null,
        });

    } catch (error: any) {
        console.error('Score API error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
