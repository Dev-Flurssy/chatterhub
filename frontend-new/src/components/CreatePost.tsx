import { Image, Video, X, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCreatePost } from '@/hooks/useCreatePost';

interface CreatePostProps {
  onPostCreated: () => void;
}

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const { user } = useAuth();
  const {
    text,
    setText,
    mediaPreview,
    mediaType,
    loading,
    error,
    handleMediaSelect,
    clearMedia,
    handleSubmit,
  } = useCreatePost(onPostCreated);

  const onMediaSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      handleMediaSelect(file, type);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-start space-x-3">
        {user?.profilePic ? (
          <img
            src={user.profilePic}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold flex-shrink-0">
            {user?.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />

          {/* Media Preview */}
          {mediaPreview && (
            <div className="mt-3 relative">
              <button
                onClick={clearMedia}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 z-10"
              >
                <X className="w-4 h-4" />
              </button>
              {mediaType === 'photo' ? (
                <img
                  src={mediaPreview}
                  alt="Preview"
                  className="w-full rounded-lg max-h-64 object-cover"
                />
              ) : (
                <video
                  src={mediaPreview}
                  controls
                  className="w-full rounded-lg max-h-64"
                />
              )}
            </div>
          )}

          {error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}

          {/* Actions */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors">
                <Image className="w-5 h-5" />
                <span className="text-sm hidden sm:inline">Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onMediaSelect(e, 'photo')}
                  className="hidden"
                />
              </label>
              <label className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors">
                <Video className="w-5 h-5" />
                <span className="text-sm hidden sm:inline">Video</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => onMediaSelect(e, 'video')}
                  className="hidden"
                />
              </label>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading || !text.trim()}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Posting...' : 'Post'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
