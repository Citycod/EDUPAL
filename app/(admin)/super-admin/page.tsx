'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
    Users,
    School,
    BarChart3,
    ShieldAlert,
    Settings,
    Menu,
    X,
    LogOut,
    Bell,
    Search,
    MoreVertical,
    CheckCircle2,
    AlertCircle,
    BookOpen,
    Link2,
    Trash2,
    Plus,
    Loader2,
    type LucideIcon
} from 'lucide-react';

interface SidebarItemProps {
    icon: LucideIcon;
    label: string;
    active: boolean;
    onClick: () => void;
    collapsed: boolean;
}

interface StatCardProps {
    label: string;
    value: number | string;
    icon: LucideIcon;
    color: string;
}

interface User {
    id: string;
    email: string;
    full_name: string | null;
    role: string;
    institution_name?: string;
    created_at: string;
}

interface Institution {
    id: string;
    name: string;
    location: string | null;
    student_count: number;
    resource_count: number;
}

interface Stats {
    stats: {
        totalUsers: number;
        totalInstitutions: number;
        totalResources: number;
    };
    recentReports: any[];
}

interface NucProgram {
    id: string;
    name: string;
    nuc_code: string;
}

interface ProgramMapping {
    id: string;
    effective_from: string;
    institution_id: string;
    institution_name: string;
    department_id: string;
    department_name: string;
    program_id: string;
    program_name: string;
    program_nuc_code: string;
}

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed }: SidebarItemProps) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active
            ? 'bg-[#13ec6a] text-[#102217] shadow-lg shadow-[#13ec6a]/20'
            : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
    >
        <Icon size={20} />
        {!collapsed && <span className="text-sm font-bold uppercase tracking-wider">{label}</span>}
    </button>
);

const StatCard = ({ label, value, icon: Icon, color }: StatCardProps) => (
    <div className="bg-white dark:bg-[#1c2720]/40 p-6 rounded-[2rem] border border-slate-200 dark:border-[#234832]/20 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${color} bg-opacity-10`}>
                <Icon size={24} className={color.replace('bg-', 'text-')} />
            </div>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-3xl font-black">{value}</p>
    </div>
);

// --- Main Page ---

export default function SuperAdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<Stats | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    // Catalog state
    const [nucPrograms, setNucPrograms] = useState<NucProgram[]>([]);
    const [mappings, setMappings] = useState<ProgramMapping[]>([]);
    const [catalogLoading, setCatalogLoading] = useState(false);
    const [onboardSubmitting, setOnboardSubmitting] = useState(false);
    const [onboardSuccess, setOnboardSuccess] = useState('');
    const [onboardError, setOnboardError] = useState('');
    const [useNewInstitution, setUseNewInstitution] = useState(false);
    const [onboardForm, setOnboardForm] = useState({
        institution_id: '',
        institution_name: '',
        institution_location: '',
        department_name: '',
        program_id: '',
    });

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (profile?.role !== 'super_admin') {
                router.push('/home');
                return;
            }

            setIsSuperAdmin(true);
            fetchData();
        };

        checkAuth();
    }, [router]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, usersRes, instRes] = await Promise.all([
                fetch('/api/admin/stats'),
                fetch('/api/admin/users'),
                fetch('/api/admin/institutions')
            ]);

            const [statsData, usersData, instData] = await Promise.all([
                statsRes.json(),
                usersRes.json(),
                instRes.json()
            ]);

            setStats(statsData ?? null);
            setUsers(Array.isArray(usersData) ? usersData : []);
            setInstitutions(Array.isArray(instData) ? instData : []);
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCatalogData = async () => {
        setCatalogLoading(true);
        try {
            const [programsRes, mappingsRes] = await Promise.all([
                fetch('/api/admin/catalog/programs'),
                fetch('/api/admin/catalog/onboard'),
            ]);
            const [programsData, mappingsData] = await Promise.all([
                programsRes.json(),
                mappingsRes.json(),
            ]);
            setNucPrograms(Array.isArray(programsData) ? programsData : []);
            setMappings(Array.isArray(mappingsData) ? mappingsData : []);
        } catch (error) {
            console.error('Error fetching catalog data:', error);
        } finally {
            setCatalogLoading(false);
        }
    };

    // Fetch catalog data when catalog tab is selected
    useEffect(() => {
        if (activeTab === 'catalog' && nucPrograms.length === 0) {
            fetchCatalogData();
        }
    }, [activeTab]);

    const handleOnboard = async (e: React.FormEvent) => {
        e.preventDefault();
        setOnboardSubmitting(true);
        setOnboardError('');
        setOnboardSuccess('');

        try {
            const res = await fetch('/api/admin/catalog/onboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(onboardForm),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Onboarding failed');

            setOnboardSuccess('University onboarded successfully! Students in this department will now see the mapped program\'s courses.');
            setOnboardForm({ institution_id: '', institution_name: '', institution_location: '', department_name: '', program_id: '' });
            setUseNewInstitution(false);
            // Refresh data
            await Promise.all([fetchCatalogData(), fetchData()]);
        } catch (error: any) {
            setOnboardError(error.message);
        } finally {
            setOnboardSubmitting(false);
        }
    };

    const handleDeleteMapping = async (id: string) => {
        if (!confirm('Remove this program mapping? Students in this department will no longer see catalog courses.')) return;
        try {
            const res = await fetch(`/api/admin/catalog/onboard?id=${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Delete failed');
            setMappings(prev => prev.filter(m => m.id !== id));
        } catch (error: any) {
            alert(error.message);
        }
    };

    const handleUpdateRole = async (userId: string, newRole: string) => {
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, role: newRole })
            });
            if (res.ok) {
                setUsers((prev: User[]) => prev.map((u: User) => u.id === userId ? { ...u, role: newRole } : u));
            }
        } catch (error) {
            console.error('Error updating role:', error);
        }
    };

    if (!isSuperAdmin) return null;

    return (
        <div className="bg-[#f6f8f7] dark:bg-[#102217] h-screen w-screen font-roboto text-slate-900 dark:text-slate-100 flex overflow-hidden">

            {/* Sidebar - Desktop */}
            <aside className={`hidden lg:flex flex-col bg-white dark:bg-[#1c2720] border-r border-slate-200 dark:border-[#234832]/20 transition-all duration-500 ease-in-out flex-shrink-0 ${isSidebarCollapsed ? 'w-20' : 'w-72'}`}>
                <div className="p-6 flex items-center justify-between">
                    {!isSidebarCollapsed && (
                        <div className="flex items-center gap-2 animate-in fade-in duration-500">
                            <div className="w-8 h-8 bg-[#13ec6a] rounded-lg flex items-center justify-center">
                                <ShieldAlert size={18} className="text-[#102217]" />
                            </div>
                            <h2 className="text-xl font-black tracking-tighter uppercase italic">
                                Edu<span className="text-[#13ec6a]">Admin</span>
                            </h2>
                        </div>
                    )}
                    <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                        {isSidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4 text-nowrap overflow-hidden">
                    <SidebarItem icon={BarChart3} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} collapsed={isSidebarCollapsed} />
                    <SidebarItem icon={Users} label="Users" active={activeTab === 'users'} onClick={() => setActiveTab('users')} collapsed={isSidebarCollapsed} />
                    <SidebarItem icon={School} label="Institutions" active={activeTab === 'institutions'} onClick={() => setActiveTab('institutions')} collapsed={isSidebarCollapsed} />
                    <SidebarItem icon={BookOpen} label="Catalog" active={activeTab === 'catalog'} onClick={() => setActiveTab('catalog')} collapsed={isSidebarCollapsed} />
                    <SidebarItem icon={ShieldAlert} label="Moderation" active={activeTab === 'moderation'} onClick={() => setActiveTab('moderation')} collapsed={isSidebarCollapsed} />
                </nav>

                <div className="p-4 mt-auto">
                    <button onClick={() => supabase.auth.signOut().then(() => router.push('/login'))} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                        <LogOut size={20} />
                        {!isSidebarCollapsed && <span className="text-sm font-bold uppercase tracking-wider">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-0 overflow-hidden">

                {/* Header */}
                <header className="h-20 bg-white/80 dark:bg-[#102217]/80 backdrop-blur-xl border-b border-slate-200 dark:border-[#234832]/20 px-4 sm:px-8 flex items-center justify-between flex-shrink-0">
                    <div className="flex lg:hidden items-center gap-3 sm:gap-4">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors">
                            <Menu size={24} />
                        </button>
                        <h2 className="text-base sm:text-lg font-black uppercase italic tracking-tighter">Edu<span className="text-[#13ec6a]">Admin</span></h2>
                    </div>

                    <div className="hidden md:flex items-center gap-4 bg-slate-100 dark:bg-[#1c2720] px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-[#234832]/20 w-80 lg:w-96 transition-all focus-within:ring-2 focus-within:ring-[#13ec6a]/20">
                        <Search size={18} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search platform..."
                            className="bg-transparent border-none outline-none text-sm font-medium w-full placeholder:text-slate-400"
                            value={searchQuery}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2 sm:gap-6">
                        <button className="relative p-2 text-slate-400 hover:text-[#13ec6a] transition-all">
                            <Bell size={22} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#102217]"></span>
                        </button>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#13ec6a]">Root Access</p>
                                <p className="text-sm font-bold truncate max-w-[120px]">Super Admin</p>
                            </div>
                            <div className="w-10 h-10 rounded-2xl bg-[#13ec6a] flex items-center justify-center font-black text-[#102217] shadow-lg shadow-[#13ec6a]/20 transition-transform hover:scale-105 active:scale-95">
                                A
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 no-scrollbar scroll-smooth">

                    {activeTab === 'overview' && (
                        <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl sm:text-4xl font-black tracking-tighter mb-1">Overview Dashboard</h1>
                                    <p className="text-slate-400 text-sm sm:text-base font-medium italic">Global insights and system metrics</p>
                                </div>
                                <div className="flex gap-1.5 bg-white dark:bg-[#1c2720] p-1.5 rounded-2xl border border-slate-200 dark:border-[#234832]/20 shadow-sm w-fit">
                                    <button className="px-4 py-2 bg-[#13ec6a] text-[#102217] rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#13ec6a]/20 transition-all">Live</button>
                                    <button className="px-4 py-2 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">History</button>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                <StatCard label="Total Students" value={stats?.stats.totalUsers || 0} icon={Users} color="bg-blue-500" />
                                <StatCard label="Universities" value={stats?.stats.totalInstitutions || 0} icon={School} color="bg-[#13ec6a]" />
                                <StatCard label="Resources" value={stats?.stats.totalResources || 0} icon={BarChart3} color="bg-purple-500" />
                            </div>

                            {/* Bottom Row */}
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
                                {/* Recent Reports */}
                                <div className="bg-white dark:bg-[#1c2720]/40 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 dark:border-[#234832]/20 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all">
                                    <div className="flex items-center justify-between mb-6 sm:mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 bg-red-500/10 text-red-500 rounded-xl">
                                                <AlertCircle size={20} />
                                            </div>
                                            <h3 className="text-base sm:text-lg font-black uppercase tracking-tight">Security Alerts</h3>
                                        </div>
                                        <button className="text-[10px] font-black text-[#13ec6a] uppercase tracking-widest hover:underline transition-all">View All</button>
                                    </div>
                                    <div className="space-y-4">
                                        {stats?.recentReports.map((report: any) => (
                                            <div key={report.report_id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#102217] rounded-2xl border border-slate-100 dark:border-[#234832]/20 hover:border-[#13ec6a]/30 transition-all group">
                                                <div className="flex items-center gap-4 min-w-0">
                                                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 flex-shrink-0 group-hover:scale-110 transition-transform">
                                                        <span className="material-symbols-outlined text-[20px]">flag</span>
                                                    </div>
                                                    <div className="truncate">
                                                        <p className="text-sm font-bold truncate">{report.resource_title}</p>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{report.reason}</p>
                                                    </div>
                                                </div>
                                                <span className="px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-[9px] font-black uppercase tracking-tighter flex-shrink-0">Pending</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* System Health */}
                                <div className="bg-white dark:bg-[#1c2720]/40 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 dark:border-[#234832]/20 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all">
                                    <div className="flex items-center gap-3 mb-6 sm:mb-8">
                                        <div className="p-2.5 bg-[#13ec6a]/10 text-[#13ec6a] rounded-xl">
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <h3 className="text-base sm:text-lg font-black uppercase tracking-tight">System Health</h3>
                                    </div>
                                    <div className="space-y-6 sm:space-y-8">
                                        {[
                                            { name: 'API Services', status: 'Operational', color: 'text-[#13ec6a]', dot: 'bg-[#13ec6a]' },
                                            { name: 'Data Pipeline', status: 'Synced', color: 'text-[#13ec6a]', dot: 'bg-[#13ec6a]' },
                                            { name: 'AI Models', status: 'High Traffic', color: 'text-amber-500', dot: 'bg-amber-500' },
                                            { name: 'Storage Nodes', status: 'Healthy', color: 'text-[#13ec6a]', dot: 'bg-[#13ec6a]' },
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between group">
                                                <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-600 dark:group-hover:text-white transition-colors">{item.name}</span>
                                                <span className={`text-[10px] font-black ${item.color} uppercase tracking-widest flex items-center gap-2 bg-slate-100/50 dark:bg-white/5 px-4 py-1.5 rounded-full`}>
                                                    <span className={`w-2 h-2 ${item.dot} rounded-full animate-pulse`}></span>
                                                    {item.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                <div>
                                    <h1 className="text-3xl sm:text-4xl font-black tracking-tighter mb-1">User Registry</h1>
                                    <p className="text-slate-400 text-sm font-medium italic">Monitor membership and access rights</p>
                                </div>
                                <button
                                    onClick={fetchData}
                                    className="p-3 bg-white dark:bg-[#1c2720] border border-slate-200 dark:border-[#234832]/20 rounded-2xl hover:text-[#13ec6a] hover:border-[#13ec6a]/30 transition-all shadow-sm active:scale-95 w-fit"
                                >
                                    <span className="material-symbols-outlined block">refresh</span>
                                </button>
                            </div>

                            <div className="bg-white dark:bg-[#1c2720]/40 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 dark:border-[#234832]/20 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                                <div className="overflow-x-auto no-scrollbar">
                                    <table className="w-full text-left border-collapse min-w-[700px]">
                                        <thead>
                                            <tr className="border-b border-slate-100 dark:border-[#234832]/20">
                                                <th className="px-6 sm:px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">User Profile</th>
                                                <th className="px-6 sm:px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Institution</th>
                                                <th className="px-6 sm:px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Role</th>
                                                <th className="px-6 sm:px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Joined</th>
                                                <th className="px-6 sm:px-8 py-6"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-[#234832]/10">
                                            {users.filter(u => !searchQuery || u.email.includes(searchQuery) || u.full_name?.toLowerCase().includes(searchQuery.toLowerCase())).map(user => (
                                                <tr key={user.id} className="hover:bg-slate-50/80 dark:hover:bg-[#112419] transition-all group">
                                                    <td className="px-6 sm:px-8 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-2xl bg-[#13ec6a]/10 dark:bg-white/5 flex items-center justify-center font-black text-[#13ec6a] flex-shrink-0">
                                                                {user.full_name?.charAt(0) || user.email.charAt(0)}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-black truncate max-w-[160px]">{user.full_name || 'Anonymous'}</p>
                                                                <p className="text-[10px] font-medium text-slate-400 tracking-tight truncate max-w-[160px]">{user.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 sm:px-8 py-5">
                                                        <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-lg truncate max-w-[160px] inline-block">
                                                            {user.institution_name || 'Global'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 sm:px-8 py-5">
                                                        <select
                                                            className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-transparent outline-none cursor-pointer focus:border-[#13ec6a]/30 transition-all ${user.role === 'super_admin' ? 'bg-purple-500/10 text-purple-500' :
                                                                user.role === 'school_admin' ? 'bg-[#13ec6a]/10 text-[#13ec6a]' :
                                                                    'bg-slate-100 dark:bg-white/5 text-slate-500'
                                                                }`}
                                                            value={user.role}
                                                            onChange={(e: ChangeEvent<HTMLSelectElement>) => handleUpdateRole(user.id, e.target.value)}
                                                        >
                                                            <option value="student">Student</option>
                                                            <option value="school_admin">School Admin</option>
                                                            <option value="super_admin">Super Admin</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-6 sm:px-8 py-5 text-[11px] font-bold text-slate-400 whitespace-nowrap italic">
                                                        {new Date(user.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 sm:px-8 py-5 text-right">
                                                        <button className="p-2.5 text-slate-300 hover:text-[#13ec6a] transition-all bg-transparent hover:bg-[#13ec6a]/5 rounded-xl">
                                                            <MoreVertical size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="lg:hidden h-1.5 bg-slate-100 dark:bg-white/5 rounded-b-[2rem]">
                                    <div className="h-full w-1/3 bg-[#13ec6a]/20 rounded-full animate-pulse mx-auto"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'institutions' && (
                        <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl sm:text-4xl font-black tracking-tighter mb-1">Institutional Hub</h1>
                                    <p className="text-slate-400 text-sm font-medium italic">Authorized verified academic nodes</p>
                                </div>
                                <button className="h-12 px-6 bg-[#13ec6a] text-[#102217] rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#13ec6a]/20 hover:scale-[1.03] active:scale-95 transition-all w-fit">
                                    + Register Node
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                                {institutions.map(inst => (
                                    <div key={inst.id} className="bg-white dark:bg-[#1c2720]/40 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 dark:border-[#234832]/20 group hover:border-[#13ec6a]/50 transition-all shadow-xl hover:shadow-2xl shadow-slate-200/50 dark:shadow-none flex flex-col relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#13ec6a]/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#13ec6a]/10 transition-colors"></div>
                                        <div className="flex justify-between items-start mb-6 relative z-10">
                                            <div className="w-14 h-14 bg-slate-100 dark:bg-[#102217] rounded-[1.25rem] flex items-center justify-center border border-slate-200 dark:border-[#234832]/20 group-hover:bg-[#13ec6a]/20 group-hover:border-[#13ec6a]/40 group-hover:rotate-6 transition-all duration-500">
                                                <School size={28} className="text-slate-400 group-hover:text-[#102217] transition-colors" />
                                            </div>
                                            <span className="text-[9px] font-black text-[#13ec6a] uppercase tracking-widest flex items-center gap-1.5 bg-[#13ec6a]/10 px-3 py-1.5 rounded-full border border-[#13ec6a]/20">
                                                <span className="w-1.5 h-1.5 bg-[#13ec6a] rounded-full animate-pulse"></span>
                                                Verified
                                            </span>
                                        </div>
                                        <div className="relative z-10 mb-8 flex-1">
                                            <h3 className="text-xl font-black mb-1 line-clamp-1 group-hover:text-[#13ec6a] transition-colors">{inst.name}</h3>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{inst.location || 'Distributed Node'}</p>
                                        </div>
                                        <div className="flex items-center gap-6 border-t border-slate-100 dark:border-[#234832]/10 pt-6 relative z-10 transition-all group-hover:border-[#13ec6a]/20">
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Students</p>
                                                <p className="text-lg font-black">{inst.student_count.toLocaleString()}</p>
                                            </div>
                                            <div className="w-px h-8 bg-slate-100 dark:bg-[#234832]/20"></div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Resources</p>
                                                <p className="text-lg font-black">{(inst.resource_count ?? 0).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'catalog' && (
                        <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl sm:text-4xl font-black tracking-tighter mb-1">Catalog Manager</h1>
                                    <p className="text-slate-400 text-sm sm:text-base font-medium italic">Map universities to NUC programs — one mapping, instant course access</p>
                                </div>
                                <button
                                    onClick={fetchCatalogData}
                                    className="p-3 bg-white dark:bg-[#1c2720] border border-slate-200 dark:border-[#234832]/20 rounded-2xl hover:text-[#13ec6a] hover:border-[#13ec6a]/30 transition-all shadow-sm active:scale-95 w-fit"
                                >
                                    <span className="material-symbols-outlined block">refresh</span>
                                </button>
                            </div>

                            {/* Stats Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                                <StatCard label="NUC Programs Seeded" value={nucPrograms.length} icon={BookOpen} color="bg-purple-500" />
                                <StatCard label="Active Mappings" value={mappings.length} icon={Link2} color="bg-[#13ec6a]" />
                                <StatCard label="Universities Onboarded" value={new Set(mappings.map(m => m.institution_id)).size} icon={School} color="bg-blue-500" />
                            </div>

                            {/* Onboarding Form */}
                            <div className="bg-white dark:bg-[#1c2720]/40 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 dark:border-[#234832]/20 shadow-xl shadow-slate-200/50 dark:shadow-none">
                                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                                    <div className="p-2.5 bg-[#13ec6a]/10 text-[#13ec6a] rounded-xl">
                                        <Plus size={20} />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-black uppercase tracking-tight">Onboard University → Program</h3>
                                </div>

                                <form onSubmit={handleOnboard} className="space-y-5">
                                    {/* Institution Toggle */}
                                    <div className="flex items-center gap-3 mb-2">
                                        <button
                                            type="button"
                                            onClick={() => { setUseNewInstitution(false); setOnboardForm(f => ({ ...f, institution_name: '', institution_location: '' })); }}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                !useNewInstitution
                                                    ? 'bg-[#13ec6a] text-[#102217] shadow-lg shadow-[#13ec6a]/20'
                                                    : 'text-slate-400 hover:text-white bg-white/5'
                                            }`}
                                        >
                                            Existing University
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setUseNewInstitution(true); setOnboardForm(f => ({ ...f, institution_id: '' })); }}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                useNewInstitution
                                                    ? 'bg-[#13ec6a] text-[#102217] shadow-lg shadow-[#13ec6a]/20'
                                                    : 'text-slate-400 hover:text-white bg-white/5'
                                            }`}
                                        >
                                            + New University
                                        </button>
                                    </div>

                                    {!useNewInstitution ? (
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Select University</label>
                                            <select
                                                className="w-full h-14 px-4 bg-slate-50 dark:bg-[#102217] border border-slate-200 dark:border-[#234832]/30 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-[#13ec6a]/20 transition-all"
                                                value={onboardForm.institution_id}
                                                onChange={(e) => setOnboardForm(f => ({ ...f, institution_id: e.target.value }))}
                                                required
                                            >
                                                <option value="">— Choose an institution —</option>
                                                {institutions.map(inst => (
                                                    <option key={inst.id} value={inst.id}>{inst.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">University Name</label>
                                                <input
                                                    className="w-full h-14 px-4 bg-slate-50 dark:bg-[#102217] border border-slate-200 dark:border-[#234832]/30 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-[#13ec6a]/20 transition-all placeholder:text-slate-400"
                                                    placeholder="e.g. Delta State University, Abraka"
                                                    value={onboardForm.institution_name}
                                                    onChange={(e) => setOnboardForm(f => ({ ...f, institution_name: e.target.value }))}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Location (Optional)</label>
                                                <input
                                                    className="w-full h-14 px-4 bg-slate-50 dark:bg-[#102217] border border-slate-200 dark:border-[#234832]/30 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-[#13ec6a]/20 transition-all placeholder:text-slate-400"
                                                    placeholder="e.g. Delta State"
                                                    value={onboardForm.institution_location}
                                                    onChange={(e) => setOnboardForm(f => ({ ...f, institution_location: e.target.value }))}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Department Name</label>
                                            <input
                                                className="w-full h-14 px-4 bg-slate-50 dark:bg-[#102217] border border-slate-200 dark:border-[#234832]/30 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-[#13ec6a]/20 transition-all placeholder:text-slate-400"
                                                placeholder="e.g. Philosophy"
                                                value={onboardForm.department_name}
                                                onChange={(e) => setOnboardForm(f => ({ ...f, department_name: e.target.value }))}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Map to NUC Program</label>
                                            <select
                                                className="w-full h-14 px-4 bg-slate-50 dark:bg-[#102217] border border-slate-200 dark:border-[#234832]/30 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-[#13ec6a]/20 transition-all"
                                                value={onboardForm.program_id}
                                                onChange={(e) => setOnboardForm(f => ({ ...f, program_id: e.target.value }))}
                                                required
                                            >
                                                <option value="">— Select NUC program —</option>
                                                {nucPrograms.map(p => (
                                                    <option key={p.id} value={p.id}>[{p.nuc_code}] {p.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {onboardError && (
                                        <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-sm font-bold">
                                            {onboardError}
                                        </div>
                                    )}

                                    {onboardSuccess && (
                                        <div className="p-4 bg-[#13ec6a]/10 border border-[#13ec6a]/20 rounded-2xl text-[#13ec6a] text-sm font-bold">
                                            {onboardSuccess}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={onboardSubmitting}
                                        className="h-14 w-full sm:w-auto px-8 bg-[#13ec6a] text-[#102217] rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#13ec6a]/20 hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {onboardSubmitting ? (
                                            <><Loader2 size={18} className="animate-spin" /> Processing...</>
                                        ) : (
                                            <><Link2 size={18} /> Onboard & Map Program</>
                                        )}
                                    </button>
                                </form>
                            </div>

                            {/* Active Mappings Table */}
                            <div className="bg-white dark:bg-[#1c2720]/40 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 dark:border-[#234832]/20 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                                <div className="px-6 sm:px-8 py-6 border-b border-slate-100 dark:border-[#234832]/20">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-purple-500/10 text-purple-500 rounded-xl">
                                            <Link2 size={20} />
                                        </div>
                                        <h3 className="text-base sm:text-lg font-black uppercase tracking-tight">Active Program Mappings</h3>
                                    </div>
                                </div>

                                {catalogLoading ? (
                                    <div className="py-16 text-center">
                                        <Loader2 size={32} className="animate-spin text-[#13ec6a] mx-auto mb-3" />
                                        <p className="text-slate-400 text-sm font-bold">Loading catalog data...</p>
                                    </div>
                                ) : mappings.length === 0 ? (
                                    <div className="py-16 text-center">
                                        <BookOpen size={40} className="text-slate-300 mx-auto mb-3" />
                                        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">No mappings yet</p>
                                        <p className="text-slate-400 text-xs mt-1">Use the form above to onboard your first university</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto no-scrollbar">
                                        <table className="w-full text-left border-collapse min-w-[700px]">
                                            <thead>
                                                <tr className="border-b border-slate-100 dark:border-[#234832]/20">
                                                    <th className="px-6 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">University</th>
                                                    <th className="px-6 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Department</th>
                                                    <th className="px-6 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">NUC Program</th>
                                                    <th className="px-6 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Since</th>
                                                    <th className="px-6 sm:px-8 py-5"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-[#234832]/10">
                                                {mappings.map(m => (
                                                    <tr key={m.id} className="hover:bg-slate-50/80 dark:hover:bg-[#112419] transition-all group">
                                                        <td className="px-6 sm:px-8 py-5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-2xl bg-[#13ec6a]/10 dark:bg-white/5 flex items-center justify-center">
                                                                    <School size={18} className="text-[#13ec6a]" />
                                                                </div>
                                                                <span className="text-sm font-black truncate max-w-[200px]">{m.institution_name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 sm:px-8 py-5">
                                                            <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-lg">
                                                                {m.department_name}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 sm:px-8 py-5">
                                                            <div className="flex items-center gap-2">
                                                                <span className="px-2.5 py-1 bg-purple-500/10 text-purple-500 rounded-full text-[9px] font-black uppercase tracking-tighter">
                                                                    {m.program_nuc_code}
                                                                </span>
                                                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 truncate max-w-[150px]">{m.program_name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 sm:px-8 py-5 text-[11px] font-bold text-slate-400 whitespace-nowrap italic">
                                                            {new Date(m.effective_from).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 sm:px-8 py-5 text-right">
                                                            <button
                                                                onClick={() => handleDeleteMapping(m.id)}
                                                                className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-xl"
                                                                title="Remove mapping"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </main>

            {/* Premium Mobile Menu Drawer */}
            <div className={`fixed inset-0 z-[100] transition-all duration-700 ${isMobileMenuOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'}`}>
                <div
                    className={`absolute inset-0 bg-[#0a160f]/60 backdrop-blur-md transition-opacity duration-700 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                />
                <aside className={`absolute left-0 top-0 bottom-0 w-[85%] max-w-[340px] bg-[#102217] flex flex-col p-8 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex justify-between items-center mb-12">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#13ec6a] rounded-lg flex items-center justify-center">
                                <ShieldAlert size={18} className="text-[#102217]" />
                            </div>
                            <h2 className="text-xl font-black tracking-tighter uppercase italic">Edu<span className="text-[#13ec6a]">Admin</span></h2>
                        </div>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                            <X size={20} className="text-[#13ec6a]" />
                        </button>
                    </div>

                    <nav className="space-y-4 flex-1">
                        {[
                            { id: 'overview', label: 'Overview', icon: BarChart3 },
                            { id: 'users', label: 'Users', icon: Users },
                            { id: 'institutions', label: 'Institutions', icon: School },
                            { id: 'catalog', label: 'Catalog', icon: BookOpen },
                            { id: 'moderation', label: 'Moderation', icon: ShieldAlert },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                                className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl transition-all border ${activeTab === item.id
                                    ? 'bg-[#13ec6a] text-[#102217] border-[#13ec6a] shadow-xl shadow-[#13ec6a]/20 translate-x-1'
                                    : 'text-slate-400 bg-white/5 border-transparent hover:bg-white/10'
                                    }`}
                            >
                                <item.icon size={22} className={activeTab === item.id ? 'animate-pulse' : ''} />
                                <span className="text-xs font-black uppercase tracking-[0.2em]">{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    <button
                        onClick={() => supabase.auth.signOut().then(() => router.push('/login'))}
                        className="mt-8 w-full flex items-center justify-center gap-3 px-4 py-5 bg-red-500/10 text-red-500 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] border border-red-500/20 active:scale-95 transition-all"
                    >
                        <LogOut size={20} />
                        Logout Session
                    </button>
                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">EduPal Admin Control v1.0</p>
                    </div>
                </aside>
            </div>
        </div>
    );
}
