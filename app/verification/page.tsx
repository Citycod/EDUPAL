'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import EduPalLogo from '@/assets/images/edupal.png';

export default function Verification() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleResendEmail = async () => {
        setLoading(true);
        setMessage('');
        try {
            // We need the user's email to resend. Since we don't have it in context here 
            // (unless passed via query param or store), we might need to ask for it 
            // or rely on the user being partially authenticated but not verified.
            // For now, let's assume the user just signed up and we might have the email in local storage or session.
            // If not, we should probably prompt for it.
            // HOWEVER, Supabase resend needs email.
            // Let's check if we have a user session.
            const { data: { user } } = await supabase.auth.getUser();

            if (user?.email) {
                const { error } = await supabase.auth.resend({
                    type: 'signup',
                    email: user.email,
                    options: {
                        emailRedirectTo: `${window.location.origin}/login`
                    }
                });
                if (error) throw error;
                setMessage('Verification email resent! Check your inbox.');
            } else {
                setMessage('Please try logging in to trigger a new verification email.');
            }
        } catch (error: any) {
            console.error('Error resending email:', error);
            setMessage(error.message || 'Failed to resend email.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark justify-center items-center overflow-x-hidden font-display p-4">
            <div className="w-full max-w-md bg-white dark:bg-[#102217] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden">
                {/* Header / Logo Area */}
                <div className="flex flex-col items-center justify-center p-8 pb-0">
                    <Image
                        src={EduPalLogo}
                        alt="EduPal Logo"
                        width={280}
                        height={280}
                        className="w-60 h-60 object-contain brightness-125 drop-shadow-[0_0_25px_rgba(19,236,106,0.4)] mb-6"
                        priority
                    />
                    <h2 className="text-[#0d191c] dark:text-white tracking-tight text-2xl font-bold leading-tight text-center">
                        Verify your email
                    </h2>
                </div>

                {/* Illustration/Image */}
                <div className="px-8 py-6 flex justify-center">
                    <div className="w-full max-w-[200px] aspect-square relative bg-primary/5 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-[80px] text-primary">mark_email_unread</span>
                    </div>
                </div>

                {/* Text Content */}
                <div className="px-8 pb-4">
                    <p className="text-[#498a9c] text-base font-normal leading-relaxed text-center">
                        We've sent a verification link to your email address. Please check your inbox (and spam folder) to verify your account.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="px-8 pb-8 flex flex-col items-center gap-4">
                    {message && <p className="text-sm font-medium text-primary text-center">{message}</p>}
                    <button
                        onClick={handleResendEmail}
                        disabled={loading}
                        className="w-full h-12 bg-[#e7f1f4] dark:bg-slate-800 text-[#0d191c] dark:text-white text-sm font-bold rounded-xl hover:bg-[#dbe7eb] dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? 'Sending...' : 'Resend Verification Email'}
                    </button>

                    <a href="/login" className="text-primary text-sm font-bold hover:underline">
                        Back to Login
                    </a>
                </div>
            </div>

            {/* Footer Text */}
            <p className="mt-8 text-center text-[#498a9c] text-xs">
                &copy; {new Date().getFullYear()} EduPal. All rights reserved.
            </p>
        </div>
    );
}
