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
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides: OnboardingSlide[] = [
        {
            id: 1,
            title: "Find Past Questions",
            description: "Access a massive repository of past exam papers organized by institution and department.",
            icon: "search_insights",
            illustration: 'search'
        },
        {
            id: 2,
            title: "Learn Together",
            description: "Join course-specific discussion groups to collaborate with peers and solve tough problems.",
            icon: "group_work",
            illustration: 'community'
        },
        {
            id: 3,
            title: "Join Virtual Classes",
            description: "Engage in real-time learning sessions with your lecturers and peers from anywhere.",
            icon: "video_call",
            illustration: 'video'
        }
    ];

    const nextSlide = useCallback(() => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            router.push('/login');
        }
    }, [currentSlide, slides.length, router]);

    // Auto-slide logic
    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 3000);

        return () => clearInterval(timer);
    }, [nextSlide]);

    const skipOnboarding = () => {
        router.push('/login');
    };

    const renderIllustration = (type: string) => {
        if (type === 'search') {
            return (
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-32 h-32 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20">
                        <span className="material-symbols-outlined text-background-dark text-6xl">
                            search_insights
                        </span>
                    </div>
                    <div className="mt-6 flex gap-3">
                        <div className="w-12 h-1 bg-primary/30 rounded-full"></div>
                        <div className="w-16 h-1 bg-primary/50 rounded-full"></div>
                        <div className="w-8 h-1 bg-primary/20 rounded-full"></div>
                    </div>
                </div>
            );
        } else if (type === 'community') {
            return (
                <div className="flex flex-col items-center gap-6">
                    <span className="material-symbols-outlined text-[120px] text-primary">
                        group_work
                    </span>
                    <div className="flex -space-x-4">
                        <div className="w-12 h-12 rounded-full border-2 border-background-dark bg-zinc-800 flex items-center justify-center">
                            <span className="material-symbols-outlined text-sm">person</span>
                        </div>
                        <div className="w-12 h-12 rounded-full border-2 border-background-dark bg-zinc-700 flex items-center justify-center">
                            <span className="material-symbols-outlined text-sm">person</span>
                        </div>
                        <div className="w-12 h-12 rounded-full border-2 border-background-dark bg-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-sm text-background-dark">add</span>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-32 h-32 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20">
                        <span className="material-symbols-outlined text-background-dark text-6xl">
                            video_call
                        </span>
                    </div>
                    <div className="mt-6 flex gap-3">
                        <div className="w-12 h-1 bg-primary/30 rounded-full"></div>
                        <div className="w-16 h-1 bg-primary/50 rounded-full"></div>
                        <div className="w-8 h-1 bg-primary/20 rounded-full"></div>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-hidden">
            {/* Top Bar with Skip */}
            <div className="flex items-center p-6 justify-end">
                {currentSlide < slides.length - 1 && (
                    <button
                        onClick={skipOnboarding}
                        className="text-white/60 hover:text-primary transition-colors text-base font-medium leading-normal tracking-wide"
                    >
                        Skip
                    </button>
                )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col items-center justify-center px-6">
                {/* Illustration / Visual Area */}
                <div className="w-full max-w-md mx-auto">
                    <div className="aspect-square w-full relative flex items-center justify-center">
                        {/* Decorative background glow */}
                        <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full"></div>

                        {/* Illustration Container */}
                        <div className={`relative w-full h-80 rounded-3xl border border-white/10 flex items-center justify-center overflow-hidden ${slides[currentSlide].illustration === 'search'
                            ? 'bg-primary/10'
                            : 'bg-gradient-to-br from-primary/20 to-transparent'
                            }`}>
                            {slides[currentSlide].illustration === 'search' && (
                                <>
                                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
                                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
                                </>
                            )}
                            {renderIllustration(slides[currentSlide].illustration)}
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="mt-12 text-center max-w-sm">
                    <h1 className="text-white tracking-tight text-[32px] font-bold leading-tight pb-4">
                        {slides[currentSlide].title}
                    </h1>
                    <p className="text-white/70 text-base font-normal leading-relaxed">
                        {slides[currentSlide].description}
                    </p>
                </div>

                {/* Pagination Dots */}
                <div className="flex w-full flex-row items-center justify-center gap-3 py-10">
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                                ? 'w-6 bg-primary'
                                : 'w-2 bg-white/20'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Action Button */}
            <div className="px-6 pb-12 w-full max-w-md mx-auto">
                <button
                    onClick={nextSlide}
                    className="w-full bg-primary hover:bg-primary/90 text-background-dark font-bold text-lg py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                    {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
                    <span className="material-symbols-outlined">arrow_forward</span>
                </button>
            </div>
        </div>
    );
}
