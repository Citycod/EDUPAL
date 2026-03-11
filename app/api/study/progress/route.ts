import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const { resourceId, userId, roadmapDate, completedTasks, isFullyCompleted } = await req.json();

        if (!resourceId || !userId || !roadmapDate) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('hub_study_progress')
            .upsert({
                user_id: userId,
                resource_id: resourceId,
                roadmap_date: roadmapDate,
                completed_tasks: completedTasks || [],
                is_fully_completed: isFullyCompleted || false,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id,resource_id,roadmap_date' })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, progress: data });

    } catch (error: any) {
        console.error('Progress API error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const resourceId = searchParams.get('resourceId');
        const userId = searchParams.get('userId');

        if (!resourceId || !userId) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('hub_study_progress')
            .select('*')
            .eq('resource_id', resourceId)
            .eq('user_id', userId);

        if (error) throw error;

        return NextResponse.json({ progress: data });

    } catch (error: any) {
        console.error('Progress GET error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
