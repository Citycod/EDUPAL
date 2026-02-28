'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface SubscriptionState {
    isSubscribed: boolean;
    subscription: any | null;
    plan: any | null;
    loading: boolean;
    daysRemaining: number | null;
    downloadCredits: number;
    totalPoints: number;
}

/**
 * Hook to check the current user's subscription status and gamification stats.
 * 
 * When NEXT_PUBLIC_SUBSCRIPTIONS_ENABLED is 'false' (or not set),
 * isSubscribed returns true — meaning all features are unlocked.
 */
export function useSubscription(): SubscriptionState {
    const [state, setState] = useState<SubscriptionState>({
        isSubscribed: true,
        subscription: null,
        plan: null,
        loading: true,
        daysRemaining: null,
        downloadCredits: 0,
        totalPoints: 0,
    });

    useEffect(() => {
        const checkSubscription = async () => {
            const isEnabled = process.env.NEXT_PUBLIC_SUBSCRIPTIONS_ENABLED === 'true';

            // If subscriptions are disabled, grant access but still fetch credits/points
            let defaultAccess = !isEnabled;

            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    setState(prev => ({ ...prev, isSubscribed: false, loading: false }));
                    return;
                }

                // Check for active subscription
                const { data: subs, error } = await supabase
                    .from('hub_subscriptions')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('status', 'active')
                    .order('expires_at', { ascending: false })
                    .limit(1);

                if (error) {
                    console.error('Subscription check error:', error);
                    // On error, default to unlocked to avoid blocking users
                    setState(prev => ({ ...prev, isSubscribed: true, loading: false }));
                    return;
                }

                const activeSub = subs?.[0] || null;
                let isActive = false;
                let daysRemaining: number | null = null;

                if (activeSub) {
                    if (activeSub.expires_at) {
                        const expiresAt = new Date(activeSub.expires_at);
                        isActive = expiresAt > new Date();
                        daysRemaining = Math.max(0, Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
                    } else {
                        // No expiry = unlimited (free plan or lifetime)
                        isActive = true;
                    }
                }

                // Fetch user gamification stats
                const { data: stats } = await supabase
                    .from('hub_user_stats')
                    .select('download_credits, total_points')
                    .eq('user_id', user.id)
                    .single();

                const downloadCredits = stats?.download_credits || 0;
                const totalPoints = stats?.total_points || 0;

                // Also check: admins and super_admins always have full access
                const { data: profile } = await supabase
                    .from('hub_profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                const isAdmin = ['admin', 'school_admin', 'super_admin'].includes(profile?.role);

                setState({
                    isSubscribed: defaultAccess || isActive || isAdmin,
                    subscription: activeSub,
                    plan: activeSub ? { name: activeSub.plan_name, price: activeSub.plan_price } : null,
                    loading: false,
                    daysRemaining,
                    downloadCredits,
                    totalPoints,
                });
            } catch (error) {
                console.error('Subscription hook error:', error);
                setState({
                    isSubscribed: defaultAccess,
                    subscription: null, plan: null, loading: false, daysRemaining: null,
                    downloadCredits: 0, totalPoints: 0
                });
            }
        };

        checkSubscription();
    }, []);

    return state;
}

/**
 * Check if a specific feature is available to the user.
 * Use this for granular feature gating.
 */
export function useFeatureAccess(featureKey: string) {
    const { isSubscribed, plan, loading } = useSubscription();

    // If subscriptions are disabled, all features are accessible
    const isEnabled = process.env.NEXT_PUBLIC_SUBSCRIPTIONS_ENABLED === 'true';
    if (!isEnabled) return { hasAccess: true, loading: false };

    // Free features are always available
    const freeFeatures = ['browse_library', 'upload_materials', 'community', 'profile', 'notifications'];
    if (freeFeatures.includes(featureKey)) return { hasAccess: true, loading: false };

    return { hasAccess: isSubscribed, loading };
}
