'use client';

/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Header from "@/components/Header";


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
  const [resource, setResource] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('hub_resources')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          // Get public URL for preview
          let publicUrl = data.file_url;
          if (publicUrl && !publicUrl.startsWith('http')) {
            const { data: urlData } = supabase.storage
              .from('resources')
              .getPublicUrl(publicUrl);
            publicUrl = urlData.publicUrl;
          }

          // Fetch actual department and institution names
          let departmentName = 'Department';
          let institutionName = 'Institution';
          if (data.department_id) {
            const { data: deptData } = await supabase
              .from('hub_departments')
              .select('name, institution_id')
              .eq('id', data.department_id)
              .single();
            if (deptData) {
              departmentName = deptData.name;
              if (deptData.institution_id) {
                const { data: instData } = await supabase
                  .from('hub_institutions')
                  .select('name')
                  .eq('id', deptData.institution_id)
                  .single();
                if (instData) institutionName = instData.name;
              }
            }
          }

          setResource({
            id: data.id,
            courseId: data.course_id,
            courseCode: data.course_code || 'N/A',
            courseTitle: data.course_title || data.title,
            department: departmentName,
            institution: institutionName,
            level: `${data.level}L`,
            session: data.session_name,
            title: data.title,
            type: data.type || 'Document',
            category: data.category,
            author: data.uploader_name || 'EduPal User',
            authorAvatar: data.uploader_avatar,
            timeAgo: new Date(data.created_at).toLocaleDateString(),
            rating: 4.8,
            downloads: data.downloads_count || 0,
            thumbnail: data.thumbnail_url || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop',
            description: data.description || 'Verified academic material for this course.',
            fileSize: data.file_size || '1.5 MB',
            pages: data.pages || 0,
            fileUrl: publicUrl
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
      const link = document.createElement('a');
      link.href = resource.fileUrl;
      link.setAttribute('download', `${resource.title}.pdf`);
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      await supabase
        .from('hub_resources')
        .update({ downloads_count: (resource.downloads || 0) + 1 })
        .eq('id', resource.id);

    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download the file.');
    }
  };

  const handleBackClick = () => {
    router.back();
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


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Decoding Archive...</p>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
        <div className="text-lg font-black text-slate-400 uppercase">Archive Entry Missing</div>
      </div>
    );
  }

  const getFileType = () => {
    if (!resource?.fileUrl) return 'unknown';
    const url = resource.fileUrl.split('?')[0]; // Remove query params
    const ext = url.split('.').pop()?.toLowerCase();

    if (ext === 'pdf') return 'pdf';
    if (['docx', 'doc', 'pptx', 'ppt', 'xlsx', 'xls'].includes(ext || '')) return 'office';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) return 'image';
    return 'unknown';
  };

  const fileType = getFileType();

  return (
    <div className={`min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-300 ${isPreviewMode ? 'overflow-hidden' : ''}`}>
      {/* Fixed Header */}
      <header className="sticky top-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center p-4 justify-between max-w-3xl mx-auto">
          <button
            onClick={handleBackClick}
            className="flex items-center justify-center size-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex flex-col items-center">
            <h2 className="text-sm font-black tracking-widest uppercase text-primary">{resource.courseCode}</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{resource.level}</p>
          </div>
          <button
            onClick={handleNotificationClick}
            className="flex items-center justify-center size-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className={`max-w-3xl mx-auto ${isPreviewMode ? 'pb-0' : 'pb-24'}`}>
        {/* Preview & Hero Section */}
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Preview Material</h3>
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-background-dark transition-all text-[10px] font-black uppercase tracking-widest"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isPreviewMode ? 'close_fullscreen' : 'fullscreen'}
              </span>
              {isPreviewMode ? 'Exit Fullscreen' : 'Fullscreen'}
            </button>
          </div>

          <div className={`relative w-full bg-slate-100 dark:bg-slate-900 rounded-[2rem] overflow-hidden border-2 border-primary/20 shadow-2xl transition-all duration-500 ${isPreviewMode ? 'fixed inset-4 z-50 !m-0 !w-[calc(100%-2rem)] !h-[calc(100%-2rem)]' : 'aspect-[3/4]'}`}>
            {resource.fileUrl ? (
              <>
                {fileType === 'pdf' && (
                  <iframe
                    src={`${resource.fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                    className="w-full h-full border-none"
                    title="PDF Preview"
                  />
                )}

                {fileType === 'office' && (
                  <iframe
                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(resource.fileUrl)}&embedded=true`}
                    className="w-full h-full border-none"
                    title="Document Preview"
                    allowFullScreen
                    allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                  />
                )}

                {fileType === 'image' && (
                  <div className="w-full h-full flex items-center justify-center p-4">
                    <img
                      src={resource.fileUrl}
                      alt={resource.title}
                      className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                    />
                  </div>
                )}

                {fileType === 'unknown' && (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-8 text-center bg-white dark:bg-slate-900">
                    <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                      <span className="material-symbols-outlined text-5xl">description</span>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">Preview Restricted</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium max-w-xs mx-auto">
                        This file format cannot be viewed directly in the browser. Please download to view on your device.
                      </p>
                    </div>
                    <button
                      onClick={handleDownload}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-background-dark rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-[18px]">download</span>
                      Download File
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-slate-400">
                <span className="material-symbols-outlined text-6xl">cloud_off</span>
                <p className="text-xs font-black uppercase tracking-widest">Preview Link Expired</p>
              </div>
            )}
          </div>
        </div>

        {/* Visibility Toggle for Metadata */}
        {!isPreviewMode && (
          <>
            {/* Quick Stats */}
            <div className="flex gap-4 px-4 py-6 overflow-x-auto no-scrollbar scrollbar-hide">
              {[
                { label: 'Type', value: resource.type, icon: 'article' },
                { label: 'Size', value: resource.fileSize, icon: 'database' },
                { label: 'Pages', value: resource.pages || 'N/A', icon: 'auto_stories' },
                { label: 'Gets', value: resource.downloads, icon: 'download' }
              ].map(stat => (
                <div key={stat.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3 shrink-0 min-w-[140px] shadow-sm">
                  <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">{stat.icon}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                    <span className="text-xs font-black uppercase tracking-tight text-slate-900 dark:text-white truncate">{stat.value}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="px-6 py-4">
              <h3 className="text-slate-900 dark:text-white text-xl font-black tracking-tight uppercase mb-2">Manifest</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                {resource.description}
              </p>
            </div>

            {/* Structural Metadata Section */}
            <div className="px-4 py-6">
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 space-y-6">
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Institution</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white uppercase">{resource.institution}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white uppercase">{resource.department}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Course Board</span>
                  <span className="text-sm font-bold text-primary uppercase">{resource.courseTitle}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Session</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white uppercase">{resource.session}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digitized By</span>
                  <div className="flex items-center gap-2">
                    <div className="size-6 rounded-full bg-cover bg-center border border-primary/30" style={{ backgroundImage: `url("${resource.authorAvatar || 'https://ui-avatars.com/api/?name=User&background=random'}")` }} />
                    <span className="text-sm font-bold text-slate-900 dark:text-white uppercase">{resource.author}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Area */}
            <div className="px-4 py-4 flex flex-col gap-4">
              <div className="flex gap-4">
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-primary text-background-dark h-16 rounded-[2rem] flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined font-black">download</span>
                  <span className="text-xs font-black uppercase tracking-[0.2em]">Download</span>
                </button>
                <button className="size-16 rounded-[2rem] bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 transition-all hover:border-primary/30">
                  <span className="material-symbols-outlined">bookmark</span>
                </button>
              </div>

              <button
                onClick={() => router.push(`/community?board=${resource.courseId}&resource=${resource.id}`)}
                className="w-full h-14 bg-white dark:bg-slate-900 border-2 border-primary/20 hover:border-primary/50 text-slate-900 dark:text-white rounded-[2rem] flex items-center justify-center gap-3 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-primary">forum</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Discuss in Community</span>
              </button>
            </div>

            {/* Reviews */}
            <div className="max-w-3xl mx-auto px-4 pb-24">
              <h3 className="text-slate-900 dark:text-white text-xl font-black uppercase tracking-tight mb-8">Critiques</h3>
              <div className="space-y-8">
                {reviews.map(review => (
                  <div key={review.id} className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="size-10 rounded-full bg-cover bg-center" style={{ backgroundImage: `url("${review.userAvatar}")` }} />
                      <div className="flex-1">
                        <p className="text-sm font-black uppercase text-slate-900 dark:text-white">{review.userName}</p>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{review.timeAgo}</span>
                      </div>
                      <div className="flex text-primary">
                        {renderStars(review.rating, 14)}
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>


    </div>
  );
};

export default ResourceDetail;
