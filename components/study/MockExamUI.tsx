"use client";

import React, { useState, useEffect, useCallback } from 'react';

interface MCQQuestion {
    type: 'mcq';
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
}

interface ShortAnswerQuestion {
    type: 'short-answer';
    question: string;
    modelAnswer: string;
    gradingCriteria: string[];
}

type ExamQuestion = MCQQuestion | ShortAnswerQuestion;

interface MockExamUIProps {
    questions: ExamQuestion[];
    onComplete: (score: number) => void;
}

export default function MockExamUI({ questions, onComplete }: MockExamUIProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, any>>({});
    const [timeLeft, setTimeLeft] = useState(questions.length * 120); // 2 min per question
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isGrading, setIsGrading] = useState(false);
    const [results, setResults] = useState<any[]>([]);

    // Timer
    useEffect(() => {
        if (isSubmitted) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isSubmitted]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const currentQuestion = questions[currentIndex];

    const handleMCQSelect = (optionIndex: number) => {
        if (isSubmitted) return;
        setAnswers(prev => ({ ...prev, [currentIndex]: optionIndex }));
    };

    const handleShortAnswerChange = (text: string) => {
        if (isSubmitted) return;
        setAnswers(prev => ({ ...prev, [currentIndex]: text }));
    };

    const handleSubmit = useCallback(async () => {
        setIsSubmitted(true);
        setIsGrading(true);

        const graded: any[] = [];
        let totalScore = 0;
        const maxScore = questions.length * 10; // Each Q out of 10

        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            const answer = answers[i];

            if (q.type === 'mcq') {
                const isCorrect = answer === q.correctAnswerIndex;
                const score = isCorrect ? 10 : 0;
                totalScore += score;
                graded.push({
                    type: 'mcq',
                    question: q.question,
                    selectedOption: answer !== undefined ? q.options[answer] : 'No answer',
                    correctOption: q.options[q.correctAnswerIndex],
                    isCorrect,
                    score,
                    explanation: q.explanation,
                });
            } else {
                // Grade short answers via AI
                try {
                    const res = await fetch('/api/study/grade', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            question: q.question,
                            modelAnswer: q.modelAnswer,
                            studentAnswer: answer || 'No answer provided',
                            gradingCriteria: q.gradingCriteria,
                        }),
                    });
                    const data = await res.json();
                    totalScore += (data.score || 0);
                    graded.push({
                        type: 'short-answer',
                        question: q.question,
                        studentAnswer: answer || 'No answer',
                        score: data.score || 0,
                        feedback: data.feedback,
                        missingPoints: data.missingPoints,
                        correctPoints: data.correctPoints,
                    });
                } catch {
                    graded.push({
                        type: 'short-answer',
                        question: q.question,
                        studentAnswer: answer || 'No answer',
                        score: 0,
                        feedback: 'Could not grade this answer.',
                    });
                }
            }
        }

        setResults(graded);
        setIsGrading(false);

        const percentage = Math.round((totalScore / maxScore) * 100);
        onComplete(percentage);
    }, [answers, questions, onComplete]);

    // --- GRADING SCREEN ---
    if (isGrading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
                <div className="relative size-20 mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-secondary" />
                    <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl text-primary animate-pulse">grading</span>
                    </div>
                </div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-2">AI is grading your exam...</h2>
                <p className="text-xs text-slate-400 font-medium">Evaluating short answers against model criteria.</p>
            </div>
        );
    }

    // --- RESULTS SCREEN ---
    if (isSubmitted && results.length > 0) {
        const totalScore = results.reduce((sum, r) => sum + r.score, 0);
        const maxScore = questions.length * 10;
        const percentage = Math.round((totalScore / maxScore) * 100);

        return (
            <div className="space-y-4 pb-8">
                {/* Readiness Score */}
                <div className="text-center p-6 bg-secondary rounded-[2rem] text-white shadow-xl shadow-secondary/20">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/70 mb-2">Exam Readiness</p>
                    <p className="text-5xl font-black text-primary mb-1">{percentage}%</p>
                    <p className="text-xs font-bold text-white/60">
                        {percentage >= 80 ? 'Excellent! You\'re exam ready.' : percentage >= 50 ? 'Good effort – keep reviewing weak areas.' : 'Needs more study. Review the feedback below.'}
                    </p>
                </div>

                {/* Per-question breakdown */}
                <div className="space-y-3">
                    {results.map((r, idx) => (
                        <div key={idx} className={`p-4 rounded-2xl border ${r.score >= 7 ? 'bg-primary/5 border-primary/20' : r.score >= 4 ? 'bg-yellow-50 dark:bg-secondary/20 border-yellow-200 dark:border-secondary/40' : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30'}`}>
                            <div className="flex items-start justify-between mb-2">
                                <p className="text-xs font-bold text-slate-900 dark:text-white flex-1 pr-2">Q{idx + 1}: {r.question}</p>
                                <span className={`text-sm font-black px-2 py-0.5 rounded-full ${r.score >= 7 ? 'bg-primary/10 text-primary' : r.score >= 4 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-600'}`}>
                                    {r.score}/10
                                </span>
                            </div>

                            {r.type === 'mcq' ? (
                                <div className="text-[11px] space-y-1">
                                    <p className="text-slate-500"><span className="font-bold">Your answer:</span> {r.selectedOption}</p>
                                    {!r.isCorrect && <p className="text-primary font-bold">Correct: {r.correctOption}</p>}
                                    <p className="text-slate-400 italic mt-1">{r.explanation}</p>
                                </div>
                            ) : (
                                <div className="text-[11px] space-y-1">
                                    <p className="text-slate-500">{r.feedback}</p>
                                    {r.correctPoints?.length > 0 && (
                                        <div className="mt-1">
                                            <span className="font-bold text-primary">✓</span>
                                            <span className="text-slate-500 ml-1">{r.correctPoints.join(', ')}</span>
                                        </div>
                                    )}
                                    {r.missingPoints?.length > 0 && (
                                        <div>
                                            <span className="font-bold text-red-400">✗ Missing:</span>
                                            <span className="text-slate-500 ml-1">{r.missingPoints.join(', ')}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // --- EXAM IN-PROGRESS ---
    return (
        <div className="space-y-4">
            {/* Timer + Progress Bar */}
            <div className="sticky top-16 z-30 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-xl py-3 px-1 -mx-4 px-4 border-b border-slate-100 dark:border-secondary/30">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Q{currentIndex + 1} of {questions.length}
                    </span>
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black ${timeLeft < 60 ? 'bg-red-100 dark:bg-red-900/20 text-red-600' : 'bg-primary/10 text-primary'}`}>
                        <span className="material-symbols-outlined text-sm">timer</span>
                        {formatTime(timeLeft)}
                    </div>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-secondary rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Question Card */}
            <div className="bg-white dark:bg-background-dark rounded-2xl border border-slate-200 dark:border-secondary/40 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${currentQuestion.type === 'mcq' ? 'bg-primary/10 text-primary' : 'bg-secondary/20 text-secondary dark:text-primary'
                        }`}>
                        {currentQuestion.type === 'mcq' ? 'Multiple Choice' : 'Short Answer'}
                    </span>
                </div>
                <p className="text-base font-bold text-slate-900 dark:text-white leading-relaxed mb-5">{currentQuestion.question}</p>

                {/* MCQ Options */}
                {currentQuestion.type === 'mcq' && (
                    <div className="space-y-2">
                        {(currentQuestion as MCQQuestion).options.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleMCQSelect(idx)}
                                className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all active:scale-[0.98] ${answers[currentIndex] === idx
                                        ? 'bg-primary/10 border-primary text-primary dark:text-primary font-bold shadow-sm'
                                        : 'bg-slate-50 dark:bg-secondary/10 border-slate-200 dark:border-secondary/30 text-slate-600 dark:text-slate-300 hover:border-primary/40'
                                    }`}
                            >
                                <span className={`inline-flex items-center justify-center size-6 rounded-full mr-3 text-xs font-black ${answers[currentIndex] === idx ? 'bg-primary text-background-dark' : 'bg-slate-200 dark:bg-secondary/40 text-slate-500'
                                    }`}>
                                    {String.fromCharCode(65 + idx)}
                                </span>
                                {opt}
                            </button>
                        ))}
                    </div>
                )}

                {/* Short Answer */}
                {currentQuestion.type === 'short-answer' && (
                    <textarea
                        value={answers[currentIndex] || ''}
                        onChange={(e) => handleShortAnswerChange(e.target.value)}
                        placeholder="Write your answer here..."
                        className="w-full h-32 p-4 rounded-xl bg-slate-50 dark:bg-secondary/10 border border-slate-200 dark:border-secondary/30 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 resize-none focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                )}
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-3 pt-2">
                {currentIndex > 0 && (
                    <button
                        onClick={() => setCurrentIndex(prev => prev - 1)}
                        className="flex-1 h-12 rounded-xl bg-slate-100 dark:bg-secondary/30 text-slate-600 dark:text-slate-300 font-black text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-secondary/50 transition-colors"
                    >
                        Previous
                    </button>
                )}
                {currentIndex < questions.length - 1 ? (
                    <button
                        onClick={() => setCurrentIndex(prev => prev + 1)}
                        className="flex-1 h-12 rounded-xl bg-primary text-background-dark font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-brand-light active:scale-95 transition-all"
                    >
                        Next
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        className="flex-1 h-12 rounded-xl bg-primary text-background-dark font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-brand-light active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">send</span>
                        Submit Exam
                    </button>
                )}
            </div>
        </div>
    );
}
