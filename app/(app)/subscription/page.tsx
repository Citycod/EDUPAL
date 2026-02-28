'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useSubscription } from '@/lib/hooks/useSubscription';

const SubscriptionContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isSubscribed, subscription, plan, loading: subLoading, daysRemaining } = useSubscription();

    const [loading, setLoading] = useState(true);
    const [plans, setPlans] = useState<any[]>([]);
    const [processing, setProcessing] = useState(false);
    const [userProfile, setUserProfile] = useState<any>(null);

    // Fetch available plans and user profile
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data: profile } = await supabase.from('hub_profiles').select('*').eq('id', user.id).single();
                    setUserProfile(profile);
                }

                const { data: availablePlans, error } = await supabase
                    .from('hub_subscription_plans')
                    .select('*')
                    .order('price_ngn', { ascending: true });

                if (!error && availablePlans) {
                    setPlans(availablePlans);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Check for Paystack success redirect
    useEffect(() => {
        const verifyPayment = async () => {
            const status = searchParams.get('status');
            const reference = searchParams.get('reference');

            if (status === 'success' && reference) {
                setProcessing(true);
                try {
                    // Call our new verify endpoint
                    const res = await fetch(`/api/subscribe/verify?reference=${reference}`);
                    if (res.ok) {
                        // Force a hard reload to update the hook state and clear the URL params
                        window.location.href = '/subscription';
                    }
                } catch (error) {
                    console.error("Verification failed:", error);
                } finally {
                    setProcessing(false);
                }
            }
        };

        verifyPayment();
    }, [searchParams]);

    const handleSubscribe = async (planId: string) => {
        if (!userProfile) {
            alert("Please login to subscribe");
            return;
        }

        setProcessing(true);
        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userProfile.id,
                    email: userProfile.email,
                    planId: planId,
                    callbackUrl: `${window.location.origin}/subscription?status=success`
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Payment initialization failed');
            }

            if (data.authorization_url) {
                // Redirect to Paystack checkout
                window.location.href = data.authorization_url;
            } else {
                throw new Error("No authorization URL received");
            }
        } catch (error: any) {
            console.error('Subscription error:', error);
            alert(`Error: ${error.message}`);
            setProcessing(false);
        }
    };

    if (loading || subLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-[#f6f8f7] dark:bg-[#102217] text-slate-500">Loading Plans...</div>;
    }

    const premiumPlan = plans.find(p => p.price_ngn > 0);
    const freePlan = plans.find(p => p.price_ngn === 0);

    const isFeatureEnabled = process.env.NEXT_PUBLIC_SUBSCRIPTIONS_ENABLED === 'true';

    return (
        <div className="bg-[#f6f8f7] dark:bg-[#102217] font-sans text-slate-900 dark:text-slate-100 min-h-screen flex flex-col pb-24">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 bg-[#f6f8f7]/80 dark:bg-[#102217]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto flex items-center p-4">
                    <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mr-3">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20 text-primary">
                            <span className="material-symbols-outlined">workspace_premium</span>
                        </div>
                        <h1 className="text-lg font-black tracking-tighter truncate">EduPal Premium</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto w-full px-4 py-8">

                {!isFeatureEnabled && (
                    <div className="mb-8 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-top-4">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-green-500">celebration</span>
                        </div>
                        <div>
                            <h3 className="text-green-600 dark:text-green-400 font-bold mb-1">Early Access Celebration!</h3>
                            <p className="text-sm text-green-700/80 dark:text-green-300/80 leading-relaxed">
                                Because you joined early, you currently have <strong>Premium Access for free</strong>!
                                Enjoy unlimited downloads while we prepare the official launch.
                            </p>
                        </div>
                    </div>
                )}

                <div className="text-center mb-12 space-y-4">
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                        Unlock Academic Excellence
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
                        Upgrade to get unlimited downloads, past questions, and AI-powered study tools. Pass your exams with less stress.
                    </p>
                </div>

                {/* Current Status Card */}
                {subscription && isFeatureEnabled && (
                    <div className="mb-12 bg-white dark:bg-[#1a231f] border-2 border-primary/20 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-primary/5">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 shrink-0">
                                <span className="material-symbols-outlined text-primary text-3xl">verified</span>
                            </div>
                            <div>
                                <p className="text-xs font-black text-primary uppercase tracking-widest mb-1">Current Status</p>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white capitalize">{subscription.plan_name} Plan</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                    {daysRemaining !== null ? `${daysRemaining} days remaining in semester` : 'Full access active'}
                                </p>
                            </div>
                        </div>

                        {daysRemaining !== null && daysRemaining <= 14 && (
                            <button
                                onClick={() => premiumPlan && handleSubscribe(premiumPlan.id)}
                                disabled={processing}
                                className="w-full sm:w-auto bg-primary text-background-dark font-black px-6 py-3 rounded-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                            >
                                {processing ? 'Processing...' : 'Renew Now'}
                            </button>
                        )}
                    </div>
                )}


                {/* Pricing Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

                    {/* Basic Plan */}
                    {freePlan && (
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm flex flex-col h-full">
                            <div className="mb-6">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{freePlan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-slate-900 dark:text-white">₦0</span>
                                    <span className="text-slate-500 text-sm font-bold uppercase tracking-wider">/ forever</span>
                                </div>
                                <p className="text-slate-500 text-sm mt-4">{freePlan.description}</p>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {freePlan.features.map((feature: string, idx: number) => (
                                    <li key={idx} className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                                        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-slate-400 text-[14px]">check</span>
                                        </div>
                                        {feature.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                    </li>
                                ))}
                            </ul>

                            <button className="w-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-black px-6 py-4 rounded-xl cursor-not-allowed uppercase tracking-widest text-xs">
                                Current Plan
                            </button>
                        </div>
                    )}

                    {/* Premium Plan */}
                    {premiumPlan && (
                        <div className="relative bg-white dark:bg-[#1a231f] border-2 border-primary rounded-3xl p-8 shadow-2xl shadow-primary/20 flex flex-col h-full transform md:-translate-y-4 z-10">
                            {/* Best Value Badge */}
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-background-dark text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                                Best For Exams
                            </div>

                            <div className="mb-6">
                                <h3 className="text-xl font-black text-primary mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[20px]">workspace_premium</span>
                                    {premiumPlan.name}
                                </h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-black text-slate-900 dark:text-white">₦{premiumPlan.price_ngn.toLocaleString()}</span>
                                    <span className="text-slate-500 text-sm font-bold uppercase tracking-wider">/ semester</span>
                                </div>
                                <p className="text-primary/70 dark:text-primary/60 text-sm mt-4 font-medium">{premiumPlan.description}</p>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {premiumPlan.features.map((feature: string, idx: number) => {
                                    const isFreeIncluded = freePlan?.features.includes(feature);

                                    return (
                                        <li key={idx} className="flex items-center gap-3 text-sm font-bold text-slate-900 dark:text-white">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${isFreeIncluded ? 'bg-primary/10' : 'bg-primary shadow-lg shadow-primary/20'}`}>
                                                <span className={`material-symbols-outlined text-[14px] ${isFreeIncluded ? 'text-primary' : 'text-background-dark'}`}>
                                                    check
                                                </span>
                                            </div>
                                            {feature.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                            {!isFreeIncluded && <span className="ml-auto text-[9px] uppercase tracking-widest bg-primary/20 text-primary px-2 py-0.5 rounded border border-primary/20 font-black">Pro</span>}
                                        </li>
                                    );
                                })}
                            </ul>

                            <button
                                onClick={() => isFeatureEnabled && handleSubscribe(premiumPlan.id)}
                                disabled={processing || (subscription?.plan_id === premiumPlan.id) || !isFeatureEnabled}
                                className={`w-full font-black px-6 py-4 rounded-xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 ${!isFeatureEnabled
                                    ? 'bg-green-500/20 text-green-600 dark:text-green-400 cursor-not-allowed border border-green-500/30'
                                    : subscription?.plan_id === premiumPlan.id
                                        ? 'bg-primary/20 text-primary cursor-not-allowed border border-primary/30'
                                        : 'bg-primary text-background-dark hover:scale-105 active:scale-95 shadow-xl shadow-primary/30'
                                    }`}
                            >
                                {processing ? (
                                    <>Processing...</>
                                ) : !isFeatureEnabled ? (
                                    <>
                                        <span className="material-symbols-outlined text-[18px]">celebration</span>
                                        Free Early Access
                                    </>
                                ) : subscription?.plan_id === premiumPlan.id ? (
                                    <>
                                        <span className="material-symbols-outlined text-[18px]">verified</span>
                                        Active Plan
                                    </>
                                ) : (
                                    <>Upgrade to Premium</>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* FAQ / Trust Indicators */}
                <div className="mt-16 text-center space-y-4 max-w-lg mx-auto">
                    <div className="flex justify-center gap-4 mb-6">
                        <div className="w-16 h-10 bg-slate-200 dark:bg-slate-800 rounded flex items-center justify-center text-xs font-black text-slate-500 uppercase tracking-widest border border-slate-300 dark:border-slate-700">Card</div>
                        <div className="w-16 h-10 bg-slate-200 dark:bg-slate-800 rounded flex items-center justify-center text-xs font-black text-slate-500 uppercase tracking-widest border border-slate-300 dark:border-slate-700">Transfer</div>
                        <div className="w-16 h-10 bg-slate-200 dark:bg-slate-800 rounded flex items-center justify-center text-xs font-black text-slate-500 uppercase tracking-widest border border-slate-300 dark:border-slate-700">USSD</div>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">Secured by Paystack. Cancel anytime.</p>
                </div>

            </main>
        </div>
    );
};

export default function SubscriptionPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#f6f8f7] dark:bg-[#102217] text-slate-500">Loading Plans...</div>}>
            <SubscriptionContent />
        </Suspense>
    );
}
