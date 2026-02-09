'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUp() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        institution: '',
        department: '',
        level: ''
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
        // Add your signup logic here
    };

    const handleBack = () => {
        router.back();
    };

    const handleLogin = () => {
        router.push('/login');
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-white min-h-screen flex flex-col">
            <div className="flex flex-col min-h-screen w-full items-center justify-center p-4">
                <div className="w-full max-w-[480px] bg-background-dark border border-border-accent rounded-xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center p-4 pb-2 border-b border-border-accent/30">
                        <button
                            onClick={handleBack}
                            className="text-white flex size-10 shrink-0 items-center justify-center cursor-pointer hover:bg-white/10 rounded-full transition-colors"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <h2 className="text-white text-lg font-medium leading-tight tracking-[-0.015em] flex-1 text-center pr-10">
                            Create Account
                        </h2>
                    </div>

                    {/* Logo and Title */}
                    <div className="px-8 pt-8 pb-4 text-center">
                        <div className="mb-4 flex justify-center">
                            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30">
                                <span className="material-symbols-outlined text-primary text-4xl">school</span>
                            </div>
                        </div>
                        <h1 className="text-white tracking-tight text-3xl font-bold leading-tight">Join EduPal</h1>
                        <p className="text-white/60 text-base font-normal leading-normal mt-2">
                            Start your academic journey with us
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-white/80 text-sm font-medium">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border-accent bg-input-bg h-12 placeholder:text-white/30 px-4 text-base font-normal transition-all"
                                placeholder="e.g. name@institution.edu"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-white/80 text-sm font-medium">Password</label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border-accent bg-input-bg h-12 placeholder:text-white/30 px-4 text-base font-normal transition-all"
                                    placeholder="Min. 8 characters"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                                >
                                    <span className="material-symbols-outlined">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Institution */}
                        <div className="flex flex-col gap-1.5 text-left">
                            <label className="text-white/80 text-sm font-medium">Institution</label>
                            <div className="relative">
                                <input
                                    name="institution"
                                    type="text"
                                    value={formData.institution}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border-accent bg-input-bg h-12 placeholder:text-white/30 px-4 text-base font-normal"
                                    placeholder="Your University or School"
                                    required
                                />
                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
                                    account_balance
                                </span>
                            </div>
                        </div>

                        {/* Department and Level */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5 text-left">
                                <label className="text-white/80 text-sm font-medium">Department</label>
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border-accent bg-input-bg h-12 px-4 text-base font-normal appearance-none cursor-pointer"
                                    required
                                >
                                    <option value="" disabled>Select Dept</option>
                                    <option>Engineering</option>
                                    <option>Science</option>
                                    <option>Arts</option>
                                    <option>Medicine</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1.5 text-left">
                                <label className="text-white/80 text-sm font-medium">Level</label>
                                <select
                                    name="level"
                                    value={formData.level}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border-accent bg-input-bg h-12 px-4 text-base font-normal appearance-none cursor-pointer"
                                    required
                                >
                                    <option value="" disabled>Select Level</option>
                                    <option>100</option>
                                    <option>200</option>
                                    <option>300</option>
                                    <option>400</option>
                                    <option>500</option>
                                </select>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 text-background-dark font-bold text-base h-12 rounded-lg transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
                            >
                                Create Account
                            </button>
                        </div>

                        {/* Login Link */}
                        <div className="pt-2 text-center">
                            <p className="text-white/50 text-sm">
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={handleLogin}
                                    className="text-primary hover:underline font-medium"
                                >
                                    Log in
                                </button>
                            </p>
                        </div>
                    </form>
                </div>

                {/* Security Badges */}
                <div className="mt-8 flex gap-6 opacity-40">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">verified_user</span>
                        <span className="text-xs">Secure Encryption</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">privacy_tip</span>
                        <span className="text-xs">Privacy Guaranteed</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
