import { useState, useEffect } from 'react';
import { 
  HardDrive, 
  Database, 
  Image, 
  FileText, 
  Users,
  MessageSquare,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

interface StorageStats {
  totalSize: number;
  usedSize: number;
  availableSize: number;
  uploads: {
    count: number;
    size: number;
  };
  database: {
    size: number;
    collections: {
      users: number;
      posts: number;
      messages: number;
      conversations: number;
    };
  };
}

export function SystemMonitor() {
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwt');
      const authData = token ? JSON.parse(token) : null;

      const response = await fetch('/api/admin/system/stats', {
        headers: {
          Authorization: `Bearer ${authData?.token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching system stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getUsagePercentage = (used: number, total: number): number => {
    return Math.round((used / total) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  const usagePercent = stats ? getUsagePercentage(stats.usedSize, stats.totalSize) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              System Monitor
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Monitor storage, database, and system resources
            </p>
          </div>
          <button
            onClick={fetchStats}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        {stats && (
          <>
            {/* Storage Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Storage Overview
                </h2>
                <HardDrive className="w-6 h-6 text-primary" />
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Storage Usage
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {formatBytes(stats.usedSize)} / {formatBytes(stats.totalSize)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full transition-all ${
                        usagePercent > 90
                          ? 'bg-red-500'
                          : usagePercent > 70
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {usagePercent}% used
                  </p>
                </div>

                {usagePercent > 80 && (
                  <div className="flex items-start space-x-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Storage Warning
                      </p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                        Storage usage is above 80%. Consider cleaning up old files or upgrading storage.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Storage Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Uploads */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Uploaded Files
                  </h3>
                  <Image className="w-5 h-5 text-blue-500" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Files</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {stats.uploads.count.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Storage Used</span>
                    <span className="text-lg font-bold text-blue-600">
                      {formatBytes(stats.uploads.size)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Database */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Database
                  </h3>
                  <Database className="w-5 h-5 text-green-500" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Database Size</span>
                    <span className="text-lg font-bold text-green-600">
                      {formatBytes(stats.database.size)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Collection Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Database Collections
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <CollectionCard
                  icon={<Users className="w-6 h-6" />}
                  label="Users"
                  count={stats.database.collections.users}
                  color="blue"
                />
                <CollectionCard
                  icon={<FileText className="w-6 h-6" />}
                  label="Posts"
                  count={stats.database.collections.posts}
                  color="green"
                />
                <CollectionCard
                  icon={<MessageSquare className="w-6 h-6" />}
                  label="Messages"
                  count={stats.database.collections.messages}
                  color="purple"
                />
                <CollectionCard
                  icon={<MessageSquare className="w-6 h-6" />}
                  label="Conversations"
                  count={stats.database.collections.conversations}
                  color="orange"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface CollectionCardProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

function CollectionCard({ icon, label, count, color }: CollectionCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
  };

  return (
    <div className="text-center">
      <div className={`inline-flex p-3 rounded-lg ${colorClasses[color]} mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {count.toLocaleString()}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
    </div>
  );
}
