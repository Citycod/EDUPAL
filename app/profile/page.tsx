'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import BottomNav from '@/components/BottomNav';

interface ProfileStats {
  uploads: number;
  downloads: number;
  rating: number | string;
}

interface UploadedResource {
  id: string;
  title: string;
  type: string;
  size: string;
  date: string;
  downloads: number;
}

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [stats, setStats] = useState<ProfileStats>({ uploads: 0, downloads: 0, rating: 'N/A' });
  const [myUploads, setMyUploads] = useState<UploadedResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // 1. Fetch Profile Details
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profile) {
            setUserProfile({
              name: profile.full_name || user.email?.split('@')[0] || 'Student',
              avatar: profile.avatar_url || 'https://ui-avatars.com/api/?name=Student&background=random',
              university: profile.university || 'University',
              major: profile.major || 'General',
              year: profile.year || 'Student',
              bio: profile.bio || ''
            });
          }

          // 2. Fetch User's Resources (Uploads)
          const { data: resources } = await supabase
            .from('resources')
            .select('*')
            .eq('uploader_id', user.id)
            .order('created_at', { ascending: false });

          if (resources) {
            // Calculate Stats
            const uploadCount = resources.length;
            const totalDownloads = resources.reduce((acc, curr) => acc + (curr.downloads_count || 0), 0);

            // Format Resources for List
            const formattedUploads = resources.map((res: any) => ({
              id: res.id,
              title: res.title,
              type: res.type || 'PDF', // Fallback if type is missing
              size: res.file_size || 'Unknown',
              date: new Date(res.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              downloads: res.downloads_count || 0
            }));

            setMyUploads(formattedUploads);

            // 3. Fetch Ratings (Average from reviews on user's resources)
            // We need the IDs of resources uploaded by this user to filter reviews
            const resourceIds = resources.map(r => r.id);
            let averageRating: number | string = 'N/A';

            if (resourceIds.length > 0) {
              const { data: reviews } = await supabase
                .from('resource_reviews')
                .select('rating')
                .in('resource_id', resourceIds);

              if (reviews && reviews.length > 0) {
                const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
                averageRating = (totalRating / reviews.length).toFixed(1);
              }
            }

            setStats({
              uploads: uploadCount,
              downloads: totalDownloads,
              rating: averageRating
            });
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

  const getFileIcon = (title: string, type: string) => {
    const lowerTitle = title.toLowerCase();
    const lowerType = type.toLowerCase();

    if (lowerTitle.endsWith('.pdf') || lowerType === 'pdf') return { icon: 'description', color: 'text-red-500', bg: 'bg-red-500/10' };
    if (lowerTitle.endsWith('.doc') || lowerTitle.endsWith('.docx') || lowerType === 'doc') return { icon: 'article', color: 'text-blue-500', bg: 'bg-blue-500/10' };
    if (lowerTitle.endsWith('.zip') || lowerTitle.endsWith('.rar') || lowerType === 'zip') return { icon: 'folder_zip', color: 'text-amber-500', bg: 'bg-amber-500/10' };
    if (lowerTitle.endsWith('.jpg') || lowerTitle.endsWith('.png') || lowerType === 'image') return { icon: 'image', color: 'text-purple-500', bg: 'bg-purple-500/10' };

    return { icon: 'description', color: 'text-primary', bg: 'bg-primary/10' };
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-slate-500">Loading Profile...</div>;
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-300 min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden pb-20">
        {/* Top Navigation */}
        <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10">
          <div className="w-12">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center h-12 w-12 rounded-full text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
          </div>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Profile</h2>
          <div className="flex w-12 items-center justify-end">
            <button className="flex cursor-pointer items-center justify-center rounded-lg h-12 bg-transparent text-slate-700 dark:text-white transition-colors hover:bg-slate-200 dark:hover:bg-white/10">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </div>

        {/* Header/Profile Section */}
        <div className="flex p-4 flex-col items-center gap-6">
          <div className="flex gap-4 flex-col items-center">
            <div className="relative">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32 border-4 border-primary/20"
                style={{ backgroundImage: `url("${userProfile?.avatar}")` }}
              >
              </div>
              <div className="absolute bottom-1 right-1 bg-primary text-background-dark rounded-full p-1 border-2 border-background-dark flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">verified</span>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-slate-900 dark:text-white text-2xl font-bold leading-tight tracking-tight">{userProfile?.name}</p>
              <div className="mt-2 space-y-1">
                <p className="text-slate-600 dark:text-primary/80 text-base font-medium leading-normal flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">school</span>
                  {userProfile?.major} {userProfile?.year && `| ${userProfile.year}`}
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">{userProfile?.university}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 w-full max-w-[480px]">
            <button className="flex-1 flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-11 px-4 bg-primary text-background-dark text-sm font-bold leading-normal tracking-wide transition-opacity hover:opacity-90">
              <span className="material-symbols-outlined mr-2 text-[18px]">edit</span>
              <span className="truncate">Edit Profile</span>
            </button>
            <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-11 px-4 bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white text-sm font-bold leading-normal transition-colors hover:bg-slate-300 dark:hover:bg-white/20">
              <span className="material-symbols-outlined">share</span>
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4 px-4 py-6 border-y border-slate-200 dark:border-white/5 mt-4">
          <div className="flex flex-col items-center">
            <span className="text-primary text-xl font-bold">{stats.uploads}</span>
            <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Uploads</span>
          </div>
          <div className="flex flex-col items-center border-x border-slate-200 dark:border-white/5">
            <span className="text-primary text-xl font-bold">{stats.downloads}</span>
            <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Downloads</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-primary text-xl font-bold">{stats.rating}</span>
            <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Rating</span>
          </div>
        </div>

        {/* My Uploads Header */}
        <div className="flex items-center justify-between px-4 pb-2 pt-6">
          <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">My Uploads</h3>
          <button className="text-primary text-sm font-semibold hover:underline">See All</button>
        </div>

        {/* Uploads List */}
        <div className="flex flex-col gap-1 px-2 pb-10">
          {myUploads.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
              <p>No uploads yet.</p>
            </div>
          ) : (
            myUploads.slice(0, 5).map((upload) => {
              const style = getFileIcon(upload.title, upload.type);
              return (
                <div key={upload.id} className="flex items-center gap-4 bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 transition-colors px-3 rounded-xl min-h-[72px] py-2 justify-between cursor-pointer group">
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className={`${style.color} flex items-center justify-center rounded-xl ${style.bg} shrink-0 size-12`}>
                      <span className="material-symbols-outlined">{style.icon}</span>
                    </div>
                    <div className="flex flex-col justify-center overflow-hidden">
                      <p className="text-slate-900 dark:text-white text-base font-medium leading-normal truncate group-hover:text-primary transition-colors">{upload.title}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-xs font-normal leading-normal">
                        {upload.date} • {upload.size}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <button className="text-slate-400 dark:text-slate-500 flex size-10 items-center justify-center hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Floating Action Button - To Upload Page */}
        <div className="fixed bottom-24 right-6 z-40">
          <button
            onClick={() => router.push('/library/upload')}
            className="bg-primary text-background-dark h-14 w-14 rounded-full shadow-lg shadow-primary/20 flex items-center justify-center transition-transform active:scale-95 hover:brightness-110"
          >
            <span className="material-symbols-outlined text-[30px] font-bold">add</span>
          </button>
        </div>
      </div>

      {/* Global Bottom Nav */}
      <BottomNav />
    </div>
  );
};

export default ProfilePage;
