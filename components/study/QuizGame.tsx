'use client';

import React, { useState } from 'react';

export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
}

interface QuizGameProps {
    questions: QuizQuestion[];
    onComplete: (score: number, total: number) => void;
}

export default function QuizGame({ questions, onComplete }: QuizGameProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);

    if (!questions || questions.length === 0) return null;

    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    const handleOptionSelect = (index: number) => {
        if (isAnswered) return; // Prevent changing answer after submitting
        setSelectedOption(index);
    };

    const handleCheckAnswer = () => {
        if (selectedOption === null) return;

        setIsAnswered(true);
        if (selectedOption === currentQuestion.correctAnswerIndex) {
            setScore(prev => prev + 1);
        }
    };

    const handleNextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            onComplete(score, questions.length);
        }
    };

    return (
        <div className="flex flex-col h-full max-w-lg mx-auto w-full pt-6 pb-24 px-4">
            {/* Context Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary bg-primary/10 dark:bg-primary/10 p-2 rounded-xl">quiz</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Question {currentIndex + 1} of {questions.length}</span>
                </div>
                <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-3 py-1.5 rounded-full border border-green-200 dark:border-green-800">
                    <span className="material-symbols-outlined text-[16px]">stars</span>
                    <span className="text-xs font-black">{score} pts</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden mb-8">
                <div className="bg-primary h-1.5 rounded-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
            </div>

            {/* Question Box */}
            <div className="mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
                    {currentQuestion.question}
                </h2>
            </div>

            {/* Options List */}
            <div className="flex flex-col gap-3 mb-8 flex-1">
                {currentQuestion.options.map((option, idx) => {
                    let optionClass = "bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-primary/40 dark:hover:border-primary/30 text-slate-700 dark:text-slate-300";
                    let icon = "radio_button_unchecked";
                    let iconColor = "text-slate-300 dark:text-slate-600";

                    if (!isAnswered && selectedOption === idx) {
                        optionClass = "bg-primary/5 dark:bg-primary/10 border-2 border-primary text-slate-900 dark:text-white ring-4 ring-primary/10";
                        icon = "radio_button_checked";
                        iconColor = "text-primary";
                    } else if (isAnswered) {
                        if (idx === currentQuestion.correctAnswerIndex) {
                            // The actual correct answer is always highlighted green
                            optionClass = "bg-green-50 dark:bg-green-900/20 border-2 border-green-500 text-green-900 dark:text-green-100 ring-4 ring-green-500/10";
                            icon = "check_circle";
                            iconColor = "text-green-500";
                        } else if (selectedOption === idx) {
                            // User selected this wrong answer
                            optionClass = "bg-red-50 dark:bg-red-900/20 border-2 border-red-500 text-red-900 dark:text-red-100";
                            icon = "cancel";
                            iconColor = "text-red-500";
                        } else {
                            // Other wrong answers fade out
                            optionClass = "bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800/50 text-slate-400 opacity-50";
                        }
                    }

                    return (
                        <button
                            key={idx}
                            onClick={() => handleOptionSelect(idx)}
                            disabled={isAnswered}
                            className={`flex items-start gap-4 p-4 rounded-2xl w-full text-left transition-all duration-200 outline-none ${optionClass} ${!isAnswered ? 'active:scale-[0.98]' : 'cursor-default'}`}
                        >
                            <span className={`material-symbols-outlined mt-0.5 ${iconColor}`}>{icon}</span>
                            <span className="font-medium flex-1 text-sm md:text-base leading-relaxed">{option}</span>
                        </button>
                    );
                })}
            </div>

            {/* Explanation Box (Shows after answering) */}
            {isAnswered && currentQuestion.explanation && (
                <div className="mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-[16px] text-slate-500">menu_book</span>
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500">Explanation</h4>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                        {currentQuestion.explanation}
                    </p>
                </div>
            )}

            {/* Action Button */}
            <div className="mt-auto">
                {!isAnswered ? (
                    <button
                        onClick={handleCheckAnswer}
                        disabled={selectedOption === null}
                        className={`w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${selectedOption !== null
                            ? 'bg-primary text-background-dark shadow-xl shadow-primary/30 hover:bg-brand-light active:scale-95'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        Check Answer
                    </button>
                ) : (
                    <button
                        onClick={handleNextQuestion}
                        className="w-full h-14 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-900/20 dark:shadow-white/20 hover:scale-[1.02] active:scale-95 transition-all outline-none ring-offset-2 ring-offset-background-light dark:ring-offset-background-dark focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                    >
                        {currentIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
                        <span className="material-symbols-outlined align-middle ml-2 -mt-0.5">arrow_forward</span>
                    </button>
                )}
            </div>
        </div>
    );
}
