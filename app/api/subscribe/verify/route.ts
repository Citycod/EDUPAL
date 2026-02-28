import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const reference = searchParams.get('reference');

        if (!reference) {
            return NextResponse.json({ error: 'Missing reference' }, { status: 400 });
        }

        // 1. Verify transaction with Paystack
        const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
        });

        const paystackData = await paystackResponse.json();

        if (!paystackData.status || paystackData.data.status !== 'success') {
            return NextResponse.json({ error: 'Transaction not successful' }, { status: 400 });
        }

        // 2. Extract metadata
        const metadata = paystackData.data.metadata;
        const subscriptionId = metadata?.subscription_id;
        const planId = metadata?.plan_id;
        const channel = paystackData.data.channel;

        if (!subscriptionId || !planId) {
            return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
        }

        // 3. Get plan duration
        const { data: plan } = await supabaseAdmin
            .from('hub_subscription_plans')
            .select('duration_days')
            .eq('id', planId)
            .single();

        const durationDays = plan?.duration_days || 120; // Default semester = ~4 months
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + durationDays);

        // 4. Activate subscription using RPC
        const { error: directError } = await supabaseAdmin.rpc('activate_subscription', {
            p_sub_id: subscriptionId,
            p_reference: reference,
            p_channel: channel || 'card',
            p_expires_at: expiresAt.toISOString(),
        });

        if (directError) {
            console.error('Failed to activate subscription:', directError);
            return NextResponse.json({ error: 'Activation failed' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Subscription activated via verification' });
    } catch (error: any) {
        console.error('Verify API error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
