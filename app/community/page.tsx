'use client';

import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

interface User {
  id: string;
  name: string;
  avatar: string;
  year?: string;
  major?: string;
}

interface Comment {
  id: string;
  author: User;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  isReply?: boolean;
  parentId?: string;
  replies?: Comment[];
}

interface Post {
  id: string;
  author: User;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  tags: string[];
  commentsList: Comment[];
}

const CommunityPage: React.FC = () => {
  const router = useRouter();
  const [newPostContent, setNewPostContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const postInputRef = useRef<HTMLInputElement>(null);

  // Mock current user - in production, this would come from auth context
  const currentUser: User = {
    id: "current-user",
    name: "Current User",
    avatar: "https://lh3.googleusercontent.com/aida-public/default-avatar",
    year: "2nd year",
    major: "Computer Science"
  };

  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      author: {
        id: "user1",
        name: "Aisha Adebayo",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUjEd-I5lAHENfFAsmlx3aywUQgNcxzanj3wP8cStib1O7VXUzKuopw3qf5rFiGTGM2C1773ZXXfGKdReU0wF3Tc1bdZ_oi-1NyiNNFx9iXBaQG9PMOXhwVeSgV7eATyP9K4nVTFM_YL-b-LYYmacpkiN75OGRrQvkvirMdDCnl1JjOuNEmsKamUQptlvzJgzzdyhG8u8vUL43V8SAR8CkcxLa9YvEuuO5P_8AxgEeLA01h7REq3wROExpyZt9ckL-RPNZI45lp3E",
        year: "2nd year",
        major: "Economics"
      },
      content: "Does anyone have past questions for the Introduction to Economics course? I'm really struggling with the concepts and could use some help.",
      timestamp: "2d ago",
      likes: 23,
      comments: 12,
      shares: 5,
      isLiked: false,
      tags: ["Economics", "Study Help", "Past Questions"],
      commentsList: [
        {
          id: "1-1",
          author: {
            id: "user2",
            name: "Chukwudi Okoro",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0S5E8N6HCdmi72_gRdcZkvey8lskXChm57S3BAZwNEc7b4WLLCm56-mL0ZtRhZVU2YiafGCX2fVvNc4CTJ2x_YQheqzEye2GFuZxYNvO_SoqrwQshYhlBLIGQoAlAUs576QgN-KvGPBJV8xpoQmdERPVdQK1vgAcCzujRBzb6EXDoZsN1Vih9djTu1dffK2a4Itw-N7Uqpw48K1hVl0b4v9Afx8oopDivwk46atOpIGW-hlGqp6kisRjbafPTagS9eFRuBEotbgI",
            year: "3rd year",
            major: "Economics"
          },
          content: "I have some past questions from last year. I can share them with you if you'd like. They really helped me understand the key concepts.",
          timestamp: "1d ago",
          likes: 5,
          isLiked: false,
          replies: [
            {
              id: "1-1-1",
              author: currentUser,
              content: "That would be amazing! Could you please share them? I've been struggling with the supply and demand curves.",
              timestamp: "12h ago",
              likes: 2,
              isLiked: false,
              isReply: true,
              parentId: "1-1"
            }
          ]
        }
      ]
    },
    {
      id: "2",
      author: {
        id: "user3",
        name: "Fatima Hassan",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoiIMVywLqqXnA53u-Ie-O1Svapj37p-QY-ZXJJPTarNLpd7l0ILekEkaPFHN-S-KV-zCs5Fzgck3KqyjhlDf31QfIZryE8uzLD3kSDDgd0oleljE8XQ0YsB0Nn5IundQLIGsCQ7ermkdDsdkZKAevW7ftjahE-aiDqafLYDr7ikp7spa_-jiGxGE2iQWHT4XemEVQ4K3YABKDtD5TViqpJGwAUAcO6RVw2pWDPuLrMuVOvqkU0S6qs41XdCD4W1_GMFUykZenk1A",
        year: "2nd year",
        major: "Mathematics"
      },
      content: "Has anyone found a good study group for the Calculus II course? I'm looking for a group that meets regularly and is focused on problem-solving.",
      timestamp: "3d ago",
      likes: 18,
      comments: 8,
      shares: 3,
      isLiked: false,
      tags: ["Calculus", "Study Group", "Mathematics"],
      commentsList: [
        {
          id: "2-1",
          author: {
            id: "user4",
            name: "Obinna Eze",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAP5ov_vVGeCiX8mt_NpNvBbCpqYCY0V6OikSTo4AbWgBV76E4Q2UpFA34jA32ZHnBrATeI6p3n9vLKk6YcMIXZavNneGDpKYKePQ2I4vaTHkg7l5ZwD5KfklUt87zCeA6yLQhhRWlDY7HsV5p-JElb7NazPn6lPn2JyDWH9GYsWlT7whjOkM5eIZF70QA1BHL-lWmXdKcDNBASeR_imlGmTo16jHBOrgM3XvJejXypqJNwkCMmgxjDGEPxby0i-WZ2q-avDyQs128",
            year: "2nd year",
            major: "Engineering"
          },
          content: "I'm also looking for a study group for Calculus II. Maybe we can start one together? I'm free on Tuesday and Thursday evenings.",
          timestamp: "2d ago",
          likes: 3,
          isLiked: false
        }
      ]
    }
  ]);

  const navItems = [
    {
      icon: "House",
      label: "Home",
      active: false,
      onClick: () => router.push("/home")
    },
    {
      icon: "BookOpen",
      label: "Study",
      active: false,
      onClick: () => router.push("/study")
    },
    {
      icon: "Video",
      label: "Classes",
      active: false,
      onClick: () => router.push("/classes")
    },
    {
      icon: "Users",
      label: "Community",
      active: true,
      onClick: () => router.push("/community")
    },
    {
      icon: "User",
      label: "Profile",
      active: false,
      onClick: () => router.push("/profile")
    }
  ];

  // Simulate API call delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handlePostClick = (postId: string) => {
    router.push(`/community/${postId}`);
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const newPost: Post = {
      id: Date.now().toString(),
      author: currentUser,
      content: newPostContent,
      timestamp: "Just now",
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      tags: extractTags(newPostContent),
      commentsList: []
    };

    setPosts(prev => [newPost, ...prev]);
    setNewPostContent("");
    setIsLoading(false);
    postInputRef.current?.focus();
  };

  const extractTags = (content: string): string[] => {
    const tags: string[] = [];
    const commonSubjects = ["Economics", "Calculus", "Physics", "Chemistry", "Biology", "History", "Programming"];

    commonSubjects.forEach(subject => {
      if (content.toLowerCase().includes(subject.toLowerCase())) {
        tags.push(subject);
      }
    });

    if (content.toLowerCase().includes("study group") || content.toLowerCase().includes("study together")) {
      tags.push("Study Group");
    }
    if (content.toLowerCase().includes("help") || content.toLowerCase().includes("struggling")) {
      tags.push("Study Help");
    }

    return tags.slice(0, 3); // Limit to 3 tags
  };

  const handleLikePost = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPosts(prev => prev.map(post =>
      post.id === postId
        ? {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        }
        : post
    ));
  };

  const handleLikeComment = (postId: string, commentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPosts(prev => prev.map(post =>
      post.id === postId
        ? {
          ...post,
          commentsList: post.commentsList.map(comment =>
            updateCommentLikes(comment, commentId)
          )
        }
        : post
    ));
  };

  const updateCommentLikes = (comment: Comment, targetId: string): Comment => {
    if (comment.id === targetId) {
      return {
        ...comment,
        likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
        isLiked: !comment.isLiked
      };
    }

    if (comment.replies) {
      return {
        ...comment,
        replies: comment.replies.map(reply => updateCommentLikes(reply, targetId))
      };
    }

    return comment;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleCreatePost();
    }
  };

  const ReactionButton: React.FC<{
    count: number;
    isActive: boolean;
    onClick: (e: React.MouseEvent) => void;
    type: 'like' | 'comment' | 'share';
  }> = ({ count, isActive, onClick, type }) => {
    const icons = {
      like: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
          {isActive ? (
            <path d="M240,94c0,70-103.79,126.66-108.21,129a8,8,0,0,1-7.58,0C119.79,220.66,16,164,16,94A62.07,62.07,0,0,1,78,32c20.65,0,38.73,8.88,50,23.89C139.27,40.88,157.35,32,178,32A62.07,62.07,0,0,1,240,94Z" />
          ) : (
            <path d="M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94A46.06,46.06,0,0,1,78,48c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,147.61,146.24,196.15,128,206.8Z" />
          )}
        </svg>
      ),
      comment: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
          <path d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128ZM84,116a12,12,0,1,0,12,12A12,12,0,0,0,84,116Zm88,0a12,12,0,1,0,12,12A12,12,0,0,0,172,116Zm60,12A104,104,0,0,1,79.12,219.82L45.07,231.17a16,16,0,0,1-20.24-20.24l11.35-34.05A104,104,0,1,1,232,128Zm-16,0A88,88,0,1,0,51.81,172.06a8,8,0,0,1,.66,6.54L40,216,77.4,203.53a7.85,7.85,0,0,1,2.53-.42,8,8,0,0,1,4,1.08A88,88,0,0,0,216,128Z" />
        </svg>
      ),
      share: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
          <path d="M227.32,28.68a16,16,0,0,0-15.66-4.08l-.15,0L19.57,82.84a16,16,0,0,0-2.42,29.84l85.62,40.55,40.55,85.62A15.86,15.86,0,0,0,157.74,248q.69,0,1.38-.06a15.88,15.88,0,0,0,14-11.51l58.2-191.94c0-.05,0-.1,0-.15A16,16,0,0,0,227.32,28.68ZM157.83,231.85l-.05.14L118.42,148.9l47.24-47.25a8,8,0,0,0-11.31-11.31L107.1,137.58,24,98.22l.14,0L216,40Z" />
        </svg>
      )
    };

    return (
      <button
        onClick={onClick}
        className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-200 ${isActive
          ? 'text-[#0d191c] bg-[#e7f1f4]'
          : 'text-[#498a9c] hover:bg-[#f0f7fa] hover:text-[#0d191c]'
          }`}
      >
        <div className={`${isActive && type === 'like' ? 'text-red-500' : ''}`}>
          {icons[type]}
        </div>
        <span className="text-[13px] font-bold leading-normal tracking-[0.015em] min-w-[20px] text-center">
          {count}
        </span>
      </button>
    );
  };

  const CommentItem: React.FC<{
    comment: Comment;
    onLike: (commentId: string, e: React.MouseEvent) => void;
    depth?: number;
  }> = ({ comment, onLike, depth = 0 }) => (
    <div className={`${depth > 0 ? 'ml-12 border-l-2 border-[#e7f1f4] pl-4' : ''}`}>
      <div className="flex gap-3 p-3 hover:bg-[#fafdfe] transition-colors rounded-lg">
        <img
          src={comment.author.avatar}
          alt={comment.author.name}
          className="w-8 h-8 rounded-full flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm text-[#0d191c]">
              {comment.author.name}
            </span>
            <span className="text-xs text-[#498a9c]">
              {comment.timestamp}
            </span>
          </div>
          <p className="text-sm text-[#0d191c] mb-2 leading-relaxed">
            {comment.content}
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={(e) => onLike(comment.id, e)}
              className={`flex items-center gap-1 text-xs font-medium transition-colors ${comment.isLiked ? 'text-[#0d191c]' : 'text-[#498a9c] hover:text-[#0d191c]'
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256">
                <path d="M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32Z" />
              </svg>
              {comment.likes > 0 && comment.likes}
            </button>
            {!comment.isReply && (
              <button className="text-xs text-[#498a9c] hover:text-[#0d191c] font-medium transition-colors">
                Reply
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Nested Replies */}
      {comment.replies?.map(reply => (
        <CommentItem
          key={reply.id}
          comment={reply}
          onLike={onLike}
          depth={depth + 1}
        />
      ))}
    </div>
  );

  if (isLoading && posts.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8fbfc] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#498a9c]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#f8fbfc]">
      {/* Header */}
      <Header title="Community" />

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Create Post Input */}
        <div className="bg-white p-4 border-b border-[#e7f1f4]">
          <div className="flex gap-3 items-center">
            <img
              src={currentUser.avatar}
              alt="Your avatar"
              className="w-12 h-12 rounded-full flex-shrink-0"
            />
            <div className="flex-1 relative">
              <input
                ref={postInputRef}
                type="text"
                placeholder="Share a question or note..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="w-full bg-[#e7f1f4] rounded-xl px-4 py-3 text-[#0d191c] placeholder-[#498a9c] border-none outline-none text-sm disabled:opacity-50"
              />
              {newPostContent && (
                <button
                  onClick={handleCreatePost}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#498a9c] hover:text-[#0d191c] transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#498a9c]"></div>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M227.32,28.68a16,16,0,0,0-15.66-4.08l-.15,0L19.57,82.84a16,16,0,0,0-2.42,29.84l85.62,40.55,40.55,85.62A15.86,15.86,0,0,0,157.74,248q.69,0,1.38-.06a15.88,15.88,0,0,0,14-11.51l58.2-191.94c0-.05,0-.1,0-.15A16,16,0,0,0,227.32,28.68Z" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Trending Section */}
        <div className="bg-white px-4 py-3 border-b border-[#e7f1f4]">
          <h3 className="text-[#0d191c] text-lg font-bold leading-tight tracking-[-0.015em]">
            Trending Discussions
          </h3>
        </div>

        {/* Posts List */}
        <div className="space-y-4 p-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-sm border border-[#e7f1f4] overflow-hidden">
              {/* Post Content */}
              <div
                className="p-4 cursor-pointer hover:bg-[#fafdfe] transition-colors"
                onClick={() => handlePostClick(post.id)}
              >
                <div className="flex gap-3">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-12 h-12 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-[#0d191c] text-sm">
                        {post.author.name}
                      </h4>
                      <span className="text-xs text-[#498a9c]">
                        {post.timestamp}
                      </span>
                    </div>
                    <p className="text-[#0d191c] text-sm leading-relaxed mb-3">
                      {post.content}
                    </p>

                    {/* Tags */}
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-[#e7f1f4] text-[#498a9c] text-xs font-medium rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Post Reactions */}
              <div className="flex gap-2 px-4 py-3 border-t border-[#e7f1f4]">
                <ReactionButton
                  count={post.likes}
                  isActive={post.isLiked}
                  onClick={(e) => handleLikePost(post.id, e)}
                  type="like"
                />
                <ReactionButton
                  count={post.comments}
                  isActive={false}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePostClick(post.id);
                  }}
                  type="comment"
                />
                <ReactionButton
                  count={post.shares}
                  isActive={false}
                  onClick={(e) => e.stopPropagation()}
                  type="share"
                />
              </div>

              {/* Recent Comments Preview */}
              {post.commentsList.slice(0, 2).map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onLike={(commentId, e) => handleLikeComment(post.id, commentId, e)}
                />
              ))}

              {/* View All Comments Link */}
              {post.comments > 2 && (
                <div className="px-4 py-3 border-t border-[#f0f7fa]">
                  <button
                    onClick={() => handlePostClick(post.id)}
                    className="text-[#498a9c] text-sm font-medium hover:text-[#0d191c] transition-colors"
                  >
                    View all {post.comments} comments
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <BottomNav navItems={navItems} />
    </div>
  );
};

export default CommunityPage;

