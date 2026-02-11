'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

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
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All Threads');
  const [userAvatar, setUserAvatar] = useState('https://ui-avatars.com/api/?name=User&background=random');
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase.from('profiles').select('avatar_url').eq('id', user.id).single();
          if (profile?.avatar_url) setUserAvatar(profile.avatar_url);
        }

        // Fetch Posts (Threads)
        const { data: posts, error } = await supabase
          .from('posts')
          .select(`
            *,
            profiles:author_id (full_name, avatar_url),
            comments (count),
            post_likes (count)
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Supabase Error Full:", JSON.stringify(error, null, 2));
          throw error;
        }

        const formattedThreads = posts.map((post: any, index: number) => {
          // Derive a title from the first few words of content
          const title = post.content.split(' ').slice(0, 8).join(' ') + (post.content.split(' ').length > 8 ? '...' : '?');

          // Mock categories for visual variety
          const categories: ('General' | 'Homework' | 'Exam' | 'Project')[] = ['General', 'Homework', 'Exam', 'Project'];
          const category = categories[index % categories.length];

          return {
            id: post.id,
            title: title,
            content: post.content,
            author: {
              name: post.profiles?.full_name || 'Anonymous',
              avatar: post.profiles?.avatar_url || 'https://ui-avatars.com/api/?name=Student&background=random',
            },
            timestamp: post.created_at,
            repliesCount: post.comments?.[0]?.count || 0,
            views: (post.post_likes?.[0]?.count || 0) * 15 + 42, // Mock views based on likes
            category: category,
            isResolved: index % 5 === 0 // Mock resolved status
          };
        });

        setThreads(formattedThreads);
      } catch (error) {
        console.error("Error fetching threads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePostSubmit = async () => {
    if (!newPostContent.trim()) return;
    setIsPosting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Please log in to post.");
        return;
      }

      const { error } = await supabase.from('posts').insert({
        content: newPostContent,
        author_id: user.id
      });

      if (error) throw error;

      setNewPostContent('');
      // Optimistic update or refetch could go here. For simplicity, we reload.
      window.location.reload();

    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to post. Please try again.");
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

        {/* TopAppBar */}
        <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center p-4 pb-2 justify-between">
            <div
              onClick={() => router.push('/home')} // Or back
              className="text-slate-900 dark:text-white flex size-10 shrink-0 items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-surface-dark rounded-full transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </div>
            <div className="flex flex-col flex-1 px-4 text-center">
              <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">Community Discussions</h2>
              <p className="text-xs text-primary font-medium">Active: 42 Students online</p>
            </div>
            <div className="flex w-12 items-center justify-end">
              <button className="flex size-10 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-surface-dark transition-colors">
                <span className="material-symbols-outlined text-slate-900 dark:text-white">search</span>
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar scrollbar-hide">
            {['All Threads', 'Unread', 'Assignments', 'General'].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 font-semibold text-sm transition-colors ${activeFilter === filter
                  ? 'bg-primary text-background-dark'
                  : 'bg-slate-200 dark:bg-surface-dark text-slate-700 dark:text-white hover:bg-primary/20'
                  }`}
              >
                <span>{filter}</span>
                {filter !== 'All Threads' && <span className="material-symbols-outlined text-base">keyboard_arrow_down</span>}
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
                <img className="h-full w-full object-cover" src={userAvatar} alt="My Avatar" />
              </div>
            </div>
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 text-dark  text-sm placeholder-slate-500 resize-none py-1 max-h-32"
                placeholder="Start a new discussion..."
                rows={1}
                style={{ minHeight: '24px' }}
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
      <div className="fixed bottom-0 w-full z-30">
        <nav className="flex justify-around items-center p-2 pb-3 border-t border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark md:hidden">
          {[
            { icon: 'home', label: 'Home', path: '/home' },
            { icon: 'menu_book', label: 'Library', path: '/library' },
            { icon: 'school', label: 'Courses', path: '/classes' },
            { icon: 'chat_bubble', label: 'Social', path: '/community', active: true },
            { icon: 'person', label: 'Profile', path: '/profile' }
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center gap-1 ${item.active ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}
            >
              {item.active ? (
                <div className="bg-primary/20 text-primary px-5 py-1 rounded-full flex flex-col items-center">
                  <span className="material-symbols-outlined fill-1">{item.icon}</span>
                </div>
              ) : (
                <span className="material-symbols-outlined">{item.icon}</span>
              )}
              <span className={`text-[10px] ${item.active ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default CommunityPage;
