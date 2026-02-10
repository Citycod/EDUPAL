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
            {/* Main Content - Centered */}
            <div className="flex-1 flex flex-col items-center justify-center w-full px-6">
                {/* Logo Container */}
                <div className="mb-8 flex items-center justify-center w-full max-w-[240px] aspect-square rounded-[2.5rem] bg-[#0d191c] border border-primary/30 shadow-[0_0_40px_rgba(76,175,80,0.15)] overflow-hidden p-6">
                    <Image
                        src={EduPalLogo}
                        alt="EduPal Logo"
                        width={240}
                        height={240}
                        className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(76,175,80,0.3)]"
                        priority
                    />
                </div>

                {/* Text Content */}
                <div className="text-center">
                    <h1 className="text-white tracking-tight text-5xl font-bold leading-tight pb-2">
                        EduPal
                    </h1>
                    <p className="text-gray-400 text-lg font-light leading-normal max-w-xs mx-auto">
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
