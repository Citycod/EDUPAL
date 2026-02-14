'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Reply {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    author: {
        full_name: string;
        avatar_url: string;
    };
}

interface Discussion {
    id: string;
    title: string;
    content: string;
    created_at: string;
    user_id: string;
    author: {
        full_name: string;
        avatar_url: string;
    };
}

// Helper to format time relative
const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};

const ThreadDetailPage: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const classId = params.classId as string;
    const discussionId = params.discussionId as string;

    const [discussion, setDiscussion] = useState<any | null>(null);
    const [replies, setReplies] = useState<any[]>([]);
    const [newReply, setNewReply] = useState('');
    const [loading, setLoading] = useState(true);
    const [isPosting, setIsPosting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const { data: discussionData, error: discussionError } = await supabase
                    .from('posts')
                    .select(`
                        *,
                        profiles:author_id (full_name, avatar_url),
                        courses_refined!inner (course_code, title)
                    `)
                    .eq('id', discussionId)
                    .single();

                if (discussionError) throw discussionError;
                setDiscussion(discussionData);

                await fetchReplies();
            } catch (error) {
                console.error("Error fetching thread:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [discussionId]);

    const fetchReplies = async () => {
        const { data: repliesData, error: repliesError } = await supabase
            .from('comments')
            .select(`
                *,
                profiles:author_id (full_name, avatar_url)
            `)
            .eq('post_id', discussionId)
            .order('created_at', { ascending: true });

        if (repliesError) console.error("Error fetching replies:", repliesError);
        setReplies(repliesData || []);
    };

    const handlePostReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newReply.trim() || isPosting) return;

        try {
            setIsPosting(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase
                .from('comments')
                .insert({
                    post_id: discussionId,
                    author_id: user.id,
                    content: newReply
                });

            if (error) throw error;

            setNewReply('');
            fetchReplies();
        } catch (error) {
            console.error("Error posting reply:", error);
        } finally {
            setIsPosting(false);
        }
    };

    if (loading && !discussion) {
        return <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-slate-500">Loading Thread...</div>;
    }

    if (!discussion) {
        return <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-slate-500">Discussion not found.</div>;
    }

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen pb-32 transition-colors duration-300">
            {/* Minimal Header */}
            <div className="sticky top-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-3xl mx-auto flex items-center p-4">
                    <button onClick={() => router.back()} className="size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div className="flex-1 text-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary leading-none block">{discussion.courses_refined?.course_code}</span>
                        <h1 className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Refined Discussion</h1>
                    </div>
                    <div className="size-10"></div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto w-full px-4 pt-8">
                {/* Main Post */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl mb-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100%] z-0" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="size-12 rounded-2xl bg-cover bg-center border-2 border-primary/20" style={{ backgroundImage: `url("${discussion.profiles?.avatar_url || 'https://ui-avatars.com/api/?name=User&background=random'}")` }} />
                            <div>
                                <p className="text-sm font-black uppercase text-slate-900 dark:text-white leading-none">{discussion.profiles?.full_name || 'Anonymous'}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{new Date(discussion.created_at).toLocaleDateString()} • ORIGINAL THREAD</p>
                            </div>
                        </div>

                        <div className="text-lg font-bold text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap italic border-l-4 border-primary pl-6">
                            {discussion.content}
                        </div>
                    </div>
                </div>

                {/* Replies Area */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">
                            Contribution Board
                        </h3>
                        <span className="text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-400 px-3 py-1 rounded-full">{replies.length} REPLIES</span>
                    </div>

                    <div className="space-y-6">
                        {replies.length === 0 ? (
                            <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800 text-slate-400">
                                <span className="material-symbols-outlined text-4xl mb-4 opacity-20">forum</span>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Board is currently silent</p>
                            </div>
                        ) : (
                            replies.map((reply) => (
                                <div key={reply.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-left duration-300">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="size-8 rounded-full bg-cover bg-center border border-primary/10" style={{ backgroundImage: `url("${reply.profiles?.avatar_url || 'https://ui-avatars.com/api/?name=User&background=random'}")` }} />
                                        <span className="text-[10px] font-black uppercase text-primary tracking-widest">{reply.profiles?.full_name}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-auto">{formatTimeAgo(reply.created_at)}</span>
                                    </div>
                                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed pl-11">
                                        {reply.content}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Reply Form */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl z-50">
                <form onSubmit={handlePostReply} className="flex gap-2 p-2 bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/20 dark:border-slate-800 rounded-[2rem] shadow-2xl">
                    <input
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        placeholder="Contribute to discussion..."
                        className="flex-1 bg-white dark:bg-slate-800 border-none rounded-[1.5rem] px-6 text-sm font-bold focus:ring-2 focus:ring-primary/50 dark:text-white"
                    />
                    <button
                        type="submit"
                        disabled={!newReply.trim() || isPosting}
                        className="bg-primary text-background-dark size-12 rounded-full flex items-center justify-center disabled:opacity-50 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        <span className="material-symbols-outlined font-black">send</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ThreadDetailPage;
