import { useNavigate, useLocation } from 'react-router-dom';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
          <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z"/>
        </svg>
      ),
      path: '/home'
    },
    {
      id: 'upload',
      label: 'Upload',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
          <path d="M240,136v64a16,16,0,0,1-16,16H32a16,16,0,0,1-16-16V136a16,16,0,0,1,16-16H80a8,8,0,0,1,0,16H32v64H224V136H176a8,8,0,0,1,0-16h48A16,16,0,0,1,240,136ZM85.66,77.66,120,43.31V128a8,8,0,0,0,16,0V43.31l34.34,34.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,77.66ZM200,168a12,12,0,1,0-12,12A12,12,0,0,0,200,168Z"/>
        </svg>
      ),
      path: '/upload'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
          <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"/>
        </svg>
      ),
      path: '/profile'
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#f0f2f4] z-50">
      <div className="flex gap-2 px-4 pb-3 pt-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.path)}
              className={`flex flex-1 flex-col items-center justify-end gap-1 py-2 transition-colors rounded-lg ${
                active 
                  ? 'text-[#111318] bg-blue-50' 
                  : 'text-[#616f89] hover:text-[#111318] hover:bg-gray-50'
              }`}
            >
              <div className={`flex h-8 items-center justify-center ${
                active ? 'text-[#276cec]' : 'text-current'
              }`}>
                {item.icon}
              </div>
              <p className={`text-xs font-medium leading-normal tracking-[0.015em] ${
                active ? 'text-[#276cec]' : 'text-current'
              }`}>
                {item.label}
              </p>
            </button>
          );
        })}
      </div>
      {/* Safe area for devices with home indicators */}
      <div className="h-5 bg-white safe-area-bottom"></div>
    </div>
  );
};

export default BottomNav;