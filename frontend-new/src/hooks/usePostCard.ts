import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { postApi } from '@/lib/postApi';
import type { Post } from '@/types';

export function usePostCard(post: Post, onUpdate: () => void) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);

  const isLiked = user ? post.likes.includes(user._id) : false;
  const isOwner = user?._id === (typeof post.postedBy === 'string' ? post.postedBy : post.postedBy._id);

  const handleLike = async () => {
    try {
      if (isLiked) {
        await postApi.unlikePost(post._id);
      } else {
        await postApi.likePost(post._id);
      }
      onUpdate();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;

    setLoading(true);
    try {
      await postApi.addComment(post._id, commentText);
      setCommentText('');
      onUpdate();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await postApi.deletePost(post._id);
      onUpdate();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return {
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
  };
}
