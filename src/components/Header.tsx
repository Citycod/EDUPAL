import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faBell, 
  faGear,
  faHouse
} from '@fortawesome/free-solid-svg-icons';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  showSettings?: boolean;
  showNotifications?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title = 'EduPal', 
  showBackButton = false,
  showSettings = true,
  showNotifications = true
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const handleNotifications = () => {
    navigate('/notifications');
  };

  const handleHome = () => {
    navigate('/home');
  };

  return (
    <div className="flex items-center justify-between p-4 pb-2 bg-white">
      {/* Left Side - Back Button or Home */}
      <div className="flex items-center">
        {showBackButton ? (
          <button 
            onClick={handleBack}
            className="text-[#111418] flex size-10 shrink-0 items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
          </button>
        ) : (
          <button 
            onClick={handleHome}
            className="text-[#111418] flex size-10 shrink-0 items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faHouse} className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {/* Title */}
      <h2 className="text-[#111318] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
        {title}
      </h2>

      {/* Right Side Icons */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        {showNotifications && (
          <button
            onClick={handleNotifications}
            className="flex size-10 items-center justify-center bg-transparent text-[#111318] hover:bg-gray-100 rounded-lg transition-colors relative"
          >
            <FontAwesomeIcon icon={faBell} className="w-4 h-4" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </button>
        )}

        {/* Settings */}
        {showSettings ? (
          <button
            onClick={handleSettings}
            className="flex size-10 items-center justify-center bg-transparent text-[#111318] hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faGear} className="w-4 h-4" />
          </button>
        ) : (
          <div className="size-10"></div> // Spacer for alignment
        )}
      </div>
    </div>
  );
};

export default Header;