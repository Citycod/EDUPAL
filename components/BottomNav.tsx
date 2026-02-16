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

  const [items, setItems] = useState<(NavItem & { onClick?: () => void; active?: boolean })[]>([]);

  useEffect(() => {
    const fetchNavItems = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      let role = 'student';

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        role = profile?.role || 'student';
      }

      const baseItems: NavItem[] = [
        { icon: 'home', label: 'Home', path: '/home', filled: true },
        { icon: 'history_edu', label: 'Library', path: '/library' },
        { icon: 'leaderboard', label: 'Ranks', path: '/leaderboard' },
      ];

      // Add Admin for staff
      if (['admin', 'school_admin', 'super_admin'].includes(role)) {
        baseItems.push({ icon: 'admin_panel_settings', label: 'Admin', path: '/admin/school' });
      }

      baseItems.push(
        { icon: 'forum', label: 'Discuss', path: '/community' },
        { icon: 'person', label: 'Profile', path: '/profile' }
      );

      setItems(baseItems as any);
    };

    fetchNavItems();
  }, [pathname]);

  const isActive = (path?: string) => path ? pathname === path : false;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background-light dark:bg-[#0a120d] border-t border-white/5 px-4 py-3 flex justify-between items-center z-50">
      {items.map((item: any, index: number) => {
        const itemPath = 'path' in item ? item.path : undefined;
        const itemActive = ('active' in item && item.active) || isActive(itemPath);
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
            className={`flex flex-col items-center gap-1 flex-1 group ${itemActive ? '' : 'text-slate-400'}`}
          >
            <div
              className={`px-5 py-1 rounded-full transition-colors ${itemActive
                ? 'bg-primary/20 text-primary'
                : 'group-hover:bg-white/5'
                }`}
            >
              <span className={`material-symbols-outlined ${item.filled && itemActive ? 'fill-1' : ''}`}>
                {item.icon}
              </span>
            </div>
            <span
              className={`text-[11px] font-medium ${itemActive ? 'text-primary' : ''}`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}