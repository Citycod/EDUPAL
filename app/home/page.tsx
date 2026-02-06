'use client';

import  { useState } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav'; 


interface DashboardCard {
  title: string;
  value: string;
}

interface SuggestedResource {
  id: number;
  image: string;
  title: string;
}

const Home: React.FC = () => {
  const navigate = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const dashboardCards: DashboardCard[] = [
    { title: "Resources Shared", value: "12" },
    { title: "Classes Joined", value: "5" },
    { title: "Peers Connected", value: "23" }
  ];

  const suggestedResources: SuggestedResource[] = [
    {
      id: 1,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZN6X2IF0br1R13zdGS8SX4KtSzAx-fAWIs1y5ZOZIIhfPIb17nKjeWbkZKsJPi4HHPwO109vh1ihnNisV7ZGN_gd7bkOimYqpDpZhSI8IRdfEWrKt17BavoIg88jrEJfYuUL44B3_n_U_88Gr3QIkVOHWmx2YrMyYHDPHWLVzOLONNRfZNMNTizNVu2FgLvfB-0ZB5vnVX_3jy8WfNPmG5OeHD0rrJCkwjc3DP58FrJEbyPRY_9_Mnp3nC4Nv4PpUtF1AVHr5XGU",
      title: "Introduction to Economics"
    },
    {
      id: 2,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDehAPPgYI7Gg5714wTSgt4OJaq93EX0N8ZnUfKqL7Tc9c_ymorxJGME8QTimW44MZOdzAhkAJk0vS-lcSEF9FZ-hBZs4xklrtmubIsV0TSMWU7XKyaT4QdDl4XQ5IiEA2Jc9F8ORNkFPZC5gy7FDvGhE3pptrgdSvlGwoJjGYMqfZvF7W3-uCHM3FQm3aZBWh6T_8TBi37Z_zgIiHBJ4QcrtlLqnsbiWI32uVkQ0tAtgx7aqVhC4AX666NsRp7BEeFKKTLPDQobtY",
      title: "Advanced Calculus Notes"
    },
    {
      id: 3,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAak8Bpqd96h55yuYTIn8jikOPBzgn_feZKb6Vre8sEsikh2ByWvHsNNacwfY53iohE5i4D8o_Q_hbld8n2EAba-o8wsvBtUUAssraDT-Hi2_IL4UUsELU-rVTkjaDA0q9vrmKn7JhmLeQSUIGt2c09_zbAjdcCezDFbrc7zt0J_T1ToalKbSrp3JJdvKLA-hcMUC7EyLxjD1xT9GLpHJN1kGyFLS6GY6vzaxRMU1bAB9FJWKtv_0oA03lQ1MidW0WU53EKCkJJIbo",
      title: "Past Exam Papers - Physics 101"
    }
  ];

  // Navigation items for BottomNav
  // In your Home component, change the navItems to:
const navItems = [
  { 
    icon: "House", 
    label: "Home", 
    active: true,
    onClick: () => router.push('/home')
  },
  { 
    icon: "BookOpen", 
    label: "Study", 
    active: false,
    onClick: () => router.push('/study')
  },
  { 
    icon: "UsersThree", 
    label: "Classes", 
    active: false,
    onClick: () => router.push('/classes')
  },
  { 
    icon: "Users", 
    label: "Community", 
    active: false,
    onClick: () => router.push('/community')
  },
  { 
    icon: "User", 
    label: "Profile", 
    active: false,
    onClick: () => router.push('/profile')
  }
];

  const handleNotificationClick = () => {
    // Add notification logic here
       router.push('/notification');
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const profileImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuCHLeeUkw2pqcgJVot4fSJhI3smgE7KIp-16nuop_1Tc78IvxkbYMC8tXNbyMuR7Mh4-gCB9G6oJXvlLCEFR7y8Mc5KGEB-ulr_g7PYuemVYpZSzru20ePUFZM-_qgrikDCQg97HeCElg2-7MAuHyvQiyL1wnQ5NBRQvvKKUJNrG1uY96xfTsJWwQhu_Qq-xYh5hg_RqF5-2plvvgNS0fRlNzMcx0E6pCXOM5QljSw2HGMyjl7aMOUUJHXZZwVD6AYx5MidVNWnIro";

  return (
    <div
      className="relative flex h-auto min-h-screen w-full flex-col bg-[#f8fbfc] justify-between group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      {/* Header Component */}
      <Header
        title="EduPal"
        showProfile={true}
        showNotifications={true}
        profileImage={profileImage}
        onNotificationClick={handleNotificationClick}
      />

      {/* Search Bar */}
      <div className="px-4 py-3">
        <label className="flex flex-col w-full h-12 min-w-40">
          <div className="flex items-stretch flex-1 w-full h-full rounded-xl">
            <div className="text-[#458da1] flex border-none bg-[#e6f1f4] items-center justify-center pl-4 rounded-l-xl border-r-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search for resources, classes, or peers"
              value={searchQuery}
              onChange={handleSearch}
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0c191d] focus:outline-0 focus:ring-0 border-none bg-[#e6f1f4] focus:border-none h-full placeholder:text-[#458da1] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal focus:bg-[#dde9ec] transition-colors"
            />
          </div>
        </label>
      </div>

      {/* Welcome Message */}
      <h3 className="text-[#0c191d] tracking-light text-2xl font-bold leading-tight px-4 text-left pb-2 pt-5">
        Hi, Wisdom 👋🏼 Welcome back to EduPal
      </h3>

      {/* Stats Cards */}
      <div className="flex flex-wrap gap-4 p-4">
        {dashboardCards.map((card, index) => (
          <div key={index} className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-[#cde3ea] bg-white hover:shadow-md transition-shadow">
            <p className="text-[#0c191d] text-base font-medium leading-normal">{card.title}</p>
            <p className="text-[#0c191d] tracking-light text-2xl font-bold leading-tight">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Suggested Resources Section */}
      <h2 className="text-[#0c191d] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Suggested for you
      </h2>

      <div className="flex overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-stretch gap-3 p-4">
          {suggestedResources.map((resource) => (
            <div key={resource.id} className="flex flex-col flex-1 h-full gap-4 transition-transform rounded-lg cursor-pointer min-w-40 hover:scale-105">
              <div
                className="flex flex-col w-full bg-center bg-no-repeat bg-cover shadow-md aspect-square rounded-xl"
                style={{ backgroundImage: `url("${resource.image}")` }}
              />
              <p className="text-[#0c191d] text-base font-medium leading-normal">{resource.title}</p>
            </div>
          ))}
        </div>
      </div>

<div
  className="relative pb-5 w-full flex-col bg-[#f8fbfc] justify-between group/design-root overflow-x-hidden " // Added pb-20 for bottom padding
  style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
>
  {/* Your content */}
  
  {/* Bottom Navigation */}
  <BottomNav navItems={navItems} />
</div>
    </div>
  );
};

export default Home;
