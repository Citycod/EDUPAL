'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import EduPalLogo from '@/assets/edupallogo.jpg';

export default function SplashScreen() {
    const [isAnimating, setIsAnimating] = useState(false);
    const [progress, setProgress] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => setIsAnimating(true), 100);

        // Smooth progress animation
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 2;
            });
        }, 35);

        const onboardingTimer = setTimeout(() => {
            router.push('/onboarding');
        }, 3500);

        return () => {
            clearTimeout(timer);
            clearTimeout(onboardingTimer);
            clearInterval(progressInterval);
        };
    }, [router]);

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-edupal-forest-900 via-edupal-forest-800 to-edupal-forest-700">
            {/* Animated Background Grid */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#10d87620_1px,transparent_1px),linear-gradient(to_bottom,#10d87620_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]"></div>
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-edupal-green-400 rounded-full opacity-30 animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${3 + Math.random() * 4}s`
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center px-6">
                {/* Logo Container with Modern Card */}
                <div
                    className={`transition-all duration-1000 ease-out ${isAnimating
                        ? 'scale-100 opacity-100 translate-y-0'
                        : 'scale-90 opacity-0 translate-y-4'
                        }`}
                >
                    <div className="relative">
                        {/* Glow Effect */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-edupal-green-500/30 to-primary/30 rounded-3xl blur-2xl opacity-75"></div>

                        {/* Logo Card */}
                        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
                            <Image
                                src={EduPalLogo}
                                alt="EduPal Logo"
                                width={120}
                                height={120}
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>

                {/* Brand Name with Gradient */}
                <h1
                    className={`mt-12 text-6xl md:text-7xl font-bold tracking-tight transition-all duration-1000 delay-200 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}
                >
                    <span className="bg-gradient-to-r from-white via-edupal-green-200 to-primary bg-clip-text text-transparent">
                        EduPal
                    </span>
                </h1>

                {/* Tagline */}
                <p
                    className={`mt-4 text-lg md:text-xl text-edupal-green-100 font-light tracking-wide transition-all duration-1000 delay-400 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}
                >
                    Your Learning Companion
                </p>

                {/* Feature Pills */}
                <div
                    className={`mt-8 flex flex-wrap gap-3 justify-center transition-all duration-1000 delay-600 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}
                >
                    {['Smart Learning', 'Collaborate', 'Achieve More'].map((feature, index) => (
                        <div
                            key={feature}
                            className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm text-edupal-green-100 font-medium"
                            style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                        >
                            {feature}
                        </div>
                    ))}
            