import { useSocket } from '@/contexts/SocketContext';

/**
 * Hook to check if a user is online
 * @param userId - User ID to check
 * @returns boolean indicating if user is online
 */
export function useOnlineStatus(userId: string | undefined): boolean {
  const { onlineUsers } = useSocket();
  
  if (!userId) return false;
  return onlineUsers.includes(userId);
}

/**
 * Hook to get all online users
 * @returns Array of online user IDs
 */
export function useOnlineUsers(): string[] {
  const { onlineUsers } = useSocket();
  return onlineUsers;
}
