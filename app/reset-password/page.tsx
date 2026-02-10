'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import EduPalLogo from '@/assets/images/edupal.png';

export default function ResetPassword() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleBack = () => {
        router.back();
    };

    const handleHelp = () => {
        console.log('Help button clicked');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Password reset requested for:', email);

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: email,
                    subject: 'Reset Your EduPal Password',
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #4CAF50;">EduPal Password Reset</h2>
                            <p>Hello,</p>
                            <p>We received a request to reset your password. Click the button below to set a new one:</p>
                            <a href="${process.env.NEXT_PUBLIC_APP_URL}/reset-password?email=${email}" 
                               style="display: inline-block; background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                               Reset Password
                            </a>
                            <p style="margin-top: 20px; color: #666;">If you didn't request this, you can safely ignore this email.</p>
                        </div>
                    `
                })
            });

            if (!response.ok) throw new Error('Failed to send email');

            setShowSuccessModal(true);
        } catch (error) {
            console.error('Reset error:', error);
            alert('Failed to send reset instructions. Please try again.');
        }
    };

    const handleOpenEmailApp = () => {
        console.log('Open email app clicked');
        window.location.href = 'mailto:';
    };

    const closeModal = () => {
        setShowSuccessModal(false);
    };

    const handleModalBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    return (
        <div
            className="relative flex h-[100dvh] min-h-[100dvh] w-full flex-col bg-background-light dark:bg-background-dark justify-between group/design-root overflow-x-hidden"
            style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
        >
            <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between border-b border-white/5">
                <button
                    onClick={handleBack}
                    className="text-slate-900 dark:text-white flex size-12 shrink-0 items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0d191c] rounded-xl flex items-center justify-center border border-primary/20 p-1.5 shadow-lg shadow-black/20">
                        <Image src={EduPalLogo} alt="EduPal Logo" width={32} height={32} className="w-full h-full object-contain" />
                    </div>
                    <h2 className="text-slate-900 dark:text-white text-lg font-bold tracking-tight">EduPal</h2>
                </div>

                <button
                    onClick={handleHelp}
                    className="flex size-12 shrink-0 items-center justify-center rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-slate-900 dark:text-white transition-colors"
                >
                    <span className="material-symbols-outlined">help</span>
                </button>
            </div>

            <div className="flex-1 px-4 py-8 max-w-md mx-auto w-full">
                <div className="text-center mb-10">
                    <div className="w-28 h-28 bg-[#0d191c] rounded-[2rem] flex items-center justify-center border border-primary/40 overflow-hidden shadow-2xl shadow-black/40 mx-auto mb-6">
                        <Image src={EduPalLogo} alt="EduPal Logo" width={80} height={80} className="w-20 h-20 object-contain drop-shadow-[0_0_12px_rgba(76,175,80,0.4)]" />
                    </div>
                    <h3 className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold leading-tight px-4">
                        Reset Password
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-relaxed mt-3 px-8">
                        Enter your email and we'll send you instructions to reset your password.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-slate-900 dark:text-white text-sm font-medium px-1">Email Address</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                <span className="material-symbols-outlined text-[20px]">mail</span>
                            </div>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#e7ebf3] dark:bg-[#1c2720] border border-transparent dark:border-[#3b5445] text-slate-900 dark:text-white rounded-lg py-4 pl-11 pr-4 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-500 dark:placeholder:text-gray-600"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-[#102217] font-bold py-4 rounded-lg shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!email}
                    >
                        Send Instructions
                    </button>
                </form>
            </div>

            {showSuccessModal && (
                <div
                    className="fixed inset-0 flex flex-col justify-end items-stretch bg-black/60 backdrop-blur-sm z-50"
                    onClick={handleModalBackdropClick}
                >
                    <div className="flex flex-col items-stretch bg-background-light dark:bg-[#0d191c] rounded-t-2xl max-h-[90vh] overflow-hidden border-t border-white/10">
                        <button
                            className="flex items-center justify-center w-full h-8"
                            onClick={closeModal}
                        >
                            <div className="h-1.5 w-12 rounded-full bg-slate-300 dark:bg-white/20"></div>
                        </button>

                        <div className="p-6 pb-12 text-center">
                            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="material-symbols-outlined text-primary text-5xl">mark_email_read</span>
                            </div>

                            <h1 className="text-slate-900 dark:text-white text-2xl font-bold leading-tight mb-3">
                                Check your email
                            </h1>

                            <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed mb-8">
                                We've sent instructions to <br /><strong className="text-slate-900 dark:text-white">{email}</strong>
                            </p>

                            <div className="space-y-4">
                                <button
                                    onClick={handleOpenEmailApp}
                                    className="w-full bg-primary text-[#102217] font-bold py-4 rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/10"
                                >
                                    Open Email App
                                </button>

                                <button
                                    onClick={closeModal}
                                    className="w-full py-4 text-slate-500 dark:text-slate-400 font-medium hover:text-primary transition-colors"
                                >
                                    I'll check later
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
