import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { userApi } from '@/lib/userApi';
import { postApi } from '@/lib/postApi';
import type { User, Post } from '@/types';

export function useProfile(userId?: string) {
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const isOwnProfile = currentUser?._id === userId;

  const fetchProfile = useCallback(async () => {
    if (!userId) return;

    try {
      const data = await userApi.getUser(userId);
      setProfileUser(data);
      setFollowing(currentUser ? data.followers.includes(currentUser._id) : false);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }, [userId, currentUser]);

  const fetchUserPosts = useCallback(async () => {
    if (!userId) return;

    try {
      const data = await postApi.getPostsByUser(userId);
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }, [userId]);

  const handleFollow = async () => {
    if (!userId) return;
    setFollowLoading(true);
    try {
      if (following) {
        await userApi.unfollowUser(userId);
      } else {
        await userApi.followUser(userId);
      }
      setFollowing(!following);
      fetchProfile(); // Refresh to update follower count
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProfile();
      fetchUserPosts();
    }
  }, [userId, fetchProfile, fetchUserPosts]);

  return {
    profileUser,
    posts,
    loading,
    following,
    followLoading,
    isOwnProfile,
    handleFollow,
    fetchUserPosts,
  };
}
