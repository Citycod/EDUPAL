'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

import { useInstitutionContext } from '@/lib/hooks/useInstitutionContext';

// Interface for Resource data
interface LibraryResource {
    id: string;
    title: string;
    course_code: string;
    course_title: string;
    session_name: string;
    type: string;
    category: string;
    upvotes_count: number;
    is_verified: boolean;
    file_url: string;
    file_size: string;
    uploader_name: string;
    uploader_avatar: string;
    institution_id: string;
    department_id: string;
    level: string;
}

const LibraryPage = () => {
    const router = useRouter();
    const [resources, setResources] = useState<LibraryResource[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [userProfile, setUserProfile] = useState<any>(null);
    const [userVotes, setUserVotes] = useState<Set<string>>(new Set());

    // Filter State
    const { institution, loading: contextLoading } = useInstitutionContext();

    const [departments, setDepartments] = useState<any[]>([]);
    const [sessions, setSessions] = useState<any[]>([]);

    const [selectedDept, setSelectedDept] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');
    const [selectedSession, setSelectedSession] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest');

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // 1. Fetch User Profile
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data: profile } = await supabase.from('hub_profiles').select('*').eq('id', user.id).single();
                    setUserProfile(profile);

                    if (institution?.id) {
                        fetchResources({ instId: institution.id, profile });
                    } if (profile?.department && !selectedDept) setSelectedDept(profile.department);
                    if (profile?.level && !selectedLevel) setSelectedLevel(profile.level);

                    // Fetch user's votes via bridge
                    const { data: votes } = await supabase.from('hub_resource_votes').select('resource_id').eq('user_id', user.id);
                    if (votes) {
                        setUserVotes(new Set(votes.map(v => v.resource_id)));
                    }

                    // Proceed with filtered fetch if context available
                    if (institution?.id) {
                        fetchResources({
                            instId: institution.id,
                            deptId: profile.department || '',
                            level: profile.level || ''
                        });
                        return;
                    }
                }

                // 2. Fetch Sessions via Bridge
                const { data: sess } = await supabase.from('hub_sessions').select('*').order('name', { ascending: false });
                if (sess) setSessions(sess);

                // 3. Handle External Search Params (e.g. from Courses page)
                const params = new URLSearchParams(window.location.search);
                const courseIdParam = params.get('course');

                if (courseIdParam && institution?.id) {
                    const { data: courseRef } = await supabase
                        .from('hub_courses')
                        .select('*, hub_departments (*)')
                        .eq('id', courseIdParam)
                        .single();

                    if (courseRef) {
                        setSelectedDept(courseRef.department_id);
                        setSelectedLevel(courseRef.level);
                        fetchResources({ instId: institution.id, deptId: courseRef.department_id, level: courseRef.level });
                        return;
                    }
                }

                if (institution?.id) {
                    fetchResources({ instId: institution.id });
                }

            } catch (error) {
                console.error("Error fetching library data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (institution?.id) {
            fetchInitialData();
        }
    }, [institution?.id]);

    const fetchResources = async (filters: { instId?: string, deptId?: string, level?: string, sessionId?: string, type?: string, sort?: 'newest' | 'popular', profile?: any }) => {
        // Enforce strict institution scoping
        const currentInstId = filters.instId || institution?.id;
        if (!currentInstId) return;

        let query = supabase
            .from('hub_resources')
            .select('*')
            .eq('institution_id', currentInstId);

        // Advanced Filtering for Departments (Include General Courses)
        if (filters.deptId && filters.deptId !== 'all') {
            // If a specific department is selected, we want that PLUS EDU, GNS, GST
            query = query.or(`department_id.eq.${filters.deptId},course_code.ilike.EDU%,course_code.ilike.GNS%,course_code.ilike.GST%`);
        }

        if (filters.level) query = query.eq('level', filters.level);
        if (filters.sessionId) query = query.eq('session_id', filters.sessionId);
        if (filters.type) query = query.eq('type', filters.type);

        if (filters.sort === 'popular') {
            query = query.order('upvotes_count', { ascending: false });
        } else {
            query = query.order('created_at', { ascending: false });
        }

        const { data, error } = await query;
        if (error) {
            console.error("Fetch resources error:", error);
            return;
        }

        const currentProfile = filters.profile || userProfile;

        const prioritizedData = (data || []).sort((a: any, b: any) => {
            const userDept = currentProfile?.department || currentProfile?.department_id;
            const aDeptMatch = a.department_id === userDept;
            const bDeptMatch = b.department_id === userDept;
            if (aDeptMatch && !bDeptMatch) return -1;
            if (!aDeptMatch && bDeptMatch) return 1;

            const aLevelMatch = String(a.level) === String(currentProfile?.level);
            const bLevelMatch = String(b.level) === String(currentProfile?.level);
            if (aLevelMatch && !bLevelMatch) return -1;
            if (!aLevelMatch && bLevelMatch) return 1;

            return 0;
        });

        setResources(prioritizedData);
    };

    const handleVote = async (resourceId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const isUpvoted = userVotes.has(resourceId);

        if (isUpvoted) {
            // Remove vote via bridge
            const { error } = await supabase.from('hub_resource_votes').delete().eq('user_id', user.id).eq('resource_id', resourceId);
            if (!error) {
                setUserVotes(prev => {
                    const next = new Set(prev);
                    next.delete(resourceId);
                    return next;
                });
                setResources(prev => prev.map(r => r.id === resourceId ? { ...r, upvotes_count: r.upvotes_count - 1 } : r));
            }
        } else {
            // Add vote via bridge
            const { error } = await supabase.from('hub_resource_votes').insert({ user_id: user.id, resource_id: resourceId });
            if (!error) {
                setUserVotes(prev => new Set([...prev, resourceId]));
                setResources(prev => prev.map(r => r.id === resourceId ? { ...r, upvotes_count: r.upvotes_count + 1 } : r));
            }
        }
    };

    const handleReport = async (resourceId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const reason = prompt("Why are you reporting this resource? (e.g. Inappropriate, Spam, Wrong Course)");
        if (!reason) return;

        const { error } = await supabase.from('hub_resource_reports').insert({
            reporter_id: user.id,
            resource_id: resourceId,
            reason: reason,
            status: 'pending'
        });

        if (error) {
            alert("Failed to submit report. Please try again.");
        } else {
            alert("Report submitted. Thank you for keeping EduPal safe!");
        }
    };

    // Update departments when institution available
    useEffect(() => {
        if (!institution?.id) return;
        const fetchDepts = async () => {
            const { data } = await supabase.from('hub_departments').select('*').eq('institution_id', institution.id).order('name');
            setDepartments(data || []);
        };
        fetchDepts();
    }, [institution?.id]);

    // Filter resources based on search
    const filteredResources = resources.filter(res => {
        const matchesSearch = !searchQuery ||
            res.course_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            res.course_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            res.title?.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSearch;
    });


    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-[#f6f8f7] dark:bg-[#102217] text-slate-500">Loading Library...</div>;
    }

    return (
        <div className="bg-[#f6f8f7] dark:bg-[#102217] font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300 min-h-screen flex flex-col">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 bg-[#f6f8f7]/80 dark:bg-[#102217]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20 text-primary">
                            <span className="material-symbols-outlined">history_edu</span>
                        </div>
                        <h1 className="text-lg sm:text-xl font-black tracking-tighter truncate">Academic Archive</h1>
                    </div>
                    {institution && (
                        <div className="hidden md:block text-sm font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                            Accessing resources for {institution.name}
                        </div>
                    )}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/library/upload')}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-background-dark hover:scale-105 active:scale-95 transition-all text-sm font-black shadow-lg shadow-primary/20"
                        >
                            <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
                            <span className="hidden sm:inline">Upload PQ</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto pb-24 flex-1 w-full">
                {/* Search and Filter Section */}
                <section className="p-4 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                        <div className="relative group flex-1">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                                <span className="material-symbols-outlined">search</span>
                            </div>
                            <input
                                className="block w-full h-16 pl-12 pr-4 bg-white dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary text-base text-slate-900 dark:text-white placeholder:text-slate-400 shadow-xl shadow-primary/5 transition-all"
                                placeholder="Search by course code or title..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Sort Toggle */}
                        <div className="flex bg-white dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 h-14 sm:h-16 shadow-lg">
                            <button
                                onClick={() => { setSortBy('newest'); fetchResources({ instId: institution?.id, deptId: selectedDept, level: selectedLevel, sessionId: selectedSession, type: selectedType, sort: 'newest' }); }}
                                className={`flex-1 sm:px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${sortBy === 'newest' ? 'bg-primary text-background-dark shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
                                Newest
                            </button>
                            <button
                                onClick={() => { setSortBy('popular'); fetchResources({ instId: institution?.id, deptId: selectedDept, level: selectedLevel, sessionId: selectedSession, type: selectedType, sort: 'popular' }); }}
                                className={`flex-1 sm:px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${sortBy === 'popular' ? 'bg-primary text-background-dark shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
                                Popular
                            </button>
                        </div>
                    </div>

                    {/* Hierarchical Filter Selects */}
                    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                        <select
                            value={selectedDept}
                            onChange={(e) => {
                                setSelectedDept(e.target.value);
                                fetchResources({ instId: institution?.id, deptId: e.target.value, level: selectedLevel, sessionId: selectedSession, type: selectedType, sort: sortBy });
                            }}
                            disabled={!institution?.id}
                            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 hover:border-primary transition-colors text-sm font-black text-slate-700 dark:text-slate-300 outline-none disabled:opacity-50"
                        >
                            <option value="">All Departments</option>
                            {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                        </select>

                        <select
                            value={selectedLevel}
                            onChange={(e) => {
                                setSelectedLevel(e.target.value);
                                fetchResources({ instId: institution?.id, deptId: selectedDept, level: e.target.value, sessionId: selectedSession, type: selectedType, sort: sortBy });
                            }}
                            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 hover:border-primary transition-colors text-sm font-black text-slate-700 dark:text-slate-300 outline-none"
                        >
                            <option value="">All Levels</option>
                            {['100', '200', '300', '400', '500'].map(lvl => <option key={lvl} value={lvl}>{lvl}L</option>)}
                        </select>

                        <select
                            value={selectedSession}
                            onChange={(e) => {
                                setSelectedSession(e.target.value);
                                fetchResources({ instId: institution?.id, deptId: selectedDept, level: selectedLevel, sessionId: e.target.value, type: selectedType, sort: sortBy });
                            }}
                            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 hover:border-primary transition-colors text-sm font-black text-slate-700 dark:text-slate-300 outline-none"
                        >
                            <option value="">All Sessions</option>
                            {sessions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>

                        <select
                            value={selectedType}
                            onChange={(e) => {
                                setSelectedType(e.target.value);
                                fetchResources({ instId: institution?.id, deptId: selectedDept, level: selectedLevel, sessionId: selectedSession, type: e.target.value, sort: sortBy });
                            }}
                            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 hover:border-primary transition-colors text-sm font-black text-slate-700 dark:text-slate-300 outline-none"
                        >
                            <option value="">All Types</option>
                            <option value="Lecture Note">Lecture Notes</option>
                            <option value="Past Question">Past Questions</option>
                        </select>
                    </div>
                </section>

                {/* Unified Archive Section */}
                <section className="px-4 py-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <span className="material-symbols-outlined text-primary">folder_open</span>
                            </div>
                            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Academic Archive</h2>
                        </div>
                        <span className="text-slate-400 text-xs font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800/50 px-3 py-1 rounded-full">{filteredResources.length} Materials Found</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredResources.map((res) => (
                            <div key={res.id} onClick={() => router.push(`/resource/${res.id}`)} className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/50 transition-all text-left cursor-pointer">
                                {/* Verified Badge Top Left */}
                                {res.is_verified && (
                                    <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-[9px] font-black uppercase tracking-tighter rounded-bl-xl flex items-center gap-1 shadow-lg z-10">
                                        <span className="material-symbols-outlined text-[12px]">verified</span>
                                        Verified
                                    </div>
                                )}

                                <div className="flex items-start justify-between mb-4">
                                    <div className="space-y-1 pr-2">
                                        <h3 className="font-extrabold text-slate-900 dark:text-white text-lg leading-tight line-clamp-2">{res.title}</h3>
                                        <div className="flex flex-wrap items-center gap-2 mt-3">
                                            <span className="bg-primary/20 text-primary text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest border border-primary/20">{res.course_code}</span>
                                            <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest">• {res.session_name}</span>
                                            <span className="bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 font-black px-2 py-0.5 rounded uppercase">{res.type}</span>
                                        </div>
                                    </div>

                                    {/* Download Icon */}
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 border border-slate-100 dark:border-slate-700">
                                        <span className="material-symbols-outlined text-primary/40 text-2xl">description</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-auto pt-5 border-t border-slate-100 dark:border-slate-800/50">
                                    {/* Uploader Bio */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[11px] font-black text-primary border border-primary/10">
                                            {res.uploader_name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2) || 'A'}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Uploader</span>
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 line-clamp-1">{res.uploader_name || 'Admin'}</span>
                                        </div>
                                    </div>

                                    {/* Interaction Buttons */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleVote(res.id); }}
                                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all font-black text-[11px] border ${userVotes.has(res.id) ? 'bg-primary text-background-dark border-primary shadow-lg shadow-primary/20' : 'bg-transparent text-slate-400 border-slate-200 dark:border-slate-700 hover:border-primary/40 hover:text-primary'}`}
                                        >
                                            <span className="material-symbols-outlined text-[18px]">thumb_up</span>
                                            {res.upvotes_count || 0}
                                        </button>

                                        <button
                                            onClick={(e) => { e.stopPropagation(); window.open(res.file_url, '_blank'); }}
                                            className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-background-dark font-black hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/10"
                                            title="Download file"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">download</span>
                                        </button>

                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleReport(res.id); }}
                                            className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all border border-transparent hover:border-red-200 dark:hover:border-red-900"
                                            title="Report content"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">flag</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredResources.length === 0 && (
                            <div className="col-span-full py-20 text-center">
                                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                    <span className="material-symbols-outlined text-4xl">search_off</span>
                                </div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">No Resources found</h3>
                                <p className="text-slate-500 max-w-xs mx-auto text-sm font-medium">Be the first to contribute or try adjusting your filters!</p>
                                <button
                                    onClick={() => router.push('/library/upload')}
                                    className="mt-8 px-8 py-3.5 bg-primary text-background-dark font-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 uppercase tracking-widest text-xs"
                                >
                                    Upload Material
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Floating Upload Button */}
            <div className="fixed bottom-20 right-5 z-40">
                <button
                    onClick={() => router.push('/library/upload')}
                    className="bg-primary text-background-dark h-14 w-14 rounded-full shadow-2xl shadow-primary/30 flex items-center justify-center transition-all active:scale-90 hover:scale-110 hover:rotate-90"
                >
                    <span className="material-symbols-outlined text-[28px] font-bold">add</span>
                </button>
            </div>


        </div>
    );
};

export default LibraryPage;
