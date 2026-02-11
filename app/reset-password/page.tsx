'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import EduPalLogo from '@/assets/images/edupal.png';

export default function ResetPassword() {
    const router = useRouter();
    const [step, setStep] = useState<'request' | 'update'>('request');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Detect if we landed here from a recovery link
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                // If there's an active session, it's likely a recovery flow
                // Supabase sets the session automatically when clicking the link
                setStep('update');
            }
        };

        checkSession();

        // Listen for PASSWORD_RECOVERY event
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'PASSWORD_RECOVERY') {
                setStep('update');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleBack = () => {
        router.push('/login');
    };

    const handleRequestReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (resetError) throw resetError;

            setShowSuccessModal(true);
        } catch (err: any) {
            console.error('Reset request error:', err);
            setError(err.message || 'Failed to send reset instructions.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (updateError) throw updateError;

            alert('Password updated successfully! Redirecting to login...');
            router.push('/login');
        } catch (err: any) {
            console.error('Update password error:', err);
            setError(err.message || 'Failed to update password.');
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setShowSuccessModal(false);
        router.push('/login');
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

                <div className="w-12"></div>
            </div>

            <div className="flex-1 px-4 py-8 max-w-md mx-auto w-full">
                <div className="text-center mb-10">
                    <div className="w-28 h-28 bg-[#0d191c] rounded-[2rem] flex items-center justify-center border border-primary/40 overflow-hidden shadow-2xl shadow-black/40 mx-auto mb-6">
                        <Image src={EduPalLogo} alt="EduPal Logo" width={80} height={80} className="w-20 h-20 object-contain drop-shadow-[0_0_12px_rgba(76,175,80,0.4)]" />
                    </div>
                    <h3 className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold leading-tight px-4">
                        {step === 'request' ? 'Reset Password' : 'New Password'}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-relaxed mt-3 px-8">
                        {step === 'request'
                            ? "Enter your email and we'll send you instructions to reset your password."
                            : "Set your new password below. Make sure it's strong and unique."}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center">
                        {error}
                    </div>
                )}

                {step === 'request' ? (
                    <form onSubmit={handleRequestReset} className="space-y-6">
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
                                    className="w-full bg-[#f0f2f5] dark:bg-[#1c2720] border border-transparent dark:border-[#3b5445] text-slate-900 dark:text-white rounded-lg py-4 pl-11 pr-4 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-500 dark:placeholder:text-gray-600"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-[#102217] font-bold py-4 rounded-lg shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading || !email}
                        >
                            {loading ? 'Sending...' : 'Send Instructions'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleUpdatePassword} className="space-y-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-slate-900 dark:text-white text-sm font-medium px-1">New Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-[#f0f2f5] dark:bg-[#1c2720] border border-transparent dark:border-[#3b5445] text-slate-900 dark:text-white rounded-lg py-4 pl-11 pr-4 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-500 dark:placeholder:text-gray-600"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-slate-900 dark:text-white text-sm font-medium px-1">Confirm New Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">lock_open</span>
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-[#f0f2f5] dark:bg-[#1c2720] border border-transparent dark:border-[#3b5445] text-slate-900 dark:text-white rounded-lg py-4 pl-11 pr-4 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-500 dark:placeholder:text-gray-600"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-[#102217] font-bold py-4 rounded-lg shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading || !newPassword || newPassword !== confirmPassword}
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                )}
            </div>

            {showSuccessModal && (
                <div className="fixed inset-0 flex flex-col justify-end items-stretch bg-black/60 backdrop-blur-sm z-50">
                    <div className="flex flex-col items-stretch bg-background-light dark:bg-[#0d191c] rounded-t-2xl max-h-[90vh] overflow-hidden border-t border-white/10">
                        <div className="p-6 pb-12 text-center mt-4">
                            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="material-symbols-outlined text-primary text-5xl">mark_email_read</span>
                            </div>
                            <h1 className="text-slate-900 dark:text-white text-2xl font-bold leading-tight mb-3">Check your email</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed mb-8">
                                We've sent instructions to <br /><strong className="text-slate-900 dark:text-white">{email}</strong>
                            </p>
                            <button
                                onClick={closeModal}
                                className="w-full bg-primary text-[#102217] font-bold py-4 rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/10"
                            >
                                Back to Login
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
