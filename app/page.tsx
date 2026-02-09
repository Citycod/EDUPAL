'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import EduPalLogo from '@/assets/edupallogo.jpg';

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
                <div className="mb-8 flex items-center justify-center w-32 h-32 rounded-3xl bg-primary/10 border border-primary/20 shadow-2xl shadow-primary/5">
                    <Image
                        src={EduPalLogo}
                        alt="EduPal Logo"
                        width={96}
                        height={96}
                        className="object-contain rounded-2xl"
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
