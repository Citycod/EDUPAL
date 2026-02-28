'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import FlashcardGame, { Flashcard } from '@/components/study/FlashcardGame';
import QuizGame, { QuizQuestion } from '@/components/study/QuizGame';
import { useFeatureAccess } from '@/lib/hooks/useSubscription';

type StudyMode = 'select' | 'generating' | 'flashcards' | 'quiz' | 'results';

export default function StudyPage() {
    const { resourceId } = useParams<{ resourceId: string }>();
    const router = useRouter();

    const [mode, setMode] = useState<StudyMode>('select');
    const [resourceTitle, setResourceTitle] = useState('Study Material');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // AI Content State
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);

    // Subscription & Access
    const { hasAccess, loading: accessLoading } = useFeatureAccess('ai_study_tools');

    // Quiz Result State
    const [quizScore, setQuizScore] = useState(0);
    const [pointsAwarded, setPointsAwarded] = useState<number | null>(null);
    const [userRank, setUserRank] = useState<number | null>(null);
    const [totalPoints, setTotalPoints] = useState<number | null>(null);

    useEffect(() => {
        const checkResource = async () => {
            if (!resourceId) return;
            try {
                const { data, error } = await supabase
                    .from('hub_resources')
                    .select('title')
                    .eq('id', resourceId)
                    .single();

                if (error) throw error;
                if (data) setResourceTitle(data.title);
            } catch (err) {
                console.error('Error fetching resource for study mode:', err);
                setError('Could not load the material.');
            } finally {
                setLoading(false);
            }
        };

        checkResource();
    }, [resourceId]);

    const handleGenerate = async (type: 'flashcards' | 'quiz', forceRegenerate = false) => {
        setMode('generating');
        setError(null);

        try {
            const res = await fetch('/api/study/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resourceId, type, forceRegenerate })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to generate content');
            }

            if (type === 'flashcards') {
                setFlashcards(data.content as Flashcard[]);
                setMode('flashcards');
            } else {
                setQuizQuestions(data.content as QuizQuestion[]);
                setMode('quiz');
            }

        } catch (err: any) {
            console.error('Generation Error:', err);
            setError(err.message || 'An error occurred during generation.');
            setMode('select');
        }
    };

    const handleQuizComplete = (score: number, total: number) => {
        setQuizScore(score);
        setMode('results');

        // Save score to backend and award points
        const saveScore = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session?.access_token) return;

                const res = await fetch('/api/study/score', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.access_token}`,
                    },
                    body: JSON.stringify({
                        resourceId,
                        type: 'quiz',
                        score,
                        totalQuestions: total,
                    }),
                });

                const data = await res.json();
                if (res.ok && data.success) {
                    setPointsAwarded(data.pointsAwarded);
                    setUserRank(data.rank);
                    setTotalPoints(data.stats?.total_points || null);
                }
            } catch (err) {
                console.error('Failed to save score:', err);
            }
        };
        saveScore();
    };

    const handleFlashcardComplete = async () => {
        setMode('results');

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) return;

            const res = await fetch('/api/study/score', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    resourceId,
                    type: 'flashcards',
                    score: 0,
                    totalQuestions: flashcards.length,
                }),
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setPointsAwarded(data.pointsAwarded);
                setUserRank(data.rank);
                setTotalPoints(data.stats?.total_points || null);
            }
        } catch (err) {
            console.error('Failed to save flashcard result:', err);
        }
    };

    if (loading || accessLoading) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
                <div className="size-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
        );
    }

    if (!hasAccess) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-6 text-center">
                <div className="relative mb-8 group">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-colors"></div>
                    <div className="size-24 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center relative z-10 shadow-xl">
                        <span className="material-symbols-outlined text-4xl text-primary">lock</span>
                    </div>
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Premium Feature Locked</h2>
                <p className="text-sm font-medium text-slate-500 max-w-sm mb-8">
                    Generate instant AI flashcards and quizzes from your course materials. Upgrade to Premium to unlock full study tools.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                    <button
                        onClick={() => router.back()}
                        className="flex-1 h-14 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-black text-sm uppercase tracking-widest hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                    >
                        Go Back
                    </button>
                    <button
                        onClick={() => router.push('/subscription')}
                        className="flex-1 h-14 rounded-2xl bg-primary text-background-dark font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/30 hover:bg-brand-light transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined">workspace_premium</span>
                        Upgrade
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-sans selection:bg-primary/30">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/50">
                <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="size-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    <div className="flex flex-col items-center max-w-[60%]">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Studying</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white truncate w-full text-center">{resourceTitle}</span>
                    </div>
                    <div className="size-10" /> {/* Balancer */}
                </div>
            </header>

            <main className="max-w-2xl mx-auto">
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
                            <div className="inline-flex items-center justify-center p-4 bg-primary/10 dark:bg-primary/10 rounded-full mb-4">
                                <span className="material-symbols-outlined text-4xl text-primary animate-pulse">model_training</span>
                            </div>
                            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">How do you want to study?</h1>
                            <p className="text-sm text-slate-500 font-medium max-w-sm mx-auto">
                                EduPal AI will read the document and generate personalized study materials instantly.
                            </p>
                        </div>

                        <div className="grid gap-4">
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => handleGenerate('flashcards')}
                                    className="group relative flex items-center justify-between p-6 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl hover:border-primary dark:hover:border-primary transition-all active:scale-[0.98] shadow-sm hover:shadow-xl hover:shadow-primary/10 text-left overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="material-symbols-outlined text-primary text-xl">style</span>
                                            <h3 className="text-lg font-black text-slate-900 dark:text-white">Smart Flashcards</h3>
                                        </div>
                                        <p className="text-xs font-medium text-slate-500 max-w-[200px]">15 generated flip-cards to drill key definitions and concepts.</p>
                                    </div>
                                    <div className="size-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary group-hover:text-background-dark transition-colors">
                                        <span className="material-symbols-outlined">arrow_forward</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => handleGenerate('flashcards', true)}
                                    className="text-[10px] font-bold text-slate-400 hover:text-primary uppercase tracking-widest flex items-center justify-center gap-1 py-2 w-full transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[14px]">refresh</span>
                                    Regenerate fresh flashcards
                                </button>
                            </div>

                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => handleGenerate('quiz')}
                                    className="group relative flex items-center justify-between p-6 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl hover:border-primary dark:hover:border-primary transition-all active:scale-[0.98] shadow-sm hover:shadow-xl hover:shadow-primary/10 text-left overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="material-symbols-outlined text-primary text-xl">quiz</span>
                                            <h3 className="text-lg font-black text-slate-900 dark:text-white">Interactive Quiz</h3>
                                        </div>
                                        <p className="text-xs font-medium text-slate-500 max-w-[200px]">10 multiple-choice questions to test your comprehension under pressure.</p>
                                    </div>
                                    <div className="size-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary group-hover:text-background-dark transition-colors">
                                        <span className="material-symbols-outlined">arrow_forward</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => handleGenerate('quiz', true)}
                                    className="text-[10px] font-bold text-slate-400 hover:text-primary uppercase tracking-widest flex items-center justify-center gap-1 py-2 w-full transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[14px]">refresh</span>
                                    Regenerate fresh quiz
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODE: Generating State */}
                {mode === 'generating' && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center animate-in fade-in zoom-in-95 duration-500">
                        <div className="relative size-24 mb-8">
                            <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800" />
                            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent border-l-transparent animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="material-symbols-outlined text-3xl text-primary animate-pulse">auto_awesome</span>
                            </div>
                        </div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">AI is reading your document...</h2>
                        <p className="text-sm font-medium text-slate-500 max-w-xs mx-auto animate-pulse">
                            Extracting key concepts and formatting questions. This usually takes 5-10 seconds.
                        </p>
                    </div>
                )}

                {/* MODE: Flashcards Active */}
                {mode === 'flashcards' && (
                    <FlashcardGame
                        cards={flashcards}
                        onComplete={handleFlashcardComplete}
                    />
                )}

                {/* MODE: Quiz Active */}
                {mode === 'quiz' && (
                    <QuizGame
                        questions={quizQuestions}
                        onComplete={handleQuizComplete}
                    />
                )}

                {/* MODE: Results Screen */}
                {mode === 'results' && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center animate-in zoom-in-95 duration-500">
                        <div className="size-24 rounded-[2rem] bg-green-500 shadow-2xl shadow-green-500/30 flex items-center justify-center mb-6 text-white rotate-12 transition-transform hover:rotate-0">
                            <span className="material-symbols-outlined text-[48px]">emoji_events</span>
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Session Complete!</h2>

                        {/* Points Earned Badge */}
                        {pointsAwarded && (
                            <div className="flex items-center gap-2 bg-primary/10 text-primary px-5 py-2 rounded-full mb-6 border border-primary/20 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <span className="material-symbols-outlined text-[18px]">bolt</span>
                                <span className="text-sm font-black">+{pointsAwarded} pts earned!</span>
                            </div>
                        )}

                        {quizQuestions.length > 0 && (
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg mb-4 w-full max-w-xs">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Final Score</p>
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className="text-5xl font-black text-primary">{quizScore}</span>
                                    <span className="text-xl font-bold text-slate-400">/{quizQuestions.length}</span>
                                </div>
                            </div>
                        )}

                        {/* Stats Card */}
                        {(totalPoints !== null || userRank !== null) && (
                            <div className="flex gap-3 w-full max-w-xs mb-8">
                                {totalPoints !== null && (
                                    <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 text-center">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Points</p>
                                        <p className="text-2xl font-black text-amber-500">{totalPoints}</p>
                                    </div>
                                )}
                                {userRank !== null && (
                                    <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 text-center">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Your Rank</p>
                                        <p className="text-2xl font-black text-primary">#{userRank}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex gap-4 w-full max-w-xs">
                            <button
                                onClick={() => { setMode('select'); setPointsAwarded(null); }}
                                className="flex-1 h-14 rounded-2xl bg-secondary dark:bg-secondary text-white font-black text-sm uppercase tracking-widest hover:bg-secondary-light dark:hover:bg-secondary-light transition-colors"
                            >
                                Study Again
                            </button>
                            <button
                                onClick={() => router.back()}
                                className="flex-1 h-14 rounded-2xl bg-primary text-background-dark font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/30 hover:bg-brand-light transition-all active:scale-95"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
