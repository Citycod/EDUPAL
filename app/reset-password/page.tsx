'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Password reset requested for:', email);
        setShowSuccessModal(true);
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
            className="relative flex h-auto min-h-screen w-full flex-col bg-[#f8f9fc] justify-between group/design-root overflow-x-hidden"
            style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
        >
            <div className="flex items-center bg-[#f8f9fc] p-4 pb-2 justify-between">
                <button
                    onClick={handleBack}
                    className="text-[#0d121b] flex size-12 shrink-0 items-center hover:bg-[#e7ebf3] rounded-xl transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
                    </svg>
                </button>

                <button
                    onClick={handleHelp}
                    className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 bg-transparent text-[#0d121b] gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0 hover:bg-[#e7ebf3] transition-colors"
                >
                    <div className="text-[#0d121b]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
                        </svg>
                    </div>
                </button>
            </div>

            <div className="flex-1">
                <h3 className="text-[#0d121b] tracking-light text-2xl font-bold leading-tight px-4 text-left pb-2 pt-5">
                    Reset your password
                </h3>

                <p className="text-[#0d121b] text-base font-normal leading-normal pb-3 pt-1 px-4">
                    Enter the email associated with your account and we'll send an email with instructions to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                        <label className="flex flex-col flex-1 min-w-40">
                            <p className="text-[#0d121b] text-base font-medium leading-normal pb-2">Email</p>
                            <input
                                type="email"
                                placeholder="example@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d121b] focus:outline-0 focus:ring-0 border-none bg-[#e7ebf3] focus:border-none h-14 placeholder:text-[#4c669a] p-4 text-base font-normal leading-normal focus:bg-[#dde3f0] transition-colors"
                                required
                            />
                        </label>
                    </div>

                    <div className="flex px-4 py-3">
                        <button
                            type="submit"
                            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 flex-1 bg-primary text-primary-dark text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!email}
                        >
                            <span className="truncate">Send Reset Instructions</span>
                        </button>
                    </div>
                </form>
            </div>

            <div className="h-5 bg-[#f8f9fc]"></div>

            {showSuccessModal && (
                <div
                    className="fixed inset-0 flex flex-col justify-end items-stretch bg-[#141414]/40 z-50"
                    onClick={handleModalBackdropClick}
                >
                    <div className="flex flex-col items-stretch bg-[#f8f9fc] rounded-t-2xl max-h-[90vh] overflow-hidden">
                        <button
                            className="flex items-center justify-center w-full h-5 pt-2 pb-1"
                            onClick={closeModal}
                        >
                            <div className="h-1 w-9 rounded-full bg-[#cfd7e7]"></div>
                        </button>

                        <div className="flex-1 p-4">
                            <h1 className="text-[#0d121b] text-[22px] font-bold leading-tight tracking-[-0.015em] text-center pb-3 pt-2">
                                Check your email
                            </h1>

                            <p className="text-[#0d121b] text-base font-normal leading-normal pb-6 pt-1 text-center">
                                We've sent an email to <strong>{email}</strong> with instructions on how to reset your password. Please check your inbox and follow the steps.
                            </p>

                            <div className="flex px-4 py-3">
                                <button
                                    onClick={handleOpenEmailApp}
                                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 flex-1 bg-[#1152d4] text-[#f8f9fc] text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#0f48b8] transition-colors"
                                >
                                    <span className="truncate">Open Email App</span>
                                </button>
                            </div>

                            <div className="flex justify-center mt-4">
                                <button
                                    onClick={closeModal}
                                    className="text-[#4c669a] text-sm font-normal leading-normal hover:text-[#1152d4] transition-colors px-4 py-2"
                                >
                                    I'll check later
                                </button>
                            </div>
                        </div>

                        <div className="h-5 bg-[#f8f9fc]"></div>
                    </div>
                </div>
            )}
        </div>
    );
}
