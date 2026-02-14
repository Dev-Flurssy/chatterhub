import { Skeleton } from './Skeleton.tsx';

export function AuthFormSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-gray-50 to-secondary/10 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Skeleton className="h-10 w-48 mx-auto mb-4 rounded-lg" />
            <Skeleton className="h-4 w-64 mx-auto rounded-lg" />
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <Skeleton className="w-full h-px" />
            </div>
            <div className="relative flex justify-center">
              <Skeleton className="h-6 w-32 rounded-lg" />
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <Skeleton className="h-4 w-24 mb-2 rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
            <div>
              <Skeleton className="h-4 w-24 mb-2 rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
            <div>
              <Skeleton className="h-4 w-24 mb-2 rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>

            {/* Submit Button */}
            <Skeleton className="h-12 w-full rounded-lg mt-6" />
          </div>

          {/* Footer Link */}
          <div className="mt-6 text-center">
            <Skeleton className="h-4 w-48 mx-auto rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ForgotPasswordSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-gray-50 to-secondary/10 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 px-4">
      <div className="max-w-md w-full">
        <Skeleton className="h-6 w-32 mb-6 rounded-lg" />

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <Skeleton className="w-16 h-16 rounded-full" />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <Skeleton className="h-8 w-48 mx-auto mb-4 rounded-lg" />
            <Skeleton className="h-4 w-full mx-auto mb-2 rounded-lg" />
            <Skeleton className="h-4 w-3/4 mx-auto rounded-lg" />
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div>
              <Skeleton className="h-4 w-24 mb-2 rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>

            <Skeleton className="h-12 w-full rounded-lg" />
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <Skeleton className="h-4 w-40 mx-auto rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
