import { Link } from 'react-router-dom';
import { useFindPeople } from '@/hooks/useFindPeople';
import { UserCardGridSkeleton } from '@/components/skeleton';
import { UserPlus, Users } from 'lucide-react';

export function FindPeople() {
  const { users, loading, followingIds, handleFollow } = useFindPeople();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Discover People
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Find and connect with new people
            </p>
          </div>
          <UserCardGridSkeleton count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Discover People
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find and connect with new people
          </p>
        </div>

        {users.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No new people to discover right now
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div
                key={user._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
              >
                <Link to={`/profile/${user._id}`} className="block mb-4">
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt={user.name}
                      className="w-20 h-20 rounded-full mx-auto object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </Link>

                <Link to={`/profile/${user._id}`} className="block text-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary">
                    {user.name}
                  </h3>
                </Link>

                {user.about && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4 line-clamp-2">
                    {user.about}
                  </p>
                )}

                <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <span>{user.followers.length} followers</span>
                  <span>•</span>
                  <span>{user.following.length} following</span>
                </div>

                <button
                  onClick={() => handleFollow(user._id)}
                  disabled={followingIds.has(user._id)}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    followingIds.has(user._id)
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary-dark'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{followingIds.has(user._id) ? 'Following' : 'Follow'}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
