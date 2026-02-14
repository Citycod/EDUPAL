'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import EduPalLogo from '@/assets/images/edupal.png';
import { supabase } from '@/lib/supabase';

export default function SignUp() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        institution: '',
        department: '',
        level: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [institutionsList, setInstitutionsList] = useState<string[]>([]);
    const [departmentsList, setDepartmentsList] = useState<string[]>([]); // Future: dynamic based on inst

    useEffect(() => {
        const fetchInstitutions = async () => {
            try {
                const { data, error } = await supabase
                    .from('hub_institutions')
                    .select('name')
                    .order('name');

                if (data) {
                    setInstitutionsList(data.map(i => i.name));
                }
            } catch (err) {
                console.error('Failed to fetch institutions', err);
                // Fallback or retry?
            }
        };
        fetchInstitutions();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    options: {
                        data: {
                            full_name: formData.full_name,
                            university: formData.institution,
                            major: formData.department,
                            year: formData.level,
                        }
                    }
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Signup failed');
            }

            alert('Signup successful! A verification email has been sent to your inbox. Please check and verify your email.');
            router.push('/verification'); // Redirect to our custom verification page instead of login
        } catch (err: any) {
            setError(err.message || 'An error occurred during signup');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        router.back();
    };

    const handleLogin = () => {
        router.push('/login');
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-white min-h-[100dvh] flex flex-col">
            <div className="flex flex-col min-h-[100dvh] w-full items-center justify-center p-4">
                <div className="w-full max-w-[480px] bg-background-dark border border-border-accent rounded-xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center p-4 pb-2 border-b border-border-accent/30">
                        <button
                            onClick={handleBack}
                            className="text-white flex size-10 shrink-0 items-center justify-center cursor-pointer hover:bg-white/10 rounded-full transition-colors"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <div className="flex-1 flex items-center justify-center pr-10 gap-3">
                            <div className="w-8 h-8 bg-[#0d191c] rounded-lg flex items-center justify-center border border-primary/20 p-1 shadow-lg">
                                <Image src={EduPalLogo} alt="EduPal Logo" width={24} height={24} className="w-full h-full object-contain" />
                            </div>
                            <h2 className="text-white text-lg font-medium leading-tight tracking-[-0.015em]">
                                Create Account
                            </h2>
                        </div>
                    </div>

                    <div className="px-8 pt-8 pb-4 text-center">
                        <div className="mb-6 flex justify-center">
                            <div className="w-24 h-24 bg-[#0d191c] rounded-[1.75rem] flex items-center justify-center border border-primary/30 overflow-hidden shadow-xl shadow-black/30">
                                <Image src={EduPalLogo} alt="EduPal Logo" width={72} height={72} className="w-16 h-16 object-contain drop-shadow-[0_0_8px_rgba(76,175,80,0.3)]" />
                            </div>
                        </div>
                        <h1 className="text-white tracking-tight text-3xl font-bold leading-tight">Join EduPal</h1>
                        <p className="text-white/60 text-base font-normal leading-normal mt-2 px-10">
                            Start your academic journey with us
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center">
                                {error}
                            </div>
                        )}
                        {/* Full Name */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-white/80 text-sm font-medium">Full Name</label>
                            <input
                                name="full_name"
                                type="text"
                                value={formData.full_name}
                                onChange={handleInputChange}
                                className="w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border-accent bg-input-bg h-12 placeholder:text-white/30 px-4 text-base font-normal transition-all"
                                placeholder="Your full name"
                                required
                            />
                        </div>

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
                                <select
                                    name="institution"
                                    value={formData.institution}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border-accent bg-input-bg h-12 px-4 text-base font-normal appearance-none cursor-pointer placeholder:text-white/30"
                                    required
                                >
                                    <option value="" disabled>Select your University</option>
                                    {institutionsList.length > 0 ? (
                                        institutionsList.map((inst) => (
                                            <option key={inst} value={inst} className="bg-background-dark text-white">{inst}</option>
                                        ))
                                    ) : (
                                        <option value="" disabled>Loading institutions...</option>
                                    )}
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
                                    arrow_drop_down
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
                                    <option>Computer Science</option>
                                    <option>Biology</option>
                                    <option>Chemistry</option>
                                    <option>Physics</option>
                                    <option>Mathematics</option>
                                    <option>English</option>
                                    <option>Geography</option>
                                    <option>Social Studies</option>
                                    <option>Business Education</option>
                                    <option>Economic</option>
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

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary/90 text-background-dark font-bold text-base h-12 rounded-lg transition-all active:scale-[0.98] shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-background-dark border-t-transparent rounded-full animate-spin"></div>
                                        Creating Account...
                                    </>
                                ) : (
                                    'Create Account'
                                )}
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
