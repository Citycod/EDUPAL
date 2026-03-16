'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import EduPalLogo from '@/assets/images/edupal.png';

interface OnboardingSlide {
    id: number;
    title: string;
    description: string;
    icon: string;
    illustration: 'search' | 'community' | 'video';
}

export default function Onboarding() {
    const router = useRouter();

    const skipOnboarding = () => {
        router.push('/login');
    };

    const features = [
        {
            title: "Past Questions",
            icon: "search_insights",
            desc: "Massive paper repository",
            color: "from-blue-500/20 to-transparent",
            iconColor: "text-blue-400"
        },
        {
            title: "Study Groups",
            icon: "group_work",
            desc: "Collaborate with peers",
            color: "from-purple-500/20 to-transparent",
            iconColor: "text-purple-400"
        },
        {
            title: "Virtual Classes",
            icon: "video_call",
            desc: "Real-time sessions",
            color: "from-amber-500/20 to-transparent",
            iconColor: "text-amber-400"
        }
    ];

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden pt-10 px-6">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full"></div>
            </div>

            {/* Header / Logo */}
            <div className="flex flex-col items-center text-center mt-12 mb-8">
                <div className="w-20 h-20 relative mb-6">
                    <Image 
                        src={EduPalLogo} 
                        alt="EduPal" 
                        fill 
                        className="object-contain"
                        priority
                    />
                </div>
                <h1 className="text-white tracking-tight text-4xl md:text-5xl font-extrabold leading-tight mb-4">
                    Welcome to <span className="text-primary italic">EduPal</span>
                </h1>
                <p className="text-white/70 text-lg max-w-md mx-auto leading-relaxed">
                    Your all-in-one companion for academic excellence. Stop wasting time and start learning better.
                </p>
            </div>

            {/* Feature Grid */}
            <div className="flex-1 max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                {features.map((feature, idx) => (
                    <div 
                        key={idx}
                        className={`group relative p-6 rounded-3xl border border-white/10 bg-gradient-to-br ${feature.color} hover:border-primary/30 transition-all duration-500 flex flex-col items-center text-center`}
                    >
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                            <span className={`material-symbols-outlined text-4xl ${feature.iconColor}`}>
                                {feature.icon}
                            </span>
                        </div>
                        <h3 className="text-white font-bold text-xl mb-2">{feature.title}</h3>
                        <p className="text-white/50 text-sm leading-snug">{feature.desc}</p>
                    </div>
                ))}
            </div>

            {/* Final Action Block */}
            <div className="w-full max-w-md mx-auto pb-16 flex flex-col gap-4">
                <button
                    onClick={() => router.push('/login')}
                    className="group relative w-full overflow-hidden bg-primary text-background-dark font-extrabold text-xl py-5 rounded-2xl transition-all shadow-[0_0_40px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_0_60px_rgba(var(--primary-rgb),0.5)] active:scale-[0.98]"
                >
                    <div className="relative z-10 flex items-center justify-center gap-3">
                        Get Started Now
                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </div>
                </button>
                <p className="text-center text-white/30 text-sm">
                    Join 10,000+ students already winning
                </p>
            </div>
        </div>
    );
}
