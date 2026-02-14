'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import BottomNav from '@/components/BottomNav';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (authUser) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();

          setUser(profile);
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-slate-500">Loading...</div>;
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-[100dvh]">
      <div className="relative flex h-auto min-h-[100dvh] w-full flex-col overflow-x-hidden pb-20">
        {/* Top Header */}
        <nav className="flex items-center bg-background-light dark:bg-background-dark p-4 justify-between sticky top-0 z-50 border-b border-white/5">
          <div className="flex shrink-0 items-center">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary cursor-pointer"
              style={{ backgroundImage: `url("${user?.avatar_url || 'https://ui-avatars.com/api/?name=Student&background=random'}")` }}
              onClick={() => router.push('/profile')}
            />
          </div>
          <div className="flex-1 px-4">
            <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tighter">EduPal</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center justify-center rounded-full h-10 w-10 bg-primary/10 text-primary transition-colors hover:bg-primary/20">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto w-full px-4 pt-10 pb-20">
          {/* Search-Centric Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-slate-900 dark:text-white tracking-tighter text-4xl md:text-5xl font-black leading-tight mb-4">
              Find Past Questions for Your Course <span className="text-primary italic font-serif underline decoration-primary/30 underline-offset-8">Instantly</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              The organized academic archive for <span className="text-slate-900 dark:text-white font-bold">{user?.university || 'Your University'}</span>
            </p>
          </div>

          {/* Prominent Search Engine */}
          <div className="max-w-3xl mx-auto mb-16 px-2">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-primary">
                <span className="material-symbols-outlined text-3xl">search</span>
              </div>
              <input
                type="text"
                placeholder="Search by course code (e.g. CSC421)"
                className="w-full h-20 pl-16 pr-8 bg-white dark:bg-slate-800/50 border-2 border-slate-200 dark:border-white/10 rounded-3xl focus:border-primary focus:ring-4 focus:ring-primary/10 text-xl shadow-2xl shadow-primary/5 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                onFocus={() => router.push('/library')}
              />
              <div className="absolute inset-y-0 right-4 flex items-center">
                <button
                  onClick={() => router.push('/library')}
                  className="px-6 py-3 bg-primary text-background-dark font-black rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Quick Context Chips */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {['Institution', 'Department', 'Level'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => router.push('/library')}
                  className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-slate-800/50 rounded-full border border-slate-200 dark:border-white/5 text-sm font-bold hover:border-primary hover:text-primary transition-all text-slate-600 dark:text-slate-400 shadow-sm"
                >
                  {filter}
                  <span className="material-symbols-outlined text-sm">expand_more</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-20">
            {/* Recently Accessed Section */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <span className="material-symbols-outlined text-primary">history</span>
                  </div>
                  <h2 className="text-slate-900 dark:text-white text-2xl font-black tracking-tight">Recently Accessed</h2>
                </div>
                <button className="text-primary text-sm font-bold hover:underline">View All Archive</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                {[
                  { code: 'CSC421', title: 'Net-Centric Computing', session: '2023/2024', size: '15.2 MB' },
                  { code: 'MTH101', title: 'General Mathematics I', session: '2022/2023', size: '8.4 MB' }
                ].map((item, idx) => (
                  <div key={idx} className="p-5 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 rounded-2xl flex items-center gap-5 cursor-pointer hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-white/5 transition-all group shadow-sm">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-3xl">description</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold truncate text-slate-900 dark:text-white text-lg">{item.code} - {item.title}</h3>
                      <p className="text-xs text-primary font-black uppercase tracking-widest mt-1">{item.session} Session • {item.size}</p>
                    </div>
                    <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">download</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Supply Engine / Contributor CTA */}
            <section className="relative">
              <div className="absolute inset-0 bg-primary rounded-[2.5rem] rotate-1 scale-105 opacity-10"></div>
              <div className="bg-primary shadow-2xl shadow-primary/20 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10 border border-primary/20">
                <div className="flex items-center gap-8">
                  <div className="p-5 bg-background-dark rounded-3xl text-primary shadow-xl rotate-[-4deg]">
                    <span className="material-symbols-outlined text-5xl">cloud_upload</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-background-dark tracking-tighter mb-2">Build the Archive</h3>
                    <p className="text-background-dark/70 font-bold max-w-sm leading-tight text-left">Your contributions make EduPal better for everyone. Upload past questions and earn community points.</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/library/upload')}
                  className="w-full md:w-auto px-12 py-5 bg-background-dark text-primary font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-black/30 text-lg"
                >
                  Upload Now
                </button>
              </div>
            </section>

            {/* Trending Section */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">trending_up</span>
                </div>
                <h2 className="text-slate-900 dark:text-white text-2xl font-black tracking-tight">Top Downloaded This Week</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
                {[
                  { code: 'CSC302', title: 'Data Structures', dl: 184 },
                  { code: 'GST111', title: 'Communication in English', dl: 245 },
                  { code: 'PHY101', title: 'General Physics I', dl: 156 }
                ].map((item, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-primary transition-all shadow-sm">
                    <span className="absolute top-4 right-4 text-4xl font-black text-primary/5 group-hover:text-primary/10">0{i + 1}</span>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-2">{item.code}</p>
                    <h4 className="text-slate-900 dark:text-white font-bold mb-4 leading-tight">{item.title}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-black text-sm">{item.dl} Downloads</span>
                      <button className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-background-dark transition-all">
                        <span className="material-symbols-outlined text-sm">download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
