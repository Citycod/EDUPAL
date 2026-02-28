import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        // 1. Verify Paystack webhook signature
        const body = await req.text();
        const hash = crypto
            .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
            .update(body)
            .digest('hex');

        const signature = req.headers.get('x-paystack-signature');
        if (hash !== signature) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const event = JSON.parse(body);

        // 2. Handle charge.success event
        if (event.event === 'charge.success') {
            const { reference, channel, metadata } = event.data;
            const subscriptionId = metadata?.subscription_id;
            const userId = metadata?.user_id;
            const planId = metadata?.plan_id;

            if (!subscriptionId || !userId) {
                console.error('Missing metadata in webhook:', metadata);
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

            // 4. Activate subscription
            const { error: updateError } = await supabaseAdmin
                .schema('academic')
                .from('user_subscriptions')
                .update({
                    status: 'active',
                    payment_reference: reference,
                    payment_channel: channel,
                    starts_at: new Date().toISOString(),
                    expires_at: expiresAt.toISOString(),
                    updated_at: new Date().toISOString(),
                })
                .eq('id', subscriptionId);

            if (updateError) {
                console.error('Failed to activate subscription:', updateError);
                return NextResponse.json({ error: 'Activation failed' }, { status: 500 });
            }

            console.log(`✅ Subscription ${subscriptionId} activated for user ${userId}`);
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
