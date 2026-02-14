import type { AuthData, SignupData, SigninData } from '@/types';

const AUTH_BASE = '/api/auth';

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

// ============ AUTH API ============

export const authApi = {
  /** Sign up a new user */
  signup: async (user: SignupData): Promise<AuthData> => {
    const response = await fetch(`${AUTH_BASE}/signup`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    return handleResponse<AuthData>(response);
  },

  /** Sign in existing user */
  signin: async (user: SigninData): Promise<AuthData> => {
    const response = await fetch(`${AUTH_BASE}/signin`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(user),
    });

    const data = await handleResponse<AuthData>(response);

    // Store JWT in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('jwt', JSON.stringify(data));
    }

    return data;
  },

  /** Sign out */
  signout: async (): Promise<{ message: string }> => {
    const response = await fetch(`${AUTH_BASE}/signout`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Signout failed: ${errorText}`);
    }

    if (typeof window !== 'undefined') {
      localStorage.removeItem('jwt');
    }

    return response.json();
  },

  /** Check if user is authenticated */
  isAuthenticated: (): AuthData | null => {
    if (typeof window === 'undefined') return null;

    try {
      const jwt = localStorage.getItem('jwt');
      if (!jwt) return null;
      return JSON.parse(jwt) as AuthData;
    } catch (error) {
      console.error('Invalid JWT in localStorage:', error);
      return null;
    }
  },

  /** Clear JWT */
  clearJWT: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jwt');
    }
  },
};
