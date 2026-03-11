'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import ProjectTopicGenerator from '@/components/premium/ProjectTopicGenerator';
import { Search, GraduationCap } from 'lucide-react';

export default function ResearchPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (authUser) {
                const { data: profile } = await supabase
                    .from('hub_profiles')
                    .select('*')
                    .eq('id', authUser.id)
                    .single();
                setUser(profile);
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Opening Research Lab</p>
            </div>
        );
    }

    const level = String(user?.level || user?.year || '').toUpperCase();
    const isSenior = level.includes('400') || level.includes('500') || level.includes('FINAL') || level.includes('4') || level.includes('5');

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white pb-20">
            <main className="max-w-5xl mx-auto px-4 pt-12">
                <div className="flex flex-col gap-2 mb-12">
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase italic">
                        Research <span className="text-primary font-serif">Lab</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold max-w-lg">
                        Find and prepare for your final year project with AI assistance.
                    </p>
                </div>

                {isSenior ? (
                    <ProjectTopicGenerator user={user} />
                ) : (
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-12 text-center border border-slate-200 dark:border-white/5 shadow-2xl shadow-black/10">
                        <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-6">
                            <GraduationCap size={40} />
                        </div>
                        <h2 className="text-2xl font-black mb-4">Senior Students Only</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto font-medium leading-relaxed">
                            The Project Topics Generator is currently reserved for <span className="text-primary font-bold italic">Level 400 and 500</span> students preparing for their final defense.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
