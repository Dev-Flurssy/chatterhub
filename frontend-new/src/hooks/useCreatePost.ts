import { useState } from 'react';
import { postApi } from '@/lib/postApi';

export function useCreatePost(onPostCreated: () => void) {
  const [text, setText] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'photo' | 'video' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMediaSelect = (file: File | null, type: 'photo' | 'video') => {
    if (!file) return;

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError('File size must be less than 50MB');
      return;
    }

    setMediaFile(file);
    setMediaType(type);
    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
  };

  const handleSubmit = async () => {
    if (!text.trim() && !mediaFile) {
      setError('Please add some text or media');
      return false;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('text', text);
      if (mediaFile) {
        formData.append(mediaType === 'photo' ? 'photo' : 'video', mediaFile);
      }

      await postApi.createPost(formData);

      // Reset form
      setText('');
      clearMedia();
      onPostCreated();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    text,
    setText,
    mediaFile,
    mediaPreview,
    mediaType,
    loading,
    error,
    handleMediaSelect,
    clearMedia,
    handleSubmit,
  };
}
