import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Configuration
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
        'mailto:support@edupal.space',
        VAPID_PUBLIC_KEY,
        VAPID_PRIVATE_KEY
    );
} else {
    console.warn('VAPID keys are missing. Push notifications will not be sent.');
}

export async function GET(req: NextRequest) {
    try {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        // 1. Fetch roadmaps that have a task for yesterday
        const { data: roadmaps, error: roadmapError } = await supabaseAdmin
            .from('hub_study_roadmaps')
            .select('*')
            .filter('exam_date', 'gt', yesterday);

        if (roadmapError) throw roadmapError;

        const results = [];

        for (const roadmap of roadmaps) {
            const plan = roadmap.roadmap as any[];
            const yesterdayTask = plan.find(d => d.date === yesterday);

            if (!yesterdayTask) continue; // No task scheduled for yesterday

            // Check if user was already notified for yesterday
            if (roadmap.last_notified_date === yesterday) continue;

            // 2. Check progress for yesterday
            const { data: progress } = await supabaseAdmin
                .from('hub_study_progress')
                .select('*')
                .eq('user_id', roadmap.user_id)
                .eq('resource_id', roadmap.resource_id)
                .eq('roadmap_date', yesterday)
                .single();

            if (!progress || !progress.is_fully_completed) {
                // DEFAULT DETECTED!

                // 3. Get subscriptions
                const { data: subs } = await supabaseAdmin
                    .from('hub_push_subscriptions')
                    .select('*')
                    .eq('user_id', roadmap.user_id);

                if (subs && subs.length > 0) {
                    const notificationPayload = JSON.stringify({
                        title: "Don't fall behind! 📚",
                        body: `You missed your study goal for yesterday: "${yesterdayTask.topic}". Let's get back on track today?`,
                        url: `/study/${roadmap.resource_id}`
                    });

                    for (const sub of subs) {
                        try {
                            await webpush.sendNotification(
                                sub.subscription_json,
                                notificationPayload
                            );
                        } catch (err) {
                            console.error('Error sending push:', err);
                        }
                    }

                    // Update last_notified_date to avoid re-notifying
                    await supabaseAdmin
                        .from('academic.study_roadmaps')
                        .update({ last_notified_date: yesterday })
                        .eq('id', roadmap.id);

                    results.push({ user: roadmap.user_id, status: 'notified' });
                }
            }
        }

        return NextResponse.json({ success: true, processed: results.length, details: results });

    } catch (error: any) {
        console.error('Check Defaults Error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
