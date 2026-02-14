import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import { chatApi } from '@/lib/chatApi';
import type { Conversation, Message, User } from '@/types';

export function useChat() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load conversations
  const loadConversations = useCallback(async () => {
    try {
      const data = await chatApi.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  }, []);

  // Load messages for a conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      setLoading(true);
      const data = await chatApi.getMessages(conversationId);
      setMessages(data.messages);
      await chatApi.markAsRead(conversationId);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Select a conversation
  const selectConversation = useCallback(async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    await loadMessages(conversation._id);
  }, [loadMessages]);

  // Send a message
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !selectedConversation) return;

    try {
      const message = await chatApi.sendMessage(selectedConversation._id, content);
      setMessages((prev) => [...prev, message]);

      // Emit socket event
      const otherUser = selectedConversation.participants.find((p) => p._id !== user?._id);
      if (socket && otherUser) {
        socket.emit('message:send', {
          recipientId: otherUser._id,
          message,
        });
      }

      // Update conversations list
      loadConversations();
      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    }
  }, [selectedConversation, socket, user, loadConversations]);

  // Handle typing indicator
  const handleTyping = useCallback(() => {
    if (!socket || !selectedConversation) return;

    const otherUser = selectedConversation.participants.find((p) => p._id !== user?._id);
    if (otherUser) {
      socket.emit('typing:start', { recipientId: otherUser._id });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing:stop', { recipientId: otherUser._id });
      }, 2000);
    }
  }, [socket, selectedConversation, user]);

  // Start chat with a user
  const startChat = useCallback(async (otherUser: User) => {
    try {
      const conversation = await chatApi.getOrCreateConversation(otherUser._id);
      setConversations((prev) => {
        const exists = prev.find((c) => c._id === conversation._id);
        return exists ? prev : [conversation, ...prev];
      });
      setSelectedConversation(conversation);
      await loadMessages(conversation._id);
      return conversation;
    } catch (error) {
      console.error('Failed to start chat:', error);
      return null;
    }
  }, [loadMessages]);

  // Socket event handlers
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data: any) => {
      if (selectedConversation && data.message.conversation === selectedConversation._id) {
        setMessages((prev) => [...prev, data.message]);
        chatApi.markAsRead(selectedConversation._id);
      }
      loadConversations();
    };

    const handleTypingStart = (data: { userId: string }) => {
      setTypingUsers((prev) => new Set(prev).add(data.userId));
    };

    const handleTypingStop = (data: { userId: string }) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(data.userId);
        return newSet;
      });
    };

    const handleMessageRead = () => {
      loadConversations();
    };

    socket.on('message:new', handleNewMessage);
    socket.on('typing:start', handleTypingStart);
    socket.on('typing:stop', handleTypingStop);
    socket.on('message:read', handleMessageRead);

    return () => {
      socket.off('message:new', handleNewMessage);
      socket.off('typing:start', handleTypingStart);
      socket.off('typing:stop', handleTypingStop);
      socket.off('message:read', handleMessageRead);
    };
  }, [socket, selectedConversation, loadConversations]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Helper functions
  const getOtherUser = useCallback((conversation: Conversation): User => {
    return conversation.participants.find((p) => p._id !== user?._id) || conversation.participants[0];
  }, [user]);

  const isTyping = useCallback((conversation: Conversation): boolean => {
    const otherUser = getOtherUser(conversation);
    return typingUsers.has(otherUser._id);
  }, [typingUsers, getOtherUser]);

  return {
    conversations,
    selectedConversation,
    messages,
    loading,
    typingUsers,
    selectConversation,
    sendMessage,
    handleTyping,
    startChat,
    getOtherUser,
    isTyping,
    setSelectedConversation,
  };
}
