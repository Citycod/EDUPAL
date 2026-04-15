'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { supabase } from '@/lib/supabase';
import { useInstitutionContext } from '@/lib/hooks/useInstitutionContext';
import ProjectTopicGenerator from '@/components/premium/ProjectTopicGenerator';
import CoachWidget from '@/components/dashboard/CoachWidget';
import OnboardingTour from '@/components/OnboardingTour';
import DailyQuestionModal from '@/components/dashboard/DailyQuestionModal';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { institution, loading: contextLoading } = useInstitutionContext();
  const [recentResources, setRecentResources] = useState<any[]>([]);
  const [trendingResources, setTrendingResources] = useState<any[]>([]);
  const [isDailyQuestionModalOpen, setIsDailyQuestionModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (authUser) {
          const { data: profile } = await supabase
            .from('hub_profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();

          const { data: stats } = await supabase
            .from('hub_user_stats')
            .select('current_streak, highest_streak')
            .maybeSingle();

          setUser({ ...profile, ...stats });

          // Quietly update daily streak in the background
          supabase.rpc('update_daily_streak').then(({ data }) => {
            if (data?.status === 'updated' || data?.status === 'initialized') {
              setUser((prev: any) => ({ ...prev, current_streak: data.streak, highest_streak: (data as any).highest_streak || data.streak }));
            }
          });

          if (profile?.institution_id) {
            // Fetch Recent Resources
            const { data: recent } = await supabase
              .from('hub_resources')
              .select(`
                *,
                hub_courses (course_code, title)
              `)
              .eq('institution_id', profile.institution_id)
              .order('created_at', { ascending: false })
              .limit(4);

            if (recent) setRecentResources(recent);

            // Fetch Trending (Most Upvoted)
            const { data: trending } = await supabase
              .from('hub_resources')
              .select(`
                *,
                hub_courses (course_code, title)
              `)
              .eq('institution_id', profile.institution_id)
              .order('upvotes_count', { ascending: false })
              .limit(3);

            if (trending) setTrendingResources(trending);
          }
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Check if daily question needs to pop up
    const checkDailyQuestionStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const res = await fetch('/api/study/daily-question', {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });

        if (res.ok) {
          const data = await res.json();
          // Only pop up if they haven't answered today
          if (!data.answered && data.status !== 'completed') {
            // Small delay for better UX after page load
            setTimeout(() => {
              setIsDailyQuestionModalOpen(true);
            }, 1500);
          }
        }
      } catch (e) {
        console.error('Failed to check daily question status:', e);
      }
    };

    checkDailyQuestionStatus();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Initializing Archive</p>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-[100dvh]">
      <OnboardingTour />
      <div className="relative flex h-auto min-h-[100dvh] w-full flex-col overflow-x-hidden pb-20">
        {/* Top Header */}
        <nav className="flex items-center bg-background-light dark:bg-background-dark p-4 justify-between sticky top-0 z-50 border-b border-white/5 backdrop-blur-md">
          <div className="flex shrink-0 items-center">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary cursor-pointer shadow-lg shadow-primary/20"
              style={{ backgroundImage: `url("${user?.avatar_url || 'https://ui-avatars.com/api/?name=Student&background=random'}")` }}
              onClick={() => router.push('/profile')}
            />
          </div>
          <div className="flex-1 px-4 text-center">
            <h2 className="text-slate-900 dark:text-white text-xl font-black tracking-tighter italic uppercase">
              Edu<span className="text-primary font-serif">Pal</span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {user && (user.current_streak !== undefined) && (
              <div
                id="tour-streak"
                className="flex items-center gap-1.5 px-3 h-10 bg-orange-500/10 text-orange-500 rounded-full font-black text-sm cursor-help transition-all hover:bg-orange-500/20"
                title={`You are on a ${user.current_streak} day study streak!`}
              >
                <span className="text-[16px] leading-none mb-0.5">🔥</span>
                <span>{user.current_streak}</span>
              </div>
            )}
            <button 
              onClick={() => router.push('/notification')}
              className="flex items-center justify-center rounded-full h-10 w-10 bg-primary/10 text-primary transition-colors hover:bg-primary/20"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto w-full px-4 pt-10 pb-20">
          <DailyQuestionModal 
            user={user} 
            isOpen={isDailyQuestionModalOpen} 
            onClose={() => setIsDailyQuestionModalOpen(false)}
            onComplete={() => {
              // Optionally refresh stats or streaks here
            }}
          />
          {/* Search-Centric Hero Section */}
          <div id="tour-welcome" className="text-center mb-16">
            <h1 className="text-slate-900 dark:text-white tracking-tighter text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-4">
              Find Past Questions for Your Course <span className="text-primary italic font-serif underline decoration-primary/30 underline-offset-8">Instantly</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              The organized academic archive for <span className="text-slate-900 dark:text-white font-bold">{institution?.name || 'Your University'}</span>
            </p>
          </div>

          {/* Prominent Search Engine */}
          <div id="tour-search" className="max-w-3xl mx-auto mb-16 px-2">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-primary">
                <span className="material-symbols-outlined text-3xl">search</span>
              </div>
              <input
                type="text"
                placeholder="Search by course code (e.g. CSC421)"
                className="w-full h-16 sm:h-20 pl-14 sm:pl-16 pr-8 bg-white dark:bg-slate-800/50 border-2 border-slate-200 dark:border-white/10 rounded-2xl sm:rounded-3xl focus:border-primary focus:ring-4 focus:ring-primary/10 text-lg sm:text-xl shadow-2xl shadow-primary/5 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
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

          {/* AI Coach Section */}
          <div id="tour-coach" className="max-w-3xl mx-auto mb-16">
            <CoachWidget />
          </div>

          <div className="space-y-20">
            {/* Recently Accessed Section */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <span className="material-symbols-outlined text-primary">history</span>
                  </div>
                  <h2 className="text-slate-900 dark:text-white text-2xl font-black tracking-tight">Recently Added</h2>
                </div>
                <button onClick={() => router.push('/library')} className="text-primary text-sm font-bold hover:underline">View All Archive</button>
              </div>

              {recentResources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  {recentResources.map((res, idx) => (
                    <div
                      key={res.id}
                      onClick={() => router.push(`/resource/${res.id}`)}
                      className="p-5 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 rounded-2xl flex items-center gap-5 cursor-pointer hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-white/5 transition-all group shadow-sm"
                    >
                      <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-3xl">description</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold truncate text-slate-900 dark:text-white text-lg">
                          {(res.hub_courses?.course_code || 'CODE')} - {(res.hub_courses?.title || res.title)}
                        </h3>
                        <p className="text-xs text-primary font-black uppercase tracking-widest mt-1">
                          {res.type || 'Material'} • {res.file_size || '0 MB'}
                        </p>
                      </div>
                      <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">download</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-white/5 rounded-3xl">
                  <span className="material-symbols-outlined text-4xl text-slate-300 mb-4 opacity-50">auto_stories</span>
                  <p className="text-slate-400 font-medium text-sm">No course materials found for your department yet.</p>
                  <button
                    onClick={() => router.push('/library/upload')}
                    className="mt-4 text-primary text-xs font-black uppercase tracking-widest border border-primary/20 px-4 py-2 rounded-lg hover:bg-primary/5"
                  >
                    Be the first to upload
                  </button>
                </div>
              )}
            </section>

            {/* Supply Engine / Contributor CTA */}
            <section className="relative">
              <div className="absolute inset-0 bg-primary rounded-[2.5rem] rotate-1 scale-105 opacity-10"></div>
              <div className="bg-primary shadow-2xl shadow-primary/20 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10 border border-primary/20">
                <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                  <div className="p-4 sm:p-5 bg-background-dark rounded-2xl sm:rounded-3xl text-primary shadow-xl rotate-[-4deg]">
                    <span className="material-symbols-outlined text-4xl sm:text-5xl">cloud_upload</span>
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-2xl sm:text-3xl font-black text-background-dark tracking-tighter mb-2">Build the Archive</h3>
                    <p className="text-background-dark/70 font-bold max-w-sm leading-tight">Your contributions make EduPal better for everyone. Upload past questions and earn points.</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/library/upload')}
                  className="w-full lg:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-background-dark text-primary font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-black/30 text-lg"
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

              {trendingResources.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                  {trendingResources.map((item, i) => (
                    <div
                      key={item.id}
                      onClick={() => router.push(`/resource/${item.id}`)}
                      className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-primary transition-all shadow-sm cursor-pointer"
                    >
                      <span className="absolute top-4 right-4 text-4xl font-black text-primary/5 group-hover:text-primary/10">0{i + 1}</span>
                      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-2">{item.hub_courses?.course_code || 'CODE'}</p>
                      <h4 className="text-slate-900 dark:text-white font-bold mb-4 leading-tight truncate">{item.hub_courses?.title || item.title}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-primary font-black text-sm">{item.downloads_count || 0} Downloads</span>
                        <button className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-background-dark transition-all">
                          <span className="material-symbols-outlined text-sm">download</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center bg-white/5 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/5">
                  <span className="material-symbols-outlined text-4xl text-slate-300 mb-4 opacity-50">star_outline</span>
                  <p className="text-slate-400 text-sm font-medium">Trending resources will appear here.</p>
                </div>
              )}
            </section>
            {/* Final Year Project Topics (Premium CTA) */}
            <section className="mt-20">
              <div
                onClick={() => router.push('/research')}
                className="group relative bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 sm:p-12 overflow-hidden cursor-pointer hover:border-primary/50 transition-all shadow-2xl shadow-primary/5"
              >
                <div className="absolute top-0 right-0 w-[40%] h-[150%] bg-primary/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/20 transition-all"></div>

                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
                    <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center text-slate-950 shadow-2xl shadow-primary/30 rotate-[-4deg] group-hover:rotate-0 transition-transform">
                      <span className="material-symbols-outlined text-4xl font-bold">science</span>
                    </div>
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-black text-white italic tracking-tighter mb-2">
                        Final Year <span className="text-primary italic font-serif">Research</span> Lab
                      </h3>
                      <p className="text-slate-400 font-bold text-sm max-w-sm">
                        Get project topics, research methodology, and AI guidance for your final defense.
                      </p>
                    </div>
                  </div>
                  <button className="px-10 py-4 bg-white/5 text-primary border border-primary/20 font-black rounded-2xl hover:bg-primary hover:text-slate-950 transition-all uppercase tracking-widest text-xs">
                    Open Lab
                  </button>
                </div>
              </div>
            </section>
          </div>
        </main>

        {/* Floating Upload Button */}
        <div id="tour-upload" className="fixed bottom-20 right-5 z-40">
          <button
            onClick={() => router.push('/library/upload')}
            className="bg-primary text-background-dark h-14 w-14 rounded-full shadow-2xl shadow-primary/30 flex items-center justify-center transition-all active:scale-90 hover:scale-110 hover:rotate-90"
          >
            <span className="material-symbols-outlined text-[28px] font-bold">add</span>
          </button>
        </div>


      </div>
    </div>
  );
}
