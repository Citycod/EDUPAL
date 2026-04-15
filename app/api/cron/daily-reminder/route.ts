import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

webpush.setVapidDetails(
    'mailto:hello@edupal.space',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
);

export async function GET(req: Request) {
    try {
        // 1. Verify Cron Secret
        const authHeader = req.headers.get('Authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Fetch all active subscriptions
        const { data: subs, error } = await supabaseAdmin
            .from('hub_push_subscriptions')
            .select('user_id, subscription, id');

        if (error) throw error;
        if (!subs || subs.length === 0) {
            return NextResponse.json({ message: 'No subscriptions found' });
        }

        const payload = JSON.stringify({
            title: "Daily Question is ready! 🔥",
            body: "Keep your streak alive — answer today's question and earn 20 points.",
            url: "/home"
        });

        const results = await Promise.allSettled(
            subs.map(async (subRecord) => {
                try {
                    await webpush.sendNotification(subRecord.subscription as any, payload);
                    
                    // Update last_used_at on success
                    await supabaseAdmin
                        .from('hub_push_subscriptions')
                        .update({ last_used_at: new Date().toISOString() })
                        .eq('id', subRecord.id);
                        
                    return { success: true, userId: subRecord.user_id };
                } catch (err: any) {
                    const status = err.statusCode;
                    
                    // 3. Handle Churn (410 Gone / 404 Not Found)
                    if (status === 410 || status === 404) {
                        await supabaseAdmin
                            .from('hub_push_subscriptions')
                            .delete()
                            .eq('id', subRecord.id);
                        console.log(`Deleted stale subscription for user ${subRecord.user_id}`);
                    } else if (status === 429) {
                        // 4. Handle Rate Limiting (429) - Skip and log
                        console.warn(`Rate limited for user ${subRecord.user_id}`);
                    }
                    
                    throw err;
                }
            })
        );

        const summary = {
            total: results.length,
            success: results.filter(r => r.status === 'fulfilled').length,
            failed: results.filter(r => r.status === 'rejected').length
        };

        return NextResponse.json({ summary });

    } catch (e: any) {
        console.error('Daily Reminder Cron Error:', e);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
