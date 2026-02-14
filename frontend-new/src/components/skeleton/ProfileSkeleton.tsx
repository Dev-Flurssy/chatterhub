import { Skeleton, SkeletonAvatar, SkeletonText } from './Skeleton.tsx';
import { PostSkeleton } from './PostSkeleton.tsx';

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Cover with gradient */}
      <div className="h-48 md:h-64 w-full bg-gradient-to-r from-primary to-primary-dark relative overflow-hidden">
        <Skeleton className="w-full h-full opacity-50" />
      </div>

      {/* Profile Card */}
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg -mt-20 md:-mt-32 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              {/* Avatar with gradient border */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-sm opacity-50"></div>
                <SkeletonAvatar size="xl" />
              </div>

              <div className="flex-1 space-y-4 w-full">
                <Skeleton className="h-8 w-48 mx-auto md:mx-0 rounded-lg" />
                <Skeleton className="h-4 w-64 mx-auto md:mx-0 rounded-lg" />
                <SkeletonText lines={2} />
                
                {/* Stats */}
                <div className="flex items-center justify-center md:justify-start space-x-6 mt-4">
                  <div className="text-center space-y-1">
                    <Skeleton className="h-8 w-12 mx-auto rounded-lg" />
                    <Skeleton className="h-3 w-12 rounded-lg" />
                  </div>
                  <div className="text-center space-y-1">
                    <Skeleton className="h-8 w-12 mx-auto rounded-lg" />
                    <Skeleton className="h-3 w-16 rounded-lg" />
                  </div>
                  <div className="text-center space-y-1">
                    <Skeleton className="h-8 w-12 mx-auto rounded-lg" />
                    <Skeleton className="h-3 w-16 rounded-lg" />
                  </div>
                </div>
              </div>

              <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
          </div>

          {/* Posts Section */}
          <div className="mt-8 space-y-6">
            <Skeleton className="h-6 w-24 rounded-lg" />
            <PostSkeleton />
            <PostSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}
