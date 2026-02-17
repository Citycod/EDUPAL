'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import EduPalLogo from '@/assets/images/edupal.png';

export default function SplashScreen() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/onboarding');
        }, 3000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="relative flex h-screen w-full flex-col items-center justify-between bg-background-light dark:bg-background-dark overflow-hidden">
            {/* Animated CSS */}
            <style jsx>{`
                @keyframes logoEntrance {
                    0% {
                        opacity: 0;
                        transform: scale(0.3) rotate(-10deg);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.1) rotate(2deg);
                    }
                    70% {
                        transform: scale(0.95) rotate(-1deg);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1) rotate(0deg);
                    }
                }
                @keyframes glowPulse {
                    0%, 100% {
                        filter: brightness(1.25) drop-shadow(0 0 25px rgba(19, 236, 106, 0.4));
                    }
                    50% {
                        filter: brightness(1.5) drop-shadow(0 0 50px rgba(19, 236, 106, 0.7));
                    }
                }
                @keyframes textSlideUp {
                    0% {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes subtitleSlideUp {
                    0% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes ringExpand {
                    0% {
                        opacity: 0.6;
                        transform: scale(0.8);
                    }
                    100% {
                        opacity: 0;
                        transform: scale(2);
                    }
                }
                .logo-animate {
                    animation: logoEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
                               glowPulse 2.5s ease-in-out 1s infinite;
                }
                .title-animate {
                    opacity: 0;
                    animation: textSlideUp 0.6s ease-out 0.5s forwards;
                }
                .subtitle-animate {
                    opacity: 0;
                    animation: subtitleSlideUp 0.6s ease-out 0.8s forwards;
                }
                .ring-animate {
                    animation: ringExpand 2s ease-out infinite;
                }
                .ring-animate-delayed {
                    animation: ringExpand 2s ease-out 0.7s infinite;
                }
            `}</style>

            {/* Main Content - Centered */}
            <div className="flex-1 flex flex-col items-center justify-center w-full px-6">
                {/* Logo with Animation */}
                <div className="mb-8 flex items-center justify-center relative">
                    {/* Expanding rings behind logo */}
                    <div className="absolute w-72 h-72 rounded-full border border-primary/20 ring-animate"></div>
                    <div className="absolute w-72 h-72 rounded-full border border-primary/15 ring-animate-delayed"></div>

                    <Image
                        src={EduPalLogo}
                        alt="EduPal Logo"
                        width={400}
                        height={400}
                        className="w-96 h-96 object-contain logo-animate"
                        priority
                    />
                </div>

                {/* Text Content */}
                <div className="text-center">
                    <h1 className="text-white tracking-tight text-5xl font-bold leading-tight pb-2 title-animate">
                        EduPal
                    </h1>
                    <p className="text-gray-400 text-lg font-light leading-normal max-w-xs mx-auto subtitle-animate">
                        Academic companion for students
                    </p>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="pb-12 w-full text-center">
                <div className="flex flex-col items-center gap-4">
                    {/* Progress Bar */}
                    <div className="w-12 h-1 bg-primary/20 rounded-full mb-2">
                        <div className="w-1/3 h-full bg-primary rounded-full animate-pulse"></div>
                    </div>
                    {/* Powered By Text */}
                    <p className="text-gray-500 text-xs font-medium tracking-widest uppercase">
                        Powered by EduPal
                    </p>
                </div>
            </div>

            {/* Background Blur Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-5%] right-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        </div>
    );
}
