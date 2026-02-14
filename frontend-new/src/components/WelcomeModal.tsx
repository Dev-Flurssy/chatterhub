import { useState } from 'react';
import { X, Sparkles, CheckCircle, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface WelcomeModalProps {
  onClose: () => void;
  showVerification?: boolean;
  devVerificationCode?: string;
}

export function WelcomeModal({ onClose, showVerification = false, devVerificationCode }: WelcomeModalProps) {
  const { user } = useAuth();
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);

  const handleVerify = async () => {
    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('jwt');
      const authData = token ? JSON.parse(token) : null;

      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authData?.token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ code: verificationCode }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Verification failed');
      }

      setVerified(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-primary to-secondary p-8 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="w-8 h-8" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center mb-2">
            Welcome to ChatterHub!
          </h2>
          <p className="text-center text-white/90">
            Hi {user?.name}, we're excited to have you here
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {!verified ? (
            <>
              {showVerification && !user?.emailVerified ? (
                <>
                  <div className="mb-6">
                    <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-1">
                          Verify your email
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          We've sent a 6-digit code to {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {devVerificationCode && (
                    <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <p className="text-xs text-yellow-800 dark:text-yellow-200 font-medium">
                        🔧 DEV MODE - Code: {devVerificationCode}
                      </p>
                    </div>
                  )}

                  {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white text-center text-2xl tracking-widest"
                    />
                  </div>

                  <button
                    onClick={handleVerify}
                    disabled={loading}
                    className="w-full px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all mb-3"
                  >
                    {loading ? 'Verifying...' : 'Verify Email'}
                  </button>

                  <button
                    onClick={handleSkip}
                    className="w-full px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-sm"
                  >
                    Skip for now
                  </button>
                </>
              ) : (
                <>
                  <div className="mb-6 space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold">1</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          Complete your profile
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Add a bio and profile picture to help others know you
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold">2</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          Find people to follow
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Discover interesting people and start building your network
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold">3</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          Share your first post
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Let the community know what's on your mind
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    className="w-full px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg font-semibold transition-all"
                  >
                    Get Started
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Email Verified!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your account is now fully activated
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
