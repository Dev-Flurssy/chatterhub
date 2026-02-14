import { Skeleton, SkeletonAvatar, SkeletonText } from './Skeleton.tsx';

export function UserCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col items-center space-y-4">
        {/* Avatar with gradient ring */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-sm opacity-30"></div>
          <SkeletonAvatar size="lg" />
        </div>

        <Skeleton className="h-5 w-32 rounded-lg" />
        <SkeletonText lines={2} className="w-full" />
        
        {/* Stats */}
        <div className="flex items-center space-x-4 w-full justify-center">
          <Skeleton className="h-4 w-20 rounded-lg" />
          <Skeleton className="h-4 w-20 rounded-lg" />
        </div>

        {/* Button */}
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}

export function UserCardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <UserCardSkeleton key={i} />
      ))}
    </div>
  );
}
