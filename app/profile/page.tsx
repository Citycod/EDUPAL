'use client';

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import { supabase } from '@/lib/supabase';

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

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [enrolledClasses, setEnrolledClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // Fetch Profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profile) {
            setUserProfile({
              id: profile.id,
              name: profile.full_name || user.email?.split('@')[0] || 'Student',
              avatar: profile.avatar_url || 'https://lh3.googleusercontent.com/aida-public/default-avatar',
              university: profile.university || 'University of Lagos', // Default for now if missing
              major: 'Computer Science', // TODO: Fetch from department table based on department_id
              year: profile.level || '1st Year',
              email: user.email,
              joinDate: new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
              bio: "Student at EduPal" // Placeholder as bio might not be in schema yet
            });
          }

          // Fetch Enrolled Classes
          const { data: enrollments } = await supabase
            .from('enrollments')
            .select(`
                *,
                courses (id, title, course_code, instructor_name)
            `)
            .eq('user_id', user.id);

          if (enrollments) {
            const formattedClasses = enrollments.map((e: any) => ({
              id: e.courses.id,
              title: e.courses.title,
              code: e.courses.course_code,
              instructor: e.courses.instructor_name || 'TBA',
              schedule: 'Weekly', // Placeholder
              progress: 0 // Placeholder
            }));
            setEnrolledClasses(formattedClasses);
          }

          // Fetch Resources (My Uploads)
          const { data: fetchedResources } = await supabase
            .from('resources')
            .select('*')
            .eq('uploader_id', user.id)
            .order('created_at', { ascending: false });

          if (fetchedResources) {
            const formattedResources = fetchedResources.map((r: any) => ({
              id: r.id,
              title: r.title,
              subtitle: r.course_code || r.category || 'Resource',
              image: r.image_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEfDr6DXYNNRgePw7Wp-A6vcDLVI20CbEItil9JAHjqWzEp90_SzmvXjZW34RKJasAbCwdtaTXWdOJ_dGUI0ItLlviatSIrPpRy9oRGMhRTe92Qj2mU0DXXfbUIuW1o5cy_yud1J0-O314Z1BUJ04_EJMXdm6-Hy50G4cF1COH98Lj2t-QqcaQXZv6MSS8VAnI8ddBjqBj-VR0c1TSm2VVf5TH8FhVQyFxkQr2aNT5Flqny7apahXOaABR_O37CbOZ4MLxL8QPD0k',
              type: r.type || 'material',
              lastAccessed: new Date(r.created_at).toLocaleDateString(),
              progress: 0
            }));
            setResources(formattedResources);
          }
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
            <p className="text-[#0d191c] text-sm">{userProfile?.email}</p>
          </div>
          <div>
            <label className="text-xs text-[#498a9c] font-medium">University</label>
            <p className="text-[#0d191c] text-sm">{userProfile?.university}</p>
          </div>
          <div>
            <label className="text-xs text-[#498a9c] font-medium">Member Since</label>
            <p className="text-[#0d191c] text-sm">{userProfile?.joinDate}</p>
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f8fbfc] text-slate-500">Loading Profile...</div>;
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-[#f8fbfc]">
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
                src={userProfile?.avatar || "https://lh3.googleusercontent.com/aida-public/default-avatar"}
                alt={userProfile?.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-sm"
              />
              <div className="flex flex-col items-center justify-center text-center">
                <h1 className="text-[#0d191c] text-[22px] font-bold leading-tight tracking-[-0.015em]">
                  {userProfile?.name}
                </h1>
                <p className="text-[#498a9c] text-base font-normal leading-normal">
                  {userProfile?.university}
                </p>
                <p className="text-[#498a9c] text-base font-normal leading-normal">
                  {userProfile?.major} • {userProfile?.year}
                </p>
                {userProfile?.bio && (
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

