"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function CoachWidget() {
    const router = useRouter();
    const [readiness, setReadiness] = useState(0);
    const [points, setPoints] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data: stats } = await supabase
                    .from('hub_user_stats')
                    .select('total_points')
                    .single();

                if (stats) {
                    setPoints(stats.total_points);
                    // Determine readiness directly from points so it matches the level progress.
                    // Let's say 1000 points is 100% readiness (Level 20 Master).
                    const calculatedReadiness = Math.min(Math.round((stats.total_points / 1000) * 100), 100);
                    setReadiness(calculatedReadiness);
                }
            } catch (err) {
                console.error('Error fetching coach stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return (
        <div className="h-48 bg-white dark:bg-background-dark rounded-[2.5rem] border border-slate-100 dark:border-secondary animate-pulse" />
    );

    const getDynamicTip = () => {
        if (readiness === 0 && points === 0) return "Welcome! Start exploring materials in the Library to begin your journey.";
        if (readiness === 0) return "Try taking a Mock Exam in the Study room to establish your baseline Readiness score!";
        if (readiness < 40) return "Focus on reviewing your recent incorrect answers. Consistency is key.";
        if (readiness < 70) return "You're steadily improving! Take another mock exam to push your readiness higher.";
        return "Excellent readiness! You are well-prepared. Help peers by uploading resources to earn more points.";
    };

    const getLevelName = () => {
        const level = Math.floor(points / 50) + 1;
        if (level === 1) return 'Novice';
        if (level < 5) return 'Apprentice';
        if (level < 10) return 'Scholar';
        if (level < 20) return 'Expert';
        return 'Master';
    };

    return (
        <div 
            onClick={() => router.push('/library')}
            className="cursor-pointer bg-white dark:bg-background-dark rounded-[2.5rem] p-6 shadow-xl shadow-primary/10 border border-primary/10 dark:border-secondary relative overflow-hidden group transition-all hover:scale-[1.01] hover:border-primary/30"
        >
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-xl text-background-dark">auto_awesome</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">AI Coach</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Study Intelligence</p>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Readiness</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{readiness}%</span>
                </div>
            </div>

            <div className="space-y-4">
                {/* Readiness Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tighter px-1">
                        <span>Beginner</span>
                        <span>Master</span>
                    </div>
                    <div className="h-3 bg-slate-100 dark:bg-secondary rounded-full overflow-hidden p-0.5">
                        <div
                            className="h-full bg-gradient-to-r from-primary via-brand-light to-primary rounded-full transition-all duration-1000 shadow-sm"
                            style={{ width: `${Math.max(readiness, 5)}%` }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="p-4 bg-primary/5 dark:bg-secondary/30 rounded-[1.5rem] border border-primary/10 dark:border-secondary">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="material-symbols-outlined text-base text-primary">emoji_events</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Points</span>
                        </div>
                        <p className="text-xl font-black text-primary">{points}</p>
                    </div>
                    <div className="p-4 bg-secondary rounded-[1.5rem] text-white shadow-lg shadow-secondary/20">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="material-symbols-outlined text-base text-primary">military_tech</span>
                            <span className="text-[10px] font-black text-primary/70 uppercase tracking-widest">Rank Level</span>
                        </div>
                        <p className="text-xl font-black">Lvl {Math.floor(points / 50) + 1} - {getLevelName()}</p>
                    </div>
                </div>

                <div className="pt-2">
                    <p className="text-xs text-slate-500 font-medium leading-relaxed italic border-l-2 border-primary/30 pl-3">
                        <span className="material-symbols-outlined text-xs text-primary inline mr-1 -mt-0.5">lightbulb</span>
                        "{getDynamicTip()}"
                    </p>
                </div>
            </div>
        </div>
    );
}
