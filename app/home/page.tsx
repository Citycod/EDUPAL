'use client';

import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';

export default function Home() {
  const router = useRouter();

  const quickAccessCards = [
    {
      title: 'Past Questions',
      subtitle: '1,200+ Resources',
      icon: 'history_edu',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFwrP0-LThS-SmerGKwLrGNxJJI5kCSbV8cBWn7bzxDvlSG6qcTLXOBbVVUn5nC3tpMqiyMrK4PHX6yI_3pSe98iG4u2T_Y8c2nvVoB3jEqnoE08jZ0avWBv-BN4cGKL3-IpRuEjujRnWadIYehTn-ZyDUF_fb6NXF_fkMtUUryvoGVyluE4ZxUobCSIIpe_66pPbyfVaa0OSLoam61pZRnJtYGODhaktq5RzhFkFR89rPKFsIY6SbqOzqk_LMwdOXUsCbG8hT06E',
      path: '/study'
    },
    {
      title: 'Courses',
      subtitle: '12 Active Enrolled',
      icon: 'school',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDb8TkeFvKiM4k8amEMTGOgkdup8zpVNzMl5cVwiFKQtFr68lIw2YQmmxIIUxhBxABAzobY46RedSm0Qiv--GrF1hPToEHNutEm-8Xd-hRLUccy354sj5Hx5_qSrjjIl9ARygzdRp0nfrXpdS_0zO84rSc3nDgVrl-fZzmD9HXc35G7H040ufJjp7HdeSl_OOJsiLqn6Hs7LXzN07mrjgeFS2b7PEIEMBvJ6xwgSE7qcO2r83MV0Hxe-ySnm5j9YTk51RcA-SFjzMM',
      path: '/courses'
    },
    {
      title: 'Discussions',
      subtitle: '5 New Replies',
      icon: 'forum',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAN69hwYd7coO877wAeqUOmkxTuS79jLz6ebqwJ2on85eAgPfMZMrfoW6vOTsZB9LlyQVUT4xwpsRgH8_jQQCvxWgQ68fRjBVCJhU9bg8J2VCWA04YhLZxxMb77QGL4D_I2N9djR6tMNglnBuPbX_DUamCnYFb_f2xRKWJCaZVzQoM6jxMXupy2Lz-UTGTbfL9v0D6cJynvpWn0oXmKZ7F2ojwq8C1EOSt1mlneVjzaWRfPQAX82LwTtbOSEncVhwB3N8ZW9GSBUOc',
      path: '/community'
    }
  ];

  const recentlyViewed = [
    {
      title: 'Advanced Mathematics 101',
      subtitle: 'Module 4: Linear Algebra • Last viewed 2 hours ago',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2EjoBA1Wno-UM3_C85-L7sXJ2nnLVM1o6RsEqigqHkJaRN4SUuhXtCzAgS967TDx5XIcQo5_SX__2QwW8LyzDngDmUtXscGj-Gqdzb5w_t9qvKCelymhhsXOGwbbIJy2HEbnkHPNk4v4_a8Z_t2zuc9cv40oc65QJkIjBzrLXCBtHxyhaV3Aas_AtWVi__FVOhND46WICaj1hlJQRGdguLNLfNz9pg785gLMGU8BO6zlqGa2tL6sZu2aDSsS5LhE7Y88MPwf6OdU'
    },
    {
      title: 'Introduction to Genetics',
      subtitle: 'Reading: DNA Replication • Last viewed 5 hours ago',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBi2TuNZww6BfE6QwK3XQjucwX5wRagv8JdH-YjY6jkAhXT6kmtTF80DvnR6A3SAjm3sOsD3V3z5WoCQRIVywnSkQK38puYYoWRFIX0iMnixJ9RfC5Si_q09QaABNsQX0XSrf5dxAPCRpGStoVQ3MRCJ81v5c-Kc8EiLIsljZRPoniQwBCNQp1GwhglDsejTpY6ee0GTg0wjSWO4Gki080d3_izC6VXqVzfRcWDxEGQra8xeX9iPG0mPLRPMRThYxjqNy2Q8GckLpY'
    },
    {
      title: 'Data Structures & Algorithms',
      subtitle: 'Video: Binary Search Trees • Last viewed yesterday',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxRcvJP3lf3qci8epR7sgnFVHbtV89hOApfEAYNLTOEw4hVO660yAAm3lq6q9QiK1cTMhuP5iC--gv1fteIC-Mf1wRUFmrLU-BUEa7U4efCrNUkoNcz0-8zZHFzsfIgfpeQjs3n_tx13PtawfKY9bbfZsYw4LLlzC_PgwH8eER2E6tETvz34ofoDfFYdpghnV_OlUMZu8qEzgdU87nDlQ-td7JMq5vBp6zrwYmjLpxt739M-feFGGlOAKNoK_n-rjbA9KHUGoUDCk'
    }
  ];

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden pb-20">
        {/* TopAppBar */}
        <nav className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-50 border-b border-white/5">
          <div className="flex size-12 shrink-0 items-center">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary cursor-pointer"
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCL9JmvwN64PzbRp2S5RapNk5GOzzY9SydgKvkJdTSLWkrlV0Tw3UcITmMNjUzPFjbEUakDPFUPEsBsaI073wRoSNw9VPQ3wJs0vqeuOnnxV-yq0G9BnriLjFzEncWOfDEK6CNZwn7YRDqNpnKpY-9j-nnRpiVhTiIuuHHoY1YkVmfZyfcFxuV6Zp73EIHUsy_xNeCKpKONkAtxQFRXHd-w8R4zxpox5jrfdgXS-AqM5O8umG8C-Uw4vm5PLjd4YZB5Sj9gqtGLbmQ")' }}
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
            <h1 className="text-slate-900 dark:text-white tracking-tight text-4xl font-bold leading-tight">Hello, Alex</h1>
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

          {/* Recently Viewed Section */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-slate-900 dark:text-white text-2xl font-bold leading-tight tracking-tight">Recently Viewed</h2>
              <button className="text-primary text-sm font-semibold hover:underline">View All</button>
            </div>
            <div className="space-y-3">
              {recentlyViewed.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-white dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/10 hover:border-primary/50 transition-colors cursor-pointer group"
                >
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-16 shrink-0"
                    style={{ backgroundImage: `url("${item.image}")` }}
                  />
                  <div className="flex flex-col flex-1 justify-center min-w-0">
                    <p className="text-slate-900 dark:text-white text-lg font-semibold leading-normal truncate">{item.title}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">{item.subtitle}</p>
                  </div>
                  <div className="shrink-0">
                    <div className="text-primary flex size-8 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-background-dark transition-all">
                      <span className="material-symbols-outlined">chevron_right</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Tasks / Summary */}
          <div className="bg-primary/10 rounded-2xl p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 border border-primary/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary rounded-xl text-background-dark">
                <span className="material-symbols-outlined text-3xl">event_available</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Upcoming Exam</h3>
                <p className="text-slate-400">Physics 201 - Monday, Oct 24th</p>
              </div>
            </div>
            <button className="w-full md:w-auto px-8 py-3 bg-primary text-background-dark font-bold rounded-xl hover:opacity-90 transition-opacity">
              Set Reminder
            </button>
          </div>
        </main>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
}
