import { useEffect, useState } from 'react';
import { CheckCircle, Loader2, Sparkles } from 'lucide-react';

interface LoadingRedirectProps {
  message?: string;
  submessage?: string;
  duration?: number;
}

export function LoadingRedirect({ 
  message = 'Creating your account', 
  submessage = 'Setting up your profile...',
  duration = 2000 
}: LoadingRedirectProps) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'loading' | 'success'>('loading');

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, duration / 10);

    // Complete animation
    const completeTimeout = setTimeout(() => {
      setProgress(100);
      setStage('success');
    }, duration - 500);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(completeTimeout);
    };
  }, [duration]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary/10 via-gray-50 to-secondary/10 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary-light/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-12 max-w-md mx-auto border border-gray-200 dark:border-gray-700">
          {/* Icon */}
          <div className="relative mb-8">
            {stage === 'loading' ? (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-xl">
                  <Loader2 className="w-12 h-12 text-white animate-spin" />
                </div>
              </div>
            ) : (
              <div className="relative animate-bounce">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-full blur-xl opacity-50"></div>
                <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-xl">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
              </div>
            )}
          </div>

          {/* Message */}
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
            {stage === 'loading' ? message : 'All Set!'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {stage === 'loading' ? submessage : 'Redirecting you now...'}
          </p>

          {/* Progress Bar */}
          <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
            </div>
          </div>

          {/* Percentage */}
          <p className="mt-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
            {progress}%
          </p>

          {/* Sparkles */}
          {stage === 'success' && (
            <div className="mt-6 flex justify-center space-x-2">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              <Sparkles className="w-5 h-5 text-secondary animate-pulse animation-delay-2000" />
              <Sparkles className="w-5 h-5 text-primary animate-pulse animation-delay-4000" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
