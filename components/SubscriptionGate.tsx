'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSubscription, useFeatureAccess } from '@/lib/hooks/useSubscription';

interface SubscriptionGateProps {
    children: React.ReactNode;
    featureKey?: string;
    fallback?: React.ReactNode;
}

export default function SubscriptionGate({
    children,
    featureKey,
    fallback
}: SubscriptionGateProps) {
    const router = useRouter();

    // If a specific feature key is provided, check that. Otherwise check general subscription.
    const { hasAccess, loading } = useFeatureAccess(featureKey || 'download_files');
    const { isSubscribed, loading: subLoading } = useSubscription();

    const isEnabled = process.env.NEXT_PUBLIC_SUBSCRIPTIONS_ENABLED === 'true';

    // Important: If feature flag is off, just render children immediately
    if (!isEnabled) {
        return <>{children}</>;
    }

    const isLoading = featureKey ? loading : subLoading;
    const isGranted = featureKey ? hasAccess : isSubscribed;

    if (isLoading) {
        // You can customize this loading state or receive it as a prop
        return (
            <div className="animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl p-4 w-full h-full min-h-[100px] flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (isGranted) {
        return <>{children}</>;
    }

    // If a custom fallback is provided, render it instead of the default paywall lock
    if (fallback) {
        return <>{fallback}</>;
    }

    // Default Paywall Lock UI
    return (
        <div className="relative overflow-hidden bg-white dark:bg-[#1a231f] border border-slate-200 dark:border-[#2a3530] rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center shadow-lg group">
            {/* Decorative Background Glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500"></div>

            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 border border-primary/20 relative z-10">
                <span className="material-symbols-outlined text-primary text-3xl">lock</span>
            </div>

            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 relative z-10 tracking-tight">
                Premium Feature
            </h3>

            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-sm relative z-10">
                Unlock full downloads, AI study tools, and unlimited access to all campus resources for just ₦1,000 per semester.
            </p>

            <button
                onClick={() => router.push('/subscription')}
                className="relative z-10 bg-primary text-background-dark font-black px-8 py-3 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center gap-2 uppercase tracking-widest text-xs"
            >
                <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                Upgrade to Premium
            </button>
        </div>
    );
}
