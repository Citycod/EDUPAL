'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';


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
  const [stats, setStats] = useState<ProfileStats>({ uploads: 0, downloads: 0, rating: 4.8 });
  const [myUploads, setMyUploads] = useState<UploadedResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [institutions, setInstitutions] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);

  const [editForm, setEditForm] = useState({
    full_name: '',
    institution_id: '',
    department_id: '',
    level: '',
    avatar_file: null as File | null
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // 1. Fetch Profile Details via Consolidated View
          const { data: profile } = await supabase
            .from('hub_profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profile) {
            setUserProfile(profile);
            setEditForm({
              full_name: profile.full_name || '',
              institution_id: profile.institution_id || '',
              department_id: profile.department_id || '',
              level: profile.level || '100',
              avatar_file: null
            });
          }

          // 2. Fetch Institutions for the editor via Bridge
          const { data: inst } = await supabase.from('hub_institutions').select('*').order('name');
          if (inst) setInstitutions(inst);

          // 3. Fetch User's Resources via Bridge
          const { data: resources } = await supabase
            .from('hub_resources')
            .select(`
                *,
                hub_courses (course_code, title)
            `)
            .eq('uploader_id', user.id)
            .order('created_at', { ascending: false });

          if (resources) {
            setMyUploads(resources.map((res: any) => ({
              id: res.id,
              title: res.hub_courses?.title || res.title,
              type: res.type || 'PDF',
              size: res.file_size || '1.2 MB',
              date: new Date(res.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              downloads: res.downloads_count || 0
            })));

            setStats(prev => ({
              ...prev,
              uploads: resources.length,
              downloads: resources.reduce((acc, curr) => acc + (curr.downloads_count || 0), 0)
            }));
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
    if (editForm.institution_id) {
      const fetchDepts = async () => {
        const { data } = await supabase
          .from('hub_departments')
          .select('*')
          .eq('institution_id', editForm.institution_id)
          .order('name');
        setDepartments(data || []);
      };
      fetchDepts();
    }
  }, [editForm.institution_id]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEditForm(prev => ({ ...prev, avatar_file: e.target.files![0] }));
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Failed to logout.');
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
          avatar_url: avatarUrl
          // Academic fields (institution_id, department_id, level) are locked after registration
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      window.location.reload(); // Refresh to get joined data

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
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden">

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
              className="flex cursor-pointer items-center justify-center rounded-lg h-12 bg-transparent text-slate-700 dark:text-white transition-colors hover:bg-slate-200 dark:hover:bg-white/10"
              onClick={() => setIsEditing(true)}
            >
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </div>

        {/* Header/Profile Section */}
        <div className="flex p-4 @container">
          <div className="flex w-full flex-col gap-6 items-center">
            <div className="flex gap-4 flex-col items-center">
              <div className="relative">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32 border-4 border-primary/20 shadow-2xl transition-transform hover:scale-105 duration-500"
                  style={{ backgroundImage: `url("${userProfile?.avatar_url || 'https://ui-avatars.com/api/?name=User&background=random'}")` }}
                >
                </div>
                <div className="absolute bottom-1 right-1 bg-primary text-background-dark rounded-full p-1 border-2 border-background-dark shadow-lg">
                  <span className="material-symbols-outlined text-[16px] block font-black">verified</span>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-slate-900 dark:text-white text-2xl font-bold leading-tight tracking-tight">{userProfile?.full_name || 'EduPal User'}</p>
                <div className="mt-2 space-y-1">
                  <p className="text-slate-600 dark:text-primary/80 text-base font-medium leading-normal flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-sm">school</span>
                    {userProfile?.department_name || 'Academic'} | Level {userProfile?.level || '100'}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">{userProfile?.institution_name || 'Institution Name'}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 w-full max-w-[480px]">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-11 px-4 bg-primary text-background-dark text-sm font-bold leading-normal tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
              >
                <span className="material-symbols-outlined mr-2 text-[18px]">edit</span>
                <span className="truncate">Edit Profile</span>
              </button>
              <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-11 px-4 bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white text-sm font-bold leading-normal transition-colors hover:bg-slate-300 dark:hover:bg-white/20 border border-slate-300 dark:border-white/5">
                <span className="material-symbols-outlined">share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4 px-4 py-6 border-y border-slate-200 dark:border-white/5 mt-4">
          <div className="flex flex-col items-center">
            <span className="text-primary text-xl font-bold">{stats.uploads}</span>
            <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Uploads</span>
          </div>
          <div className="flex flex-col items-center border-x border-slate-200 dark:border-white/5">
            <span className="text-primary text-xl font-bold">{stats.downloads > 999 ? (stats.downloads / 1000).toFixed(1) + 'k' : stats.downloads}</span>
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
        <div className="flex flex-col gap-1 px-2 pb-24">
          {myUploads.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <span className="material-symbols-outlined text-4xl mb-2 opacity-20">cloud_upload</span>
              <p className="text-sm font-medium">No materials uploaded yet</p>
            </div>
          ) : (
            myUploads.map((upload: UploadedResource) => {
              const style = getFileIcon(upload.title, upload.type);
              return (
                <div key={upload.id} className="flex items-center gap-4 bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 transition-colors px-3 rounded-xl min-h-[72px] py-2 justify-between group cursor-pointer">
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className={`text-primary flex items-center justify-center rounded-xl ${style.bg} shrink-0 size-12 shadow-inner border border-current border-opacity-5`}>
                      <span className="material-symbols-outlined">{style.icon}</span>
                    </div>
                    <div className="flex flex-col justify-center overflow-hidden">
                      <p className="text-slate-900 dark:text-white text-base font-medium leading-normal truncate group-hover:text-primary transition-colors">{upload.title}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-xs font-normal leading-normal">{upload.date} • {upload.size}</p>
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

        {/* Floating Action Button */}
        <div className="fixed bottom-24 right-6 z-40">
          <button
            onClick={() => router.push('/library/upload')}
            className="bg-primary text-background-dark h-14 w-14 rounded-full shadow-lg shadow-primary/20 flex items-center justify-center transition-all active:scale-90 hover:rotate-90"
          >
            <span className="material-symbols-outlined text-[30px] font-bold">add</span>
          </button>
        </div>

        {/* Edit Profile Modal */}
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] shadow-2xl p-8 border border-slate-200 dark:border-slate-800 relative max-h-[85vh] overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Identity</h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="space-y-6">
                {/* Avatar Upload */}
                <div className="flex flex-col items-center mb-4">
                  <div
                    className="w-24 h-24 rounded-3xl bg-cover bg-center border-4 border-primary/20 mb-3 relative group overflow-hidden"
                    style={{
                      backgroundImage: editForm.avatar_file
                        ? `url(${URL.createObjectURL(editForm.avatar_file)})`
                        : `url("${userProfile?.avatar_url || 'https://ui-avatars.com/api/?name=User&background=random'}")`
                    }}
                  >
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Digitize Signature</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-2">
                    <span className="material-symbols-outlined text-amber-500 text-sm">lock</span>
                    <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">Academic details are permanent</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Legal Name</label>
                    <input
                      name="full_name"
                      value={editForm.full_name}
                      onChange={handleEditChange}
                      className="w-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl py-4 px-5 focus:outline-none focus:border-primary transition-all font-bold"
                    />
                  </div>

                  <div className="space-y-2 opacity-60">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Institution</label>
                      <span className="material-symbols-outlined text-xs">lock</span>
                    </div>
                    <select
                      name="institution_id"
                      value={editForm.institution_id}
                      disabled
                      className="w-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl py-4 px-5 font-bold cursor-not-allowed"
                    >
                      <option value="">Select Institution</option>
                      {institutions.map(inst => <option key={inst.id} value={inst.id}>{inst.name}</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 opacity-60">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dept</label>
                        <span className="material-symbols-outlined text-xs">lock</span>
                      </div>
                      <select
                        name="department_id"
                        value={editForm.department_id}
                        disabled
                        className="w-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl py-4 px-3 text-sm font-bold cursor-not-allowed"
                      >
                        <option value="">Select</option>
                        {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2 opacity-60">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Level</label>
                        <span className="material-symbols-outlined text-xs">lock</span>
                      </div>
                      <select
                        name="level"
                        value={editForm.level}
                        disabled
                        className="w-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl py-4 px-3 text-sm font-bold cursor-not-allowed"
                      >
                        {['100', '200', '300', '400', '500'].map(lvl => <option key={lvl} value={lvl}>{lvl}L</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  onClick={saveProfile}
                  disabled={uploading}
                  className="w-full bg-primary text-background-dark font-black py-5 rounded-[2rem] mt-4 mb-2 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 uppercase text-xs tracking-[0.2em]"
                >
                  {uploading ? 'Synching...' : 'Authorize Changes'}
                </button>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 text-red-500 font-bold py-3 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                  >
                    <span className="material-symbols-outlined">logout</span>
                    Logout Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Global Bottom Nav */}

    </div>
  );
};

export default ProfilePage;
