'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface NavItem {
  icon: string;
  label: string;
  path?: string;
  filled?: boolean;
}

interface BottomNavProps {
  navItems?: (NavItem & { onClick?: () => void; active?: boolean })[];
}

export default function BottomNav({ navItems: customNavItems }: BottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<string>('student');

  useEffect(() => {
    const fetchRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        if (profile?.role) setRole(profile.role);
      }
    };
    fetchRole();
  }, []);

  const navItems = customNavItems || [
    { icon: 'home', label: 'Home', path: '/home', filled: true },
    { icon: 'history_edu', label: 'Library', path: '/library' },
    { icon: 'leaderboard', label: 'Ranks', path: '/leaderboard' },
    ...(['admin', 'school_admin', 'super_admin'].includes(role)
      ? [{ icon: 'admin_panel_settings', label: 'Admin', path: '/admin/school' }]
      : []
    ),
    { icon: 'forum', label: 'Discuss', path: '/community' },
    { icon: 'person', label: 'Profile', path: '/profile' },
  ];

  const getIsActive = (itemPath?: string) => {
    if (!itemPath) return false;
    if (itemPath === '/home') return pathname === '/home';
    return pathname.startsWith(itemPath);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2">
      <div className="mx-auto max-w-lg bg-white/80 dark:bg-[#0a120d]/80 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-[2.5rem] shadow-2xl shadow-black/20 px-2 py-2 flex justify-between items-center transition-all duration-300">
        {navItems.map((item: any, index: number) => {
          const itemPath = 'path' in item ? item.path : undefined;
          const itemActive = ('active' in item && item.active) || getIsActive(itemPath);
          const itemOnClick = 'onClick' in item ? item.onClick : undefined;

          return (
            <button
              key={itemPath || item.label || index}
              onClick={() => {
                if (itemOnClick) {
                  itemOnClick();
                } else if (itemPath) {
                  router.push(itemPath);
                }
              }}
              className="flex flex-col items-center gap-1 flex-1 px-1 group outline-none"
            >
              <div
                className={`relative px-5 py-2 rounded-2xl transition-all duration-300 ${itemActive
                    ? 'bg-primary text-background-dark scale-105 shadow-lg shadow-primary/20'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-white/10'
                  }`}
              >
                <span className={`material-symbols-outlined text-[24px] block transition-transform duration-300 ${item.filled && itemActive ? 'fill-1' : ''
                  } ${itemActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </span>

                {itemActive && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-background-dark opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-background-dark/50"></span>
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${itemActive ? 'text-primary' : 'text-slate-500 dark:text-slate-500 opacity-0 group-hover:opacity-100'
                  }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}