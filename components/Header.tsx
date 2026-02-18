

import React from 'react';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showAddButton?: boolean;
  showProfile?: boolean;
  showNotifications?: boolean;
  onBackClick?: () => void;
  onAddClick?: () => void;
  onNotificationClick?: () => void;
  profileImage?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  showAddButton = false,
  showProfile = false,
  showNotifications = false,
  onBackClick,
  onAddClick,
  onNotificationClick,
  profileImage
}) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#f8fbfc]">
      <div className="flex items-center justify-between p-4 pb-2">
        {/* Left Section */}
        <div className="flex items-center size-12 shrink-0">
          {showBackButton && (
            <button
              onClick={onBackClick}
              className="text-[#0d191c] flex size-12 shrink-0 items-center hover:bg-[#e7f1f4] rounded-xl transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
              </svg>
            </button>
          )}
          {showProfile && profileImage && (
            <div className="flex items-center size-12 shrink-0">
              <div
                className="bg-center bg-no-repeat bg-cover rounded-full aspect-square size-8"
                style={{ backgroundImage: `url("${profileImage}")` }}
              />
            </div>
          )}
        </div>

        {/* Center Title */}
        <h2 className="text-[#0d191c] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          {title}
        </h2>

        {/* Right Section */}
        <div className="flex items-center justify-end w-12">
          {showAddButton && (
            <button
              onClick={onAddClick}
              className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 bg-transparent text-[#0d191c] gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0 hover:bg-[#e7f1f4] transition-colors"
            >
              <div className="text-[#0d191c]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
                </svg>
              </div>
            </button>
          )}
          {showNotifications && (
            <button
              onClick={onNotificationClick}
              className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 bg-transparent text-[#0d191c] gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0 hover:bg-[#e7f1f4] transition-colors"
            >
              <div className="text-[#0d191c]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z" />
                </svg>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;