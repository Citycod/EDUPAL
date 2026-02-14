'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import BottomNav from '@/components/BottomNav';

// Interface for Resource data
interface LibraryResource {
    id: string;
    title: string;
    courseCode: string; // From joined course
    year: string; // Derived or from course
    type: string;
    category: string;
    downloads: number;
    uploaderAbbr: string[]; // Initials for avatars
    colorCheck: string; // For random coloring
}

const LibraryPage = () => {
    const router = useRouter();
    const [resources, setResources] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [userProfile, setUserProfile] = useState<any>(null);

    // Filter State
    const [institutions, setInstitutions] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);
    const [sessions, setSessions] = useState<any[]>([]);

    const [selectedInst, setSelectedInst] = useState('');
    const [selectedDept, setSelectedDept] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // 1. Fetch User Profile
                const { data: { user } } = await supabase.auth.getUser();
                let profileData = null;
                if (user) {
                    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                    profileData = profile;
                    setUserProfile(profile);
                }

                // 2. Fetch Institutions & Sessions via Bridge
                const { data: inst } = await supabase.from('hub_institutions').select('*').order('name');
                const { data: sess } = await supabase.from('hub_sessions').select('*').order('name', { ascending: false });
                if (inst) setInstitutions(inst);
                if (sess) setSessions(sess);

                // 3. Handle External Search Params (e.g. from Courses page)
                const params = new URLSearchParams(window.location.search);
                const courseIdParam = params.get('course');

                if (courseIdParam) {
                    // Fetch course details via Bridge
                    const { data: courseRef } = await supabase
                        .from('hub_courses')
                        .select('*, hub_departments (*)')
                        .eq('id', courseIdParam)
                        .single();

                    if (courseRef) {
                        setSelectedInst(courseRef.hub_departments.institution_id);
                        setSelectedDept(courseRef.department_id);
                        setSelectedLevel(courseRef.level);
                        fetchResources(courseRef.hub_departments.institution_id, courseRef.department_id, courseRef.level);
                        return; // Initial fetch done by context setting
                    }
                }

                // Default context logic if no param
                if (profileData?.institution_id) {
                    setSelectedInst(profileData.institution_id);
                } else {
                    fetchResources();
                }

            } catch (error) {
                console.error("Error fetching library data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const fetchResources = async (instId?: string, deptId?: string, level?: string) => {
        let query = supabase
            .from('hub_resources')
            .select('*')
            .order('created_at', { ascending: false });

        // Filtering via simplified joins or flattened fields
        if (instId) query = query.eq('institution_id', instId);
        if (deptId) query = query.eq('department_id', deptId);
        if (level) query = query.eq('level', level);

        const { data, error } = await query;
        if (error) {
            console.error("Fetch resources error:", error);
            return;
        }
        setResources(data || []);
    };

    // Update departments when institution changes
    useEffect(() => {
        if (!selectedInst) return;
        const fetchDepts = async () => {
            const { data } = await supabase.from('hub_departments').select('*').eq('institution_id', selectedInst).order('name');
            setDepartments(data || []);
            fetchResources(selectedInst);
        };
        fetchDepts();
    }, [selectedInst]);

    // Filter resources based on search and filters
    const filteredResources = resources.filter(res => {
        const matchesSearch = !searchQuery ||
            res.course_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            res.course_title?.toLowerCase().includes(searchQuery.toLowerCase());

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
                        <h1 className="text-xl font-black tracking-tighter">Academic Archive</h1>
                    </div>
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
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                            <span className="material-symbols-outlined">search</span>
                        </div>
                        <input
                            className="block w-full h-16 pl-12 pr-4 bg-white dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary text-base text-slate-900 dark:text-white placeholder:text-slate-400 shadow-xl shadow-primary/5 transition-all"
                            placeholder="Direct search by course code (e.g. CSC421)..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Hierarchical Filter Selects */}
                    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                        <select
                            value={selectedInst}
                            onChange={(e) => setSelectedInst(e.target.value)}
                            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 hover:border-primary transition-colors text-sm font-bold text-slate-700 dark:text-slate-300 outline-none"
                        >
                            <option value="">All Institutions</option>
                            {institutions.map(inst => <option key={inst.id} value={inst.id}>{inst.name}</option>)}
                        </select>

                        <select
                            value={selectedDept}
                            onChange={(e) => {
                                setSelectedDept(e.target.value);
                                fetchResources(selectedInst, e.target.value, selectedLevel);
                            }}
                            disabled={!selectedInst}
                            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 hover:border-primary transition-colors text-sm font-bold text-slate-700 dark:text-slate-300 outline-none disabled:opacity-50"
                        >
                            <option value="">All Departments</option>
                            {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                        </select>

                        <select
                            value={selectedLevel}
                            onChange={(e) => {
                                setSelectedLevel(e.target.value);
                                fetchResources(selectedInst, selectedDept, e.target.value);
                            }}
                            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 hover:border-primary transition-colors text-sm font-bold text-slate-700 dark:text-slate-300 outline-none"
                        >
                            <option value="">All Levels</option>
                            {['100', '200', '300', '400', '500'].map(lvl => <option key={lvl} value={lvl}>{lvl}L</option>)}
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
                            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">All Academic Materials</h2>
                        </div>
                        <span className="text-slate-400 text-xs font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800/50 px-3 py-1 rounded-full">{filteredResources.length} Results</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredResources.map((res) => (
                            <div key={res.id} className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/50 transition-all text-left">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="space-y-1 pr-2">
                                        <h3 className="font-extrabold text-slate-900 dark:text-white text-lg leading-tight line-clamp-2">{res.course_title || res.title}</h3>
                                        <div className="flex flex-wrap items-center gap-2 mt-3">
                                            <span className="bg-primary/20 text-primary text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest border border-primary/20">{res.course_code}</span>
                                            <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest">• {res.session_name}</span>
                                        </div>
                                    </div>
                                    <div className="w-14 h-14 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center flex-shrink-0 border border-slate-100 dark:border-slate-700">
                                        <span className="material-symbols-outlined text-primary/40 text-3xl">description</span>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{res.type}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-auto pt-5 border-t border-slate-100 dark:border-slate-800/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[11px] font-black text-primary border border-primary/10">
                                            {res.uploader_name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2) || 'A'}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Uploader</span>
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 line-clamp-1">{res.uploader_name || 'Admin'}</span>
                                        </div>
                                    </div>
                                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-background-dark font-black text-[11px] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/10 uppercase tracking-wider">
                                        <span className="material-symbols-outlined text-[18px]">download</span>
                                        Get PDF
                                    </button>
                                </div>
                            </div>
                        ))}

                        {filteredResources.length === 0 && (
                            <div className="col-span-full py-20 text-center">
                                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                    <span className="material-symbols-outlined text-4xl">search_off</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No results found</h3>
                                <p className="text-slate-500 max-w-xs mx-auto text-sm">We couldn't find any resources matching your search. Be the first to contribution for these course!</p>
                                <button
                                    onClick={() => router.push('/library/upload')}
                                    className="mt-6 px-8 py-3 bg-primary text-background-dark font-black rounded-xl hover:scale-105 transition-all"
                                >
                                    Upload Now
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <BottomNav />
        </div>
    );
};

export default LibraryPage;
