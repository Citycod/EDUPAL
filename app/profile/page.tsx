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
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: '',
    university: '',
    major: '',
    year: '',
    avatar_file: null as File | null
  });
  const [uploading, setUploading] = useState(false);

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
              avatar: profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || 'Student')}&background=random`,
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
              type: res.type || 'PDF',
              size: res.file_size || 'Unknown',
              date: new Date(res.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              downloads: res.downloads_count || 0
            }));

            setMyUploads(formattedUploads);

            // 3. Fetch Ratings
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

  useEffect(() => {
    if (userProfile) {
      setEditForm({
        full_name: userProfile.name,
        university: userProfile.university,
        major: userProfile.major,
        year: userProfile.year,
        avatar_file: null
      });
    }
  }, [userProfile]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEditForm(prev => ({ ...prev, avatar_file: e.target.files![0] }));
    }
  };

  const saveProfile = async () => {
    try {
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let avatarUrl = userProfile.avatar;

      if (editForm.avatar_file) {
        const fileExt = editForm.avatar_file.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, editForm.avatar_file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        avatarUrl = publicUrl;
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: editForm.full_name,
          university: editForm.university,
          major: editForm.major,
          year: editForm.year,
          avatar_url: avatarUrl
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setUserProfile((prev: any) => ({
        ...prev,
        name: editForm.full_name,
        university: editForm.university,
        major: editForm.major,
        year: editForm.year,
        avatar: avatarUrl
      }));

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } finally {
      setUploading(false);
    }
  };

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
            <button
              onClick={() => setIsEditing(true)}
              className="flex cursor-pointer items-center justify-center rounded-lg h-12 bg-transparent text-slate-700 dark:text-white transition-colors hover:bg-slate-200 dark:hover:bg-white/10"
            >
              <span className="material-symbols-outlined">edit</span>
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
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-11 px-4 bg-primary text-background-dark text-sm font-bold leading-normal tracking-wide transition-opacity hover:opacity-90"
            >
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
            myUploads.slice(0, 5).map((upload: UploadedResource) => {
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

        {/* Edit Profile Modal */}
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-[#0a120d] w-full max-w-md rounded-2xl shadow-2xl p-6 border border-slate-200 dark:border-white/10 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Edit Profile</h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="space-y-4">
                {/* Avatar Upload */}
                <div className="flex flex-col items-center mb-6">
                  <div
                    className="w-24 h-24 rounded-full bg-cover bg-center border-4 border-slate-100 dark:border-white/5 mb-3 relative"
                    style={{
                      backgroundImage: editForm.avatar_file
                        ? `url(${URL.createObjectURL(editForm.avatar_file)})`
                        : `url("${userProfile.avatar}")`
                    }}
                  >
                    <label className="absolute bottom-0 right-0 bg-primary text-background-dark p-2 rounded-full cursor-pointer shadow-lg hover:brightness-110 transition-all">
                      <span className="material-symbols-outlined text-sm">photo_camera</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Tap icon to change photo</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input
                    name="full_name"
                    value={editForm.full_name}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">University</label>
                  <input
                    name="university"
                    value={editForm.university}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Major</label>
                    <input
                      name="major"
                      value={editForm.major}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Year</label>
                    <input
                      name="year"
                      value={editForm.year}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                <button
                  onClick={saveProfile}
                  disabled={uploading}
                  className="w-full bg-primary text-background-dark font-bold py-4 rounded-xl mt-4 shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {uploading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Global Bottom Nav */}
      <BottomNav />
    </div>
  );
};

export default ProfilePage;
