'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const MOODS = [
  { value: 1, emoji: '😡', label: 'Frustrated' },
  { value: 2, emoji: '😐', label: 'Meh' },
  { value: 3, emoji: '😊', label: 'Happy' },
  { value: 4, emoji: '🤩', label: 'Love it!' },
];

const CATEGORIES = [
  { value: 'bug', label: 'Bug', icon: 'bug_report' },
  { value: 'feature', label: 'Feature Idea', icon: 'lightbulb' },
  { value: 'content', label: 'Content Issue', icon: 'menu_book' },
  { value: 'general', label: 'Other', icon: 'chat' },
];

export default function FeedbackWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState<number | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setMood(null);
        setCategory(null);
        setMessage('');
        setShowSuccess(false);
      }, 300);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!mood) return;
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get institution_id from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('institution_id')
        .eq('id', user.id)
        .single();

      await supabase.from('feedback').insert({
        user_id: user.id,
        institution_id: profile?.institution_id || null,
        type: category || 'general',
        mood,
        message: message.trim() || null,
        context: { page: pathname },
      });

      setShowSuccess(true);
      setTimeout(() => setIsOpen(false), 1800);
    } catch (err) {
      console.error('Feedback submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-28 left-5 z-40 w-12 h-12 rounded-full bg-[#13ec6a] text-[#102217] shadow-lg shadow-[#13ec6a]/25 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 ${isOpen ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100'}`}
        aria-label="Give feedback"
      >
        <span className="material-symbols-outlined text-[22px]">rate_review</span>
      </button>

      {/* Backdrop + Panel */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
        >
          <div
            className="bg-white dark:bg-[#1c1f1d] w-full max-w-sm rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 border border-slate-200 dark:border-white/10 shadow-2xl animate-in slide-in-from-bottom-8 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {showSuccess ? (
              /* ---- SUCCESS STATE ---- */
              <div className="text-center py-6 animate-in zoom-in-95 duration-300">
                <div className="text-5xl mb-4">💚</div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">Thank you!</h3>
                <p className="text-sm text-slate-400 font-bold">Your feedback helps us improve EduPal.</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                      {step === 1 ? 'How do you feel?' : step === 2 ? 'What\'s it about?' : 'Tell us more'}
                    </h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                      Step {step} of 3
                    </p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-white/5"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>

                {/* Step 1: Mood */}
                {step === 1 && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="grid grid-cols-4 gap-3">
                      {MOODS.map((m) => (
                        <button
                          key={m.value}
                          onClick={() => { setMood(m.value); setStep(2); }}
                          className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 hover:scale-105 active:scale-95 ${
                            mood === m.value
                              ? 'border-[#13ec6a] bg-[#13ec6a]/10 shadow-lg shadow-[#13ec6a]/10'
                              : 'border-slate-100 dark:border-white/5 hover:border-[#13ec6a]/40 bg-slate-50 dark:bg-white/5'
                          }`}
                        >
                          <span className="text-3xl">{m.emoji}</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{m.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Category */}
                {step === 2 && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="grid grid-cols-2 gap-3">
                      {CATEGORIES.map((c) => (
                        <button
                          key={c.value}
                          onClick={() => { setCategory(c.value); setStep(3); }}
                          className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 hover:scale-[1.02] active:scale-95 text-left ${
                            category === c.value
                              ? 'border-[#13ec6a] bg-[#13ec6a]/10'
                              : 'border-slate-100 dark:border-white/5 hover:border-[#13ec6a]/40 bg-slate-50 dark:bg-white/5'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[#13ec6a] text-[20px]">{c.icon}</span>
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{c.label}</span>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setStep(1)}
                      className="w-full text-center text-[10px] font-black text-slate-400 uppercase tracking-widest py-2 hover:text-[#13ec6a] transition-colors"
                    >
                      ← Back
                    </button>
                  </div>
                )}

                {/* Step 3: Message */}
                {step === 3 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    {/* Mood + Category summary */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{MOODS.find(m => m.value === mood)?.emoji}</span>
                      <span className="px-2.5 py-1 bg-[#13ec6a]/10 text-[#13ec6a] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#13ec6a]/20">
                        {CATEGORIES.find(c => c.value === category)?.label}
                      </span>
                    </div>

                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Optional: Tell us more about your experience..."
                      className="w-full bg-slate-50 dark:bg-black/20 border-2 border-slate-100 dark:border-white/5 text-slate-900 dark:text-white rounded-2xl py-4 px-5 focus:outline-none focus:border-[#13ec6a] transition-all font-bold placeholder:font-normal placeholder:text-slate-400 resize-none min-h-[100px] text-sm"
                      rows={3}
                      autoFocus
                    />

                    <div className="flex gap-3">
                      <button
                        onClick={() => setStep(2)}
                        className="flex-1 py-4 text-slate-500 font-bold text-sm uppercase tracking-widest rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex-1 bg-[#13ec6a] text-[#102217] font-black py-4 rounded-2xl shadow-xl shadow-[#13ec6a]/20 transition-all active:scale-[0.95] disabled:opacity-50 uppercase text-xs tracking-widest flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[18px]">send</span>
                            Submit
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Progress dots */}
                <div className="flex justify-center gap-2 mt-6">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        s === step ? 'w-8 bg-[#13ec6a]' : s < step ? 'w-4 bg-[#13ec6a]/40' : 'w-4 bg-slate-200 dark:bg-white/10'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
