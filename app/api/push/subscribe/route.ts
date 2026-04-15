import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
        if (authError || !user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

        const { subscription } = await req.json();
        if (!subscription || !subscription.endpoint) {
            return NextResponse.json({ error: 'Invalid subscription object' }, { status: 400 });
        }

        // Upsert subscription for this user and endpoint (multi-device)
        // Note: 'endpoint' is a generated column in our migration, so we don't insert to it directly,
        // but it is used for the onConflict check.
        const { error } = await supabaseAdmin
            .from('hub_push_subscriptions')
            .upsert({
                user_id: user.id,
                subscription: subscription,
                last_used_at: new Date().toISOString()
            }, { 
                onConflict: 'user_id,endpoint' 
            });

        if (error) {
            console.error('Database Upsert Error:', error);
            throw error;
        }

        return NextResponse.json({ success: true });

    } catch (e: any) {
        console.error('Push Subscribe Error:', e.message);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
