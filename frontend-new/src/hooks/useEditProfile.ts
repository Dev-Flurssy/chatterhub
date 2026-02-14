import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { userApi } from '@/lib/userApi';

export function useEditProfile() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [about, setAbout] = useState('');
  const [password, setPassword] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAbout(user.about || '');
      setAvatarPreview(user.profilePic || null);
    }
  }, [user]);

  const handleAvatarSelect = (file: File | null) => {
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Avatar size must be less than 5MB');
      return;
    }

    setAvatarFile(file);
    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(user?.profilePic || null);
  };

  const handleSubmit = async () => {
    if (!user) return false;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('about', about);
      if (password) {
        formData.append('password', password);
      }
      if (avatarFile) {
        formData.append('photo', avatarFile);
      }

      const updatedUser = await userApi.updateUser(user._id, formData);

      // Update auth context with new user data
      const jwt = localStorage.getItem('jwt');
      if (jwt) {
        const parsed = JSON.parse(jwt);
        parsed.user = updatedUser;
        localStorage.setItem('jwt', JSON.stringify(parsed));
        login(parsed);
      }

      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        navigate(`/profile/${user._id}`);
      }, 1500);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    name,
    setName,
    email,
    setEmail,
    about,
    setAbout,
    password,
    setPassword,
    avatarFile,
    avatarPreview,
    loading,
    error,
    success,
    handleAvatarSelect,
    clearAvatar,
    handleSubmit,
  };
}
