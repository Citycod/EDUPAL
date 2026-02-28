'use client';

import React, { useState } from 'react';

export interface Flashcard {
    front: string;
    back: string;
}

interface FlashcardGameProps {
    cards: Flashcard[];
    onComplete: () => void;
}

export default function FlashcardGame({ cards, onComplete }: FlashcardGameProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const currentCard = cards[currentIndex];

    const nextCard = () => {
        setIsFlipped(false);
        setTimeout(() => {
            if (currentIndex < cards.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                onComplete();
            }
        }, 150); // slight delay to allow flip animation to reset before changing content
    };

    if (!cards || cards.length === 0) return null;

    const progress = ((currentIndex + 1) / cards.length) * 100;

    return (
        <div className="flex flex-col h-full max-w-md mx-auto w-full pt-6 pb-24 px-4">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mastery Progress</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{currentIndex + 1} / {cards.length}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-primary h-2 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            {/* Flashcard Area */}
            <div className="relative flex-1 perspective-1000 mb-8 z-10">
                <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className={`w-full h-full min-h-[400px] cursor-pointer transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                >
                    {/* Front */}
                    <div className="absolute w-full h-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-xl p-8 flex flex-col justify-center items-center text-center backface-hidden z-20">
                        <span className="material-symbols-outlined text-primary mb-6 text-4xl opacity-50">help</span>
                        <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                            {currentCard.front}
                        </h3>
                        <p className="absolute bottom-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Tap to flip</p>
                    </div>

                    {/* Back */}
                    <div className="absolute w-full h-full bg-primary/5 dark:bg-primary/10 border-2 border-primary/30 dark:border-primary/20 rounded-[2rem] shadow-xl p-8 flex flex-col justify-center items-center text-center backface-hidden rotate-y-180 z-20">
                        <span className="material-symbols-outlined text-green-500 mb-6 text-4xl opacity-50">lightbulb</span>
                        <p className="text-lg md:text-xl font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                            {currentCard.back}
                        </p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            {isFlipped && (
                <div className="flex gap-4 animate-in slide-in-from-bottom-4 fade-in duration-300">
                    <button
                        onClick={nextCard}
                        className="flex-1 bg-white dark:bg-slate-900 border-2 border-red-200 dark:border-red-900/30 text-red-500 rounded-2xl py-4 font-black uppercase tracking-wider text-xs shadow-lg hover:bg-red-50 dark:hover:bg-red-950/20 active:scale-95 transition-all"
                    >
                        Hard
                    </button>
                    <button
                        onClick={nextCard}
                        className="flex-1 bg-white dark:bg-slate-900 border-2 border-amber-200 dark:border-amber-900/30 text-amber-500 rounded-2xl py-4 font-black uppercase tracking-wider text-xs shadow-lg hover:bg-amber-50 dark:hover:bg-amber-950/20 active:scale-95 transition-all"
                    >
                        Okay
                    </button>
                    <button
                        onClick={nextCard}
                        className="flex-1 bg-primary text-background-dark rounded-2xl py-4 font-black uppercase tracking-wider text-xs shadow-lg shadow-primary/30 hover:bg-brand-light active:scale-95 transition-all"
                    >
                        Easy
                    </button>
                </div>
            )}
        </div>
    );
}
