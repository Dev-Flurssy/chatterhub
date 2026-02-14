import { useState, useEffect } from 'react';
import { userApi } from '@/lib/userApi';
import { useAuth } from '@/contexts/AuthContext';
import type { User } from '@/types';

export function useFindPeople() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (currentUser?._id) {
      fetchPeople();
    }
  }, [currentUser]);

  const fetchPeople = async () => {
    if (!currentUser?._id) return;

    try {
      const data = await userApi.findPeople(currentUser._id);
      setUsers(data);
    } catch (error) {
      console.error('Error fetching people:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId: string) => {
    try {
      await userApi.followUser(userId);
      setFollowingIds((prev) => new Set(prev).add(userId));
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  return {
    users,
    loading,
    followingIds,
    handleFollow,
  };
}
