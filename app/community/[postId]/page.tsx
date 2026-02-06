import { useNavigate, useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
    id: string;
  };
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
  author: {
    name: string;
    avatar: string;
    year: string;
    major: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  tags: string[];
}

const CommunityPostDetail: React.FC = () => {
  const navigate = useNavigate();
  useParams<{ postId: string; }>();
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  // Mock data - in production, this would come from an API
  const [post, setPost] = useState<Post>({
    id: "1",
    author: {
      name: "Aisha Adebayo",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4uzTKyAm5wbmebOCIqI-1VbPa1yeYZRZ81bKKXQYoZXJYP-IfPs6A0rr-5KrF93bfMa4kXASuMBFrEFVrjPmGgxSqaiwi2BTfWQUsu8Ph0SDN7BcrS8wHUZPVG63w7GjYko3r29lBKYCb-hHfT56UiJpDZb7MO1lGrc7AWfhFbNC8J07t0zGLNygw6Iyd7qUFV-TqZI41uPyk9y0LYAE8XNz-rbfgYSDQB96WxjQdhLaADN5i83HapJEWNdo7R_9bIm3Z85Y6dzM",
      year: "2nd year",
      major: "Computer Science"
    },
    content: "Anyone taking Data Structures this semester? Need help with the linked list implementation. Specifically struggling with doubly linked lists and circular linked list concepts.",
    timestamp: "2d ago",
    likes: 23,
    comments: 12,
    isLiked: false,
    tags: ["Data Structures", "Linked Lists", "Study Help"]
  });

  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: {
        name: "Aisha Bello",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBG5tgypbakWnRnGvY7Z3vLXrxaqxrO2quw6KyWQ1zqVAl_BBSBq1HJJiW82wk_3lV7jT_DtbBdQnpaUBAEqnbe8N5Q3AmOAyLPi9YJvRUlWy6th8sIHZo9OvclVmeXEPlUwjbmwnAcvaEXPKfTahb6g59ecstUnrbRjcqDfi05HvoyAy3FqriCRfczWkd8_CRjK-m8UpUxHsoY6asrOWGIi_GkHfNoTTHuKTIu23rWAB9JC4Cv8fb3h9IEXSDJT1ZJ3QCtG8nZfjI",
        id: "user2"
      },
      content: "I'm in that class! We can study together. I'm also struggling with linked lists, especially the pointer manipulation part.",
      timestamp: "1d ago",
      likes: 5,
      isLiked: false,
      replies: [
        {
          id: "1-1",
          author: {
            name: "Chukwudi Okoro",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjxc1_ZT8P11yVziKizCzDyHVFPV-NdpkLRCECKwVgI8xkoPUIywtlcYr2-YbV5RQUkQWs83Oltuq31MSto6AgthaiW2-tAl-u1Z5LKywKXcKbwdabun4kkwvPh-HnFU-39XvrpLH8TXwbluGummBGCtubcMbp6IRXgYYK2LvOf30FQQd68_jljTzHAzqu_xXT7-3N0YdLiJw3GXWFmtYJAJkN7oVCdz3LWKvhr-DooBs-NjD9ySUR76rH_Kva9kybenJ_RjrO7_E",
            id: "user3"
          },
          content: "I can help too! I've got a good grasp on linked lists. Let's create a study group on Discord?",
          timestamp: "12h ago",
          likes: 3,
          isLiked: false,
          isReply: true,
          parentId: "1"
        }
      ]
    },
    {
      id: "2",
      author: {
        name: "Ngozi Eze",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAZZUauW_8ogtmULdPSLNoGOO7lRT8ojSo0Ni5ESOVkaM07qfZgukVSZTIrtXzgKcjbKVFDjZrHNJ9jtvKpWlaqL6B8221z7s97142GRIcD0oqzahV-vVO3R8xKnFRmfLPbbsipKNYEux7s8HMTh4359cK3o9XD3Vn6RvZDsnQQH-bWE44pbHJuytyVutp8ygmMw6Ztgp6R8CfbH1YE01UTVIxAvps7B-FaE2hyBBTrWSEn08XLfTVOe0JkfegTBNZGNNcuJT01Ps",
        id: "user4"
      },
      content: "I'm in the same boat. Maybe we can form a study group? I found some good practice problems online that we can work through together.",
      timestamp: "8h ago",
      likes: 2,
      isLiked: false
    }
  ]);

  // Scroll to bottom when comments update
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const handleLikePost = () => {
    setPost(prev => ({
      ...prev,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
      isLiked: !prev.isLiked
    }));
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1, isLiked: !comment.isLiked }
          : comment
      )
    );
  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const commentData: Comment = {
      id: Date.now().toString(),
      author: {
        name: "Current User", // Would come from auth context
        avatar: "https://lh3.googleusercontent.com/aida-public/default-avatar",
        id: "current-user"
      },
      content: newComment,
      timestamp: "Just now",
      likes: 0,
      isLiked: false,
      ...(replyingTo && { isReply: true, parentId: replyingTo })
    };

    if (replyingTo) {
      // Add as reply
      setComments(prev =>
        prev.map(comment =>
          comment.id === replyingTo
            ? {
                ...comment,
                replies: [...(comment.replies || []), commentData]
              }
            : comment
        )
      );
    } else {
      // Add as top-level comment
      setComments(prev => [commentData, ...prev]);
      setPost(prev => ({ ...prev, comments: prev.comments + 1 }));
    }

    setNewComment("");
    setReplyingTo(null);
    commentInputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  const startReply = (commentId: string, authorName: string) => {
    setReplyingTo(commentId);
    setNewComment(`@${authorName} `);
    commentInputRef.current?.focus();
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setNewComment("");
  };

  const formatTimeAgo = (timestamp: string) => {
    // In production, you'd use a proper date formatting library like date-fns
    return timestamp;
  };

  const ReactionButton: React.FC<{
    count: number;
    isActive: boolean;
    onClick: () => void;
    type: 'like' | 'comment';
  }> = ({ count, isActive, onClick, type }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
        isActive 
          ? 'text-[#4c669a] bg-[#e7ebf3]' 
          : 'text-[#4c669a] hover:bg-[#f0f3f9] hover:text-[#0d121b]'
      }`}
    >
      {type === 'like' ? (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          fill="currentColor" 
          viewBox="0 0 256 256"
          className={isActive ? 'text-red-500' : ''}
        >
          {isActive ? (
            <path d="M240,94c0,70-103.79,126.66-108.21,129a8,8,0,0,1-7.58,0C119.79,220.66,16,164,16,94A62.07,62.07,0,0,1,78,32c20.65,0,38.73,8.88,50,23.89C139.27,40.88,157.35,32,178,32A62.07,62.07,0,0,1,240,94Z"/>
          ) : (
            <path d="M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94A46.06,46.06,0,0,1,78,48c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,147.61,146.24,196.15,128,206.8Z"/>
          )}
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
          <path d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128ZM84,116a12,12,0,1,0,12,12A12,12,0,0,0,84,116Zm88,0a12,12,0,1,0,12,12A12,12,0,0,0,172,116Zm60,12A104,104,0,0,1,79.12,219.82L45.07,231.17a16,16,0,0,1-20.24-20.24l11.35-34.05A104,104,0,1,1,232,128Zm-16,0A88,88,0,1,0,51.81,172.06a8,8,0,0,1,.66,6.54L40,216,77.4,203.53a7.85,7.85,0,0,1,2.53-.42,8,8,0,0,1,4,1.08A88,88,0,0,0,216,128Z"/>
        </svg>
      )}
      <span className="text-sm font-semibold min-w-[20px] text-center">{count}</span>
    </button>
  );

  const CommentItem: React.FC<{ comment: Comment; depth?: number }> = ({ comment, depth = 0 }) => (
    <div className={`${depth > 0 ? 'ml-12 border-l-2 border-[#e7ebf3] pl-4' : ''}`}>
      <div className="flex gap-3 p-4 hover:bg-[#fafbfe] transition-colors rounded-lg">
        <img
          src={comment.author.avatar}
          alt={comment.author.name}
          className="w-10 h-10 rounded-full flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm text-[#0d121b]">
              {comment.author.name}
            </span>
            <span className="text-xs text-[#4c669a]">
              {formatTimeAgo(comment.timestamp)}
            </span>
          </div>
          <p className="text-sm text-[#0d121b] mb-2 leading-relaxed">
            {comment.content}
          </p>
          <div className="flex items-center gap-4">
            <ReactionButton
              count={comment.likes}
              isActive={comment.isLiked}
              onClick={() => handleLikeComment(comment.id)}
              type="like"
            />
            {!comment.isReply && (
              <button
                onClick={() => startReply(comment.id, comment.author.name)}
                className="text-xs text-[#4c669a] hover:text-[#0d121b] font-medium transition-colors"
              >
                Reply
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Nested Replies */}
      {comment.replies?.map(reply => (
        <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-[#f8f9fc]">
      {/* Header */}
      <div className="flex items-center bg-white p-4 border-b border-[#e7ebf3] sticky top-0 z-10">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-10 h-10 text-[#0d121b] hover:bg-[#f0f3f9] rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
            <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/>
          </svg>
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-[#0d121b] pr-12">
          Discussion
        </h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Post Content */}
        <div className="bg-white p-6 border-b border-[#e7ebf3]">
          <div className="flex gap-4">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-16 h-16 rounded-full flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="font-bold text-[#0d121b] text-lg">{post.author.name}</h2>
                <span className="text-sm text-[#4c669a]">{post.timestamp}</span>
              </div>
              <p className="text-[#0d121b] mb-3 leading-relaxed">{post.content}</p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-[#e7ebf3] text-[#4c669a] text-xs font-medium rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Author Info */}
              <div className="text-sm text-[#4c669a]">
                {post.author.year} • {post.author.major}
              </div>
            </div>
          </div>

          {/* Post Reactions */}
          <div className="flex gap-4 mt-4 pt-4 border-t border-[#e7ebf3]">
            <ReactionButton
              count={post.likes}
              isActive={post.isLiked}
              onClick={handleLikePost}
              type="like"
            />
            <ReactionButton
              count={post.comments}
              isActive={false}
              onClick={() => commentInputRef.current?.focus()}
              type="comment"
            />
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white">
          <h3 className="px-6 py-4 text-lg font-bold text-[#0d121b] border-b border-[#e7ebf3]">
            Comments ({post.comments})
          </h3>
          
          <div className="divide-y divide-[#f0f3f9]">
            {comments.map(comment => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
          
          <div ref={commentsEndRef} />
        </div>
      </div>

      {/* Comment Input */}
      <div className="bg-white border-t border-[#e7ebf3] p-4 sticky bottom-0">
        {replyingTo && (
          <div className="flex items-center justify-between mb-2 px-3 py-2 bg-[#f0f3f9] rounded-lg">
            <span className="text-sm text-[#4c669a]">
              Replying to {comments.find(c => c.id === replyingTo)?.author.name}
            </span>
            <button
              onClick={cancelReply}
              className="text-[#4c669a] hover:text-[#0d121b] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/>
              </svg>
            </button>
          </div>
        )}
        
        <div className="flex gap-3 items-center">
          <img
            src="https://lh3.googleusercontent.com/aida-public/default-avatar"
            alt="Your avatar"
            className="w-10 h-10 rounded-full flex-shrink-0"
          />
          <div className="flex-1 flex items-center bg-[#f0f3f9] rounded-xl px-4 py-2">
            <input
              ref={commentInputRef}
              type="text"
              placeholder={replyingTo ? "Write your reply..." : "Add a comment..."}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-transparent border-none outline-none text-[#0d121b] placeholder-[#4c669a] text-sm"
            />
            <button
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
              className={`ml-2 p-2 rounded-lg transition-colors ${
                newComment.trim()
                  ? 'text-[#4c669a] hover:text-[#0d121b] hover:bg-[#e7ebf3]'
                  : 'text-[#c7d1e3] cursor-not-allowed'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                <path d="M227.32,28.68a16,16,0,0,0-15.66-4.08l-.15,0L19.57,82.84a16,16,0,0,0-2.42,29.84l85.62,40.55,40.55,85.62A15.86,15.86,0,0,0,157.74,248q.69,0,1.38-.06a15.88,15.88,0,0,0,14-11.51l58.2-191.94c0-.05,0-.1,0-.15A16,16,0,0,0,227.32,28.68Z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPostDetail;