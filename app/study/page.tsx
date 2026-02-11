'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { supabase } from '@/lib/supabase';

interface StudyResource {
  id: number;
  title: string;
  type: string;
  uploadedBy: string;
  image: string;
}

interface UploadData {
  title: string;
  department: string;
  courseCode: string;
  description: string;
  file: File | null;
}

const StudyResources: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [resources, setResources] = useState<StudyResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Map Supabase data to local interface
        const formattedResources: StudyResource[] = data.map((res: any) => ({
          id: res.id,
          title: res.title,
          type: res.type || 'PDF', // Default if not in DB
          uploadedBy: 'EduPal User', // Need to join with profiles for real name
          image: res.image_url || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop'
        }));

        setResources(formattedResources);
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const navItems = [
    {
      icon: "House",
      label: "Home",
      active: false,
      onClick: () => router.push('/home')
    },
    {
      icon: "BookOpen",
      label: "Study",
      active: true,
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

  const handleAddResource = () => {
    setIsUploadModalOpen(true);
  };

  const handleUploadSubmit = (uploadData: UploadData) => {
    console.log('Upload data:', uploadData);
    // Handle the upload logic here (API call, etc.)
    setIsUploadModalOpen(false);
  };

  const handleUploadClose = () => {
    setIsUploadModalOpen(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterClick = (filterType: string) => {
    console.log(`Filter by ${filterType} clicked`);
  };

  const handleResourceClick = (resourceId: number) => {
    router.push(`/resource/${resourceId}`);
  };

  // Filter resources based on search query
  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f8fbfc] text-slate-500">Loading Resources...</div>;
  }

  return (
    <div
      className="min-h-[100dvh] bg-[#f8fbfc]"
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      {/* Fixed Header */}
      <Header
        title="Study Resources"
        showAddButton={true}
        onAddClick={handleAddResource}
      />

      {/* Main Content with padding for fixed header and bottom nav */}
      <div className="pt-20 pb-24">
        {/* Search Bar */}
        <div className="px-4 py-3">
          <label className="flex flex-col w-full h-12 min-w-40">
            <div className="flex items-stretch flex-1 w-full h-full rounded-xl">
              <div className="text-[#498a9c] flex border-none bg-[#e7f1f4] items-center justify-center pl-4 rounded-l-xl border-r-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search for resources"
                value={searchQuery}
                onChange={handleSearch}
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d191c] focus:outline-0 focus:ring-0 border-none bg-[#e7f1f4] focus:border-none h-full placeholder:text-[#498a9c] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal focus:bg-[#dde9ec] transition-colors"
              />
            </div>
          </label>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-3 p-3 overflow-x-auto">
          <button
            onClick={() => handleFilterClick('course')}
            className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#e7f1f4] pl-4 pr-2 hover:bg-[#dde9ec] transition-colors"
          >
            <p className="text-[#0d191c] text-sm font-medium leading-normal">Course</p>
            <div className="text-[#0d191c]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
              </svg>
            </div>
          </button>
          <button
            onClick={() => handleFilterClick('department')}
            className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#e7f1f4] pl-4 pr-2 hover:bg-[#dde9ec] transition-colors"
          >
            <p className="text-[#0d191c] text-sm font-medium leading-normal">Department</p>
            <div className="text-[#0d191c]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
              </svg>
            </div>
          </button>
          <button
            onClick={() => handleFilterClick('year')}
            className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#e7f1f4] pl-4 pr-2 hover:bg-[#dde9ec] transition-colors"
          >
            <p className="text-[#0d191c] text-sm font-medium leading-normal">Year</p>
            <div className="text-[#0d191c]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
              </svg>
            </div>
          </button>
        </div>

        {/* Resources List */}
        <div className="flex-1">
          {filteredResources.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="text-[#498a9c] mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="64px" height="64px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M216,40H40A16,16,0,0,0,24,56V184a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,144H40V56H216V184ZM184,88a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,88Zm0,32a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,120Zm0,32a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,152Z" />
                </svg>
              </div>
              <p className="text-[#498a9c] text-lg font-medium text-center">
                No resources found matching your search
              </p>
            </div>
          ) : (
            filteredResources.map((resource) => (
              <div
                key={resource.id}
                className="p-4 cursor-pointer hover:bg-[#f0f7f9] transition-colors border-b border-[#e7f1f4]"
                onClick={() => handleResourceClick(resource.id)}
              >
                <div className="flex items-stretch justify-between gap-4 rounded-xl">
                  <div className="flex flex-col gap-1 flex-[2_2_0px]">
                    <p className="text-[#0d191c] text-base font-bold leading-tight">{resource.title}</p>
                    <p className="text-[#498a9c] text-sm font-normal leading-normal">
                      {resource.type} · Uploaded by {resource.uploadedBy}
                    </p>
                  </div>
                  <div
                    className="flex-1 w-full transition-shadow bg-center bg-no-repeat bg-cover shadow-md aspect-video rounded-xl hover:shadow-lg min-w-[100px] max-w-[120px]"
                    style={{ backgroundImage: `url("${resource.image}")` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Resource Floating Button */}
        <div className="flex justify-end px-5 pb-5 overflow-hidden sticky bottom-24">
          <button
            onClick={handleAddResource}
            className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-primary text-primary-dark text-base font-bold leading-normal tracking-[0.015em] min-w-0 gap-4 pl-4 pr-6 hover:bg-primary-light transition-colors shadow-lg hover:shadow-xl"
          >
            <div className="text-[#f8fbfc]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
              </svg>
            </div>
            <span className="truncate">Add Resource</span>
          </button>
        </div>
      </div>

      {/* Fixed Bottom Navigation */}
      <BottomNav navItems={navItems} />

      {/* Upload Material Modal - TODO: Create this component */}
      {/* <UploadMaterialModal
        isOpen={isUploadModalOpen}
        onClose={handleUploadClose}
        onSubmit={handleUploadSubmit}
      /> */}
    </div>
  );
};

export default StudyResources;

