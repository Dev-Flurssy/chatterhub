import { CreatePost } from '@/components/CreatePost';
import { PostCard } from '@/components/PostCard';
import { GlobalSearch } from '@/components/GlobalSearch';
import { usePosts } from '@/hooks/usePosts';
import { PostsFeedSkeleton } from '@/components/skeleton';

export function Posts() {
  const { posts, loading, error, fetchPosts } = usePosts();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Search Bar */}
        <div className="mb-6">
          <GlobalSearch />
        </div>

        {/* Create Post */}
        <div className="mb-6">
          <CreatePost onPostCreated={fetchPosts} />
        </div>

        {/* Posts Feed */}
        {loading ? (
          <PostsFeedSkeleton count={3} />
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No posts yet. Be the first to share something!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} onUpdate={fetchPosts} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
