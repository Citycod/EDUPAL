"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface RoadmapDay {
    date: string;
    topic: string;
    tasks: string[];
    goal: string;
}

interface StudyRoadmapProps {
    roadmap: RoadmapDay[];
    resourceId: string;
}

export default function StudyRoadmap({ roadmap, resourceId }: StudyRoadmapProps) {
    const [expandedDay, setExpandedDay] = useState<number | null>(0);
    const [progress, setProgress] = useState<Record<string, string[]>>({});
    const [loadingProgress, setLoadingProgress] = useState(true);
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const res = await fetch(`/api/study/progress?resourceId=${resourceId}&userId=${user.id}`);
                const data = await res.json();

                if (data.progress) {
                    const progMap: Record<string, string[]> = {};
                    data.progress.forEach((p: any) => {
                        progMap[p.roadmap_date] = p.completed_tasks;
                    });
                    setProgress(progMap);
                }
            } catch (err) {
                console.error('Error fetching progress:', err);
            } finally {
                setLoadingProgress(false);
            }
        };

        fetchProgress();
    }, [resourceId]);

    const handleToggleTask = async (date: string, task: string) => {
        const currentTasks = progress[date] || [];
        const newTasks = currentTasks.includes(task)
            ? currentTasks.filter(t => t !== task)
            : [...currentTasks, task];

        const newProgress = { ...progress, [date]: newTasks };
        setProgress(newProgress);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const dayRoadmap = roadmap.find(d => d.date === date);
            const isFullyCompleted = dayRoadmap ? newTasks.length === dayRoadmap.tasks.length : false;

            await fetch('/api/study/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resourceId,
                    userId: user.id,
                    roadmapDate: date,
                    completedTasks: newTasks,
                    isFullyCompleted
                })
            });
        } catch (err) {
            console.error('Error saving progress:', err);
        }
    };

    const getDayStatus = (date: string) => {
        const dayProgress = progress[date] || [];
        const dayRoadmap = roadmap.find(d => d.date === date);
        const isComplete = dayRoadmap && dayProgress.length === dayRoadmap.tasks.length && dayRoadmap.tasks.length > 0;

        if (isComplete) return 'complete';
        if (date < today) return 'past';
        if (date === today) return 'today';
        return 'future';
    };

    if (!roadmap || roadmap.length === 0) {
        return (
            <div className="p-8 text-center text-slate-500">
                <span className="material-symbols-outlined text-4xl mb-2">calendar_month</span>
                <p className="text-sm font-medium">No roadmap generated yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined text-xl text-background-dark">route</span>
                </div>
                <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Your Study Roadmap</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{roadmap.length} days planned</p>
                </div>
            </div>

            {/* Timeline */}
            <div className="space-y-3">
                {roadmap.map((day, index) => {
                    const status = getDayStatus(day.date);
                    const isExpanded = expandedDay === index;
                    const dateObj = new Date(day.date + 'T00:00:00');
                    const dayLabel = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                    const dayProgress = progress[day.date] || [];
                    const completionRate = day.tasks.length > 0 ? Math.round((dayProgress.length / day.tasks.length) * 100) : 0;

                    return (
                        <div
                            key={index}
                            className={`relative rounded-2xl border transition-all overflow-hidden ${status === 'today'
                                ? 'bg-primary/5 dark:bg-secondary/30 border-primary/30 shadow-lg shadow-primary/10 scale-[1.02] z-10'
                                : status === 'complete'
                                    ? 'bg-slate-50 dark:bg-secondary/10 border-green-200 dark:border-green-900/30'
                                    : status === 'past'
                                        ? 'bg-slate-50 dark:bg-secondary/10 border-slate-200 dark:border-secondary/30 opacity-60'
                                        : 'bg-white dark:bg-background-dark border-slate-200 dark:border-secondary/40'
                                }`}
                        >
                            <div
                                onClick={() => setExpandedDay(isExpanded ? null : index)}
                                className="flex items-center gap-3 p-4 cursor-pointer"
                            >
                                {/* Status Indicator */}
                                <div className={`size-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${status === 'complete' ? 'bg-green-500 text-white' :
                                        status === 'today' ? 'bg-primary text-background-dark shadow-md shadow-primary/30' :
                                            status === 'past' ? 'bg-slate-200 dark:bg-secondary/50 text-slate-400' :
                                                'bg-primary/10 dark:bg-secondary/40 text-primary'
                                    }`}>
                                    {status === 'complete' || (status === 'past' && completionRate === 100) ? (
                                        <span className="material-symbols-outlined text-sm">check</span>
                                    ) : status === 'today' ? (
                                        <span className="material-symbols-outlined text-sm">play_arrow</span>
                                    ) : (
                                        <span className="text-[10px] font-black">{index + 1}</span>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${status === 'complete' ? 'text-green-500' : 'text-primary'}`}>
                                            {dayLabel}
                                        </span>
                                        {status === 'today' && (
                                            <span className="text-[8px] font-black bg-primary text-background-dark px-2 py-0.5 rounded-full uppercase tracking-wider">Today</span>
                                        )}
                                        {status === 'complete' && (
                                            <span className="text-[8px] font-black bg-green-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Done</span>
                                        )}
                                    </div>
                                    <p className={`text-sm font-bold truncate ${status === 'complete' ? 'text-slate-500 line-through' : 'text-slate-900 dark:text-white'}`}>
                                        {day.topic}
                                    </p>
                                </div>

                                <div className="flex flex-col items-end gap-1">
                                    <span className={`text-[10px] font-black ${completionRate === 100 ? 'text-green-500' : 'text-slate-400'}`}>
                                        {completionRate}%
                                    </span>
                                    <span className={`material-symbols-outlined text-sm text-slate-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                                        expand_more
                                    </span>
                                </div>
                            </div>

                            {/* Expanded Section */}
                            {isExpanded && (
                                <div className="px-4 pb-4 pt-0 border-t border-slate-100 dark:border-secondary/30 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="pt-3">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Tasks</p>
                                        <ul className="space-y-2">
                                            {day.tasks.map((task, tIdx) => {
                                                const isDone = dayProgress.includes(task);
                                                return (
                                                    <li key={tIdx} className="flex items-center gap-3 group">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleToggleTask(day.date, task); }}
                                                            className={`size-6 rounded-lg flex items-center justify-center transition-all ${isDone ? 'bg-green-500 text-white border-green-500' : 'bg-slate-100 dark:bg-secondary/40 border border-slate-200 dark:border-secondary/30 group-hover:border-primary'
                                                                }`}
                                                        >
                                                            {isDone && <span className="material-symbols-outlined text-sm font-black">check</span>}
                                                        </button>
                                                        <span className={`text-xs font-medium transition-colors ${isDone ? 'text-slate-400 line-through' : 'text-slate-600 dark:text-slate-200'}`}>
                                                            {task}
                                                        </span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                    <div className="bg-primary/5 dark:bg-secondary/20 rounded-xl p-3 border border-primary/10 dark:border-secondary/30">
                                        <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">Goal</p>
                                        <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{day.goal}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
