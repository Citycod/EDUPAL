'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import BottomNav from '@/components/BottomNav';

interface Course {
    id: string;
    title: string;
    code: string;
    instructor: string;
    level: string;
    image: string;
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
    replies_count: [{ count: number }];
}

const CourseDetailPage: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const classId = params.classId as string;

    const [course, setCourse] = useState<Course | null>(null);
    const [activeTab, setActiveTab] = useState<'materials' | 'questions' | 'discussions'>('materials');
    const [discussions, setDiscussions] = useState<Discussion[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateThread, setShowCreateThread] = useState(false);
    const [newThreadTitle, setNewThreadTitle] = useState('');
    const [newThreadContent, setNewThreadContent] = useState('');

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                setLoading(true);
                // Fetch Course Details
                const { data: courseData, error } = await supabase
                    .from('courses')
                    .select('*')
                    .eq('id', classId)
                    .single();

                if (error) throw error;
                setCourse(courseData);

                // Fetch Discussions if tab is active
                if (activeTab === 'discussions') {
                    await fetchDiscussions();
                }

            } catch (error) {
                console.error("Error fetching course:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [classId, activeTab]);

    const fetchDiscussions = async () => {
        try {
            const { data, error } = await supabase
                .from('discussions')
                .select(`
          *,
          author:user_id (full_name, avatar_url),
          replies_count:replies(count)
        `)
                .eq('course_id', classId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setDiscussions(data || []);
        } catch (error) {
            console.error("Error fetching discussions:", error);
        }
    };

    const handleCreateThread = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase
                .from('discussions')
                .insert({
                    course_id: classId,
                    user_id: user.id,
                    title: newThreadTitle,
                    content: newThreadContent
                });

            if (error) throw error;

            setNewThreadTitle('');
            setNewThreadContent('');
            setShowCreateThread(false);
            fetchDiscussions(); // Refresh list
        } catch (error) {
            console.error("Error creating thread:", error);
            alert("Failed to create thread. Please try again.");
        }
    };

    if (loading && !course) {
        return <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-slate-500">Loading Class...</div>;
    }

    if (!course) {
        return <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-slate-500">Course not found.</div>;
    }

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-primary/10 dark:bg-[#1c2720] pb-6">
                <div className="flex items-center p-4 justify-between">
                    <button onClick={() => router.back()} className="text-slate-900 dark:text-white">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="text-lg font-bold text-slate-900 dark:text-white">{course.code}</h1>
                    <button className="text-slate-900 dark:text-white">
                        <span className="material-symbols-outlined">more_vert</span>
                    </button>
                </div>
                <div className="px-6 text-center">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{course.title}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{course.instructor || 'Instructor Name'}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-white/10 px-4 mt-4">
                {['materials', 'questions', 'discussions'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${activeTab === tab
                                ? 'border-primary text-primary'
                                : 'border-transparent text-slate-500 dark:text-slate-400'
                            }`}
                    >
                        {tab === 'questions' ? 'Past Qs' : tab}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="p-4">
                {activeTab === 'materials' && (
                    <div className="text-center py-10 text-slate-500">
                        <p>Course materials will appear here.</p>
                    </div>
                )}

                {activeTab === 'questions' && (
                    <div className="text-center py-10 text-slate-500">
                        <p>Past questions will be listed here.</p>
                    </div>
                )}

                {activeTab === 'discussions' && (
                    <div>
                        {!showCreateThread ? (
                            <>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-lg dark:text-white">Class Discussions</h3>
                                    <button
                                        onClick={() => setShowCreateThread(true)}
                                        className="bg-primary text-background-dark px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-lg">add</span>
                                        Ask Question
                                    </button>
                                </div>

                                {discussions.length === 0 ? (
                                    <div className="text-center py-10 text-slate-500 bg-slate-50 dark:bg-white/5 rounded-xl border border-dashed border-slate-200 dark:border-white/10">
                                        <span className="material-symbols-outlined text-4xl mb-2">forum</span>
                                        <p>No discussions yet.</p>
                                        <p className="text-sm">Be the first to ask a question!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {discussions.map((discussion) => (
                                            <div
                                                key={discussion.id}
                                                onClick={() => router.push(`/classes/${classId}/discussion/${discussion.id}`)}
                                                className="bg-white dark:bg-[#28392f]/20 p-4 rounded-xl border border-slate-100 dark:border-white/5 hover:border-primary/50 cursor-pointer transition-colors"
                                            >
                                                <h4 className="font-bold text-slate-900 dark:text-white mb-2">{discussion.title}</h4>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                                    <span className="font-medium text-primary">{discussion.author?.full_name || 'Student'}</span>
                                                    <span>•</span>
                                                    <span>{new Date(discussion.created_at).toLocaleDateString()}</span>
                                                    <span className="ml-auto flex items-center gap-1 bg-slate-100 dark:bg-white/10 px-2 py-1 rounded-full">
                                                        <span className="material-symbols-outlined text-sm">chat_bubble_outline</span>
                                                        {discussion.replies_count?.[0]?.count || 0}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <form onSubmit={handleCreateThread} className="bg-white dark:bg-[#28392f]/20 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-lg dark:text-white">Ask a Question</h3>
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateThread(false)}
                                        className="text-slate-500 hover:text-slate-700 dark:hover:text-white"
                                    >
                                        Cancel
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                                        <input
                                            required
                                            type="text"
                                            value={newThreadTitle}
                                            onChange={(e) => setNewThreadTitle(e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white"
                                            placeholder="e.g., Question about Lecture 3"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Content</label>
                                        <textarea
                                            required
                                            value={newThreadContent}
                                            onChange={(e) => setNewThreadContent(e.target.value)}
                                            rows={4}
                                            className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white resize-none"
                                            placeholder="Describe your question in detail..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-primary text-background-dark font-bold py-3 rounded-lg hover:opacity-90 transition-opacity"
                                    >
                                        Post Question
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </div>

            <BottomNav />
        </div>
    );
};

export default CourseDetailPage;
