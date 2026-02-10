'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import BottomNav from '@/components/BottomNav';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolledCount, setEnrolledCount] = useState(0);
  const [resourcesCount, setResourcesCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (authUser) {
          // Fetch user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();

          setUser(profile);

          // Fetch enrollment count
          const { count: enrollments } = await supabase
            .from('enrollments')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', authUser.id);

          setEnrolledCount(enrollments || 0);

          // Fetch total resources count (mocked for now as we don't have a user-resource relation yet, but fetching total available)
          const { count: resources } = await supabase
            .from('resources')
            .select('*', { count: 'exact', head: true });

          setResourcesCount(resources || 0);
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const quickAccessCards = [
    {
      title: 'Past Questions',
      subtitle: `${resourcesCount > 0 ? resourcesCount + '+' : 'Browse'} Resources`,
      icon: 'history_edu',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFwrP0-LThS-SmerGKwLrGNxJJI5kCSbV8cBWn7bzxDvlSG6qcTLXOBbVVUn5nC3tpMqiyMrK4PHX6yI_3pSe98iG4u2T_Y8c2nvVoB3jEqnoE08jZ0avWBv-BN4cGKL3-IpRuEjujRnWadIYehTn-ZyDUF_fb6NXF_fkMtUUryvoGVyluE4ZxUobCSIIpe_66pPbyfVaa0OSLoam61pZRnJtYGODhaktq5RzhFkFR89rPKFsIY6SbqOzqk_LMwdOXUsCbG8hT06E',
      path: '/library'
    },
    {
      title: 'Courses',
      subtitle: `${enrolledCount} Active Enrolled`,
      icon: 'school',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDb8TkeFvKiM4k8amEMTGOgkdup8zpVNzMl5cVwiFKQtFr68lIw2YQmmxIIUxhBxABAzobY46RedSm0Qiv--GrF1hPToEHNutEm-8Xd-hRLUccy354sj5Hx5_qSrjjIl9ARygzdRp0nfrXpdS_0zO84rSc3nDgVrl-fZzmD9HXc35G7H040ufJjp7HdeSl_OOJsiLqn6Hs7LXzN07mrjgeFS2b7PEIEMBvJ6xwgSE7qcO2r83MV0Hxe-ySnm5j9YTk51RcA-SFjzMM',
      path: '/classes'
    },
    {
      title: 'Discussions',
      subtitle: 'Join conversation',
      icon: 'forum',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAN69hwYd7coO877wAeqUOmkxTuS79jLz6ebqwJ2on85eAgPfMZMrfoW6vOTsZB9LlyQVUT4xwpsRgH8_jQQCvxWgQ68fRjBVCJhU9bg8J2VCWA04YhLZxxMb77QGL4D_I2N9djR6tMNglnBuPbX_DUamCnYFb_f2xRKWJCaZVzQoM6jxMXupy2Lz-UTGTbfL9v0D6cJynvpWn0oXmKZ7F2ojwq8C1EOSt1mlneVjzaWRfPQAX82LwTtbOSEncVhwB3N8ZW9GSBUOc',
      path: '/community'
    }
  ];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-slate-500">Loading...</div>;
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-[100dvh]">
      <div className="relative flex h-auto min-h-[100dvh] w-full flex-col overflow-x-hidden pb-20">
        {/* TopAppBar */}
        <nav className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-50 border-b border-white/5">
          <div className="flex size-12 shrink-0 items-center">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary cursor-pointer"
              style={{ backgroundImage: `url("${user?.avatar_url || 'https://lh3.googleusercontent.com/aida-public/default-avatar'}")` }}
              onClick={() => router.push('/profile')}
            />
          </div>
          <div className="flex flex-1 px-4">
            <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">EduPal</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex cursor-pointer items-center justify-center rounded-full h-10 w-10 bg-primary/10 text-primary transition-colors hover:bg-primary/20">
              <span className="material-symbols-outlined">search</span>
            </button>
            <button
              onClick={() => router.push('/notification')}
              className="flex cursor-pointer items-center justify-center rounded-full h-10 w-10 bg-primary/10 text-primary transition-colors hover:bg-primary/20"
            >
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto w-full px-4">
          {/* Greeting */}
          <div className="py-8">
            <h1 className="text-slate-900 dark:text-white tracking-tight text-4xl font-bold leading-tight">
              Hello, {user?.full_name?.split(' ')[0] || 'Student'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Ready to continue your learning journey today?</p>
          </div>

          {/* Quick Access Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {quickAccessCards.map((card, index) => (
              <div
                key={index}
                onClick={() => router.push(card.path)}
                className="group relative overflow-hidden bg-cover bg-center flex flex-col gap-3 rounded-xl justify-end p-6 aspect-[4/3] cursor-pointer transition-transform hover:scale-[1.02]"
                style={{
                  backgroundImage: `linear-gradient(0deg, rgba(16, 34, 23, 0.9) 0%, rgba(16, 34, 23, 0.2) 100%), url("${card.image}")`
                }}
              >
                <div className="absolute top-4 right-4 bg-primary text-background-dark p-2 rounded-lg">
                  <span className="material-symbols-outlined">{card.icon}</span>
                </div>
                <div>
                  <p className="text-white text-xl font-bold leading-tight">{card.title}</p>
                  <p className="text-primary text-sm font-medium mt-1">{card.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recently Viewed - Placeholder for now until we have a viewing history table */}
          {/* 
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-slate-900 dark:text-white text-2xl font-bold leading-tight tracking-tight">Recently Viewed</h2>
              <button className="text-primary text-sm font-semibold hover:underline">View All</button>
            </div>
             <div className="text-center py-8 text-slate-500">
                <p>No recently viewed items yet. Start exploring!</p>
             </div>
          </div> 
          */}

          {/* Upcoming Tasks / Summary */}
          {/* Placeholder or fetch from enrollments/assignments later */}
          <div className="bg-primary/10 rounded-2xl p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 border border-primary/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary rounded-xl text-background-dark">
                <span className="material-symbols-outlined text-3xl">event_available</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Stay Tracked</h3>
                <p className="text-slate-400">Check your classes for upcoming assignments.</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/classes')}
              className="w-full md:w-auto px-8 py-3 bg-primary text-background-dark font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
              Go to Classes
            </button>
          </div>
        </main>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
}
