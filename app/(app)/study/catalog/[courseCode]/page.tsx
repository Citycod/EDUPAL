'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import FlashcardGame, { Flashcard } from '@/components/study/FlashcardGame';
import QuizGame, { QuizQuestion } from '@/components/study/QuizGame';
import MockExamUI from '@/components/study/MockExamUI';
import StudyRoadmap from '@/components/study/StudyRoadmap';
import { useFeatureAccess } from '@/lib/hooks/useSubscription';
import ReactMarkdown from 'react-markdown';

type StudyMode = 'select' | 'generating' | 'flashcards' | 'quiz' | 'notes' | 'mock-exam' | 'roadmap' | 'results';

export default function CatalogStudyPage() {
    const { courseCode } = useParams<{ courseCode: string }>();
    const router = useRouter();

    const [mode, setMode] = useState<StudyMode>('select');
    const [courseTitle, setCourseTitle] = useState('Catalog Course');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCached, setIsCached] = useState(false);

    // AI Content State
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
    const [mockQuestions, setMockQuestions] = useState<any[]>([]);
    const [studyNotes, setStudyNotes] = useState<string>('');
    const [roadmapData, setRoadmapData] = useState<any[]>([]);
    const [examDate, setExamDate] = useState<string>(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
    const [isRoadmapLoading, setIsRoadmapLoading] = useState(false);

    // Subscription & Access
    const { hasAccess, loading: accessLoading } = useFeatureAccess('ai_study_tools');

    useEffect(() => {
        const fetchCourseDetails = async () => {
            if (!courseCode) return;
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const headers: any = {};
                if (session?.access_token) {
                    headers['Authorization'] = `Bearer ${session.access_token}`;
                }

                // Fetch from the catalog API - we use the course code to find it
                const res = await fetch(`/api/catalog/courses?programCode=CSC`, { headers }); 
                const data = await res.json();
                const course = data.courses?.find((c: any) => c.course_code_standard === courseCode);
                
                if (course) {
                    setCourseTitle(`${course.course_code_standard}: ${course.title_standard}`);
                }
            } catch (err) {
                console.error('Error fetching course details:', err);
                setError('Could not load course curriculum.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetails();
    }, [courseCode]);

    const handleGenerate = async (type: 'flashcards' | 'quiz' | 'notes' | 'mock-exam', forceRegenerate = false) => {
        setMode('generating');
        setError(null);
        setIsCached(false);

        try {
            const res = await fetch('/api/study/generate-from-catalog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courseCode, type, forceRegenerate })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to generate');

            if (type === 'flashcards') {
                setFlashcards(data.content);
                setMode('flashcards');
            } else if (type === 'quiz') {
                setQuizQuestions(data.content);
                setMode('quiz');
            } else if (type === 'notes') {
                setStudyNotes(data.content);
                setMode('notes');
                setIsCached(data.cached);
            } else if (type === 'mock-exam') {
                setMockQuestions(data.content);
                setMode('mock-exam');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during generation.');
            setMode('select');
        }
    };

    const handleGenerateRoadmap = async () => {
        setIsRoadmapLoading(true);
        setError(null);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Please login to generate a roadmap.");

            const res = await fetch('/api/study/roadmap-from-catalog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courseCode, userId: user.id, examDate })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to generate roadmap');
            
            if (data.roadmap) {
                setRoadmapData(data.roadmap);
                setMode('roadmap');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsRoadmapLoading(false);
        }
    };

    if (loading || accessLoading) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
                <div className="size-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f6f8f7] dark:bg-[#102217] font-sans selection:bg-primary/30">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#102217]/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/50">
                <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="size-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    <div className="flex flex-col items-center max-w-[60%]">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Catalog Study Room</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white truncate w-full text-center">{courseTitle}</span>
                    </div>
                    <div className="size-10" />
                </div>
            </header>

            <main className="max-w-2xl mx-auto pb-20">
                {error && (
                    <div className="m-4 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
                        <span className="material-symbols-outlined text-red-500">error</span>
                        <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}

                {/* MODE: Selection */}
                {mode === 'select' && (
                    <div className="p-4 pt-8 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center p-6 bg-primary/10 rounded-[2rem] mb-4 rotate-3">
                                <span className="material-symbols-outlined text-5xl text-primary">auto_stories</span>
                            </div>
                            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2 uppercase italic">Select Study Artifact</h1>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest max-w-sm mx-auto">
                                AI is ready to generate materials from the NUC objectives. No upload required.
                            </p>
                        </div>

                        <div className="grid gap-4">
                            <button
                                onClick={() => handleGenerate('notes')}
                                className="group relative flex items-center justify-between p-6 bg-[#0a120d] border border-white/5 rounded-[2.5rem] hover:border-primary/50 transition-all active:scale-95 shadow-2xl"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="size-14 rounded-2xl bg-primary flex items-center justify-center text-slate-950 shadow-lg shadow-primary/20">
                                        <span className="material-symbols-outlined text-3xl font-bold">menu_book</span>
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-lg font-black text-white italic tracking-tight">AI Study Notes</h3>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Master Course Objectives</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform">arrow_forward</span>
                            </button>

                            <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => handleGenerate('flashcards')}
                                className="flex flex-col items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-primary transition-all active:scale-95 text-center shadow-sm"
                            >
                                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined">style</span>
                                </div>
                                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Flashcards</span>
                            </button>
                            <button
                                onClick={() => handleGenerate('quiz')}
                                className="flex flex-col items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-primary transition-all active:scale-95 text-center shadow-sm"
                            >
                                <div className="size-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                    <span className="material-symbols-outlined">quiz</span>
                                </div>
                                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Practice Quiz</span>
                            </button>
                            <button
                                onClick={() => handleGenerate('mock-exam')}
                                className="flex flex-col items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-primary transition-all active:scale-95 text-center shadow-sm"
                            >
                                <div className="size-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                                    <span className="material-symbols-outlined">history_edu</span>
                                </div>
                                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Mock Exam</span>
                            </button>
                            <button
                                onClick={() => handleGenerate('notes')}
                                className="flex flex-col items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-primary transition-all active:scale-95 text-center shadow-sm"
                            >
                                <div className="size-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                    <span className="material-symbols-outlined">description</span>
                                </div>
                                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Study Notes</span>
                            </button>
                        </div>

                        {/* Roadmap Tool */}
                        <div className="mt-2 p-6 bg-slate-100 dark:bg-slate-800/50 rounded-[2rem] border border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="size-12 rounded-2xl bg-primary flex items-center justify-center text-background-dark shadow-lg shadow-primary/20">
                                    <span className="material-symbols-outlined">calendar_today</span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Exam Roadmap</h3>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase">Personalized Study Schedule</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block px-1">When is your exam?</label>
                                    <input
                                        type="date"
                                        value={examDate}
                                        onChange={(e) => setExamDate(e.target.value)}
                                        className="w-full h-12 bg-white dark:bg-slate-900 rounded-xl px-4 text-sm font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:border-primary outline-none transition-colors"
                                    />
                                </div>

                                <button
                                    onClick={handleGenerateRoadmap}
                                    disabled={isRoadmapLoading}
                                    className="w-full h-14 bg-primary text-background-dark rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    {isRoadmapLoading ? (
                                        <div className="size-4 rounded-full border-2 border-background-dark border-t-transparent animate-spin" />
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                                            Generate Roadmap
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                        </div>
                    </div>
                )}

                {/* MODE: Generating */}
                {mode === 'generating' && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
                        <div className="relative size-32 mb-12">
                            <div className="absolute inset-0 rounded-full border-8 border-slate-100 dark:border-white/5" />
                            <div className="absolute inset-0 rounded-full border-8 border-primary border-t-transparent animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="material-symbols-outlined text-5xl text-primary animate-bounce">bolt</span>
                            </div>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3 uppercase tracking-tighter italic">Digitizing Syllabus...</h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] max-w-xs mx-auto">
                            Gemini is synthesizing notes based on official learning objectives.
                        </p>
                    </div>
                )}

                {/* MODE: Notes Display */}
                {mode === 'notes' && (
                    <div className="p-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="prose prose-slate dark:prose-invert ai-content-prose max-w-none bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl relative">
                            {isCached && (
                                <div className="absolute top-6 right-8 flex items-center gap-1.5 bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full border border-emerald-500/20">
                                    <span className="material-symbols-outlined text-[14px]">verified</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Official Guide</span>
                                </div>
                            )}
                            <ReactMarkdown>{studyNotes}</ReactMarkdown>
                        </div>
                        <button
                            onClick={() => setMode('select')}
                            className="w-full h-16 rounded-2xl bg-[#0a120d] text-white font-black text-sm uppercase tracking-widest shadow-xl"
                        >
                            Back to Tools
                        </button>
                    </div>
                )}

                {/* MODE: Flashcards Active */}
                {mode === 'flashcards' && (
                    <FlashcardGame
                        cards={flashcards}
                        onComplete={() => setMode('results')}
                    />
                )}

                {/* MODE: Quiz Game */}
                {mode === 'quiz' && quizQuestions.length > 0 && (
                    <QuizGame 
                        questions={quizQuestions} 
                        onComplete={(score, total) => setMode('results')} 
                    />
                )}

                {/* MODE: Mock Exam */}
                {mode === 'mock-exam' && mockQuestions.length > 0 && (
                    <div className="p-4">
                        <MockExamUI 
                            questions={mockQuestions} 
                            onComplete={() => setMode('results')}
                        />
                    </div>
                )}

                {/* MODE: Study Roadmap */}
                {mode === 'roadmap' && roadmapData.length > 0 && (
                    <div className="p-4">
                        <StudyRoadmap 
                            roadmap={roadmapData} 
                            resourceId={courseCode.toUpperCase()}
                        />
                        <button
                            onClick={() => setMode('select')}
                            className="w-full mt-6 h-14 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                        >
                            Back to Study Room
                        </button>
                    </div>
                )}

                {/* MODE: Results Screen */}
                {mode === 'results' && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
                        <div className="size-24 rounded-[2rem] bg-primary flex items-center justify-center mb-4 rotate-12 shadow-2xl shadow-primary/30 relative">
                            <span className="material-symbols-outlined text-5xl text-slate-950 font-bold">celebration</span>
                            {isCached && (
                                <div className="absolute -top-2 -right-2 size-8 bg-emerald-500 rounded-full border-4 border-white dark:border-[#102217] flex items-center justify-center text-white">
                                    <span className="material-symbols-outlined text-[16px] font-bold">verified</span>
                                </div>
                            )}
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic mb-2">Brilliant Session!</h2>
                        {isCached && (
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-4">Official NUC Syllabus Mastered</p>
                        )}
                        <p className="text-sm font-medium text-slate-500 mb-12 max-w-xs">You've successfully covered the core objectives for {courseCode}.</p>
                        
                        <div className="flex gap-4 w-full max-w-sm">
                            <button
                                onClick={() => setMode('select')}
                                className="flex-1 h-14 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest shadow-lg"
                            >
                                Switch Tool
                            </button>
                            <button
                                onClick={() => router.push('/library')}
                                className="flex-1 h-14 rounded-2xl bg-primary text-slate-950 font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20"
                            >
                                End Session
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
