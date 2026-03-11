'use client';

import React, { useState } from 'react';
import { Sparkles, GraduationCap, Lightbulb, Copy, Check, Loader2, Sparkle } from 'lucide-react';

interface Topic {
    title: string;
    description: string;
    methodology: string;
}

interface ProjectTopicGeneratorProps {
    user: any;
}

export default function ProjectTopicGenerator({ user }: ProjectTopicGeneratorProps) {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [interest, setInterest] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const generateTopics = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/premium/project-topics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, interest })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to generate topics');
            setTopics(data.topics);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-2xl shadow-primary/5">
            {/* Header Section */}
            <div className="bg-slate-950 p-8 sm:p-12 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] bg-primary rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[150%] bg-blue-500 rounded-full blur-[120px] animate-pulse delay-700"></div>
                </div>

                <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center text-slate-950 shadow-2xl shadow-primary/30 rotate-3">
                        <GraduationCap size={32} />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tighter">
                        Final Year <span className="text-primary italic font-serif">Research</span> Topics
                    </h2>
                    <p className="text-slate-400 font-bold max-w-lg text-sm sm:text-base leading-relaxed">
                        Exclusively for <span className="text-white italic">Level {user.level || 'Final Year'}</span>. AI-powered topic research tailored to your department and interests.
                    </p>
                </div>
            </div>

            {/* Input Section */}
            <div className="p-8 sm:p-12 space-y-8">
                <div className="max-w-xl mx-auto space-y-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Field of Interest (Optional)</label>
                        <input
                            type="text"
                            value={interest}
                            onChange={(e) => setInterest(e.target.value)}
                            placeholder="e.g. Artificial Intelligence, Marketing, Cardiology..."
                            className="w-full h-16 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-white/5 rounded-2xl px-6 text-sm font-bold focus:border-primary transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                        />
                    </div>

                    <button
                        onClick={generateTopics}
                        disabled={isLoading}
                        className="w-full h-16 bg-primary text-slate-950 font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={24} className="animate-spin" />
                                <span className="uppercase tracking-widest text-xs">Generating Research Paper...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles size={20} />
                                <span className="uppercase tracking-widest text-xs">Generate 10 Research Topics</span>
                            </>
                        )}
                    </button>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold text-center">
                            {error}
                        </div>
                    )}
                </div>

                {/* Results Grid */}
                {topics.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                        {topics.map((topic, i) => (
                            <div
                                key={i}
                                className="group bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-white/5 rounded-3xl p-8 hover:border-primary/40 transition-all flex flex-col gap-4 relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/20 group-hover:bg-primary transition-colors"></div>

                                <div className="flex items-start justify-between gap-4">
                                    <h4 className="font-black text-slate-900 dark:text-white text-lg leading-tight uppercase tracking-tight">
                                        {topic.title}
                                    </h4>
                                    <button
                                        onClick={() => copyToClipboard(`${topic.title}\n\n${topic.description}\n\nMethodology: ${topic.methodology}`, i)}
                                        className="p-2.5 rounded-xl bg-white dark:bg-slate-700 text-slate-400 hover:text-primary transition-all"
                                    >
                                        {copiedIndex === i ? <Check size={16} /> : <Copy size={16} />}
                                    </button>
                                </div>

                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                    {topic.description}
                                </p>

                                <div className="mt-auto pt-4 border-t border-slate-200 dark:border-white/5 flex items-center gap-2">
                                    <div className="p-1 px-3 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
                                        {topic.methodology}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
