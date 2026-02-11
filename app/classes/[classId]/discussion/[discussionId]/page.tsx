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

const ThreadDetailPage: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const classId = params.classId as string;
    const discussionId = params.discussionId as string;

    const [discussion, setDiscussion] = useState<Discussion | null>(null);
    const [replies, setReplies] = useState<Reply[]>([]);
    const [newReply, setNewReply] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch Discussion Details
                const { data: discussionData, error: discussionError } = await supabase
                    .from('discussions')
                    .select(`
            *,
            author:user_id (full_name, avatar_url)
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
            .from('replies')
            .select(`
        *,
        author:user_id (full_name, avatar_url)
      `)
            .eq('discussion_id', discussionId)
            .order('created_at', { ascending: true });

        if (repliesError) console.error("Error fetching replies:", repliesError);
        setReplies(repliesData || []);
    };

    const handlePostReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newReply.trim()) return;

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase
                .from('replies')
                .insert({
                    discussion_id: discussionId,
                    user_id: user.id,
                    content: newReply
                });

            if (error) throw error;

            setNewReply('');
            fetchReplies(); // Refresh replies
        } catch (error) {
            console.error("Error posting reply:", error);
            alert("Failed to post reply. Please try again.");
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-slate-500">Loading Thread...</div>;
    }

    if (!discussion) {
        return <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-slate-500">Discussion not found.</div>;
    }

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen pb-24">
            {/* Header */}
            <div className="flex items-center bg-white dark:bg-[#1c2720] p-4 border-b border-slate-200 dark:border-white/5 sticky top-0 z-10">
                <button
                    onClick={() => router.back()}
                    className="flex items-center justify-center w-10 h-10 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="flex-1 text-center text-lg font-bold text-slate-900 dark:text-white pr-10">
                    Thread
                </h1>
            </div>

            <div className="max-w-3xl mx-auto w-full">
                {/* Main Post */}
                <div className="bg-white dark:bg-[#28392f]/20 p-6 border-b border-slate-200 dark:border-white/5">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{discussion.title}</h2>
                    <div className="flex items-center gap-3 mb-4">
                        <div
                            className="w-10 h-10 rounded-full bg-center bg-cover bg-slate-200"
                            style={{ backgroundImage: `url("${discussion.author?.avatar_url || 'https://ui-avatars.com/api/?name=User&background=random'}")` }}
                        ></div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{discussion.author?.full_name || 'Anonymous'}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(discussion.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {discussion.content}
                    </div>
                </div>

                {/* Replies List */}
                <div className="p-4 space-y-4">
                    <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                        Replies ({replies.length})
                    </h3>

                    {replies.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 italic">No replies yet. Be the first to help!</div>
                    ) : (
                        replies.map((reply) => (
                            <div key={reply.id} className="bg-white dark:bg-[#28392f]/10 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                                <div className="flex items-center gap-2 mb-2">
                                    <div
                                        className="w-8 h-8 rounded-full bg-center bg-cover bg-slate-200"
                                        style={{ backgroundImage: `url("${reply.author?.avatar_url || 'https://ui-avatars.com/api/?name=User&background=random'}")` }}
                                    ></div>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{reply.author?.full_name}</span>
                                    <span className="text-xs text-slate-400">• {new Date(reply.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed pl-10">
                                    {reply.content}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Reply Input */}
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1c2720] border-t border-slate-200 dark:border-white/5 p-4">
                <form onSubmit={handlePostReply} className="max-w-3xl mx-auto flex gap-3 relative z-50">
                    <textarea
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        placeholder="Write a reply..."
                        className="flex-1 bg-slate-100 dark:bg-white/5 border-none rounded-xl px-4 py-3 min-h-[50px] max-h-[120px] focus:ring-1 focus:ring-primary focus:outline-none dark:text-white resize-none"
                        rows={1}
                    />
                    <button
                        type="submit"
                        disabled={!newReply.trim()}
                        className="bg-primary text-background-dark w-12 h-12 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                    >
                        <span className="material-symbols-outlined">send</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ThreadDetailPage;
