'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useInstitutionContext } from '@/lib/hooks/useInstitutionContext';


interface Contributor {
    user_id: string;
    full_name: string;
    avatar_url: string;
    upload_count: number;
    resource_upvotes: number;
    comment_upvotes: number;
    score: number;
}

const LeaderboardPage: React.FC = () => {
    const router = useRouter();
    const { institution, loading: contextLoading } = useInstitutionContext();
    const [contributors, setContributors] = useState<Contributor[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [timeFilter, setTimeFilter] = useState<'all' | 'month' | 'week'>('all');

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) setCurrentUserId(user.id);

                if (!institution?.id) return;

                // Query hub_contributor_scores view filtered by institution
                const { data, error } = await supabase
                    .from('hub_contributor_scores')
                    .select('*')
                    .eq('institution_id', institution.id)
                    .order('score', { ascending: false })
                    .limit(50);

                if (error) throw error;

                setContributors(data || []);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            } finally {
                setLoading(false);
            }
        };

        if (institution?.id) {
            fetchLeaderboard();
        }
    }, [institution?.id, timeFilter]);

    const currentUserRank = contributors.findIndex(c => c.user_id === currentUserId) + 1;
    const currentUserData = contributors.find(c => c.user_id === currentUserId);

    const getRankStyle = (rank: number) => {
        switch (rank) {
            case 1: return { emoji: '👑', gradient: 'from-yellow-400 to-amber-500', ring: 'ring-yellow-400', bg: 'bg-yellow-400/10', text: 'text-yellow-400', size: 'w-24 h-24' };
            case 2: return { emoji: '🥈', gradient: 'from-slate-300 to-slate-400', ring: 'ring-slate-300', bg: 'bg-slate-300/10', text: 'text-slate-300', size: 'w-20 h-20' };
            case 3: return { emoji: '🥉', gradient: 'from-amber-600 to-amber-700', ring: 'ring-amber-600', bg: 'bg-amber-600/10', text: 'text-amber-600', size: 'w-20 h-20' };
            default: return { emoji: '', gradient: '', ring: '', bg: '', text: 'text-slate-400', size: 'w-12 h-12' };
        }
    };

    if (loading || contextLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark gap-4">
                <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Loading Rankings</p>
            </div>
        );
    }

    const top3 = contributors.slice(0, 3);
    const rest = contributors.slice(3);

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-screen">
            <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden pb-20">

                {/* Hero Header */}
                <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

                    <header className="relative z-10 pt-6 pb-4 px-4">
                        <div className="flex items-center justify-between mb-6">
                            <button
                                onClick={() => router.push('/home')}
                                className="flex items-center justify-center h-10 w-10 rounded-xl bg-white/10 backdrop-blur-sm text-slate-600 dark:text-white hover:bg-white/20 transition-all"
                            >
                                <span className="material-symbols-outlined">arrow_back</span>
                            </button>
                            <div className="text-center">
                                <h1 className="text-2xl font-black tracking-tighter uppercase">Leaderboard</h1>
                                <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mt-0.5">{institution?.name || 'Your University'}</p>
                            </div>
                            <div className="w-10" />
                        </div>

                        {/* Time Filters */}
                        <div className="flex gap-2 justify-center">
                            {[
                                { key: 'week', label: 'This Week' },
                                { key: 'month', label: 'This Month' },
                                { key: 'all', label: 'All Time' }
                            ].map(f => (
                                <button
                                    key={f.key}
                                    onClick={() => setTimeFilter(f.key as any)}
                                    className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${timeFilter === f.key
                                        ? 'bg-primary text-background-dark border-primary shadow-lg shadow-primary/20 scale-105'
                                        : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 hover:border-primary/50'
                                        }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </header>

                    {/* Your Rank Banner */}
                    {currentUserRank > 0 && currentUserData && (
                        <div className="mx-4 mb-6 p-4 bg-primary/10 border border-primary/20 rounded-2xl flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-sm">
                                #{currentUserRank}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Your Rank</p>
                                <p className="font-bold truncate">{currentUserData.full_name}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black text-primary">{currentUserData.score}</p>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Points</p>
                            </div>
                        </div>
                    )}

                    {/* Podium - Top 3 */}
                    {top3.length > 0 && (
                        <div className="flex items-end justify-center gap-3 px-4 pt-4 pb-8">
                            {/* 2nd Place */}
                            {top3[1] && (
                                <div className="flex flex-col items-center flex-1 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
                                    <div className="text-xl sm:text-2xl mb-2">{getRankStyle(2).emoji}</div>
                                    <div className={`${getRankStyle(2).size} rounded-full bg-cover bg-center ring-4 ${getRankStyle(2).ring} shadow-xl mb-3 scale-90 sm:scale-100 transition-transform`}
                                        style={{ backgroundImage: `url("${top3[1].avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(top3[1].full_name)}&background=random`}")` }}
                                    />
                                    <p className="font-black text-[10px] sm:text-sm text-center truncate max-w-[80px] sm:max-w-[100px]">{top3[1].full_name?.split(' ')[0]}</p>
                                    <p className={`text-lg sm:text-xl font-black ${getRankStyle(2).text}`}>{top3[1].score}</p>
                                    <div className={`w-full h-14 sm:h-20 ${getRankStyle(2).bg} rounded-t-2xl mt-2 flex items-center justify-center border border-slate-300/20`}>
                                        <span className="text-3xl sm:text-4xl font-black text-slate-500/20">2</span>
                                    </div>
                                </div>
                            )}

                            {/* 1st Place */}
                            {top3[0] && (
                                <div className="flex flex-col items-center flex-1 -mt-4 animate-slide-in-up">
                                    <div className="text-3xl sm:text-4xl mb-2 animate-float" style={{ animationDuration: '3s' }}>{getRankStyle(1).emoji}</div>
                                    <div className={`${getRankStyle(1).size} rounded-full bg-cover bg-center ring-4 ${getRankStyle(1).ring} shadow-2xl shadow-yellow-400/30 mb-3 scale-95 sm:scale-100 transition-transform`}
                                        style={{ backgroundImage: `url("${top3[0].avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(top3[0].full_name)}&background=random`}")` }}
                                    />
                                    <p className="font-black text-xs sm:text-base text-center truncate max-w-[100px] sm:max-w-[120px]">{top3[0].full_name?.split(' ')[0]}</p>
                                    <p className={`text-xl sm:text-2xl font-black ${getRankStyle(1).text}`}>{top3[0].score}</p>
                                    <div className={`w-full h-20 sm:h-28 ${getRankStyle(1).bg} rounded-t-2xl mt-2 flex items-center justify-center border border-yellow-400/20`}>
                                        <span className="text-4xl sm:text-5xl font-black text-yellow-400/20">1</span>
                                    </div>
                                </div>
                            )}

                            {/* 3rd Place */}
                            {top3[2] && (
                                <div className="flex flex-col items-center flex-1 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                                    <div className="text-xl sm:text-2xl mb-2">{getRankStyle(3).emoji}</div>
                                    <div className={`${getRankStyle(3).size} rounded-full bg-cover bg-center ring-4 ${getRankStyle(3).ring} shadow-xl mb-3 scale-90 sm:scale-100 transition-transform`}
                                        style={{ backgroundImage: `url("${top3[2].avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(top3[2].full_name)}&background=random`}")` }}
                                    />
                                    <p className="font-black text-[10px] sm:text-sm text-center truncate max-w-[80px] sm:max-w-[100px]">{top3[2].full_name?.split(' ')[0]}</p>
                                    <p className={`text-lg sm:text-xl font-black ${getRankStyle(3).text}`}>{top3[2].score}</p>
                                    <div className={`w-full h-12 sm:h-16 ${getRankStyle(3).bg} rounded-t-2xl mt-2 flex items-center justify-center border border-amber-600/20`}>
                                        <span className="text-3xl sm:text-4xl font-black text-amber-600/20">3</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Ranked List */}
                <div className="px-4 -mt-2">
                    <div className="bg-white dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-xl">
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-white/5">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Rank</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Contributor</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Score</p>
                        </div>

                        {rest.length === 0 && top3.length <= 3 && contributors.length <= 3 && (
                            <div className="text-center py-8 text-slate-400">
                                <span className="material-symbols-outlined text-3xl mb-2 opacity-30">groups</span>
                                <p className="text-xs font-medium">More contributors coming soon!</p>
                            </div>
                        )}

                        {rest.map((contributor, index) => {
                            const rank = index + 4;
                            const isCurrentUser = contributor.user_id === currentUserId;

                            return (
                                <div
                                    key={contributor.user_id}
                                    className={`flex items-center gap-4 px-5 py-4 border-b border-slate-100 dark:border-white/5 last:border-0 transition-all hover:bg-slate-50 dark:hover:bg-white/5 ${isCurrentUser ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                                        }`}
                                >
                                    {/* Rank */}
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${isCurrentUser ? 'bg-primary text-background-dark' : 'bg-slate-100 dark:bg-white/10 text-slate-400'
                                        }`}>
                                        {rank}
                                    </div>

                                    {/* Avatar */}
                                    <div
                                        className="w-10 h-10 rounded-full bg-cover bg-center shrink-0 border-2 border-slate-200 dark:border-white/10"
                                        style={{ backgroundImage: `url("${contributor.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(contributor.full_name)}&background=random`}")` }}
                                    />

                                    {/* Name + Breakdown */}
                                    <div className="flex-1 min-w-0">
                                        <p className={`font-bold text-sm truncate ${isCurrentUser ? 'text-primary' : ''}`}>
                                            {contributor.full_name || 'Anonymous'}
                                            {isCurrentUser && <span className="ml-1.5 text-[8px] font-black text-primary uppercase tracking-widest">(You)</span>}
                                        </p>
                                        <div className="flex items-center gap-2 sm:gap-3 mt-0.5">
                                            <span className="text-[9px] text-slate-400 flex items-center gap-0.5">
                                                <span className="material-symbols-outlined text-[11px]">upload_file</span>
                                                {contributor.upload_count}
                                            </span>
                                            <span className="text-[9px] text-slate-400 flex items-center gap-0.5">
                                                <span className="material-symbols-outlined text-[11px]">thumb_up</span>
                                                {contributor.resource_upvotes}
                                            </span>
                                            <span className="text-[9px] text-slate-400 flex items-center gap-0.5">
                                                <span className="material-symbols-outlined text-[11px]">chat</span>
                                                {contributor.comment_upvotes}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Score */}
                                    <div className="text-right">
                                        <p className={`text-lg font-black ${isCurrentUser ? 'text-primary' : 'text-slate-600 dark:text-slate-300'}`}>
                                            {contributor.score}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Empty state */}
                {contributors.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
                        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-primary text-4xl">leaderboard</span>
                        </div>
                        <h3 className="text-xl font-black tracking-tight mb-2">No Rankings Yet</h3>
                        <p className="text-slate-400 text-sm max-w-xs">Be the first to upload resources and earn contributor points at {institution?.name || 'your university'}!</p>
                        <button
                            onClick={() => router.push('/library/upload')}
                            className="mt-6 px-8 py-3 bg-primary text-background-dark font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-widest"
                        >
                            Upload First Resource
                        </button>
                    </div>
                )}


            </div>
        </div>
    );
};

export default LeaderboardPage;
