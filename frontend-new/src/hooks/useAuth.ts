import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth as useAuthContext } from '@/contexts/AuthContext';

interface SigninData {
  email: string;
  password: string;
}

interface SignupData {
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
}

interface ForgotPasswordData {
  email: string;
}

interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export function useAuthForm() {
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [devInfo, setDevInfo] = useState<any>(null);
  const [redirecting, setRedirecting] = useState(false);

  const signin = async (data: SigninData) => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to sign in');
      }

      // Store JWT in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('jwt', JSON.stringify(result));
      }

      login(result);
      setLoading(false);
      setRedirecting(true);

      // Show loading animation before redirect
      setTimeout(() => {
        navigate(result.user.role === 'admin' ? '/admin/dashboard' : '/posts');
      }, 2000);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
      setLoading(false);
      return false;
    }
  };

  const signup = async (data: SignupData) => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to sign up');
      }

      // Store JWT in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('jwt', JSON.stringify(result));
      }

      login(result);

      if (result.devMode && result.verificationCode) {
        setDevInfo({ verificationCode: result.verificationCode });
      }

      setLoading(false);
      setRedirecting(true);

      // Show loading animation before redirect
      setTimeout(() => {
        navigate('/posts');
      }, 2500);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up');
      setLoading(false);
      return false;
    }
  };

  const forgotPassword = async (data: ForgotPasswordData) => {
    setError('');
    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send reset email');
      }

      setSuccess(true);
      if (result.devMode) {
        setDevInfo({
          resetToken: result.resetToken,
          resetUrl: result.resetUrl,
        });
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (data: ResetPasswordData) => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to reset password');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/signin');
      }, 3000);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async (credential: string) => {
    setError('');
    setLoading(true);

    try {
      // Decode the JWT credential to get user info
      const payload = JSON.parse(atob(credential.split('.')[1]));
      
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          googleId: payload.sub,
          email: payload.email,
          name: payload.name,
          profilePic: payload.picture,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to sign in with Google');
      }

      // Store JWT in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('jwt', JSON.stringify(result));
      }

      login(result);
      setLoading(false);
      setRedirecting(true);

      // Show loading animation before redirect
      setTimeout(() => {
        navigate(result.user.role === 'admin' ? '/admin/dashboard' : '/posts');
      }, 2000);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in with Google');
      setLoading(false);
      return false;
    }
  };

  const resetState = () => {
    setError('');
    setSuccess(false);
    setDevInfo(null);
  };

  return {
    loading,
    error,
    success,
    devInfo,
    redirecting,
    signin,
    signup,
    forgotPassword,
    resetPassword,
    handleGoogleAuth,
    resetState,
  };
}
