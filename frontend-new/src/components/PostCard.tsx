import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Trash2, Send } from 'lucide-react';
import { usePostCard } from '@/hooks/usePostCard';
import { formatDate } from '@/lib/utils';
import type { Post, User } from '@/types';

interface PostCardProps {
  post: Post;
  onUpdate: () => void;
}

export function PostCard({ post, onUpdate }: PostCardProps) {
  const {
    showComments,
    setShowComments,
    commentText,
    setCommentText,
    loading,
    isLiked,
    isOwner,
    handleLike,
    handleComment,
    handleDelete,
  } = usePostCard(post, onUpdate);

  const postedBy = typeof post.postedBy === 'string' ? null : (post.postedBy as User);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <Link to={`/profile/${typeof post.postedBy === 'string' ? post.postedBy : post.postedBy._id}`} className="flex items-center space-x-3">
          {postedBy?.profilePic ? (
            <img
              src={postedBy.profilePic}
              alt={postedBy.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
              {postedBy?.name.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900 dark:text-white hover:text-primary">
              {postedBy?.name || 'Unknown User'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(post.createdAt)}
            </p>
          </div>
        </Link>
        {isOwner && (
          <button
            onClick={handleDelete}
            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
          {post.text}
        </p>
      </div>

      {/* Media */}
      {post.photo && (
        <div className="w-full">
          <img
            src={post.photo}
            alt="Post content"
            className="w-full object-cover max-h-96"
          />
        </div>
      )}
      {post.video && (
        <div className="w-full">
          <video
            src={post.video}
            controls
            className="w-full max-h-96"
          />
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isLiked
                  ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{post.likes.length}</span>
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{post.comments.length}</span>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 space-y-3">
            {/* Comment Input */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                placeholder="Write a comment..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                onClick={handleComment}
                disabled={loading || !commentText.trim()}
                className="p-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            {/* Comments List */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {post.comments.map((comment) => {
                const commentUser = typeof comment.postedBy === 'string' ? null : (comment.postedBy as User);
                return (
                  <div key={comment._id} className="flex space-x-2">
                    {commentUser?.profilePic ? (
                      <img
                        src={commentUser.profilePic}
                        alt={commentUser.name}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                        {commentUser?.name.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {commentUser?.name || 'Unknown User'}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {comment.text}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
