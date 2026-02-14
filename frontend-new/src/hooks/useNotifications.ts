import { useEffect, useState, useCallback } from 'react';
import { useSocket } from '@/contexts/SocketContext';

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'message' | 'system';
  title: string;
  message: string;
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  link?: string;
  read: boolean;
  timestamp: Date;
}

export function useNotifications() {
  const { socket, isConnected } = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Listen for new notifications
    socket.on('notification:new', (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      
      // Show browser notification if permitted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: notification.senderAvatar || '/logo192.png',
        });
      }
    });

    // Listen for post likes
    socket.on('post:liked', ({ postId, likedBy }) => {
      const notification: Notification = {
        id: `like-${postId}-${Date.now()}`,
        type: 'like',
        title: 'New Like',
        message: 'Someone liked your post',
        senderId: likedBy,
        read: false,
        timestamp: new Date(),
        link: `/posts/${postId}`,
      };
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    // Listen for post comments
    socket.on('post:commented', ({ postId, commentedBy, comment }) => {
      const notification: Notification = {
        id: `comment-${postId}-${Date.now()}`,
        type: 'comment',
        title: 'New Comment',
        message: comment.substring(0, 50) + (comment.length > 50 ? '...' : ''),
        senderId: commentedBy,
        read: false,
        timestamp: new Date(),
        link: `/posts/${postId}`,
      };
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    // Listen for new followers
    socket.on('user:followed', ({ followerId }) => {
      const notification: Notification = {
        id: `follow-${followerId}-${Date.now()}`,
        type: 'follow',
        title: 'New Follower',
        message: 'Someone started following you',
        senderId: followerId,
        read: false,
        timestamp: new Date(),
        link: `/profile/${followerId}`,
      };
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    // Listen for new messages
    socket.on('message:new', ({ senderId, message }) => {
      const notification: Notification = {
        id: `message-${senderId}-${Date.now()}`,
        type: 'message',
        title: 'New Message',
        message: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        senderId,
        read: false,
        timestamp: new Date(),
        link: `/chat/${senderId}`,
      };
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      socket.off('notification:new');
      socket.off('post:liked');
      socket.off('post:commented');
      socket.off('user:followed');
      socket.off('message:new');
    };
  }, [socket, isConnected]);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  }, []);

  const clearNotification = useCallback((notificationId: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId));
    const notification = notifications.find((n) => n.id === notificationId);
    if (notification && !notification.read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  }, [notifications]);

  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }, []);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAll,
    requestPermission,
  };
}
