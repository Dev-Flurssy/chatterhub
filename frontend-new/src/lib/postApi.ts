import type { Post } from '@/types';

const POST_BASE = '/api/posts';

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

export const postApi = {
  /** Get all posts (newsfeed) */
  getAllPosts: async (): Promise<Post[]> => {
    const token = getAuthToken();
    const response = await fetch(POST_BASE, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });
    return handleResponse<Post[]>(response);
  },

  /** Get posts by user */
  getPostsByUser: async (userId: string): Promise<Post[]> => {
    const token = getAuthToken();
    const response = await fetch(`${POST_BASE}/by/${userId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });
    return handleResponse<Post[]>(response);
  },

  /** Create a new post */
  createPost: async (formData: FormData): Promise<Post> => {
    const token = getAuthToken();
    const response = await fetch(`${POST_BASE}/new`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: formData,
    });
    return handleResponse<Post>(response);
  },

  /** Like a post */
  likePost: async (postId: string): Promise<Post> => {
    const token = getAuthToken();
    const response = await fetch(`${POST_BASE}/like`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify({ postId }),
    });
    return handleResponse<Post>(response);
  },

  /** Unlike a post */
  unlikePost: async (postId: string): Promise<Post> => {
    const token = getAuthToken();
    const response = await fetch(`${POST_BASE}/unlike`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify({ postId }),
    });
    return handleResponse<Post>(response);
  },

  /** Add a comment */
  addComment: async (postId: string, text: string): Promise<Post> => {
    const token = getAuthToken();
    const response = await fetch(`${POST_BASE}/comment`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify({ postId, comment: { text } }),
    });
    return handleResponse<Post>(response);
  },

  /** Delete a post */
  deletePost: async (postId: string): Promise<{ message: string }> => {
    const token = getAuthToken();
    const response = await fetch(`${POST_BASE}/${postId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });
    return handleResponse<{ message: string }>(response);
  },

  /** Search posts by text content */
  searchPosts: async (query: string): Promise<Post[]> => {
    const token = getAuthToken();
    const response = await fetch(`${POST_BASE}/search?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });
    return handleResponse<Post[]>(response);
  },
};
