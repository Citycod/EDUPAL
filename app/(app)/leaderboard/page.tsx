'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useInstitutionContext } from '@/lib/hooks/useInstitutionContext';

interface LeaderboardUser {
    user_id: string;
    full_name: string;
    avatar_url: string;
    department_name: string;
    total_points: number;
    current_streak: number;
    institution_rank: number;
}

export default function LeaderboardPage() {
    const { institution, loading: instLoading } = useInstitutionContext();
    const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUserRank, setCurrentUserRank] = useState<LeaderboardUser | null>(null);

    useEffect(() => {
        const fetchLeaders = async () => {
            if (!institution?.id) return;

            try {
                // Fetch top 50 users for this institution
                const { data } = await supabase
                    .from('hub_leaderboard')
                    .select('*')
                    .eq('institution_id', institution.id)
                    .order('institution_rank', { ascending: true })
                    .limit(50);

                if (data) setLeaders(data);

                // Fetch current user rank separately
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data: myRank } = await supabase
                        .from('hub_leaderboard')
                        .select('*')
                        .eq('user_id', user.id)
                        .single();
                    if (myRank) setCurrentUserRank(myRank);
                }

            } catch (error) {
                console.error("Leaderboard error:", error);
            } finally {
                setLoading(false);
            }
        };

        if (!instLoading) {
            fetchLeaders();
        }
    }, [institution?.id, instLoading]);

    if (instLoading || loading) {
        return <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-slate-500">Loading Rankings...</div>;
    }

    const topThree = leaders.slice(0, 3);
    const rest = leaders.slice(3);

    return (
        <div className="bg-[#f6f8f7] dark:bg-[#102217] font-sans text-slate-900 dark:text-slate-100 min-h-screen flex flex-col pb-24">

            <header className="bg-primary pt-12 pb-24 rounded-b-[3rem] px-4 shadow-xl shadow-primary/20 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

                <div className="max-w-2xl mx-auto relative z-10 text-center">
                    <h1 className="text-3xl font-black text-white tracking-tighter mb-2">Hall of Fame</h1>
                    <p className="text-white/80 text-sm font-medium">
                        Top contributors in {institution?.name || 'your school'}
                    </p>
                </div>
            </header>

            <main className="max-w-2xl mx-auto w-full -mt-16 px-4 z-20 flex-1">

                {/* Podium for Top 3 */}
                {topThree.length > 0 && (
                    <div className="flex items-end justify-center gap-2 mb-8 h-48">
                        {/* 2nd Place */}
                        {topThree[1] && (
                            <div className="flex flex-col items-center pb-2 w-24">
                                <div className="size-14 rounded-full bg-cover bg-center border-4 border-[#C0C0C0] shadow-xl relative mb-2" style={{ backgroundImage: `url(${topThree[1].avatar_url || 'https://ui-avatars.com/api/?name=User'})` }}>
                                    <div className="absolute -bottom-2 -right-2 size-6 rounded-full bg-[#C0C0C0] text-white flex items-center justify-center text-xs font-black shadow-md border-2 border-white dark:border-slate-900">2</div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-700 dark:text-white truncate w-full text-center">
                                    {topThree[1].full_name.split(' ')[0]}
                                </span>
                                <span className="text-[10px] font-black text-amber-500">{topThree[1].total_points}</span>
                                <div className="w-full h-16 bg-gradient-to-t from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-t-xl mt-2 border-t border-[#C0C0C0]/50"></div>
                            </div>
                        )}

                        {/* 1st Place */}
                        {topThree[0] && (
                            <div className="flex flex-col items-center w-28 drop-shadow-2xl z-10">
                                <span className="material-symbols-outlined text-amber-500 text-3xl drop-shadow-lg mb-1 animate-bounce">Workspace_Premium</span>
                                <div className="size-20 rounded-full bg-cover bg-center border-4 border-amber-400 shadow-2xl relative mb-2" style={{ backgroundImage: `url(${topThree[0].avatar_url || 'https://ui-avatars.com/api/?name=User'})` }}>
                                    <div className="absolute -bottom-2 -right-2 size-7 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center text-sm font-black shadow-md border-2 border-white dark:border-slate-900">1</div>
                                </div>
                                <span className="text-xs font-black text-slate-900 dark:text-white truncate w-full text-center">
                                    {topThree[0].full_name.split(' ')[0]}
                                </span>
                                <span className="text-[11px] font-black text-amber-500">{topThree[0].total_points} pts</span>
                                <div className="w-full h-24 bg-gradient-to-t from-primary/30 to-primary/10 border-x border-t border-primary/20 rounded-t-xl mt-2 backdrop-blur-sm"></div>
                            </div>
                        )}

                        {/* 3rd Place */}
                        {topThree[2] && (
                            <div className="flex flex-col items-center pb-2 w-24">
                                <div className="size-14 rounded-full bg-cover bg-center border-4 border-[#CD7F32] shadow-xl relative mb-2" style={{ backgroundImage: `url(${topThree[2].avatar_url || 'https://ui-avatars.com/api/?name=User'})` }}>
                                    <div className="absolute -bottom-2 -right-2 size-6 rounded-full bg-[#CD7F32] text-white flex items-center justify-center text-xs font-black shadow-md border-2 border-white dark:border-slate-900">3</div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-700 dark:text-white truncate w-full text-center">
                                    {topThree[2].full_name.split(' ')[0]}
                                </span>
                                <span className="text-[10px] font-black text-amber-500">{topThree[2].total_points}</span>
                                <div className="w-full h-12 bg-gradient-to-t from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-t-xl mt-2 border-t border-[#CD7F32]/50"></div>
                            </div>
                        )}
                    </div>
                )}

                {/* List of remaining ranks */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none p-2 mb-6 border border-slate-100 dark:border-slate-800">
                    {rest.map((user, idx) => (
                        <div key={user.user_id} className="flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-colors">
                            <span className="text-xs font-black w-6 text-center text-slate-400">
                                {user.institution_rank}
                            </span>
                            <div
                                className="size-10 rounded-full bg-cover bg-center border-2 border-slate-100 dark:border-slate-800"
                                style={{ backgroundImage: `url(${user.avatar_url || 'https://ui-avatars.com/api/?name=User'})` }}
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.full_name}</p>
                                <p className="text-[10px] font-medium text-slate-500 truncate">{user.department_name}</p>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-black text-amber-500">{user.total_points}</span>
                                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Pts</span>
                            </div>
                        </div>
                    ))}

                    {leaders.length === 0 && (
                        <div className="p-10 text-center">
                            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">military_tech</span>
                            <p className="font-bold text-slate-500">No ranked students yet.</p>
                            <p className="text-xs text-slate-400 mt-1">Upload a past question to claim 1st place!</p>
                        </div>
                    )}
                </div>

                {/* Info Card */}
                <div className="bg-primary/10 rounded-3xl border border-primary/20 p-5 mb-8 flex items-start gap-4">
                    <div className="size-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-background-dark">info</span>
                    </div>
                    <div>
                        <h4 className="font-black text-sm text-slate-900 dark:text-white mb-1">How to earn points?</h4>
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                            Upload past questions, lecture notes, or course materials to the library. Every approved upload gives you <strong className="text-primary font-black">50 points</strong> and <strong className="text-primary font-black">1 Free Download Credit</strong>!
                        </p>
                    </div>
                </div>

            </main>

            {/* Sticky Current User Rank (if outside top numbers and ranked) */}
            {currentUserRank && currentUserRank.institution_rank > 3 && (
                <div className="fixed bottom-20 left-4 right-4 max-w-2xl mx-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-2xl p-4 flex items-center gap-4 z-40 border-t-4 border-amber-400">
                    <span className="text-sm font-black w-6 text-center text-amber-400">
                        #{currentUserRank.institution_rank}
                    </span>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">Your Ranking</p>
                        <p className="text-[10px] font-medium opacity-80 uppercase tracking-widest">Keep uploading!</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-black text-amber-400">{currentUserRank.total_points}</span>
                        <span className="text-[9px] font-bold uppercase tracking-widest opacity-70">Pts</span>
                    </div>
                </div>
            )}
        </div>
    );
}
