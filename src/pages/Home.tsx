/* eslint-disable @typescript-eslint/no-unused-vars */
import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import FloatingActionButton from '../components/FloatingActionButton';

interface Resource {
  id: string;
  courseCode: string;
  title: string;
  type: 'past-questions' | 'lecture-notes' | 'summaries';
  author: string;
  timeAgo: string;
  rating: number;
  downloads: number;
  thumbnail: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const resources: Resource[] = [
    {
      id: '1',
      courseCode: 'CSC 401',
      title: 'Final Year Project',
      type: 'past-questions',
      author: 'John D.',
      timeAgo: '2 days ago',
      rating: 4.2,
      downloads: 142,
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAF8_fCDzlQG90-l_z-Azc2WTzpkpuoFZmx2CuP9culc6FQuo19aZzNqd131cBLq_QK-9ZKEDFCmWP79GQM3T4DubNjk01kNh_et7J6dkLIpH8YwyKGCJKwZNndH9YNqpoUmJGhDs99euO8OfZsrkm5-j33YlfqxISUu-CJVtoqgPnzPYQIHidiS5mr9g3X5P-ldbBrJKWJuXihNSLBY451neC20DWR7utToy83bdD-We9QVAErRzpvvC3XsuPTkAkK3wk5gXJQ5KXR'
    },
    {
      id: '2',
      courseCode: 'MTH 201',
      title: 'Calculus II Notes',
      type: 'lecture-notes',
      author: 'Sarah M.',
      timeAgo: '3 days ago',
      rating: 4.5,
      downloads: 210,
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB61QZVa9NzDvEzjdXB8WidlrIS_YdegsyustTm3cgeXJbt7dMkrJ_Hh4LmcdAEQwjiHaZU74DPzYwCmYrBGxUEXtq97qq2ve_cD8pu7X3no1IVj5-mPENKcxW2SfL5bwbnEVrdVak0Ds_AYfNuWkmYVU_dzyrDkdBxKXu2oUeItQAbGJKcwmY70mfYO1jhKir6t7YlU-BK-DhpQteleQRI6_RJCp1LVRU_tpiWGMFFsepLBJCwIu9OccslHmZiIQsGwAfEaCey1q2H'
    },
    {
      id: '3',
      courseCode: 'PHY 101',
      title: 'Physics I Past Questions',
      type: 'past-questions',
      author: 'Alex R.',
      timeAgo: '5 days ago',
      rating: 4.0,
      downloads: 185,
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMdBVTzoLtGulGz2msGl6hl07W7gpDpNwyQtAMFfRijxDRbH8bnnyWNB-cSS0r9T7Cnd4zOiE302VD_FCPP3FWWUKuHZnm4pYKQBDNoIsLmsJtTMmtUJ1Uh8a8aDNBjfdq_NbrKaXj6AGDmNA7m5knGZR6gG5Mrf_YzlPEPtGsNl1-EJRHFI-nXx7NnaA_G9BBldFvSdL7p21E1RHZCYHeqz_M4Ot_SOa3WIho__u0-xJAF7t85SPwXAHBXgxIRzEqaiHkrt98tKUH'
    },
    {
      id: '4',
      courseCode: 'CHM 102',
      title: 'Chemistry II Summaries',
      type: 'summaries',
      author: 'Emily L.',
      timeAgo: '7 days ago',
      rating: 4.8,
      downloads: 250,
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6HEsaay8qpHJRZGmNOUvU4oKQTX_gLe_zH6cxAUSr9ADA-0XEHdLIly5PZyD1i7-arqlyNUR0ShRXkH8bvjC2ciWcf1lOFjI9jmOKvScuwIfTGYLpiS-7ypn9RxK_T0OD-QCAvqhyaD20AD1pT7mjAxzzTa9BfgFOM4EfKb9wquKCOW8rZlu3WM_X-xaICCagCdxgb9tYB0sc52fh2htibY5q3Oec1ztlliewGwN3QskjiJlXnmIA7xmKv2SSWrhC8Xpkmi343xU3'
    }
  ];

  
const handleResourceClick = (resourceId: string) => {
  navigate(`/resource/${resourceId}`);
};
  const handleUploadClick = () => {
    navigate('/upload');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'past-questions':
        return 'bg-blue-100 text-blue-800';
      case 'lecture-notes':
        return 'bg-green-100 text-green-800';
      case 'summaries':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.courseCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || resource.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white justify-between overflow-x-hidden font-['Manrope','Noto_Sans',sans-serif]">
      {/* Header - Using only props that exist in Header component */}
      <Header title="EduPal" showBackButton={false} />

      {/* Main Content */}
      <div className="flex-1 pb-24">
        {/* Search Bar */}
        <div className="px-4 py-3">
          <label className="flex flex-col min-w-40 h-12 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-[#f0f2f4] focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all duration-200">
              <div className="text-[#616f89] flex items-center justify-center pl-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                </svg>
              </div>
              <input
                placeholder="Search courses, materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111318] focus:outline-0 border-none bg-transparent h-full placeholder:text-[#616f89] px-4 text-base font-normal leading-normal"
              />
            </div>
          </label>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-3 px-4 py-3 overflow-x-auto">
          {[
            { id: 'all', label: 'All', icon: '📚' },
            { id: 'past-questions', label: 'Past Questions', icon: '📝' },
            { id: 'lecture-notes', label: 'Lecture Notes', icon: '🧾' },
            { id: 'summaries', label: 'Summaries', icon: '📋' }
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 transition-all duration-200 ${
                activeFilter === filter.id 
                  ? 'bg-[#276cec] text-white shadow-lg shadow-blue-500/25' 
                  : 'bg-[#f0f2f4] text-[#111318] hover:bg-gray-200 hover:scale-105'
              }`}
            >
              <span className="text-sm">{filter.icon}</span>
              <p className="text-sm font-medium leading-normal whitespace-nowrap">{filter.label}</p>
            </button>
          ))}
        </div>

        {/* Resources Count */}
        <div className="px-4 py-2">
          <p className="text-[#616f89] text-sm font-normal">
            {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Resources List */}
        <div className="pb-4">
          {filteredResources.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-[#111318] text-lg font-bold mb-2">No resources found</h3>
              <p className="text-[#616f89] text-base">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            filteredResources.map((resource) => (
              <div 
                key={resource.id} 
                className="px-4 py-3 border-b border-[#f0f2f4] cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors duration-200"
                onClick={() => handleResourceClick(resource.id)}
              >
                <div className="flex items-stretch justify-between gap-4">
                  {/* Thumbnail */}
                  <div 
                    className="w-20 h-20 bg-center bg-no-repeat bg-cover rounded-xl flex-shrink-0 shadow-sm"
                    style={{ backgroundImage: `url("${resource.thumbnail}")` }}
                  ></div>
                  
                  {/* Content */}
                  <div className="flex flex-col gap-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                        {resource.type.replace('-', ' ')}
                      </span>
                      <span className="text-[#616f89] text-xs font-medium">
                        {resource.courseCode}
                      </span>
                    </div>
                    
                    <h3 className="text-[#111318] text-base font-bold leading-tight truncate">
                      {resource.title}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-[#616f89] text-xs font-normal">
                      <span>By {resource.author}</span>
                      <span>•</span>
                      <span>{resource.timeAgo}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-[#616f89] text-xs font-normal">
                      <span className="flex items-center gap-1">
                        ⭐ {resource.rating}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        📥 {resource.downloads}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton onClick={handleUploadClick} />

      {/* Bottom Navigation - Using without props if they don't exist */}
      <BottomNav />
    </div>
  );
};

export default Home;