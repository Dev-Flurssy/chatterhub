import { useParams, Link } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { PostCard } from '@/components/PostCard';
import { ProfileSkeleton } from '@/components/skeleton';
import { 
  Settings, 
  UserPlus, 
  UserMinus, 
  Calendar,
  MessageSquare
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export function Profile() {
  const { userId } = useParams<{ userId: string }>();
  const {
    profileUser,
    posts,
    loading,
    following,
    followLoading,
    isOwnProfile,
    handleFollow,
    fetchUserPosts,
  } = useProfile(userId);

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!profileUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 dark:text-gray-400">User not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Cover Photo */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-primary to-primary-dark"></div>

      {/* Profile Header */}
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg -mt-20 md:-mt-32 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              {/* Avatar */}
              <div className="relative">
                {profileUser.profilePic ? (
                  <img
                    src={profileUser.profilePic}
                    alt={profileUser.name}
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-gray-800 object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-gray-800 bg-primary text-white flex items-center justify-center text-5xl font-bold">
                    {profileUser.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {profileUser.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {profileUser.email}
                </p>

                {profileUser.about && (
                  <p className="text-gray-700 dark:text-gray-300 mb-4 max-w-2xl">
                    {profileUser.about}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {formatDate(profileUser.createdAt)}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-center md:justify-start space-x-6 mt-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {posts.length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Posts</p>
                  </div>
                  <Link 
                    to={`/profile/${userId}/followers`}
                    className="text-center hover:opacity-80 transition-opacity"
                  >
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {profileUser.followers.length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Followers</p>
                  </Link>
                  <Link 
                    to={`/profile/${userId}/following`}
                    className="text-center hover:opacity-80 transition-opacity"
                  >
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {profileUser.following.length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Following</p>
                  </Link>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-2">
                {isOwnProfile ? (
                  <>
                    <Link
                      to="/profile/edit"
                      className="flex items-center justify-center space-x-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </Link>
                    <Link
                      to="/account-settings"
                      className="flex items-center justify-center space-x-2 px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Account</span>
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={handleFollow}
                    disabled={followLoading}
                    className={`flex items-center justify-center space-x-2 px-6 py-2 rounded-lg transition-colors ${
                      following
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                        : 'bg-primary text-white hover:bg-primary-dark'
                    }`}
                  >
                    {following ? (
                      <>
                        <UserMinus className="w-4 h-4" />
                        <span>Unfollow</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Posts Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Posts
            </h2>
            {posts.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  {isOwnProfile ? "You haven't posted anything yet" : "No posts yet"}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} onUpdate={fetchUserPosts} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
