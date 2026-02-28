import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const { userId, resourceId, filePath } = await req.json();

        if (!userId || !resourceId || !filePath) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Check feature flag (if paywall is off, everyone has full access)
        const isEnabled = process.env.NEXT_PUBLIC_SUBSCRIPTIONS_ENABLED === 'true';
        let hasAccess = !isEnabled;

        if (isEnabled) {
            // 2. Check if user is an admin (Admins get free access)
            const { data: profile } = await supabaseAdmin
                .from('hub_profiles')
                .select('role')
                .eq('id', userId)
                .single();

            const isAdmin = ['admin', 'school_admin', 'super_admin'].includes(profile?.role);

            if (isAdmin) {
                hasAccess = true;
            } else {
                // 3. Check if user has an active premium subscription
                const { data: subs } = await supabaseAdmin
                    .from('hub_subscriptions')
                    .select('*')
                    .eq('user_id', userId)
                    .eq('status', 'active')
                    .order('expires_at', { ascending: false })
                    .limit(1);

                const activeSub = subs?.[0];
                if (activeSub && (activeSub.expires_at === null || new Date(activeSub.expires_at) > new Date())) {
                    hasAccess = true;
                }
            }
        }

        // 4. If no unlimited access, try to consume 1 Download Credit
        if (!hasAccess) {
            const { data: creditConsumed, error: creditError } = await supabaseAdmin.rpc(
                'consume_download_credit',
                { p_user_id: userId, p_resource_id: resourceId }
            );

            if (!creditError && creditConsumed === true) {
                hasAccess = true;
            } else {
                return NextResponse.json({
                    error: 'Insufficient download credits or no active subscription',
                    code: 'PAYMENT_REQUIRED'
                }, { status: 403 });
            }
        }

        // 5. User has access (via flag, admin, sub, or credit). Generate Download URL.
        const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin
            .storage
            .from('resources')
            .createSignedUrl(filePath, 60 * 60); // 1 hour expiry

        if (signedUrlError) {
            console.error('Signed URL Error:', signedUrlError);
            return NextResponse.json({ error: 'Failed to generate download link' }, { status: 500 });
        }

        // 6. Asynchronously increment the total download count on the resource
        try {
            await supabaseAdmin.rpc('increment_resource_downloads', { p_resource_id: resourceId });
        } catch (incrementError) {
            console.error('Failed to increment download count:', incrementError);
        }

        return NextResponse.json({
            downloadUrl: signedUrlData.signedUrl
        });

    } catch (error: any) {
        console.error('Download API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
