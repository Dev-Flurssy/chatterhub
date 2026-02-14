import type { User } from '@/types';

const USER_BASE = '/api/users';

/** Unified response handler */
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorMessage: string;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || 'Something went wrong';
    } catch {
      errorMessage = await response.text();
    }
    throw new Error(`Error ${response.status}: ${errorMessage}`);
  }
  return response.json();
};

/** Get auth token from localStorage */
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) return null;
    const parsed = JSON.parse(jwt);
    return parsed.token;
  } catch {
    return null;
  }
};

export const userApi = {
  /** Get user by ID */
  getUser: async (userId: string): Promise<User> => {
    const token = getAuthToken();
    const response = await fetch(`${USER_BASE}/${userId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });
    return handleResponse<User>(response);
  },

  /** Update user profile */
  updateUser: async (userId: string, formData: FormData): Promise<User> => {
    const token = getAuthToken();
    const response = await fetch(`${USER_BASE}/${userId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: formData,
    });
    return handleResponse<User>(response);
  },

  /** Follow a user */
  followUser: async (userId: string): Promise<User> => {
    const token = getAuthToken();
    const response = await fetch(`${USER_BASE}/follow`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify({ userId }),
    });
    return handleResponse<User>(response);
  },

  /** Unfollow a user */
  unfollowUser: async (userId: string): Promise<User> => {
    const token = getAuthToken();
    const response = await fetch(`${USER_BASE}/unfollow`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify({ userId }),
    });
    return handleResponse<User>(response);
  },

  /** Get user's followers */
  getFollowers: async (userId: string): Promise<User[]> => {
    const token = getAuthToken();
    const response = await fetch(`${USER_BASE}/${userId}/followers`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });
    return handleResponse<User[]>(response);
  },

  /** Get user's following */
  getFollowing: async (userId: string): Promise<User[]> => {
    const token = getAuthToken();
    const response = await fetch(`${USER_BASE}/${userId}/following`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });
    return handleResponse<User[]>(response);
  },

  /** Find users to follow */
  findPeople: async (userId: string): Promise<User[]> => {
    const token = getAuthToken();
    const response = await fetch(`${USER_BASE}/findpeople/${userId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });
    return handleResponse<User[]>(response);
  },

  /** Deactivate account */
  deactivateAccount: async (): Promise<{ message: string }> => {
    const token = getAuthToken();
    const response = await fetch(`${USER_BASE}/deactivate`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });
    return handleResponse<{ message: string }>(response);
  },

  /** Delete account permanently */
  deleteAccount: async (): Promise<{ message: string }> => {
    const token = getAuthToken();
    const response = await fetch(`${USER_BASE}/delete-account`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });
    return handleResponse<{ message: string }>(response);
  },

  /** Search users by name, email, or username */
  searchUsers: async (query: string): Promise<User[]> => {
    const token = getAuthToken();
    const response = await fetch(`${USER_BASE}/search?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });
    return handleResponse<User[]>(response);
  },
};
