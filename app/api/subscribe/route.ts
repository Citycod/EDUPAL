import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const { userId, email, planId, callbackUrl } = await req.json();

        if (!userId || !email || !planId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Get plan details
        const { data: plan, error: planError } = await supabaseAdmin
            .from('hub_subscription_plans')
            .select('*')
            .eq('id', planId)
            .single();

        if (planError || !plan) {
            return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
        }

        if (plan.price_ngn === 0) {
            return NextResponse.json({ error: 'Cannot pay for a free plan' }, { status: 400 });
        }

        // 2. Create a pending subscription using RPC (because academic schema isn't exposed to API)
        const { data: directSub, error: directError } = await supabaseAdmin
            .rpc('create_pending_subscription', {
                p_user_id: userId,
                p_plan_id: planId,
                p_amount: plan.price_ngn,
            });

        if (directError || !directSub) {
            console.error('Subscription creation failed:', directError);
            return NextResponse.json({ error: 'Failed to create subscription record' }, { status: 500 });
        }

        const subId = directSub;

        // 3. Initialize Paystack transaction
        const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                amount: plan.price_ngn * 100, // Paystack uses kobo (₦1 = 100 kobo)
                currency: 'NGN',
                reference: `edupal_sub_${subId}_${Date.now()}`,
                callback_url: callbackUrl || `${process.env.NEXT_PUBLIC_APP_URL}/subscription?status=success`,
                metadata: {
                    subscription_id: subId,
                    user_id: userId,
                    plan_id: planId,
                    plan_name: plan.name,
                    custom_fields: [
                        {
                            display_name: 'Plan',
                            variable_name: 'plan',
                            value: plan.name,
                        },
                    ],
                },
            }),
        });

        const paystackData = await paystackResponse.json();

        if (!paystackData.status) {
            console.error('Paystack error:', paystackData);
            return NextResponse.json({ error: 'Payment initialization failed' }, { status: 500 });
        }

        // 4. Update subscription with payment reference
        await supabaseAdmin
            .from('user_subscriptions')
            .update({ payment_reference: paystackData.data.reference })
            .eq('id', subId);

        return NextResponse.json({
            authorization_url: paystackData.data.authorization_url,
            reference: paystackData.data.reference,
            subscription_id: subId,
        });
    } catch (error: any) {
        console.error('Subscribe API error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
