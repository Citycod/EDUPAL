'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Login attempted with:', formData);
        // Add your login logic here
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
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col items-center justify-center p-4">
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
                    <h2 className="text-white text-xl font-bold tracking-tight">EduPal</h2>
                    <div className="w-10"></div> {/* Spacer for centering title */}
                </div>

                {/* Main Login Card */}
                <div className="w-full bg-white/5 dark:bg-white/5 backdrop-blur-md p-8 rounded-xl border border-white/10 shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-white text-3xl font-bold mb-2">Welcome Back</h1>
                        <p className="text-gray-400 text-sm">Login to your EduPal account to continue learning</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
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
                            className="w-full bg-primary hover:bg-primary/90 text-[#102217] font-bold py-4 rounded-lg shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] mt-4"
                        >
                            Log In
                        </button>
                    </form>

                    {/* Social Login Divider */}
                    <div className="relative flex items-center py-8">
                        <div className="flex-grow border-t border-white/10"></div>
                        <span className="flex-shrink mx-4 text-gray-500 text-xs font-medium uppercase tracking-widest">
                            Or continue with
                        </span>
                        <div className="flex-grow border-t border-white/10"></div>
                    </div>

                    {/* Social Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-lg transition-colors">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span className="text-sm font-medium">Google</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-lg transition-colors">
                            <span className="material-symbols-outlined text-[20px]">apple</span>
                            <span className="text-sm font-medium">Apple</span>
                        </button>
                    </div>
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
