import React from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

const Verification: React.FC = () => {
  const handleResendEmail = () => {
    // TODO: Implement resend email functionality
    console.log('Resend email clicked');
    // Add API call to resend verification email
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white justify-between overflow-x-hidden font-['Manrope','Noto_Sans',sans-serif]">
      {/* Header */}
      <Header title="Verify Email" showBackButton={true} showSettings={false} />

      {/* Main Content */}
      <div className="flex-1 pb-24">
        {/* Illustration */}
        <div className="flex justify-center p-4 bg-white">
          <div className="w-full max-w-sm overflow-hidden bg-white rounded-lg">
            <div 
              className="w-full h-64 bg-center bg-no-repeat bg-cover rounded-lg"
              style={{ 
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuATmWttvrIaNl64NKXlpA32hIppjGDEkMLnUZSewP1ParHY0OifPX1gEBnkQnzXdePHttWxzLPvOacYP8RNWHGRquq9m9Q-0V9BWllqaBx5cMuXVORdPeJzDVq9tFyreyROJO_qveFr-bG6Ur--dzQTmmF-YSWULFKIBZG3X6VwPIeWO9watO3A7nBH-_vtbLmhxBsMpa76qDZ8aUydyybXBdmCV-NXdbY8zBgjXC0ipfI0J9CWZHdxTTWgYGdMCBx_uwUM_wKgOJxK")' 
              }}
            ></div>
          </div>
        </div>

        {/* Text Content */}
        <div className="px-4 py-3">
          <h2 className="text-[#111418] tracking-tight text-[28px] font-bold leading-tight text-center pb-3">
            Verify your student email
          </h2>
          <p className="text-[#111418] text-base font-normal leading-normal text-center">
            We've sent a verification link to your student email. Please check your inbox and click the link to continue.
          </p>
        </div>

        {/* Resend Email Button */}
        <div className="flex justify-center px-4 py-3">
          <button
            onClick={handleResendEmail}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f4] text-[#111418] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-200 transition-colors duration-200"
          >
            <span className="truncate">Resend Email</span>
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Verification;