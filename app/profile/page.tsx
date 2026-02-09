'use client';

import BottomNav from "@/components/BottomNav";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Resource {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  type: 'course' | 'material' | 'assignment';
  lastAccessed?: string;
  progress?: number;
}

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  university: string;
  major: string;
  year: string;
  email?: string;
  joinDate?: string;
  bio?: string;
}

type TabType = 'resources' | 'classes' | 'settings';

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('resources');

  const userProfile: UserProfile = {
    id: "user-1",
    name: "Ayo Adebayo",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_mXZg5UcxVRCSaJ8FAyIBo47xY2bNH_agbO55sKAXFwddAG-9Fk6TwLMJpEa0E3eDkNTIOIJrBlBNCFx9CIHh4N2DYszlcwS746fLB0HO8oAxzPFT5iT2GsDPbwU1nHZGeqI49ezMBIfndGYKs79dDSmq_hHwyn_AvGGNCfe3ZqK3_DN3yO0JMID8iA7hA3QKp2CoIUxsppbtcESNcxnNi3u-9jN6mcI5ULiFtIuUbQTmqG7HFwVoQ3AygRJO9qJZkOlQAO2G_lk",
    university: "University of Lagos",
    major: "Computer Science",
    year: "2nd Year",
    email: "ayo.adebayo@student.unilag.edu.ng",
    joinDate: "September 2022",
    bio: "Passionate about software engineering and machine learning. Always looking to collaborate on interesting projects!"
  };

  const resources: Resource[] = [
    {
      id: "1",
      title: "CSC 101",
      subtitle: "2023/2024 • Introduction to Computer Science",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEfDr6DXYNNRgePw7Wp-A6vcDLVI20CbEItil9JAHjqWzEp90_SzmvXjZW34RKJasAbCwdtaTXWdOJ_dGUI0ItLlviatSIrPpRy9oRGMhRTe92Qj2mU0DXXfbUIuW1o5cy_yud1J0-O314Z1BUJ04_EJMXdm6-Hy50G4cF1COH98Lj2t-QqcaQXZv6MSS8VAnI8ddBjqBj-VR0c1TSm2VVf5TH8FhVQyFxkQr2aNT5Flqny7apahXOaABR_O37CbOZ4MLxL8QPD0k",
      type: 'course',
      lastAccessed: "2 days ago",
      progress: 85
    },
    {
      id: "2",
      title: "CSC 102",
      subtitle: "2023/2024 • Data Structures and Algorithms",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeGks0b-3HXYcobNEyWIY6PEwEHpVkcbCBI0lYVKMkuOPhTSvo-bjQjsd8bbpijfncavUbMcS5dV3nKllO5WRL6iciM9o62odKxfHSShnZhCyhiFNAc1Fb953BYqhAEtPnxrETAKVFr2RcocOILFBklzYODx4Diw9QrTKHr5X9X4LK6X06KQrLrHOywPvaZIh7QqVo_OU6CA-8m1dxSx3R6VHxGmXOVGI4q9QXnBE-FV7lBf7iMzHFaC0oa6y89c4usRYefe4w3ao",
      type: 'course',
      lastAccessed: "1 week ago",
      progress: 60
    },
    {
      id: "3",
      title: "CSC 103",
      subtitle: "2023/2024 • Object-Oriented Programming",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDc9Fu0pR-0TGjHjX1b1UgAOmy4A8eWx_iNriIyKqxhFvAiMUViq4RQASV6io66Yq7B04vsseRyvobuoYSqe01VnPTvhmteQbMwa5AZTqQNideE5Ucz8FQ7jowX1nKcnYaxF16maYKUZ3bNM4BRZMu1Bn-4motf3FUdZ79n-WhVIkRoiqIpBAtdXsEnYKHWfYHc5JNGKFo3p9hm4X3SmkZBY6L9ELFIBZHpzo2yEmmUIwz--yxQ6ttXgA32FnEezJlYxo_bS9_H10E",
      type: 'course',
      lastAccessed: "3 days ago",
      progress: 45
    }
  ];

  const enrolledClasses = [
    {
      id: "1",
      title: "Advanced Calculus",
      code: "MTH 201",
      instructor: "Dr. Chinedu Okoro",
      schedule: "Mon, Wed 10:00 AM",
      progress: 75
    },
    {
      id: "2",
      title: "Database Systems",
      code: "CSC 301",
      instructor: "Prof. Fatima Bello",
      schedule: "Tue, Thu 2:00 PM",
      progress: 60
    },
    {
      id: "3",
      title: "Software Engineering",
      code: "CSC 305",
      instructor: "Dr. Emeka Nwosu",
      schedule: "Mon, Fri 1:00 PM",
      progress: 40
    }
  ];

  const handleEditProfile = () => {
    // Navigate to edit profile page or open modal
    console.log("Edit profile clicked");
  };

  const handleResourceClick = (resourceId: string) => {
    router.push(`/resource/${resourceId}`);
  };

  const handleClassClick = (classId: string) => {
    router.push(`/class/${classId}`);
  };

  const TabButton: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
  }> = ({ label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 transition-all duration-200 ${isActive
        ? 'border-b-primary text-[#0d191c]'
        : 'border-b-transparent text-[#498a9c] hover:text-[#0d191c]'
        }`}
    >
      <p className={`text-sm font-bold leading-normal tracking-[0.015em] ${isActive ? 'text-[#0d191c]' : 'text-[#498a9c]'
        }`}>
        {label}
      </p>
    </button>
  );

  const ResourceCard: React.FC<{ resource: Resource }> = ({ resource }) => (
    <div
      className="flex items-center gap-4 bg-white hover:bg-[#f8fbfc] p-4 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-[#e7f1f4]"
      onClick={() => handleResourceClick(resource.id)}
    >
      <img
        src={resource.image}
        alt={resource.title}
        className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[#0d191c] text-base font-medium leading-normal truncate">
            {resource.title}
          </p>
          {resource.progress !== undefined && (
            <span className="text-xs text-[#498a9c] bg-[#e7f1f4] px-2 py-1 rounded-full">
              {resource.progress}%
            </span>
          )}
        </div>
        <p className="text-[#498a9c] text-sm font-normal leading-normal line-clamp-2">
          {resource.subtitle}
        </p>
        {resource.lastAccessed && (
          <p className="text-xs text-[#498a9c] mt-1">
            Last accessed {resource.lastAccessed}
          </p>
        )}
      </div>
    </div>
  );

  const ClassCard: React.FC<{ classItem: typeof enrolledClasses[0] }> = ({ classItem }) => (
    <div
      className="bg-white hover:bg-[#f8fbfc] p-4 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-[#e7f1f4]"
      onClick={() => handleClassClick(classItem.id)}
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="text-[#0d191c] text-base font-medium leading-normal">
            {classItem.title}
          </h4>
          <p className="text-[#498a9c] text-sm font-normal">
            {classItem.code} • {classItem.instructor}
          </p>
        </div>
        <span className="text-xs text-[#498a9c] bg-[#e7f1f4] px-2 py-1 rounded-full">
          {classItem.progress}%
        </span>
      </div>
      <div className="flex items-center justify-between text-xs text-[#498a9c]">
        <span>{classItem.schedule}</span>
        <div className="w-20 bg-[#e7f1f4] rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${classItem.progress}%` }}
          />
        </div>
      </div>
    </div>
  );

  const SettingsSection: React.FC = () => (
    <div className="space-y-4 p-4">
      <div className="bg-white p-4 rounded-lg border border-[#e7f1f4]">
        <h4 className="text-[#0d191c] text-base font-bold mb-3">Account Information</h4>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-[#498a9c] font-medium">Email</label>
            <p className="text-[#0d191c] text-sm">{userProfile.email}</p>
          </div>
          <div>
            <label className="text-xs text-[#498a9c] font-medium">University</label>
            <p className="text-[#0d191c] text-sm">{userProfile.university}</p>
          </div>
          <div>
            <label className="text-xs text-[#498a9c] font-medium">Member Since</label>
            <p className="text-[#0d191c] text-sm">{userProfile.joinDate}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-[#e7f1f4]">
        <h4 className="text-[#0d191c] text-base font-bold mb-3">Preferences</h4>
        <div className="space-y-3">
          <button className="w-full text-left text-sm text-[#0d191c] hover:text-primary transition-colors py-2">
            Notification Settings
          </button>
          <button className="w-full text-left text-sm text-[#0d191c] hover:text-primary transition-colors py-2">
            Privacy Settings
          </button>
          <button className="w-full text-left text-sm text-[#0d191c] hover:text-primary transition-colors py-2">
            Study Preferences
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-[#e7f1f4]">
        <h4 className="text-[#0d191c] text-base font-bold mb-3">Support</h4>
        <div className="space-y-3">
          <button className="w-full text-left text-sm text-[#0d191c] hover:text-primary transition-colors py-2">
            Help Center
          </button>
          <button className="w-full text-left text-sm text-[#0d191c] hover:text-primary transition-colors py-2">
            Contact Support
          </button>
          <button className="w-full text-left text-sm text-red-500 hover:text-red-600 transition-colors py-2">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-[#f8fbfc]">
      {/* Header */}
      <div className="flex items-center bg-[#f8fbfc] p-4 pb-2 justify-between">
        <button
          onClick={() => router.push('/')}
          className="text-[#0d191c] flex size-12 shrink-0 items-center hover:bg-[#e7f1f4] rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
          </svg>
        </button>
        <h2 className="text-[#0d191c] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
          Profile
        </h2>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Profile Header */}
        <div className="p-4">
          <div className="flex flex-col gap-4 items-center">
            <div className="flex gap-4 flex-col items-center">
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-sm"
              />
              <div className="flex flex-col items-center justify-center text-center">
                <h1 className="text-[#0d191c] text-[22px] font-bold leading-tight tracking-[-0.015em]">
                  {userProfile.name}
                </h1>
                <p className="text-[#498a9c] text-base font-normal leading-normal">
                  {userProfile.university}
                </p>
                <p className="text-[#498a9c] text-base font-normal leading-normal">
                  {userProfile.major} • {userProfile.year}
                </p>
                {userProfile.bio && (
                  <p className="text-[#498a9c] text-sm mt-2 max-w-md leading-relaxed">
                    {userProfile.bio}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleEditProfile}
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#e7f1f4] text-[#0d191c] text-sm font-bold leading-normal tracking-[0.015em] w-full max-w-[480px] hover:bg-[#d4e4e8] transition-colors"
            >
              <span className="truncate">Edit profile</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="pb-3">
          <div className="flex border-b border-[#cee3e8] px-4 gap-8">
            <TabButton
              label="My Resources"
              isActive={activeTab === 'resources'}
              onClick={() => setActiveTab('resources')}
            />
            <TabButton
              label="My Classes"
              isActive={activeTab === 'classes'}
              onClick={() => setActiveTab('classes')}
            />
            <TabButton
              label="Account Settings"
              isActive={activeTab === 'settings'}
              onClick={() => setActiveTab('settings')}
            />
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === 'resources' && (
            <div className="space-y-3">
              <h3 className="text-[#0d191c] text-lg font-bold leading-tight tracking-[-0.015em] mb-4">
                My Resources ({resources.length})
              </h3>
              {resources.map(resource => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}

          {activeTab === 'classes' && (
            <div className="space-y-3">
              <h3 className="text-[#0d191c] text-lg font-bold leading-tight tracking-[-0.015em] mb-4">
                My Classes ({enrolledClasses.length})
              </h3>
              {enrolledClasses.map(classItem => (
                <ClassCard key={classItem.id} classItem={classItem} />
              ))}
            </div>
          )}

          {activeTab === 'settings' && <SettingsSection />}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ProfilePage;

