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
    const [resources, setResources] = useState<LibraryResource[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [userAvatar, setUserAvatar] = useState('https://lh3.googleusercontent.com/aida-public/default-avatar');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch User Avatar
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data: profile } = await supabase.from('profiles').select('avatar_url').eq('id', user.id).single();
                    if (profile?.avatar_url) setUserAvatar(profile.avatar_url);
                }

                // Fetch Resources with Course and Uploader info
                const { data, error } = await supabase
                    .from('resources')
                    .select(`
            *,
            courses (id, title, course_code),
            profiles:uploader_id (full_name)
          `)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                const formattedResources = data.map((res: any) => {
                    const courseCode = res.courses?.course_code || 'GEN 101';
                    const year = new Date(res.created_at).getFullYear().toString();

                    // Generate initials for uploader (Mocking multiple uploaders for UI consistency with design)
                    const uploaderName = res.profiles?.full_name || 'Edu Pal';
                    const initials = uploaderName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

                    return {
                        id: res.id,
                        title: res.title,
                        courseCode: courseCode,
                        year: year,
                        type: res.type || 'PDF',
                        category: res.category || 'General',
                        downloads: res.downloads_count || 0,
                        uploaderAbbr: [initials], // In a real app, maybe fetch multiple contributors
                        colorCheck: res.id // Use ID for deterministic random color
                    };
                });

                setResources(formattedResources);

            } catch (error) {
                console.error("Error fetching library data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter resources based on search
    const filteredResources = resources.filter(res =>
        res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.courseCode.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const navItems = [
        { icon: "home", label: "Home", active: false, onClick: () => router.push('/home') },
        { icon: "menu_book", label: "Library", active: true, onClick: () => router.push('/library') },
        { icon: "school", label: "Courses", active: false, onClick: () => router.push('/classes') },
        { icon: "forum", label: "Community", active: false, onClick: () => router.push('/community') },
        { icon: "person", label: "Profile", active: false, onClick: () => router.push('/profile') }
    ];

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
                            <span className="material-symbols-outlined">menu_book</span>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">EduPal Library</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/library/upload')}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all text-sm font-medium"
                        >
                            <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
                            <span className="hidden sm:inline">Upload PQ</span>
                        </button>
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border-2 border-primary/30">
                            <img
                                alt="User Profile"
                                src={userAvatar}
                                className="w-full h-full object-cover"
                            />
                        </div>
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
                            className="block w-full h-14 pl-12 pr-4 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-base text-slate-900 dark:text-white placeholder:text-slate-400"
                            placeholder="Search course code or title (e.g. MTH 101)..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {/* Horizontal Filters */}
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
                        {['Institution', 'Department', 'Level', 'Course Code'].map((filter) => (
                            <button key={filter} className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 hover:border-primary transition-colors text-slate-700 dark:text-slate-300">
                                <span className="text-sm font-medium">{filter}</span>
                                <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Fast Access / Recent Section */}
                <section className="px-4 py-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold">Recommended for You</h2>
                        <button className="text-primary text-sm font-medium hover:underline">See all</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* PQ Cards */}
                        {filteredResources.slice(0, 3).map((res, index) => (
                            <div key={res.id} className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 hover:shadow-lg hover:shadow-primary/5 transition-all">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{res.title}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{res.courseCode}</span>
                                            <span className="text-slate-400 dark:text-slate-500 text-xs">• {res.year} Session</span>
                                        </div>
                                    </div>
                                    <div className="w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-800 flex-shrink-0 overflow-hidden border border-slate-200 dark:border-slate-700">
                                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-primary/40 text-3xl">description</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex -space-x-2">
                                        {/* Mock multiple avatars or single uploader */}
                                        <div className="w-6 h-6 rounded-full border border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700 text-[10px] flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold">
                                            {res.uploaderAbbr[0]}
                                        </div>
                                    </div>
                                    <button className="flex items-center gap-1.5 px-4 h-9 rounded-lg bg-primary text-[#102217] font-bold text-sm hover:opacity-90 transition-opacity">
                                        <span className="material-symbols-outlined text-[18px]">download</span>
                                        Download
                                    </button>
                                </div>
                            </div>
                        ))}

                        {filteredResources.length === 0 && (
                            <div className="col-span-full py-8 text-center text-slate-500">
                                No resources found. Try a different search.
                            </div>
                        )}
                    </div>
                </section>

                {/* Category Grid */}
                <section className="p-4 mt-6">
                    <h2 className="text-lg font-bold mb-4">Browse by Category</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { name: 'Engineering', icon: 'engineering' },
                            { name: 'Sciences', icon: 'science' },
                            { name: 'Law', icon: 'balance' },
                            { name: 'Medicine', icon: 'stethoscope' }
                        ].map(cat => (
                            <div key={cat.name} className="flex flex-col items-center justify-center p-4 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 hover:bg-primary/10 hover:border-primary transition-all cursor-pointer group">
                                <span className="material-symbols-outlined text-3xl text-primary mb-2">{cat.icon}</span>
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{cat.name}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Latest Uploads List */}
                <section className="p-4 mt-2">
                    <h2 className="text-lg font-bold mb-4">Latest Uploads</h2>
                    <div className="space-y-3">
                        {filteredResources.slice(3, 8).map((res) => (
                            <div key={res.id} className="flex items-center gap-4 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 group hover:border-primary/50 transition-colors">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined">description</span>
                                </div>
                                <div className="flex-grow min-w-0">
                                    <h4 className="text-sm font-bold truncate text-slate-900 dark:text-white">{res.title}</h4>
                                    <p className="text-[11px] text-slate-500 uppercase font-semibold">{res.courseCode} • {res.year}</p>
                                </div>
                                <button className="w-9 h-9 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-[#102217] transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">download</span>
                                </button>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400 font-medium hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined">add_circle</span>
                        Load more questions
                    </button>
                </section>
            </main>

            <BottomNav navItems={navItems} />
        </div>
    );
};

export default LibraryPage;
