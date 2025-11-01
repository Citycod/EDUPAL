import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHouse, 
  faUpload, 
  faUser,
  faSearch,
  
} from '@fortawesome/free-solid-svg-icons';

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
      icon: <FontAwesomeIcon icon={faHouse} className="w-5 h-5" />,
      path: '/home'
    },
    {
      id: 'search',
      label: 'Search',
      icon: <FontAwesomeIcon icon={faSearch} className="w-5 h-5" />,
      path: '/search'
    },
    {
      id: 'upload',
      label: 'Upload',
      icon: <FontAwesomeIcon icon={faUpload} className="w-5 h-5" />,
      path: '/upload'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <FontAwesomeIcon icon={faUser} className="w-5 h-5" />,
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
      <div className="flex gap-1 px-2  ">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.path)}
              className={`flex flex-1 flex-col items-center justify-end gap-1  transition-colors rounded-lg ${
                active 
                  ? 'text-[#276cec] bg-blue-50' 
                  : 'text-[#616f89] hover:text-[#111318] hover:bg-gray-50'
              }`}
            >
              <div className={`flex items-center justify-center ${
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