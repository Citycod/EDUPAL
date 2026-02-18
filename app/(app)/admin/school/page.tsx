'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useInstitutionContext } from '@/lib/hooks/useInstitutionContext';


const SchoolAdminDashboard = () => {
    const router = useRouter();
    const { institution, loading: contextLoading } = useInstitutionContext();
    const [resources, setResources] = useState<any[]>([]);
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterVerify, setFilterVerify] = useState('all'); // all, verified, unverified
    const [sortBy, setSortBy] = useState('date'); // date, upvotes, title
    const [activeTab, setActiveTab] = useState('resources'); // resources, reports, activity

    // Modal States
    const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
    const [showResolveModal, setShowResolveModal] = useState<any | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState<any | null>(null);

    useEffect(() => {
        const setupAdmin = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
            if (!profile || !['admin', 'school_admin', 'super_admin'].includes(profile.role)) {
                router.push('/home');
                return;
            }

            if (institution?.id) {
                fetchInitialData(institution.id);
                setupSubscriptions(institution.id);
            }
        };

        if (!contextLoading) {
            setupAdmin();
        }

        return () => {
            supabase.removeAllChannels();
        };
    }, [institution?.id, contextLoading]);

    const fetchInitialData = async (instId: string) => {
        setLoading(true);
        try {
            // Fetch Resources
            const { data: resData } = await supabase
                .from('hub_resources')
                .select('*')
                .eq('institution_id', instId)
                .order('created_at', { ascending: false });

            setResources(resData || []);

            // Fetch Reports
            const { data: repData } = await supabase
                .from('resource_reports')
                .select('*, hub_resources(*)')
                .order('created_at', { ascending: false });

            setReports(repData || []);
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setLoading(false);
        }
    };

    const setupSubscriptions = (instId: string) => {
        // Real-time Resources
        supabase
            .channel('admin-resources')
            .on('postgres_changes', {
                event: '*',
                schema: 'academic',
                table: 'resources'
            }, () => {
                fetchInitialData(instId); // Simple refresh for now to handle joins
            })
            .subscribe();

        // Real-time Reports
        supabase
            .channel('admin-reports')
            .on('postgres_changes', {
                event: '*',
                schema: 'academic',
                table: 'resource_reports'
            }, () => {
                fetchInitialData(instId);
            })
            .subscribe();
    };

    // Stats Calculation
    const stats = useMemo(() => {
        const total = resources.length;
        const verified = resources.filter(r => r.is_verified).length;
        const pendingReports = reports.filter(r => r.status === 'pending').length;
        const trending = [...resources].sort((a, b) => (b.upvotes_count || 0) - (a.upvotes_count || 0)).slice(0, 3);

        return { total, verified, unverified: total - verified, pendingReports, trending };
    }, [resources, reports]);

    // Filtering & Sorting
    const processedResources = useMemo(() => {
        let filtered = resources.filter(res => {
            const matchesSearch = !searchQuery ||
                res.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                res.course_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                res.uploader_name?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesVerify = filterVerify === 'all' ||
                (filterVerify === 'verified' && res.is_verified) ||
                (filterVerify === 'unverified' && !res.is_verified);

            return matchesSearch && matchesVerify;
        });

        if (sortBy === 'upvotes') {
            return filtered.sort((a, b) => (b.upvotes_count || 0) - (a.upvotes_count || 0));
        } else if (sortBy === 'title') {
            return filtered.sort((a, b) => a.title.localeCompare(b.title));
        }
        return filtered; // Default to date (fetched order)
    }, [resources, searchQuery, filterVerify, sortBy]);

    // Handlers
    const toggleVerify = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from('hub_resources')
            .update({ is_verified: !currentStatus })
            .eq('id', id);

        if (error) alert("Error updating status");
    };

    const handleDelete = async () => {
        const idToDelete = showDeleteModal || (showDetailsModal?.id && "nuclear_delete");
        if (!idToDelete) return;

        const finalId = showDeleteModal || showDetailsModal.id;

        const { error } = await supabase.from('hub_resources').delete().eq('id', finalId);
        if (error) alert("Delete failed");
        setShowDeleteModal(null);
        setShowDetailsModal(null);
    };

    const resolveReport = async (status: 'resolved' | 'rejected') => {
        if (!showResolveModal) return;
        const { error } = await supabase
            .from('resource_reports')
            .update({ status })
            .eq('id', showResolveModal.id);

        if (error) alert("Failed to update report");
        setShowResolveModal(null);
    };

    if (contextLoading || loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#f6f8f7] dark:bg-[#102217] font-display">
                <div className="w-12 h-12 border-4 border-[#13ec6a] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Accessing Command Center...</p>
            </div>
        );
    }

    return (
        <div className="bg-[#f6f8f7] dark:bg-[#102217] min-h-screen font-roboto text-slate-900 dark:text-slate-100 flex flex-col pb-24">
            {/* Nav Header */}
            <header className="sticky top-0 z-40 bg-[#f6f8f7]/80 dark:bg-[#102217]/80 backdrop-blur-md border-b border-slate-200 dark:border-[#234832]/30 p-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#13ec6a]/20 flex items-center justify-center text-[#13ec6a] shadow-lg shadow-[#13ec6a]/10">
                            <span className="material-symbols-outlined font-black">shield_person</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tighter leading-none">Admin Panel</h1>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{institution?.name || 'Academic Command'}</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto w-full p-4 space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-[#1c2720]/40 p-5 rounded-3xl border border-slate-200 dark:border-[#234832]/20 shadow-xl shadow-slate-200/50 dark:shadow-none">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Materials</p>
                        <p className="text-3xl font-black">{stats.total}</p>
                    </div>
                    <div className="bg-white dark:bg-[#1c2720]/40 p-5 rounded-3xl border border-slate-200 dark:border-[#234832]/20">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Unverified</p>
                        <p className="text-3xl font-black text-amber-500">{stats.unverified}</p>
                    </div>
                    <div className="bg-white dark:bg-[#1c2720]/40 p-5 rounded-3xl border border-slate-200 dark:border-[#234832]/20">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Verified</p>
                        <p className="text-3xl font-black text-[#13ec6a]">{stats.verified}</p>
                    </div>
                    <div className="bg-white dark:bg-[#1c2720]/40 p-5 rounded-3xl border border-slate-200 dark:border-[#234832]/20">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Alerts</p>
                        <p className="text-3xl font-black text-red-500">{stats.pendingReports}</p>
                    </div>
                </div>

                {/* Tabs Toggle */}
                <div className="flex bg-slate-200/50 dark:bg-[#1c2720] p-1.5 rounded-2xl w-fit">
                    {['resources', 'reports'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-[#13ec6a] text-[#102217] shadow-lg shadow-[#13ec6a]/20' : 'text-slate-400'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {activeTab === 'resources' ? (
                    <div className="space-y-4">
                        {/* Filters & Search */}
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <div className="relative flex-1 w-full">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                                <input
                                    className="w-full h-14 pl-12 pr-4 bg-white dark:bg-[#1c2720] border border-slate-200 dark:border-[#234832]/30 rounded-2xl outline-none focus:ring-2 focus:ring-[#13ec6a]/20 transition-all font-bold placeholder:text-slate-400"
                                    placeholder="Search by code, title or user..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                <select
                                    className="h-14 px-4 bg-white dark:bg-[#1c2720] border border-slate-200 dark:border-[#234832]/30 rounded-2xl font-bold text-sm outline-none"
                                    value={filterVerify}
                                    onChange={e => setFilterVerify(e.target.value)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="verified">Verified Only</option>
                                    <option value="unverified">Needs Review</option>
                                </select>
                                <select
                                    className="h-14 px-4 bg-white dark:bg-[#1c2720] border border-slate-200 dark:border-[#234832]/30 rounded-2xl font-bold text-sm outline-none"
                                    value={sortBy}
                                    onChange={e => setSortBy(e.target.value)}
                                >
                                    <option value="date">Sort: Recent</option>
                                    <option value="upvotes">Sort: Top Rated</option>
                                    <option value="title">Sort: Name</option>
                                </select>
                            </div>
                        </div>

                        {/* List */}
                        <div className="grid grid-cols-1 gap-3">
                            {processedResources.map(res => (
                                <div key={res.id} className="bg-white dark:bg-[#1c2720]/40 p-5 rounded-3xl border border-slate-200 dark:border-[#234832]/10 flex items-center justify-between group hover:shadow-xl transition-all shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-[#102217] flex items-center justify-center border border-slate-100 dark:border-[#234832]/20">
                                            <span className="material-symbols-outlined text-[#13ec6a]/60">
                                                {res.type === 'Lecture Note' ? 'book' : 'history_edu'}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-black text-slate-900 dark:text-white leading-none">{res.title}</h3>
                                                {res.is_verified && (
                                                    <span className="material-symbols-outlined text-[#13ec6a] text-sm font-black">verified</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1.5 overflow-x-auto no-scrollbar pb-1">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{res.course_code}</span>
                                                <span className="text-slate-300">•</span>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{res.type}</span>
                                                <span className="text-slate-300">•</span>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{new Date(res.created_at).toLocaleDateString()}</span>
                                                <span className="text-slate-300">•</span>
                                                <span className="text-[10px] font-black text-[#13ec6a] uppercase tracking-widest flex items-center gap-0.5 whitespace-nowrap">
                                                    <span className="material-symbols-outlined text-[12px]">recommend</span>
                                                    {res.upvotes_count || 0}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => toggleVerify(res.id, res.is_verified)}
                                            className={`p-2.5 rounded-xl border transition-all ${res.is_verified ? 'bg-[#13ec6a]/10 border-[#13ec6a] text-[#13ec6a]' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-[#13ec6a] hover:border-[#13ec6a]/50'}`}
                                            title="Toggle verification"
                                        >
                                            <span className="material-symbols-outlined">{res.is_verified ? 'verified_user' : 'new_releases'}</span>
                                        </button>
                                        <button
                                            onClick={() => setShowDetailsModal(res)}
                                            className="p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 rounded-xl hover:bg-[#13ec6a] hover:text-[#102217] transition-all"
                                            title="View Details"
                                        >
                                            <span className="material-symbols-outlined">info</span>
                                        </button>
                                        <button
                                            onClick={() => setShowDeleteModal(res.id)}
                                            className="p-2.5 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-md shadow-red-500/5 group-hover:scale-105"
                                            title="Delete Permanently"
                                        >
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {processedResources.length === 0 && (
                                <div className="py-20 text-center bg-slate-50 dark:bg-[#1c2720] border-2 border-dashed border-slate-200 dark:border-[#234832]/20 rounded-3xl">
                                    <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">search_off</span>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Nothing matched your command</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2 p-1">
                            <span className="material-symbols-outlined text-red-500">warning</span>
                            <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Pending Moderation Alerts</h2>
                        </div>
                        {reports.map(rep => (
                            <div key={rep.id} className="bg-white dark:bg-[#1c2720]/40 p-6 rounded-3xl border-l-4 border-l-red-500 border border-slate-200 dark:border-[#234832]/10 shadow-sm transition-all hover:shadow-xl">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                                            <span className="material-symbols-outlined font-black">flag</span>
                                        </div>
                                        <div>
                                            <h3 className="font-extrabold text-slate-900 dark:text-white leading-none mb-1">Reported: {rep.hub_resources?.title}</h3>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Submitter: {rep.reporter_id?.substring(0, 8)} • {new Date(rep.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${rep.status === 'pending' ? 'bg-amber-100 text-amber-600 border border-amber-200' : 'bg-green-100 text-green-600 border border-green-200'}`}>
                                        {rep.status}
                                    </span>
                                </div>

                                <div className="bg-slate-50 dark:bg-[#102217] p-4 rounded-2xl border border-slate-100 dark:border-[#234832]/20 mb-5">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Reason Given</p>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{rep.reason}</p>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowResolveModal(rep)}
                                        className="h-12 flex-1 bg-[#13ec6a] text-[#102217] font-black uppercase tracking-widest text-[10px] rounded-xl shadow-lg shadow-[#13ec6a]/20 hover:scale-[1.02] active:scale-95 transition-all"
                                    >
                                        Resolve Action
                                    </button>
                                    <button
                                        onClick={() => setShowDetailsModal(rep.hub_resources)}
                                        className="h-12 px-6 border border-slate-200 dark:border-[#234832]/30 rounded-xl hover:bg-slate-50 transition-all font-black text-[10px] uppercase tracking-widest"
                                    >
                                        Inspect
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Modals */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#102217]/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-[#1c1f1d] border border-slate-200 dark:border-white/10 w-full max-w-sm rounded-[32px] p-8 shadow-2xl scale-in-95 animate-in slide-in-from-bottom-4">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6 mx-auto text-red-500">
                            <span className="material-symbols-outlined text-4xl">delete_forever</span>
                        </div>
                        <h4 className="text-xl font-black mb-2 text-center">Terminate Material?</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-sm text-center mb-8 font-medium italic">
                            This will permanetly erase this file from the database. This action cannot be revoked.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(null)}
                                className="flex-1 h-12 rounded-xl border border-slate-200 dark:border-white/10 font-black uppercase tracking-widest text-[10px] text-slate-500"
                            >
                                Abort
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 h-12 rounded-xl bg-red-500 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-red-500/20"
                            >
                                Delete Now
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showResolveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#102217]/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-[#1c1f1d] border border-slate-200 dark:border-white/10 w-full max-w-sm rounded-[32px] p-8 shadow-2xl scale-in-95 animate-in slide-in-from-bottom-4">
                        <div className="w-16 h-16 rounded-full bg-[#13ec6a]/10 flex items-center justify-center mb-6 mx-auto text-[#13ec6a]">
                            <span className="material-symbols-outlined text-4xl">gavel</span>
                        </div>
                        <h4 className="text-xl font-black mb-2 text-center">Resolution Action</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-sm text-center mb-8 font-medium px-4">
                            Choose how to handle this student report for {showResolveModal.hub_resources?.title}.
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => resolveReport('rejected')}
                                className="w-full h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl font-black uppercase tracking-widest text-[10px] text-slate-500 border border-slate-200 dark:border-white/10"
                            >
                                Dismiss Report (False Alert)
                            </button>
                            <button
                                onClick={() => resolveReport('resolved')}
                                className="w-full h-14 bg-[#13ec6a] text-[#102217] font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg shadow-[#13ec6a]/20"
                            >
                                Resolve & Keep Content
                            </button>
                            <button
                                onClick={() => {
                                    const id = showResolveModal.resource_id;
                                    resolveReport('resolved');
                                    setShowDeleteModal(id);
                                }}
                                className="w-full h-14 border-2 border-red-500/20 text-red-500 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-500 hover:text-white transition-all underline decoration-red-500/30 underline-offset-4"
                            >
                                Strike & Nuclear Delete
                            </button>
                            <button
                                onClick={() => setShowResolveModal(null)}
                                className="w-full p-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2"
                            >
                                Cancel Decision
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showDetailsModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#102217]/90 backdrop-blur-md animate-in fade-in duration-300 no-scrollbar overflow-y-auto">
                    <div className="bg-white dark:bg-[#1c1f1d] border border-slate-200 dark:border-white/10 w-full max-w-lg rounded-[40px] p-8 shadow-2xl scale-in-95 animate-in slide-in-from-bottom-8 my-auto">
                        <div className="flex justify-between items-start mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-[#13ec6a]/10 flex items-center justify-center text-[#13ec6a] border border-[#13ec6a]/20">
                                <span className="material-symbols-outlined text-3xl">analytics</span>
                            </div>
                            <button onClick={() => setShowDetailsModal(null)} className="p-2 text-slate-400 hover:text-slate-600 transition-all">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h1 className="text-2xl font-black tracking-tight leading-none mb-2">{showDetailsModal.title}</h1>
                                <div className="flex items-center gap-2">
                                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${showDetailsModal.is_verified ? 'bg-[#13ec6a] text-[#102217]' : 'bg-slate-100 text-slate-400'}`}>
                                        {showDetailsModal.is_verified ? 'Official' : 'Unverified'}
                                    </span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">UID: {showDetailsModal.id.substring(0, 8)}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-3xl border border-slate-100 dark:border-white/5">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Course</p>
                                    <p className="text-sm font-bold">{showDetailsModal.course_code}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-3xl border border-slate-100 dark:border-white/5">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Session</p>
                                    <p className="text-sm font-bold">{showDetailsModal.session_name}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-3xl border border-slate-100 dark:border-white/5">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Type</p>
                                    <p className="text-sm font-bold">{showDetailsModal.type}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-3xl border border-slate-100 dark:border-white/5">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Upvotes</p>
                                    <p className="text-sm font-bold flex items-center gap-1 text-[#13ec6a]">
                                        <span className="material-symbols-outlined text-sm">recommend</span>
                                        {showDetailsModal.upvotes_count || 0}
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 bg-[#13ec6a]/5 rounded-3xl border border-[#13ec6a]/20">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center font-black text-xs">
                                        {showDetailsModal.uploader_name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Uploader</p>
                                        <p className="text-sm font-black">{showDetailsModal.uploader_name || 'Anonymous User'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => window.open(showDetailsModal.file_url, '_blank')}
                                    className="w-full h-14 bg-[#13ec6a] text-[#102217] font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl shadow-[#13ec6a]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined">download</span>
                                    Download Material
                                </button>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            toggleVerify(showDetailsModal.id, showDetailsModal.is_verified);
                                            setShowDetailsModal((prev: any) => ({ ...prev, is_verified: !prev.is_verified }));
                                        }}
                                        className="flex-1 h-12 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest"
                                    >
                                        {showDetailsModal.is_verified ? 'Revoke Verify' : 'Mark Verified'}
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteModal(showDetailsModal.id)}
                                        className="flex-1 h-12 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-black text-[10px] uppercase tracking-widest"
                                    >
                                        Nuclear Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default SchoolAdminDashboard;
