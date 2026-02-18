'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';


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

    const [course, setCourse] = useState<any | null>(null);
    const [activeTab, setActiveTab] = useState<'materials' | 'questions' | 'discussions'>('materials');
    const [discussions, setDiscussions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateThread, setShowCreateThread] = useState(false);
    const [newThreadTitle, setNewThreadTitle] = useState('');
    const [newThreadContent, setNewThreadContent] = useState('');

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                setLoading(true);
                const { data: courseData, error } = await supabase
                    .from('hub_courses')
                    .select('*, hub_departments (name, hub_institutions (name))')
                    .eq('id', classId)
                    .single();

                if (error) throw error;
                setCourse(courseData);

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
                .from('hub_posts')
                .select(`
                    *,
                    profiles:author_id (full_name, avatar_url)
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
                .from('hub_posts')
                .insert({
                    course_id: classId,
                    author_id: user.id,
                    content: `${newThreadTitle}\n\n${newThreadContent}`
                });

            if (error) throw error;

            setNewThreadTitle('');
            setNewThreadContent('');
            setShowCreateThread(false);
            fetchDiscussions();
        } catch (error) {
            console.error("Error creating thread:", error);
        }
    };

    if (loading && !course) {
        return <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-slate-500">Loading Class...</div>;
    }

    if (!course) {
        return <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-slate-500">Course not found.</div>;
    }

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen pb-20 transition-colors duration-300">
            {/* Premium Header */}
            <div className="bg-primary/5 dark:bg-primary/10 border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center p-4 justify-between">
                        <button onClick={() => router.back()} className="size-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <div className="flex flex-col items-center">
                            <h1 className="text-sm font-black tracking-widest uppercase text-primary leading-none">{course.course_code}</h1>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{course.level}L • BOARD</p>
                        </div>
                        <button className="size-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center">
                            <span className="material-symbols-outlined">more_vert</span>
                        </button>
                    </div>
                    <div className="px-6 pb-8 pt-4 text-center">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter uppercase leading-tight">{course.title}</h2>
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-[10px] font-black bg-primary text-background-dark px-2 py-0.5 rounded-full uppercase tracking-tighter">{course.hub_departments?.hub_institutions?.name}</span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{course.hub_departments?.name}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Academic Tabs */}
            <div className="max-w-3xl mx-auto">
                <div className="flex border-b border-slate-200 dark:border-slate-800 px-4 mt-6">
                    {['materials', 'questions', 'discussions'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] border-b-2 transition-all ${activeTab === tab
                                ? 'border-primary text-primary'
                                : 'border-transparent text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {tab === 'questions' ? 'Archives' : tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-3xl mx-auto p-4 lg:p-6">
                {activeTab === 'materials' && (
                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 text-slate-500">
                        <span className="material-symbols-outlined text-4xl mb-4 opacity-20">inventory_2</span>
                        <p className="text-xs font-black uppercase tracking-widest">Repository Empty</p>
                    </div>
                )}

                {activeTab === 'questions' && (
                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 text-slate-500">
                        <span className="material-symbols-outlined text-4xl mb-4 opacity-20">history_edu</span>
                        <p className="text-xs font-black uppercase tracking-widest">No Past Questions Digitized</p>
                    </div>
                )}

                {activeTab === 'discussions' && (
                    <div className="space-y-6">
                        {!showCreateThread ? (
                            <>
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-xl font-black uppercase tracking-tight dark:text-white">Active Board</h3>
                                    <button
                                        onClick={() => setShowCreateThread(true)}
                                        className="bg-primary text-background-dark px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/20"
                                    >
                                        <span className="material-symbols-outlined text-sm">add</span>
                                        Initialize Thread
                                    </button>
                                </div>

                                {discussions.length === 0 ? (
                                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 text-slate-500">
                                        <span className="material-symbols-outlined text-4xl mb-4 opacity-20">forum</span>
                                        <p className="text-xs font-black uppercase tracking-widest">No Active Discussions</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        {discussions.map((discussion) => (
                                            <div
                                                key={discussion.id}
                                                onClick={() => router.push(`/community?board=${classId}`)}
                                                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 cursor-pointer transition-all shadow-sm active:scale-95 group"
                                            >
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="size-8 rounded-full bg-cover bg-center border border-primary/20" style={{ backgroundImage: `url("${discussion.profiles?.avatar_url || 'https://ui-avatars.com/api/?name=User&background=random'}")` }} />
                                                    <span className="text-[10px] font-black uppercase text-primary tracking-widest">{discussion.profiles?.full_name || 'Anonymous'}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase ml-auto">{new Date(discussion.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-relaxed group-hover:text-primary transition-colors">
                                                    {discussion.content}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <form onSubmit={handleCreateThread} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl space-y-8 animate-in slide-in-from-bottom duration-300">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1 tracking-tighter">New Thread</h3>
                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">Initialize academic discussion</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateThread(false)}
                                        className="size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center text-slate-400"
                                    >
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                                        <input
                                            required
                                            value={newThreadTitle}
                                            onChange={(e) => setNewThreadTitle(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl py-4 px-5 focus:outline-none focus:border-primary transition-all font-bold placeholder:font-normal"
                                            placeholder="e.g. Question about Lecture 3"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Context</label>
                                        <textarea
                                            required
                                            value={newThreadContent}
                                            onChange={(e) => setNewThreadContent(e.target.value)}
                                            rows={5}
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl py-4 px-5 focus:outline-none focus:border-primary transition-all font-bold placeholder:font-normal resize-none"
                                            placeholder="Describe your inquiry in detail..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-primary text-background-dark font-black py-4 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98] uppercase text-xs tracking-[0.2em]"
                                    >
                                        Broadcast to Board
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </div>


        </div>
    );
};

export default CourseDetailPage;
