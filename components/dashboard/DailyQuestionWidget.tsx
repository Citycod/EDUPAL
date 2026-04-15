'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface QuestionData {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
}

export default function DailyQuestionWidget({ user, onComplete }: { user: any, onComplete?: () => void }) {
  const [loading, setLoading] = useState(true);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [questionData, setQuestionData] = useState<QuestionData | null>(null);
  const [secureHash, setSecureHash] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ isCorrect: boolean; correctAnswer: string; explanation: string; points: number } | null>(null);

  useEffect(() => {
    async function fetchDailyQuestion() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const res = await fetch('/api/study/daily-question', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (data.status === 'completed' || data.answered) {
            setHasAnswered(true);
          } else if (data.questionData) {
            setQuestionData(data.questionData);
            setSecureHash(data._secure_hash);
          }
        }
      } catch (e) {
        console.error('Failed to fetch daily question:', e);
      } finally {
        setLoading(false);
      }
    }

    if (user) fetchDailyQuestion();
  }, [user]);

  const handleAnswerSubmit = async (answer: string) => {
    if (submitting || result || hasAnswered) return;
    
    setSelectedAnswer(answer);
    setSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch('/api/study/daily-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          userAnswer: answer,
          _secure_hash: secureHash
        })
      });

      const data = await res.json();
      if (data.success) {
        setResult({
          isCorrect: data.isCorrect,
          correctAnswer: data.correctAnswer,
          explanation: data.explanation,
          points: data.pointsEarned
        });
        if (onComplete) onComplete();
      }
    } catch (e) {
      console.error('Failed to submit answer:', e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-white dark:bg-slate-800/50 rounded-[2rem] border border-slate-200 dark:border-white/5 p-6 animate-pulse">
        <div className="h-6 w-48 bg-slate-200 dark:bg-white/10 rounded-lg mb-4"></div>
        <div className="space-y-3">
          <div className="h-12 w-full bg-slate-200 dark:bg-white/10 rounded-xl"></div>
          <div className="h-12 w-full bg-slate-200 dark:bg-white/10 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (hasAnswered && !result) {
    return (
      <div className="relative overflow-hidden w-full bg-gradient-to-br from-primary/20 via-background-dark to-slate-900 rounded-[2rem] border border-primary/20 p-8 shadow-2xl shadow-primary/10">
        <div className="absolute top-0 right-0 w-[50%] h-[150%] bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center text-slate-950 text-3xl shadow-xl shadow-primary/30 rotate-[-10deg]">
              🔥
            </div>
            <div>
              <h3 className="text-2xl font-black text-white italic tracking-tighter mb-1">
                {user?.current_streak || 1}-Day Streak!
              </h3>
              <p className="text-slate-300 font-bold text-sm">
                You've completed today's challenge. Come back tomorrow!
              </p>
            </div>
          </div>
          <div className="px-6 py-3 bg-white/10 border border-white/10 rounded-2xl flex flex-col items-center">
            <span className="text-xs text-white/60 font-black uppercase tracking-widest mb-1">Earned Today</span>
            <span className="text-primary font-black text-xl">+20 Pts</span>
          </div>
        </div>
      </div>
    );
  }

  if (!questionData) return null;

  return (
    <div className="w-full bg-white dark:bg-slate-800/80 rounded-[2rem] border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-xl shadow-black/5 transition-all">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/20 rounded-xl text-primary flex items-center justify-center">
          <span className="material-symbols-outlined font-bold">bolt</span>
        </div>
        <div>
          <h2 className="text-slate-900 dark:text-white text-xl font-black tracking-tight">Question of the Day</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">+20 Points for participating</p>
        </div>
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 leading-relaxed">
        {questionData.question}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(questionData.options).map(([key, value]) => {
          const isSelected = selectedAnswer === key;
          const isCorrect = result?.correctAnswer === key;
          const isWrongSelection = result && isSelected && !isCorrect;

          return (
            <button
              key={key}
              disabled={submitting || result !== null}
              onClick={() => handleAnswerSubmit(key)}
              className={`relative flex items-center p-4 rounded-2xl border-2 transition-all text-left ${
                result
                  ? isCorrect
                    ? 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-300'
                    : isWrongSelection
                    ? 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-300'
                    : 'border-slate-200 dark:border-white/5 opacity-50 bg-transparent text-slate-600 dark:text-slate-400'
                  : isSelected
                  ? 'border-primary bg-primary/10 text-slate-900 dark:text-white'
                  : 'border-slate-200 dark:border-white/5 bg-transparent hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className={`flex items-center justify-center w-8 h-8 rounded-lg mr-4 font-black transition-colors ${
                result && isCorrect 
                  ? 'bg-green-500 text-white' 
                  : result && isWrongSelection 
                  ? 'bg-red-500 text-white' 
                  : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400'
              }`}>
                {key}
              </div>
              <span className="font-semibold">{value as string}</span>
            </button>
          );
        })}
      </div>

      {result && (
        <div className={`mt-6 p-5 rounded-2xl border ${result.isCorrect ? 'bg-green-500/10 border-green-500/30' : 'bg-primary/10 border-primary/30'} flex flex-col sm:flex-row items-center gap-4 animate-fade-in`}>
          <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center text-2xl ${result.isCorrect ? 'bg-green-500 text-white' : 'bg-primary text-slate-900'} shadow-lg`}>
            {result.isCorrect ? '🎉' : '🔥'}
          </div>
          <div>
            <h4 className={`font-black text-lg ${result.isCorrect ? 'text-green-600 dark:text-green-400' : 'text-primary'}`}>
              {result.isCorrect ? 'Correct! +20 Points' : 'Good try! +20 Points for participating!'}
            </h4>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">
              <span className="font-black">Explanation:</span> {result.explanation}
            </p>
          </div>
          {!hasAnswered && (
            <button 
              onClick={() => setHasAnswered(true)}
              className="mt-4 sm:mt-0 sm:ml-auto whitespace-nowrap px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:scale-105 active:scale-95 transition-all text-sm"
            >
              Continue
            </button>
          )}
        </div>
      )}
    </div>
  );
}
