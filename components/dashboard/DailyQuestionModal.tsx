'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getPushSubscriptionStatus, subscribeUserToPush } from '@/lib/push-helper';

interface QuestionData {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
}

interface DailyQuestionModalProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export default function DailyQuestionModal({ user, isOpen, onClose, onComplete }: DailyQuestionModalProps) {
  const [loading, setLoading] = useState(true);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [questionData, setQuestionData] = useState<QuestionData | null>(null);
  const [secureHash, setSecureHash] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ isCorrect: boolean; correctAnswer: string; explanation: string; points: number } | null>(null);
  const [pushStatus, setPushStatus] = useState<string>('DEFAULT');
  const [subscribingPush, setSubscribingPush] = useState(false);

  useEffect(() => {
    if (!isOpen || !user) return;

    async function fetchDailyQuestion() {
      try {
        setLoading(true);
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
            // If already answered, we just show streak or auto-close?
            // The user wants a pop-up, so if it's already answered, they shouldn't see it probably.
            // But if they clicked to open it, we show the streak.
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

    fetchDailyQuestion();

    // Check push status
    getPushSubscriptionStatus().then(setPushStatus);
  }, [isOpen, user]);

  const handlePushSubscribe = async () => {
    setSubscribingPush(true);
    const res = await subscribeUserToPush();
    if (res.success) {
      setPushStatus('GRANTED');
    }
    setSubscribingPush(false);
  };

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#1a231f] w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-white/10 animate-in zoom-in-95 duration-300">
        
        {/* Header Graphic */}
        <div className="bg-primary/10 h-32 relative flex items-center justify-center">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 size-10 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 text-slate-700 dark:text-white transition group"
          >
            <span className="material-symbols-outlined text-lg group-hover:rotate-90 transition-transform">close</span>
          </button>
          <div className="size-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg border-4 border-primary/20 rotate-[-5deg]">
            <span className="material-symbols-outlined text-primary text-4xl">bolt</span>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          {loading ? (
            <div className="py-10 flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              <p className="text-slate-500 font-bold text-sm animate-pulse uppercase tracking-[0.2em]">Summoning Challenge...</p>
            </div>
          ) : hasAnswered && !result ? (
            <div className="py-6 text-center">
              <div className="w-20 h-20 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                🔥
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2 italic">
                {user?.current_streak || 1}-Day Streak!
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-bold mb-8">
                You've already conquered today's quest. <br/>Check back tomorrow for more glorious points!
              </p>
              <button
                onClick={onClose}
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black py-4 rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest text-sm"
              >
                Onwards to Victory
              </button>
            </div>
          ) : !questionData ? (
             <div className="py-10 text-center">
                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 opacity-30">error_outline</span>
                <p className="text-slate-500 font-bold">Failed to load today's challenge.</p>
                <button onClick={onClose} className="mt-6 text-primary font-black underline uppercase text-xs tracking-widest">Close</button>
             </div>
          ) : (
            <>
              <div className="mb-8 text-center sm:text-left">
                <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-2 block">Question of the Day</span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                  {questionData.question}
                </h3>
              </div>

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
                      className={`group relative flex items-center p-5 rounded-3xl border-2 transition-all text-left ${
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
                      <div className={`flex items-center justify-center w-10 h-10 rounded-xl mr-4 font-black transition-colors ${
                        result && isCorrect 
                          ? 'bg-green-500 text-white' 
                          : result && isWrongSelection 
                          ? 'bg-red-500 text-white' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-primary/20'
                      }`}>
                        {key}
                      </div>
                      <span className="font-bold text-sm sm:text-base leading-snug">{value as string}</span>
                    </button>
                  );
                })}
              </div>

              {result ? (
                <div className={`mt-8 p-6 rounded-[2rem] border animate-in slide-in-from-bottom-4 duration-500 ${result.isCorrect ? 'bg-green-500/10 border-green-500/30' : 'bg-primary/10 border-primary/30'}`}>
                  <div className="flex items-center gap-4 mb-3">
                    <div className={`size-10 rounded-full flex items-center justify-center text-xl ${result.isCorrect ? 'bg-green-500 text-white' : 'bg-primary text-slate-900'}`}>
                      {result.isCorrect ? '🎉' : '🔔'}
                    </div>
                    <div>
                      <h4 className={`font-black text-lg ${result.isCorrect ? 'text-green-600 dark:text-green-400' : 'text-primary'}`}>
                        {result.isCorrect ? `Correct! +${result.points} Points` : 'Nice try! Knowledge is its own reward (0 Points).'}
                      </h4>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">
                        <span className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-widest">Why?</span> {result.explanation}
                      </p>
                    </div>
                  </div>
                  
                  {/* Push Reminder CTA - Only show on success if not already subscribed */}
                  {result.isCorrect && pushStatus === 'DEFAULT' && (
                    <div className="mb-4 p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between gap-4 animate-in fade-in slide-in-from-right-4 duration-700 delay-300">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">🔔</span>
                            <div className="text-left">
                                <p className="text-xs font-black text-white uppercase tracking-wider">Never miss a streak</p>
                                <p className="text-[10px] text-slate-400 font-medium">Get a daily push reminder</p>
                            </div>
                        </div>
                        <button 
                            onClick={handlePushSubscribe}
                            disabled={subscribingPush}
                            className="bg-primary text-slate-900 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                        >
                            {subscribingPush ? 'Enabling...' : 'Remind Me Daily'}
                        </button>
                    </div>
                  )}

                  <button 
                    onClick={onClose}
                    className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black py-4 rounded-2xl text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-black/10"
                  >
                    Continue to Dashboard
                  </button>
                </div>
              ) : (
                <div className="mt-10 flex justify-center">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em]">Choose Wisely • +20 Points</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
