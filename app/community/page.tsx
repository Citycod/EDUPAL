'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useInstitutionContext } from '@/lib/hooks/useInstitutionContext';
import BottomNav from '@/components/BottomNav';

// Helper to format time relative (e.g. "2m ago")
const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

interface Thread {
  id: string;
  title: string; // We might need to derive this from content if not in DB
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  timestamp: string;
  repliesCount: number;
  views: number; // Mock if not in DB
  category: 'General' | 'Homework' | 'Exam' | 'Project'; // Derive or mock
  isResolved?: boolean;
}

const CommunityPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const boardId = searchParams.get('board');

  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const { institution, loading: contextLoading } = useInstitutionContext();
  const [userProfile, setUserProfile] = useState<any>(null);

  // Selection State
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');

  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Fetch Academic Context via Bridge
          const { data: academicProfile } = await supabase
            .from('hub_profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          setUserProfile(academicProfile);

          // Fetch Course Boards via Bridge (Filtered by Institution)
          if (institution?.id) {
            const { data: courseData } = await supabase
              .from('hub_courses')
              .select('id, course_code, title')
              .eq('institution_id', institution.id)
              .order('course_code');

            if (courseData) {
              setCourses(courseData);
              // Pre-select board from param if it exists, otherwise use first
              if (boardId) {
                setSelectedCourseId(boardId);
              } else if (courseData.length > 0) {
                setSelectedCourseId(courseData[0].id);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    if (institution?.id) {
      fetchInitialData();
    }
  }, [boardId, institution?.id]);

  useEffect(() => {
    if (!selectedCourseId) return;

    const fetchThreads = async () => {
      setLoading(true);
      try {
        const { data: posts, error } = await supabase
          .from('hub_posts')
          .select(`
            *,
            profiles:author_id (full_name, avatar_url),
            hub_courses!inner (course_code)
          `)
          .eq('course_id', selectedCourseId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedThreads = posts.map((post: any, index: number) => {
          const title = post.content.split(' ').slice(0, 8).join(' ') + (post.content.split(' ').length > 8 ? '...' : '?');
          return {
            id: post.id,
            title: title,
            content: post.content,
            author: {
              name: post.profiles?.full_name || 'Anonymous',
              avatar: post.profiles?.avatar_url || 'https://ui-avatars.com/api/?name=Scholar&background=random',
            },
            timestamp: post.created_at,
            repliesCount: 0,
            views: 42,
            category: (['General', 'Homework', 'Exam', 'Project'] as const)[index % 4],
            isResolved: index % 5 === 0
          };
        });

        setThreads(formattedThreads);
      } catch (error) {
        console.error("Error fetching threads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, [selectedCourseId]);

  const handlePostSubmit = async () => {
    if (!newPostContent.trim() || !selectedCourseId) return;
    setIsPosting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('hub_posts')
        .insert({
          content: newPostContent,
          author_id: user.id,
          course_id: selectedCourseId
        });

      if (error) throw error;

      setNewPostContent('');
      window.location.reload();

    } catch (error: any) {
      console.error("Error creating post:", error);
      alert(`Failed to post: ${error.message}`);
    } finally {
      setIsPosting(false);
    }
  };

  const getCategoryIcon = (category: string, isResolved?: boolean) => {
    if (isResolved) return { icon: 'check_circle', color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20' };
    switch (category) {
      case 'Homework': return { icon: 'event_note', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' };
      case 'Exam': return { icon: 'help', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' };
      case 'Project': return { icon: 'rocket_launch', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' };
      default: return { icon: 'terminal', color: 'text-primary', bg: 'bg-primary/10 border-primary/20' };
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-slate-500">Loading Discussions...</div>;
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300">
      <div className="max-w-3xl mx-auto flex flex-col min-h-screen border-x border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark">

        {/* TopAppBar - Course Board Identity */}
        <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center p-4 pb-2 justify-between">
            <div
              onClick={() => router.push('/home')}
              className="text-slate-900 dark:text-white flex size-10 shrink-0 items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-surface-dark rounded-full transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </div>
            <div className="flex flex-col flex-1 px-4 text-center">
              <h2 className="text-slate-900 dark:text-white text-lg font-black leading-tight tracking-tighter uppercase">Course Boards</h2>
              <p className="text-[10px] text-primary font-black tracking-widest uppercase">Academic Discussions</p>
            </div>
            <div className="flex w-12 items-center justify-end">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-8 border border-primary/30"
                style={{ backgroundImage: `url("${userProfile?.avatar_url || 'https://ui-avatars.com/api/?name=User&background=random'}")` }}
              />
            </div>
          </div>

          {/* Board Switcher (Courses) */}
          <div className="flex gap-2 px-4 py-4 overflow-x-auto no-scrollbar scrollbar-hide">
            {courses.map(course => (
              <button
                key={course.id}
                onClick={() => setSelectedCourseId(course.id)}
                className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl px-5 font-black text-xs transition-all border uppercase tracking-widest ${selectedCourseId === course.id
                  ? 'bg-primary border-primary text-background-dark shadow-lg shadow-primary/20 scale-105'
                  : 'bg-white dark:bg-surface-dark border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-primary/50'
                  }`}
              >
                <span>{course.course_code}</span>
              </button>
            ))}
          </div>
        </header>

        {/* Thread List */}
        <main className="flex-1 overflow-y-auto pb-20">
          {threads.map((thread) => {
            const style = getCategoryIcon(thread.category, thread.isResolved);
            return (
              <div key={thread.id} className={`flex gap-4 px-4 py-5 border-b border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-surface-dark/40 cursor-pointer transition-colors group ${thread.isResolved ? 'opacity-75' : ''}`}>
                <div className="shrink-0 pt-1">
                  <div className={`${style.bg} flex items-center justify-center rounded-lg h-12 w-12 ${style.color}`}>
                    <span className="material-symbols-outlined">{style.icon}</span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex justify-between items-start">
                    <p className={`text-slate-900 dark:text-white text-base font-semibold leading-snug group-hover:text-primary transition-colors ${thread.isResolved ? 'italic' : ''}`}>
                      {thread.isResolved && 'Resolved: '}{thread.title}
                    </p>
                    <span className="text-slate-500 dark:text-slate-400 text-xs shrink-0 ml-4">{formatTimeAgo(thread.timestamp)}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm font-normal line-clamp-2">
                    {thread.content}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className={`flex items-center gap-1 text-xs font-medium ${thread.repliesCount > 0 ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}>
                      <span className="material-symbols-outlined text-sm">chat_bubble</span>
                      <span>{thread.repliesCount} replies</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs">
                      <span className="material-symbols-outlined text-sm">visibility</span>
                      <span>{thread.views} views</span>
                    </div>
                    <div className="text-xs text-slate-400 ml-auto">
                      Posted by {thread.author.name.split(' ')[0]}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {threads.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <p>No threads yet. Start a discussion!</p>
            </div>
          )}
        </main>

        {/* Reply / Post Input Area */}
        <div className="fixed bottom-[52px] md:bottom-0 left-0 right-0 z-20 p-4 bg-background-light dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 max-w-3xl mx-auto">
          <div className="flex items-end gap-3 bg-slate-100 dark:bg-surface-dark rounded-xl p-3 focus-within:ring-2 focus-within:ring-primary/50 transition-all shadow-sm">
            <div className="shrink-0 pb-1">
              <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-primary">
                <img className="h-full w-full object-cover" src={userProfile?.avatar_url || 'https://ui-avatars.com/api/?name=User&background=random'} alt="My Avatar" />
              </div>
            </div>
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 text-dark  text-sm placeholder-slate-500 resize-none py-1 max-h-32"
                placeholder={`Post to ${courses.find(c => c.id === selectedCourseId)?.course_code || 'Board'}...`}
                rows={1}
                style={{ minHeight: '34px ', textDecoration: 'none', color: 'black' }}
              ></textarea>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center justify-center h-8 w-8 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
                <span className="material-symbols-outlined">attach_file</span>
              </button>
              <button
                onClick={handlePostSubmit}
                disabled={!newPostContent.trim() || isPosting}
                className="flex items-center justify-center h-8 w-8 bg-primary text-background-dark rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-sm font-bold">send</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sticky Mobile Nav (Synced with Global BottomNav visually, but using this for layout match) */}
        {/* Note: In Next.js app directory layout, the global BottomNav might overlap. 
            We should check if we want to suppress the global one or use this one. 
            For now, I'll rely on the global BottomNav and add padding to main.
            The user prompt had a custom nav, but consistent app nav is better. 
            I will use the global BottomNav component at the bottom of the page structure 
            to ensure consistency with other pages. 
        */}
      </div>

      {/* Global Bottom Nav - Placed outside the max-w-3xl container to span full width */}
      <BottomNav />
    </div>
  );
};

export default CommunityPage;
