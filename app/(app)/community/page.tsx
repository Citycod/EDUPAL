'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useInstitutionContext } from '@/lib/hooks/useInstitutionContext';

import { Suspense } from 'react';

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

interface Post {
  id: string;
  content: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  created_at: string;
  replies_count: number;
  course_code?: string;
  resource_id?: string;
  resource_title?: string;
}

interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  content: string;
  upvotes_count: number;
  created_at: string;
  user_has_voted?: boolean;
}

const CommunityContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const boardId = searchParams.get('board');

  const { institution, loading: contextLoading } = useInstitutionContext();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Course selection
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');

  // Posts
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Thread detail
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  // Composer
  const [newPostContent, setNewPostContent] = useState('');
  const [newReplyContent, setNewReplyContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Linked Resource (from query param)
  const linkedResourceId = searchParams.get('resource');
  const [linkedResourceInfo, setLinkedResourceInfo] = useState<any>(null);

  // Top contributors (for badges)
  const [topContributorIds, setTopContributorIds] = useState<Set<string>>(new Set());

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentUserId(user.id);
          const { data: profile } = await supabase
            .from('hub_profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          setUserProfile(profile);

          if (institution?.id) {
            // Fetch courses
            const { data: courseData } = await supabase
              .from('hub_courses')
              .select('id, course_code, title')
              .eq('institution_id', institution.id)
              .order('course_code');

            if (courseData) {
              setCourses(courseData);
              if (boardId) setSelectedCourseId(boardId);
              else if (courseData.length > 0) setSelectedCourseId(courseData[0].id);
            }

            // Fetch top 10 contributors for badge display via bridge
            const { data: topData } = await supabase
              .from('hub_contributor_scores')
              .select('user_id')
              .eq('institution_id', institution.id)
              .order('score', { ascending: false })
              .limit(10);

            if (topData) {
              setTopContributorIds(new Set(topData.map((t: any) => t.user_id)));
            }
          }

          // Fetch linked resource info if parameter exists
          if (linkedResourceId) {
            const { data: resInfo } = await supabase
              .from('hub_resources')
              .select('id, title, course_code')
              .eq('id', linkedResourceId)
              .single();
            if (resInfo) {
              setLinkedResourceInfo(resInfo);
              // Pre-populate composer with title suggestion
              setNewPostContent(`Discussion: ${resInfo.title}\n\n`);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    if (institution?.id) fetchInitialData();
  }, [boardId, institution?.id]);

  // Fetch posts for selected course
  const fetchPosts = useCallback(async () => {
    if (!selectedCourseId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('hub_posts')
        .select('*')
        .eq('course_id', selectedCourseId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Fetch posts error details:', error);
        throw error;
      }

      // Fetch reply counts
      const postIds = data?.map((p: any) => p.id) || [];
      let replyCounts: Record<string, number> = {};

      if (postIds.length > 0) {
        const { data: commentData } = await supabase
          .from('hub_comments')
          .select('post_id')
          .in('post_id', postIds);

        if (commentData) {
          replyCounts = commentData.reduce((acc: Record<string, number>, c: any) => {
            acc[c.post_id] = (acc[c.post_id] || 0) + 1;
            return acc;
          }, {});
        }
      }

      const formattedPosts: Post[] = (data || []).map((post: any) => ({
        id: post.id,
        content: post.content,
        author_id: post.author_id,
        author_name: post.author_name || 'Anonymous',
        author_avatar: post.author_avatar || `https://ui-avatars.com/api/?name=User&background=random`,
        created_at: post.created_at,
        replies_count: replyCounts[post.id] || 0,
        course_code: post.course_code,
        resource_id: post.resource_id,
        resource_title: post.resource_title
      }));

      setPosts(formattedPosts);
    } catch (error: any) {
      console.error('Error fetching posts:', error.message || error);
    } finally {
      setLoading(false);
    }
  }, [selectedCourseId]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  // Real-time subscription for new posts
  useEffect(() => {
    if (!selectedCourseId) return;

    const channel = supabase
      .channel('community-posts')
      .on('postgres_changes', { event: 'INSERT', schema: 'academic', table: 'posts', filter: `course_id=eq.${selectedCourseId}` }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selectedCourseId, fetchPosts]);

  // Fetch comments for expanded post
  const fetchComments = async (postId: string) => {
    setLoadingComments(true);
    try {
      const { data, error } = await supabase
        .from('hub_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Check which comments current user has voted on
      let votedCommentIds = new Set<string>();
      if (currentUserId && data && data.length > 0) {
        const commentIds = data.map((c: any) => c.id);
        const { data: votes } = await supabase
          .from('hub_comment_votes')
          .select('comment_id')
          .eq('user_id', currentUserId)
          .in('comment_id', commentIds);

        if (votes) {
          votedCommentIds = new Set(votes.map((v: any) => v.comment_id));
        }
      }

      const formattedComments: Comment[] = (data || []).map((c: any) => ({
        id: c.id,
        post_id: c.post_id,
        author_id: c.author_id,
        author_name: c.author_name || 'Anonymous',
        author_avatar: c.author_avatar || `https://ui-avatars.com/api/?name=User&background=random`,
        content: c.content,
        upvotes_count: c.upvotes_count || 0,
        created_at: c.created_at,
        user_has_voted: votedCommentIds.has(c.id)
      }));

      setComments(formattedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const toggleThread = (postId: string) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
      setComments([]);
    } else {
      setExpandedPostId(postId);
      fetchComments(postId);
    }
  };

  // Create new post
  const handlePostSubmit = async () => {
    if (!newPostContent.trim() || !selectedCourseId || !currentUserId) return;
    setIsPosting(true);
    try {
      const { error } = await supabase
        .from('hub_posts')
        .insert({
          content: newPostContent,
          author_id: currentUserId,
          course_id: selectedCourseId,
          resource_id: linkedResourceId // Use from URL if present
        });

      if (error) throw error;
      setNewPostContent('');
      // Redirect to clear resource param after posting if desired, or just refresh
      if (linkedResourceId) {
        router.replace(`/community?board=${selectedCourseId}`);
        setLinkedResourceInfo(null);
      }
      fetchPosts();
    } catch (error: any) {
      console.error('Error creating post:', error.message || error);
      alert(`Failed to post: ${error.message || 'Unknown error'}`);
    } finally {
      setIsPosting(false);
    }
  };

  // Create reply
  const handleReplySubmit = async (postId: string) => {
    if (!newReplyContent.trim() || !currentUserId) return;
    setIsPosting(true);
    try {
      const { error } = await supabase
        .from('hub_comments')
        .insert({ post_id: postId, author_id: currentUserId, content: newReplyContent });

      if (error) throw error;
      setNewReplyContent('');
      fetchComments(postId);
      // Update reply count locally
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, replies_count: p.replies_count + 1 } : p));
    } catch (error: any) {
      console.error('Error adding reply:', error);
      alert(`Failed to reply: ${error.message}`);
    } finally {
      setIsPosting(false);
    }
  };

  // Vote on comment
  const handleCommentVote = async (commentId: string, hasVoted: boolean) => {
    if (!currentUserId) return;
    try {
      if (hasVoted) {
        // Remove vote via bridge
        const { error } = await supabase
          .from('hub_comment_votes')
          .delete()
          .eq('user_id', currentUserId)
          .eq('comment_id', commentId);
        if (error) throw error;
      } else {
        // Add vote via bridge
        const { error } = await supabase
          .from('hub_comment_votes')
          .insert({ user_id: currentUserId, comment_id: commentId });
        if (error) throw error;
      }
      if (expandedPostId) fetchComments(expandedPostId);
    } catch (error) {
      console.error('Error voting on comment:', error);
    }
  };

  const isTopContributor = (userId: string) => topContributorIds.has(userId);

  if (loading && posts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark gap-4">
        <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Loading Discussions</p>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300">
      <div className="max-w-3xl mx-auto flex flex-col min-h-screen border-x border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark">

        {/* Header */}
        <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center p-4 pb-2 justify-between">
            <button
              onClick={() => router.push('/home')}
              className="flex size-10 shrink-0 items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="flex flex-col flex-1 px-4 text-center">
              <h2 className="text-lg font-black leading-tight tracking-tighter uppercase">Course Boards</h2>
              <p className="text-[9px] text-primary font-black tracking-[0.2em] uppercase">Academic Discussions</p>
            </div>
            <div className="flex w-12 items-center justify-end">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-8 border border-primary/30"
                style={{ backgroundImage: `url("${userProfile?.avatar_url || 'https://ui-avatars.com/api/?name=User&background=random'}")` }}
              />
            </div>
          </div>

          {/* Course Switcher */}
          <div className="flex gap-2 px-4 py-4 overflow-x-auto no-scrollbar scrollbar-hide">
            {courses.map((course: any) => (
              <button
                key={course.id}
                onClick={() => { setSelectedCourseId(course.id); setExpandedPostId(null); }}
                className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl px-5 font-black text-xs transition-all border uppercase tracking-widest ${selectedCourseId === course.id
                  ? 'bg-primary border-primary text-background-dark shadow-lg shadow-primary/20 scale-105'
                  : 'bg-white dark:bg-white/5 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-primary/50'
                  }`}
              >
                {course.course_code}
              </button>
            ))}
          </div>
        </header>

        {/* Thread List */}
        <main className="flex-1 overflow-y-auto pb-28">
          {posts.map(post => {
            const isExpanded = expandedPostId === post.id;
            const isTop = isTopContributor(post.author_id);

            return (
              <div key={post.id} className="border-b border-slate-200 dark:border-slate-800">
                {/* Post Card */}
                <div
                  onClick={() => toggleThread(post.id)}
                  className={`flex gap-3.5 px-4 py-4 cursor-pointer transition-colors group ${isExpanded ? 'bg-primary/5' : 'hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                >
                  <div className="shrink-0 pt-0.5 relative">
                    <div
                      className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-slate-200 dark:border-white/10"
                      style={{ backgroundImage: `url("${post.author_avatar}")` }}
                    />
                    {isTop && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] shadow-lg" title="Top Contributor">
                        👑
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm truncate">{post.author_name}</span>
                      {isTop && (
                        <span className="px-1.5 py-0.5 rounded-md bg-yellow-400/10 text-yellow-500 text-[8px] font-black uppercase tracking-widest border border-yellow-400/20">
                          Top 10
                        </span>
                      )}
                      <span className="text-slate-400 text-xs ml-auto shrink-0">{formatTimeAgo(post.created_at)}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed line-clamp-3">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-4 mt-2.5">
                      <div className={`flex items-center gap-1 text-xs font-medium ${post.replies_count > 0 ? 'text-primary' : 'text-slate-400'
                        }`}>
                        <span className="material-symbols-outlined text-sm">chat_bubble</span>
                        <span>{post.replies_count} {post.replies_count === 1 ? 'reply' : 'replies'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400 text-xs">
                        <span className="material-symbols-outlined text-sm">{isExpanded ? 'expand_less' : 'expand_more'}</span>
                        <span>{isExpanded ? 'Collapse' : 'View thread'}</span>
                      </div>
                    </div>

                    {post.resource_id && (
                      <div className="mt-3 p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 flex items-center gap-2 group/res">
                        <span className="material-symbols-outlined text-xs text-primary">description</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-black uppercase text-slate-400 leading-none mb-1">Discussing Material</p>
                          <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300 truncate tracking-tight">{post.resource_title}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/resource/${post.resource_id}`);
                          }}
                          className="px-3 py-1 bg-primary/20 text-primary text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-primary transition-all hover:text-background-dark shadow-sm border border-primary/20"
                        >
                          View File
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded Thread */}
                {isExpanded && (
                  <div className="bg-slate-50 dark:bg-white/[0.02] border-t border-slate-200 dark:border-white/5">
                    {/* Reply list */}
                    {loadingComments ? (
                      <div className="flex items-center justify-center py-8 gap-2 text-slate-400">
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs">Loading replies...</span>
                      </div>
                    ) : comments.length === 0 ? (
                      <div className="text-center py-6 text-slate-400">
                        <p className="text-xs">No replies yet. Be the first!</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100 dark:divide-white/5">
                        {comments.map(comment => {
                          const commentIsTop = isTopContributor(comment.author_id);
                          return (
                            <div key={comment.id} className="flex gap-3 px-4 py-3 pl-8">
                              <div className="shrink-0 pt-0.5 relative">
                                <div
                                  className="w-8 h-8 rounded-full bg-cover bg-center border border-slate-200 dark:border-white/10"
                                  style={{ backgroundImage: `url("${comment.author_avatar}")` }}
                                />
                                {commentIsTop && (
                                  <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-[8px]">👑</div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="font-bold text-xs">{comment.author_name}</span>
                                  {commentIsTop && (
                                    <span className="text-[7px] font-black text-yellow-500 uppercase tracking-widest">Top 10</span>
                                  )}
                                  <span className="text-slate-400 text-[10px] ml-auto">{formatTimeAgo(comment.created_at)}</span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{comment.content}</p>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleCommentVote(comment.id, !!comment.user_has_voted); }}
                                  className={`flex items-center gap-1 mt-1.5 text-xs font-medium transition-all ${comment.user_has_voted
                                    ? 'text-primary'
                                    : 'text-slate-400 hover:text-primary'
                                    }`}
                                >
                                  <span className="material-symbols-outlined text-sm">{comment.user_has_voted ? 'thumb_up' : 'thumb_up_off_alt'}</span>
                                  {comment.upvotes_count > 0 && <span>{comment.upvotes_count}</span>}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Reply Composer */}
                    <div className="px-4 py-3 pl-8 border-t border-slate-200 dark:border-white/5">
                      <div className="flex items-end gap-2 bg-white dark:bg-white/5 rounded-xl p-2.5 border border-slate-200 dark:border-white/10 focus-within:border-primary/50 transition-all">
                        <input
                          type="text"
                          value={newReplyContent}
                          onChange={(e) => setNewReplyContent(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReplySubmit(post.id); } }}
                          placeholder="Write a reply..."
                          className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-sm placeholder-slate-400 text-slate-900 dark:text-white py-1"
                        />
                        <button
                          onClick={() => handleReplySubmit(post.id)}
                          disabled={!newReplyContent.trim() || isPosting}
                          className="flex items-center justify-center h-8 w-8 bg-primary text-background-dark rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                        >
                          <span className="material-symbols-outlined text-sm font-bold">send</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {posts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center px-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary text-3xl">forum</span>
              </div>
              <h3 className="font-black text-lg tracking-tight mb-1">No Threads Yet</h3>
              <p className="text-slate-400 text-sm">Start a discussion for {courses.find(c => c.id === selectedCourseId)?.course_code || 'this course'}!</p>
            </div>
          )}
        </main>

        {/* Post Composer (Fixed Bottom) */}
        <div className="fixed bottom-[90px] md:bottom-0 left-0 right-0 z-20 p-3 bg-background-light dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 max-w-3xl mx-auto">
          {linkedResourceInfo && (
            <div className="mb-2 px-3 py-2 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-between animate-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">link</span>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
                  Creating Resource Thread: {linkedResourceInfo.course_code} - {linkedResourceInfo.title}
                </p>
              </div>
              <button onClick={() => {
                setLinkedResourceInfo(null);
                const params = new URLSearchParams(searchParams.toString());
                params.delete('resource');
                router.replace(`/community?${params.toString()}`);
              }}>
                <span className="material-symbols-outlined text-slate-400 text-sm hover:text-red-500">close</span>
              </button>
            </div>
          )}
          <div className="flex items-end gap-2.5 bg-slate-100 dark:bg-white/5 rounded-xl p-3 focus-within:ring-2 focus-within:ring-primary/50 transition-all shadow-sm border border-slate-200 dark:border-white/10">
            <div className="shrink-0 pb-0.5">
              <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-primary">
                <img className="h-full w-full object-cover" src={userProfile?.avatar_url || 'https://ui-avatars.com/api/?name=User&background=random'} alt="Avatar" />
              </div>
            </div>
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-sm placeholder-slate-500 resize-none py-1 max-h-32 text-slate-900 dark:text-white"
                placeholder={`Post to ${courses.find(c => c.id === selectedCourseId)?.course_code || 'Board'}...`}
                rows={1}
                style={{ minHeight: '34px' }}
              />
            </div>
            <div className="flex gap-2">
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
      </div>


    </div>
  );
};

const CommunityPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-slate-400">Loading Community...</div>}>
      <CommunityContent />
    </Suspense>
  );
};

export default CommunityPage;
