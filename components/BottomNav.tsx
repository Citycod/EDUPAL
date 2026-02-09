'use client';

import { useRouter, usePathname } from 'next/navigation';

interface NavItem {
  icon: string;
  label: string;
  path: string;
  filled?: boolean;
}

interface BottomNavProps {
  navItems?: (NavItem & { onClick?: () => void; active?: boolean })[];
}

export default function BottomNav({ navItems: customNavItems }: BottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  const defaultNavItems: NavItem[] = [
    { icon: 'home', label: 'Home', path: '/home', filled: true },
    { icon: 'menu_book', label: 'Library', path: '/study' },
    { icon: 'school', label: 'Courses', path: '/courses' },
    { icon: 'forum', label: 'Social', path: '/community' },
    { icon: 'person', label: 'Profile', path: '/profile' },
  ];

  const items = customNavItems || defaultNavItems;

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background-light dark:bg-[#0a120d] border-t border-white/5 px-4 py-3 flex justify-between items-center z-50">
      {items.map((item) => (
        <button
          key={'path' in item ? item.path : item.label}
          onClick={() => {
            if ('onClick' in item && item.onClick) {
              item.onClick();
            } else if ('path' in item) {
              router.push(item.path);
            }
          }}
          className={`flex flex-col items-center gap-1 flex-1 group ${('path' in item && isActive(item.path)) || ('active' in item && item.active) ? '' : 'text-slate-400'
            }`}
        >
          <div
            className={`px-5 py-1 rounded-full transition-colors ${('path' in item && isActive(item.path)) || ('active' in item && item.active)
                ? 'bg-primary/20 text-primary'
                : 'group-hover:bg-white/5'
              }`}
          >
            <span className={`material-symbols-outlined ${item.filled && ('path' in item && isActive(item.path)) ? 'fill-1' : ''}`}>
              {item.icon}
            </span>
          </div>
          <span
            className={`text-[11px] font-medium ${('path' in item && isActive(item.path)) || ('active' in item && item.active) ? 'text-primary' : ''
              }`}
          >
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
}