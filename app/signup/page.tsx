'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUp() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        university: '',
        department: '',
        password: '',
        confirmPassword: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Signup attempted with:', formData);
    };

    const handleBack = () => {
        router.back();
    };

    const handleSignIn = () => {
        router.push('/login');
    };

    const selectButtonSvg = "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724px%27 height=%2724px%27 fill=%27rgb(76,154,154)%27 viewBox=%270 0 256 256%27%3e%3cpath d=%27M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z%27%3e%3c/path%3e%3c/svg%3e";

    return (
        <div
            className="relative flex h-auto min-h-screen w-full flex-col bg-[#f8fcfc] justify-between group/design-root overflow-x-hidden"
            style={{
                fontFamily: 'Inter, "Noto Sans", sans-serif',
                '--select-button-svg': `url('${selectButtonSvg}')`
            } as React.CSSProperties}
        >
            <div className="flex items-center bg-[#f8fcfc] p-4 pb-2 justify-between">
                <button
                    onClick={handleBack}
                    className="text-[#0d1b1b] flex size-12 shrink-0 items-center hover:bg-[#e7f3f3] rounded-xl transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
                    </svg>
                </button>
                <h2 className="text-[#0d1b1b] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
                    Sign Up
                </h2>
            </div>

            <div className="flex-1">
                <h1 className="text-[#0d1b1b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-left pb-3 pt-5">
                    Create your EduPal account
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                        <label className="flex flex-col flex-1 min-w-40">
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Full Name"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d1b1b] focus:outline-0 focus:ring-0 border-none bg-[#e7f3f3] focus:border-none h-14 placeholder:text-[#4c9a9a] p-4 text-base font-normal leading-normal focus:bg-[#dde9e9] transition-colors"
                                required
                            />
                        </label>
                    </div>

                    <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                        <label className="flex flex-col flex-1 min-w-40">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d1b1b] focus:outline-0 focus:ring-0 border-none bg-[#e7f3f3] focus:border-none h-14 placeholder:text-[#4c9a9a] p-4 text-base font-normal leading-normal focus:bg-[#dde9e9] transition-colors"
                                required
                            />
                        </label>
                    </div>

                    <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                        <label className="flex flex-col flex-1 min-w-40">
                            <select
                                name="university"
                                value={formData.university}
                                onChange={handleInputChange}
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d1b1b] focus:outline-0 focus:ring-0 border-none bg-[#e7f3f3] focus:border-none h-14 bg-[image:--select-button-svg] bg-no-repeat bg-[center_right_1rem] bg-[length:24px_24px] placeholder:text-[#4c9a9a] p-4 text-base font-normal leading-normal focus:bg-[#dde9e9] transition-colors appearance-none"
                                required
                            >
                                <option value="">Select University</option>
                                <option value="university-1">University of Lagos</option>
                                <option value="university-2">University of Ibadan</option>
                                <option value="university-3">Covenant University</option>
                                <option value="university-4">University of Nigeria</option>
                            </select>
                        </label>
                    </div>

                    <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                        <label className="flex flex-col flex-1 min-w-40">
                            <input
                                type="text"
                                name="department"
                                placeholder="Department"
                                value={formData.department}
                                onChange={handleInputChange}
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d1b1b] focus:outline-0 focus:ring-0 border-none bg-[#e7f3f3] focus:border-none h-14 placeholder:text-[#4c9a9a] p-4 text-base font-normal leading-normal focus:bg-[#dde9e9] transition-colors"
                                required
                            />
                        </label>
                    </div>

                    <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                        <label className="flex flex-col flex-1 min-w-40">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d1b1b] focus:outline-0 focus:ring-0 border-none bg-[#e7f3f3] focus:border-none h-14 placeholder:text-[#4c9a9a] p-4 text-base font-normal leading-normal focus:bg-[#dde9e9] transition-colors"
                                required
                            />
                        </label>
                    </div>

                    <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                        <label className="flex flex-col flex-1 min-w-40">
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d1b1b] focus:outline-0 focus:ring-0 border-none bg-[#e7f3f3] focus:border-none h-14 placeholder:text-[#4c9a9a] p-4 text-base font-normal leading-normal focus:bg-[#dde9e9] transition-colors"
                                required
                            />
                        </label>
                    </div>

                    <div className="flex px-4 py-3">
                        <button
                            type="submit"
                            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 flex-1 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!formData.fullName || !formData.email || !formData.university || !formData.department || !formData.password || !formData.confirmPassword}
                        >
                            <span className="truncate">Join EduPal</span>
                        </button>
                    </div>
                </form>
            </div>

            <div>
                <button
                    onClick={handleSignIn}
                    className="text-edupal-forest-400 text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center underline hover:text-primary transition-colors w-full"
                >
                    Already have an account? Sign In
                </button>
                <div className="h-5 bg-[#f8fcfc]"></div>
            </div>
        </div>
    );
}
