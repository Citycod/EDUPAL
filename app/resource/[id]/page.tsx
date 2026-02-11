'use client';

/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

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
  const [resource, setResource] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('resources')
          .select(`
            *,
            uploader:profiles(full_name),
            course:courses(course_code)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          setResource({
            id: data.id,
            courseCode: data.course?.course_code || 'N/A',
            title: data.title,
            type: data.type,
            category: data.category,
            author: data.uploader?.full_name || 'EduPal User',
            timeAgo: new Date(data.created_at).toLocaleDateString(),
            rating: data.rating || 4.5, // Default if no ratings
            downloads: data.downloads_count || 0,
            thumbnail: data.thumbnail_url || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop',
            description: data.description || 'No description provided for this resource.',
            fileSize: data.file_size || '0.0 MB',
            pages: data.pages || 0,
            fileUrl: data.file_url
          });
        }
      } catch (err) {
        console.error('Error fetching resource:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchResource();
  }, [id]);

  const reviews: Review[] = [
    // ... keep existing reviews mock for now
    {
      id: 1,
      userName: "Sophia L.",
      userAvatar: "https://ui-avatars.com/api/?name=User&background=random",
      timeAgo: "1 week ago",
      rating: 5,
      comment: "Very helpful for midterms!"
    },
    {
      id: 2,
      userName: "Ethan M.",
      userAvatar: "https://ui-avatars.com/api/?name=User&background=random",
      timeAgo: "2 weeks ago",
      rating: 4,
      comment: "Clear and well-organized"
    }
  ];

  const relatedResources: RelatedResource[] = [
    // ... keep existing related resources mock for now
    {
      id: 1,
      title: "CSC 401 - Past Exam",
      image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop",
      uploader: "Sarah C."
    },
    {
      id: 2,
      title: "CSC 401 - Study Notes",
      image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop",
      uploader: "David R."
    },
    {
      id: 3,
      title: "CSC 401 - Assignment",
      image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop",
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

  const handleDownload = async () => {
    if (!resource?.fileUrl) {
      alert('Download URL not found');
      return;
    }

    try {
      // If it's a full URL, open it. If it's a path, get public URL or download
      let downloadUrl = resource.fileUrl;

      if (!downloadUrl.startsWith('http')) {
        const { data } = supabase.storage
          .from('resources')
          .getPublicUrl(downloadUrl);
        downloadUrl = data.publicUrl;
      }

      // Create a temporary link and click it to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `${resource.title}.pdf`); // Fallback extension
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Increment download count in DB
      await supabase
        .from('resources')
        .update({ downloads_count: (resource.downloads || 0) + 1 })
        .eq('id', resource.id);

    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download the file.');
    }
  };

  const handleBackClick = () => {
    router.back(); // Go back to previous page
  };

  const handleNotificationClick = () => {
    router.push('/notification');
  };

  const handleRelatedResourceClick = (resourceId: number) => {
    router.push(`/resource/${resourceId}`);
  };

  const renderStars = (rating: number, size: number = 20) => {
    // ... existing renderStars
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

  const navItems = [
    // ... existing navItems
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
    // ... existing loading view
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading resource...</div>
      </div>
    );
  }

  if (!resource) {
    // ... existing empty view
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
          {resource.type} • {resource.fileSize} • {resource.pages} pages
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
// ... existing UI for ratings and reviews
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

      <BottomNav navItems={navItems} />
    </div>
  );
};

export default ResourceDetail;
