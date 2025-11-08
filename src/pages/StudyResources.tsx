/* eslint-disable @typescript-eslint/no-unused-vars */
import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import UploadMaterialModal from '../pages/UploadMaterialModal'; // Import the modal

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
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false); // Modal state
  const [selectedFilters, setSelectedFilters] = useState({
    course: '',
    department: '',
    year: ''
  });

  const studyResources: StudyResource[] = [
    {
      id: 1,
      title: "Past Exam Questions",
      type: "PDF",
      uploadedBy: "Alex",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwGK051C7lPu2XgK_r8y1G-BEki81m6jIJCB6ITOhnhtRAjKtMo2YwwNA5zw1sJzdX0PBPuK58q3i7RaFe1xXbxms3y6M1dYynnP9Y9_bm0-lsvPFQvwM0Pv7lzxt3DGNDIBHKGyqd744WHBAfU2_aDGbJ2-Hcld5wUHqspAYqEDbs220YotzMAlwg_VryoSDuTQ0sVQRW68HMiORxD5VRnlryhERQWtSjYoShAbD8NGSchKaXwcukhGk8S3nmHrKV9LJVE40oRJY"
    },
    // ... other resources
  ];

  const navItems = [
    { 
      icon: "House", 
      label: "Home", 
      active: false,
      onClick: () => navigate('/home')
    },
    { 
      icon: "BookOpen", 
      label: "Study", 
      active: true,
      onClick: () => navigate('/study')
    },
    { 
      icon: "UsersThree", 
      label: "Classes", 
      active: false,
      onClick: () => navigate('/classes')
    },
    { 
      icon: "Users", 
      label: "Community", 
      active: false,
      onClick: () => navigate('/community')
    },
    { 
      icon: "User", 
      label: "Profile", 
      active: false,
      onClick: () => navigate('/profile')
    }
  ];

  const handleAddResource = () => {
    setIsUploadModalOpen(true); // Open the modal
  };

  const handleUploadSubmit = (uploadData: UploadData) => {
    console.log('Upload data:', uploadData);
    // Handle the upload logic here (API call, etc.)
    // You can add your upload logic here
    setIsUploadModalOpen(false); // Close modal after submit
  };

  const handleUploadClose = () => {
    setIsUploadModalOpen(false); // Close modal
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterClick = (filterType: string) => {
    // Filter logic would go here
    console.log(`Filter by ${filterType} clicked`);
  };

  const handleResourceClick = (resourceId: number) => {
    navigate(`/resource/${resourceId}`);
  };

  return (
    <div 
      className="min-h-screen bg-[#f8fbfc]"
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
        <div className="flex gap-3 p-3 overflow-x-hidden">
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
          {studyResources.map((resource) => (
            <div 
              key={resource.id} 
              className="p-4 cursor-pointer hover:bg-[#f0f7f9] transition-colors"
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
                  className="flex-1 w-full transition-shadow bg-center bg-no-repeat bg-cover shadow-md aspect-video rounded-xl hover:shadow-lg"
                  style={{ backgroundImage: `url("${resource.image}")` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Add Resource Floating Button */}
        <div className="flex justify-end px-5 pb-5 overflow-hidden">
          <button
            onClick={handleAddResource}
            className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-[#0ba9d5] text-[#f8fbfc] text-base font-bold leading-normal tracking-[0.015em] min-w-0 gap-4 pl-4 pr-6 hover:bg-[#0a95c0] transition-colors shadow-lg hover:shadow-xl"
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

      {/* Upload Material Modal */}
      <UploadMaterialModal
        isOpen={isUploadModalOpen}
        onClose={handleUploadClose}
        onSubmit={handleUploadSubmit}
      />
    </div>
  );
};

export default StudyResources;