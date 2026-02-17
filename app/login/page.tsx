'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import EduPalLogo from '@/assets/images/edupal.png';

export default function Login() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: loginError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password
            });

            if (loginError) throw loginError;

            router.push('/home');
        } catch (err: any) {
            setError(err.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        router.back();
    };

    const handleSignUp = () => {
        router.push('/signup');
    };

    const handleForgotPassword = () => {
        router.push('/reset-password');
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-[100dvh] flex flex-col items-center justify-center p-4">
            {/* Login Container */}
            <div className="w-full max-w-[480px] flex flex-col items-center">
                {/* Header Section */}
                <div className="w-full flex items-center justify-between mb-8">
                    <button
                        onClick={handleBack}
                        className="text-white bg-white/10 p-2 rounded-lg cursor-pointer hover:bg-white/20 transition-colors"
                    >
                        <span className="material-symbols-outlined block">arrow_back</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <Image src={EduPalLogo} alt="EduPal Logo" width={80} height={80} className="w-12 h-12 object-contain brightness-125 drop-shadow-[0_0_12px_rgba(19,236,106,0.4)]" />
                        <h2 className="text-white text-2xl font-black tracking-tighter uppercase italic">
                            Edu<span className="text-primary">Pal</span>
                        </h2>
                    </div>
                    <div className="w-12"></div> {/* Equal width to back button for centering */}
                </div>

                {/* Main Login Card */}
                <div className="w-full bg-white/5 dark:bg-white/5 backdrop-blur-md p-5 rounded-xl border border-white/10 shadow-2xl">
                    <div className="text-center mb-3">
                        <div className="flex justify-center mb-6">
                            <Image
                                src={EduPalLogo}
                                alt="EduPal Logo"
                                width={320}
                                height={320}
                                className="w-72 h-72 object-contain brightness-125 drop-shadow-[0_0_30px_rgba(19,236,106,0.4)]"
                            />
                        </div>
                        <h1 className="text-white text-3xl font-bold mb-2">Welcome Back</h1>
                        <p className="text-gray-400 text-sm px-4 leading-relaxed">Login to your EduPal account to continue learning</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center">
                                {error}
                            </div>
                        )}
                        {/* Email Input */}
                        <div className="flex flex-col gap-2">
                            <label className="text-white text-sm font-medium px-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">mail</span>
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#1c2720] border border-[#3b5445] text-white rounded-lg py-4 pl-11 pr-4 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-gray-600"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-white text-sm font-medium">Password</label>
                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    className="text-primary text-xs font-semibold hover:underline"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">lock</span>
                                </div>
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#1c2720] border border-[#3b5445] text-white rounded-lg py-4 pl-11 pr-12 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-gray-600"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-[#102217] font-bold py-4 rounded-lg shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-[#102217] border-t-transparent rounded-full animate-spin"></div>
                                    Logging in...
                                </>
                            ) : (
                                'Log In'
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Link */}
                <p className="mt-8 text-gray-400 text-sm">
                    Don't have an account?{' '}
                    <button
                        type="button"
                        onClick={handleSignUp}
                        className="text-primary font-bold hover:underline"
                    >
                        Sign Up
                    </button>
                </p>
            </div>
        </div>
    );
}
