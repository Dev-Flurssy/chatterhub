const API_URL = '/api/chat';

/** Get auth token from localStorage */
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      console.warn('[chatApi] No JWT found in localStorage');
      return null;
    }
    const parsed = JSON.parse(jwt);
    if (!parsed.token) {
      console.warn('[chatApi] JWT object missing token property');
      return null;
    }
    return parsed.token;
  } catch (error) {
    console.error('[chatApi] Error parsing JWT:', error);
    return null;
  }
};

export const chatApi = {
  // Get all conversations
  getConversations: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/conversations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch conversations');
    return response.json();
  },

  // Get or create conversation with a user
  getOrCreateConversation: async (userId: string) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/conversations/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to get conversation');
    return response.json();
  },

  // Get messages in a conversation
  getMessages: async (conversationId: string, page = 1) => {
    const token = getAuthToken();
    const response = await fetch(
      `${API_URL}/conversations/${conversationId}/messages?page=${page}&limit=50`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      }
    );
    if (!response.ok) throw new Error('Failed to fetch messages');
    return response.json();
  },

  // Send a message
  sendMessage: async (conversationId: string, content: string) => {
    const token = getAuthToken();
    const response = await fetch(
      `${API_URL}/conversations/${conversationId}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ content }),
      }
    );
    if (!response.ok) throw new Error('Failed to send message');
    return response.json();
  },

  // Mark messages as read
  markAsRead: async (conversationId: string) => {
    const token = getAuthToken();
    const response = await fetch(
      `${API_URL}/conversations/${conversationId}/read`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      }
    );
    if (!response.ok) throw new Error('Failed to mark as read');
    return response.json();
  },

  // Delete a message
  deleteMessage: async (messageId: string) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/messages/${messageId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to delete message');
    return response.json();
  },

  // Search users
  searchUsers: async (query: string) => {
    const token = getAuthToken();
    const response = await fetch(
      `${API_URL}/users/search?query=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      }
    );
    if (!response.ok) throw new Error('Failed to search users');
    return response.json();
  },
};
