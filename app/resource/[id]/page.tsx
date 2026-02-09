'use client';

/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

interface Review {
  id: number;
  userName: string;
  userAvatar: string;
  timeAgo: string;
  rating: number;
  comment: string;
}

interface RelatedResource {
  id: number;
  title: string;
  image: string;
  uploader: string;
}

interface ResourceData {
  id: string;
  courseCode: string;
  title: string;
  type: 'past-questions' | 'lecture-notes' | 'summaries';
  author: string;
  timeAgo: string;
  rating: number;
  downloads: number;
  thumbnail: string;
  description: string;
  fileSize: string;
  pages: number;
}

const ResourceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [resource, setResource] = useState<ResourceData | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data - in a real app, you'd fetch this based on the ID
  const mockResources: ResourceData[] = [
    {
      id: '1',
      courseCode: 'CSC 401',
      title: 'Final Year Project',
      type: 'past-questions',
      author: 'John D.',
      timeAgo: '2 days ago',
      rating: 4.2,
      downloads: 142,
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZu0RCNgSV5BydXkjI5mmOkMSnEGLdKqalB7w8B-Y19EbTO0zLBvYJQi2woE7uPDoOrw84OFRHx8F8-kxKCsmOBUqE8eeVY-1MOATuDPvATd26UHrM4AaCIDtQGtsoZ4-Z-AHL4fCrkrmxQKCqtGA-wvTDxPI3OKGVK5qdonQyy1F0uoDd7Bt4At-fmevG4jaRT83FVU5VEupGmrbprqNfpQIr5aL41OsxbgLYz1Wqq0a53usfD3pJj3wjm60OrICDuRn0kRHrpDEY',
      description: 'Complete final year project documentation and research paper for CSC 401 course.',
      fileSize: '2.4 MB',
      pages: 12
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
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB61QZVa9NzDvEzjdXB8WidlrIS_YdegsyustTm3cgeXJbt7dMkrJ_Hh4LmcdAEQwjiHaZU74DPzYwCmYrBGxUEXtq97qq2ve_cD8pu7X3no1IVj5-mPENKcxW2SfL5bwbnEVrdVak0Ds_AYfNuWkmYVU_dzyrDkdBxKXu2oUeItQAbGJKcwmY70mfYO1jhKir6t7YlU-BK-DhpQteleQRI6_RJCp1LVRU_tpiWGMFFsepLBJCwIu9OccslHmZiIQsGwAfEaCey1q2H',
      description: 'Comprehensive lecture notes covering all topics in Calculus II.',
      fileSize: '1.8 MB',
      pages: 45
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
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMdBVTzoLtGulGz2msGl6hl07W7gpDpNwyQtAMFfRijxDRbH8bnnyWNB-cSS0r9T7Cnd4zOiE302VD_FCPP3FWWUKuHZnm4pYKQBDNoIsLmsJtTMmtUJ1Uh8a8aDNBjfdq_NbrKaXj6AGDmNA7m5knGZR6gG5Mrf_YzlPEPtGsNl1-EJRHFI-nXx7NnaA_G9BBldFvSdL7p21E1RHZCYHeqz_M4Ot_SOa3WIho__u0-xJAF7t85SPwXAHBXgxIRzEqaiHkrt98tKUH',
      description: 'Past examination questions and solutions for Physics I.',
      fileSize: '3.1 MB',
      pages: 28
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
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6HEsaay8qpHJRZGmNOUvU4oKQTX_gLe_zH6cxAUSr9ADA-0XEHdLIly5PZyD1i7-arqlyNUR0ShRXkH8bvjC2ciWcf1lOFjI9jmOKvScuwIfTGYLpiS-7ypn9RxK_T0OD-QCAvqhyaD20AD1pT7mjAxzzTa9BfgFOM4EfKb9wquKCOW8rZlu3WM_X-xaICCagCdxgb9tYB0sc52fh2htibY5q3Oec1ztlliewGwN3QskjiJlXnmIA7xmKv2SSWrhC8Xpkmi343xU3',
      description: 'Condensed summaries of key Chemistry II concepts and formulas.',
      fileSize: '1.2 MB',
      pages: 15
    }
  ];

  useEffect(() => {
    // Simulate API call to fetch resource data
    const fetchResource = () => {
      setLoading(true);
      setTimeout(() => {
        const foundResource = mockResources.find(res => res.id === id);
        setResource(foundResource || null);
        setLoading(false);
      }, 500);
    };

    fetchResource();
  }, [id]);

  const reviews: Review[] = [
    {
      id: 1,
      userName: "Sophia L.",
      userAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvX8RVoJ-V_u2QA5lQL410LhRaG2rtuK173d4ZF4MfPvMEIidzL7HQCxteBi4xBgvHe9fzKpn6j1DgSqeu_qJsUsPCFhBZWQ5cWB_ueyQbOXZ8PmQvQzcAYNri3kmhSZva2VdRsFg5KPKwEaTJw0e76HdKQN3HTGEaBa4OaEtc6sZtR8JVxtG73DRUWAXiIUIRu7EC8W--nSatKTH8ZXnaaddoxoOJf0nwGl773cRJAfj9rRePljLGJW3BR9fAMY-_xWa81B7rl0hC",
      timeAgo: "1 week ago",
      rating: 5,
      comment: "Very helpful for midterms!"
    },
    {
      id: 2,
      userName: "Ethan M.",
      userAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDczySBv7de0tzOQ0sakLJaE5HJY1tZsd0A_YltnzlOk2sJwDPBAFI8MmWX06suMHZtC2w1uMzhzqYbxUMElmh6u0wHbum5y38L2W6Rg5qrrYFD5PiFu8PIHoAa-EpWFZuLgv98pAkxgAxZfp8XnPnzqjkzlnPCx2Mr6kfr1CQ5SkueVxODvpkqlqySjZk0CIVbXgAZsdP9uR2k38miAbFHZ_NRp5k7A5k5XN5lGP5CvZf6Y696pOqV47tFEGbNFq2VgI7JsjGAy9pt",
      timeAgo: "2 weeks ago",
      rating: 4,
      comment: "Clear and well-organized"
    }
  ];

  const relatedResources: RelatedResource[] = [
    {
      id: 1,
      title: "CSC 401 - Past Exam",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwEoD6Cl9mQJY0RgV50IaCXWvY5HL5ey2PZ1oG1NmwW5ZCEMZbeeae3kfbvliS1rGodw3rOfFCkWc_IaNpHhfW21YTxhTc6-CEm8dMcO_-w-E-NBCX5XeYTITbzi6Hq9g8oN2hYOC0JApGZahoRbec7OCNXHOHFCaSbzuXIRChBt5otwd-OMUasemRBUROhm_-JA5COJi8GIP5ULrvl4nsQL56QDhYo24nk1RH5j8nBTw85JsomQHqSaUOLx3WG-GOd8iM_CGPFowc",
      uploader: "Sarah C."
    },
    {
      id: 2,
      title: "CSC 401 - Study Notes",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqER7PVCwSl8-d9OZiOtmsSa8P514ejVA_ivKc79Ck3_ae2UeI0MaSJbCUsnCEXzETwHkZepqLfYFAUtcL5XGFku6-mz1PnON1duRT-V3dj2Fyxxt5-yimBg2J6b0WHuvQXriSnYatjaa-tRftPH-ITQYaVIwvhczVx2oNbrU9S4eS0lYvFbSyUXAaTptsD-hnzK3GsWc3pCJ-hEeflEo0TNFakS4FwM0gRgFtr2z1eIRTADi6_iZEGEs91My4ze2X8Hm_Snfh1Ex_",
      uploader: "David R."
    },
    {
      id: 3,
      title: "CSC 401 - Assignment",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBOeSTjdKnQ4sp23vRpQDlU_cCcRNMEkQzFw-NoUsHoBSw1VF-WZJ30kXc8imhmXFQIzCV3PMJYyGP9QnjZ-Xfde5LLOcK3MK_WMM0KTElMMhWsAF1f1SQH21ayMjwjtaILlm6L80aKPv5xm5FVO5PjdnwXwgOnhT3lDG_uFOApYVI7LeBgDa9dKqIHlbi5NViQsgGaP2B_LVhZCEeJIG3NyjWMMOYDiUNXHxjSvbzAucr27AnQkbfSTkAcrjZMjOWnLtfkY0cye2ge",
      uploader: "Olivia B."
    }
  ];

  const handleRatingClick = (rating: number) => {
    setUserRating(rating);
  };

  const handleSubmitReview = () => {
    console.log('Review submitted:', { rating: userRating, comment: reviewText });
    setReviewText('');
    setUserRating(0);
  };

  const handleDownload = () => {
    console.log('Downloading resource:', resource?.title);
    // Add actual download logic here
  };

  const handleBackClick = () => {
    router.back(); // Go back to previous page
  };

  const handleNotificationClick = () => {
    router.push('/notifications');
  };

  const handleRelatedResourceClick = (resourceId: number) => {
    router.push(`/resource/${resourceId}`);
  };

  const renderStars = (rating: number, size: number = 20) => {
    return Array.from({ length: 5 }, (_, index) => {
      const isFilled = index < rating;
      return (
        <div key={index} className={`${isFilled ? 'text-yellow-400' : 'text-gray-300'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width={`${size}px`} height={`${size}px`} fill="currentColor" viewBox="0 0 256 256">
            <path
              d={isFilled
                ? "M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"
                : "M239.2,97.29a16,16,0,0,0-13.81-11L166,81.17,142.72,25.81h0a15.95,15.95,0,0,0-29.44,0L90.07,81.17,30.61,86.32a16,16,0,0,0-9.11,28.06L66.61,153.8,53.09,212.34a16,16,0,0,0,23.84,17.34l51-31,51.11,31a16,16,0,0,0,23.84-17.34l-13.51-58.6,45.1-39.36A16,16,0,0,0,239.2,97.29Zm-15.22,5-45.1,39.36a16,16,0,0,0-5.08,15.71L187.35,216v0l-51.07-31a15.9,15.9,0,0,0-16.54,0l-51,31h0L82.2,157.4a16,16,0,0,0-5.08-15.71L32,102.35a.37.37,0,0,1,0-.09l59.44-5.14a16,16,0,0,0,13.35-9.75L128,32.08l23.2,55.29a16,16,0,0,0,13.35,9.75L224,102.26S224,102.32,224,102.33Z"
              }
            />
          </svg>
        </div>
      );
    });
  };

  // Navigation items for BottomNav
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading resource...</div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Resource not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header - Using only valid props */}
      <Header
        title={resource.courseCode}
        showBackButton={true}
        showNotifications={true}
        onBackClick={handleBackClick}
        onNotificationClick={handleNotificationClick}
      />

      {/* Main Content with padding for fixed header and bottom nav */}
      <div className="pt-20 pb-24">
        {/* Resource Header Image */}
        <div className="@container">
          <div className="@[480px]:px-4 @[480px]:py-3">
            <div
              className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden bg-white @[480px]:rounded-lg min-h-[218px]"
              style={{ backgroundImage: `url("${resource.thumbnail}")` }}
            />
          </div>
        </div>

        <p className="text-[#616f89] text-sm font-normal leading-normal pb-3 pt-1 px-4">
          PDF • {resource.fileSize} • {resource.pages} pages
        </p>

        <h3 className="text-[#111318] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
          {resource.title}
        </h3>

        <p className="text-[#616f89] text-base font-normal leading-normal px-4 pb-4">
          {resource.description}
        </p>

        {/* Metadata Section */}
        <h3 className="text-[#111318] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
          Metadata
        </h3>
        <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
          <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dbdfe6] py-5">
            <p className="text-[#616f89] text-sm font-normal leading-normal">Uploader</p>
            <p className="text-[#111318] text-sm font-normal leading-normal">{resource.author}</p>
          </div>
          <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dbdfe6] py-5">
            <p className="text-[#616f89] text-sm font-normal leading-normal">Upload date</p>
            <p className="text-[#111318] text-sm font-normal leading-normal">{resource.timeAgo}</p>
          </div>
          <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dbdfe6] py-5">
            <p className="text-[#616f89] text-sm font-normal leading-normal">Rating</p>
            <p className="text-[#111318] text-sm font-normal leading-normal">
              ⭐⭐⭐⭐☆ ({resource.rating}) from {Math.floor(resource.downloads * 0.1)} ratings
            </p>
          </div>
          <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dbdfe6] py-5">
            <p className="text-[#616f89] text-sm font-normal leading-normal">Download count</p>
            <p className="text-[#111318] text-sm font-normal leading-normal">📥 {resource.downloads} downloads</p>
          </div>
        </div>

        {/* Download Button */}
        <div className="flex px-4 py-3">
          <button
            onClick={handleDownload}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 flex-1 bg-[#276cec] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-blue-700 transition-colors duration-200"
          >
            <span className="truncate">Download</span>
          </button>
        </div>

        {/* Rating Section */}
        <h3 className="text-[#111318] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
          Rate this resource
        </h3>
        <div className="flex flex-wrap justify-between gap-4 px-4 py-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => handleRatingClick(rating)}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${userRating >= rating ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                }`}
            >
              <div className={`${userRating >= rating ? 'text-blue-600' : 'text-[#616f89]'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path
                    d={userRating >= rating
                      ? "M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"
                      : "M239.2,97.29a16,16,0,0,0-13.81-11L166,81.17,142.72,25.81h0a15.95,15.95,0,0,0-29.44,0L90.07,81.17,30.61,86.32a16,16,0,0,0-9.11,28.06L66.61,153.8,53.09,212.34a16,16,0,0,0,23.84,17.34l51-31,51.11,31a16,16,0,0,0,23.84-17.34l-13.51-58.6,45.1-39.36A16,16,0,0,0,239.2,97.29Zm-15.22,5-45.1,39.36a16,16,0,0,0-5.08,15.71L187.35,216v0l-51.07-31a15.9,15.9,0,0,0-16.54,0l-51,31h0L82.2,157.4a16,16,0,0,0-5.08-15.71L32,102.35a.37.37,0,0,1,0-.09l59.44-5.14a16,16,0,0,0,13.35-9.75L128,32.08l23.2,55.29a16,16,0,0,0,13.35,9.75L224,102.26S224,102.32,224,102.33Z"
                    }
                  />
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* Review Input */}
        <h3 className="text-[#111318] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
          Reviews
        </h3>
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col flex-1 min-w-40">
            <input
              placeholder="Add review (optional)"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111318] focus:outline-0 focus:ring-2 focus:ring-blue-500 border border-[#dbdfe6] bg-white focus:border-blue-500 h-14 placeholder:text-[#616f89] p-[15px] text-base font-normal leading-normal transition-colors duration-200"
            />
          </label>
          <button
            onClick={handleSubmitReview}
            disabled={!userRating}
            className="flex items-center justify-center px-6 py-3 font-medium text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </div>

        {/* Existing Reviews */}
        <div className="flex flex-col gap-8 p-4 overflow-x-hidden bg-white">
          {reviews.map((review) => (
            <div key={review.id} className="flex flex-col gap-3 bg-white">
              <div className="flex items-center gap-3">
                <div
                  className="bg-center bg-no-repeat bg-cover rounded-full aspect-square size-10"
                  style={{ backgroundImage: `url("${review.userAvatar}")` }}
                />
                <div className="flex-1">
                  <p className="text-[#111318] text-base font-medium leading-normal">{review.userName}</p>
                  <p className="text-[#616f89] text-sm font-normal leading-normal">{review.timeAgo}</p>
                </div>
              </div>
              <div className="flex gap-0.5">
                {renderStars(review.rating)}
              </div>
              <p className="text-[#111318] text-base font-normal leading-normal">{review.comment}</p>
            </div>
          ))}
        </div>

        {/* Related Resources */}
        <h3 className="text-[#111318] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
          You might also like
        </h3>
        <div className="flex overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-stretch gap-3 p-4">
            {relatedResources.map((relatedResource) => (
              <div
                key={relatedResource.id}
                className="flex flex-col flex-1 h-full gap-4 rounded-lg cursor-pointer min-w-40"
                onClick={() => handleRelatedResourceClick(relatedResource.id)}
              >
                <div
                  className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-lg flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300"
                  style={{ backgroundImage: `url("${relatedResource.image}")` }}
                />
                <div>
                  <p className="text-[#111318] text-base font-medium leading-normal">{relatedResource.title}</p>
                  <p className="text-[#616f89] text-sm font-normal leading-normal">Uploaded by {relatedResource.uploader}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Navigation */}
      <BottomNav navItems={navItems} />
    </div>
  );
};

export default ResourceDetail;