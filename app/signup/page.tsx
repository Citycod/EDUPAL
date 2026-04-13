'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import EduPalLogo from '@/assets/images/edupal.png';
import { supabase } from '@/lib/supabase';
import { getLevelOptions, ProgramType } from '@/lib/nce';
import { NceDepartmentSelect } from '@/components/NceDepartmentSelect';
import { SearchableSelect } from '@/components/SearchableSelect';

// Expanded list of standard degree departments
const DEGREE_DEPARTMENTS = [
    'Agricultural Science',
    'Biology',
    'Business Education',
    'Chemistry',
    'Christian Religious Studies',
    'Computer Science',
    'Creative Arts',
    'Curriculum & Instruction Studies',
    'Early Childhood Care and Education',
    'Economics',
    'Educational Foundation',
    'Educational Psychology',
    'Educational Technology',
    'English',
    'Entrepreneurship Education',
    'Fine and Applied Arts',
    'General Studies in Education',
    'Geography',
    'Guidance and Counselling',
    'History',
    'Home Economics',
    'Islamic Studies',
    'Integrated Science',
    'Library and Information Science',
    'Mathematics',
    'Nursery and Primary Education',
    'Physical and Health Education',
    'Physics',
    'Political Science',
    'Primary Education (Double Major)',
    'Social Studies',
    'Technical Education',
    'Transport Planning'
].sort();

export default function SignUp() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        institution: '',
        department: '',
        level: '',
        program_type: 'degree' as ProgramType
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [institutionsData, setInstitutionsData] = useState<{ id: string; name: string }[]>([]);
    const [departmentsList, setDepartmentsList] = useState<string[]>([]);
    const [loadingDepts, setLoadingDepts] = useState(false);

    useEffect(() => {
        const fetchInstitutions = async () => {
            try {
                const { data, error } = await supabase
                    .from('hub_institutions')
                    .select('id, name')
                    .order('name');

                if (data) {
                    setInstitutionsData(data);
                }
            } catch (err) {
                console.error('Failed to fetch institutions', err);
            }
        };
        fetchInstitutions();
    }, []);

    // Fetch departments when institution changes
    useEffect(() => {
        const fetchDepartments = async () => {
            if (!formData.institution) {
                setDepartmentsList([]);
                return;
            }

            setLoadingDepts(true);
            try {
                // Find institution ID from name
                const inst = institutionsData.find(i => i.name === formData.institution);
                if (!inst) return;

                const { data, error } = await supabase
                    .from('hub_departments')
                    .select('name')
                    .eq('institution_id', inst.id)
                    .order('name');

                if (data && data.length > 0) {
                    setDepartmentsList(data.map(d => d.name));
                } else {
                    setDepartmentsList([]); // Fallback to hardcoded list handled in render
                }
            } catch (err) {
                console.error('Failed to fetch departments', err);
                setDepartmentsList([]);
            } finally {
                setLoadingDepts(false);
            }
        };

        if (formData.program_type === 'degree') {
            fetchDepartments();
        }
    }, [formData.institution, formData.program_type, institutionsData]);

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

        // Client-side validation for restricted names
        const fullName = formData.full_name.toLowerCase().trim();
        const restrictedWords = ['anonymous', 'admin', 'administrator', 'root', 'system', 'moderator', 'support', 'edupal'];
        if (restrictedWords.some(word => fullName.includes(word))) {
            setError('Please use your real name. Names containing "Anonymous", "Admin", etc. are not permitted.');
            setLoading(false);
            return;
        }

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
                            program_type: formData.program_type
                        }
                    }
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Signup failed');
            }

            alert('Account created successfully! You can now log in.');
            router.push('/login');
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
                            <Image src={EduPalLogo} alt="EduPal Logo" width={80} height={80} className="w-16 h-16 object-contain brightness-125 drop-shadow-[0_0_10px_rgba(19,236,106,0.6)]" />
                            <h2 className="text-white text-lg font-medium leading-tight tracking-[-0.015em]">
                                Create Account
                            </h2>
                        </div>
                    </div>

                    <div className="px-8 pt-8 pb-4 text-center">
                        <div className="mb-6 flex justify-center">
                            <Image src={EduPalLogo} alt="EduPal Logo" width={280} height={280} className="w-64 h-64 object-contain brightness-125 drop-shadow-[0_0_30px_rgba(19,236,106,0.4)]" />
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
                            <SearchableSelect
                                options={institutionsData.map(i => i.name)}
                                value={formData.institution}
                                onChange={(val) => setFormData(prev => ({ ...prev, institution: val, department: '' }))}
                                placeholder={institutionsData.length > 0 ? "Select your University" : "Loading institutions..."}
                                disabled={institutionsData.length === 0}
                            />
                        </div>

                        {/* Program Type */}
                        <div className="flex flex-col gap-2 pt-1 pb-2">
                            <label className="text-white/80 text-sm font-medium">Program</label>
                            <div className="grid grid-cols-2 gap-3">
                                <label className={`flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${formData.program_type === 'degree' ? 'border-primary bg-primary/10 text-primary' : 'border-border-accent bg-input-bg text-white/50 hover:border-white/20'}`}>
                                    <input type="radio" name="program_type" value="degree" checked={formData.program_type === 'degree'} onChange={() => setFormData(prev => ({ ...prev, program_type: 'degree', level: '' }))} className="hidden" />
                                    <span className="material-symbols-outlined text-[18px]">school</span>
                                    <span className="text-sm font-bold">Degree</span>
                                </label>
                                <label className={`flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${formData.program_type === 'nce' ? 'border-primary bg-primary/10 text-primary' : 'border-border-accent bg-input-bg text-white/50 hover:border-white/20'}`}>
                                    <input type="radio" name="program_type" value="nce" checked={formData.program_type === 'nce'} onChange={() => setFormData(prev => ({ ...prev, program_type: 'nce', level: '' }))} className="hidden" />
                                    <span className="material-symbols-outlined text-[18px]">menu_book</span>
                                    <span className="text-sm font-bold">NCE</span>
                                </label>
                            </div>
                        </div>

                        {/* Department */}
                        <div className="flex flex-col gap-1.5 text-left">
                            <label className="text-white/80 text-sm font-medium">Department</label>
                            {formData.program_type === 'nce' ? (
                                <NceDepartmentSelect
                                    value={formData.department}
                                    onChange={(val) => setFormData(prev => ({ ...prev, department: val }))}
                                    className="w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border-accent bg-input-bg h-12 px-4 text-base font-normal appearance-none cursor-pointer"
                                />
                            ) : (
                                <SearchableSelect
                                    options={departmentsList.length > 0 ? departmentsList : DEGREE_DEPARTMENTS}
                                    value={formData.department}
                                    onChange={(val) => setFormData(prev => ({ ...prev, department: val }))}
                                    placeholder={loadingDepts ? "Loading departments..." : "Search your department"}
                                />
                            )}
                        </div>

                        {/* Level */}
                        <div className="flex flex-col gap-1.5 text-left">
                            <label className="text-white/80 text-sm font-medium">Level</label>
                            <div className="relative">
                                <select
                                    name="level"
                                    value={formData.level}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border-accent bg-input-bg h-12 px-4 text-base font-normal cursor-pointer"
                                    required
                                >
                                    <option value="" disabled>Select your level</option>
                                    {getLevelOptions(formData.program_type).map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
                                    arrow_drop_down
                                </span>
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
