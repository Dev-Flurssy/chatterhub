import { useState, useEffect } from 'react';
import { analyticsApi, type FilterType, type OverviewMetrics, type SignupData, type ActivityData, type SessionData } from '@/lib/analyticsApi';
import { exportAnalyticsToPDF } from '@/lib/pdfExport';
import { 
  Users, 
  UserPlus, 
  Eye, 
  Clock, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  Calendar,
  Download,
  FileText
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#8b5cf6', '#6b7280'];

export function AdminDashboard() {
  const [filter, setFilter] = useState<FilterType>('today');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [signupData, setSignupData] = useState<SignupData | null>(null);
  const [activityData, setActivityData] = useState<ActivityData | null>(null);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchAllData();
    
    // Auto-refresh every 60 seconds for "today" filter
    let interval: number | null = null;
    if (filter === 'today') {
      interval = window.setInterval(fetchAllData, 60000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [filter, customStart, customEnd]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const start = filter === 'custom' ? customStart : undefined;
      const end = filter === 'custom' ? customEnd : undefined;
      
      const [overview, signups, activity, sessions] = await Promise.all([
        analyticsApi.getOverview(filter, start, end),
        analyticsApi.getSignups(filter, 'daily', start, end),
        analyticsApi.getActivity(filter, start, end),
        analyticsApi.getSessions(filter, start, end)
      ]);
      
      setMetrics(overview);
      setSignupData(signups);
      setActivityData(activity);
      setSessionData(sessions);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomDateApply = () => {
    if (customStart && customEnd) {
      setFilter('custom');
      setShowCustomPicker(false);
    }
  };

  const exportToCSV = () => {
    if (!metrics) return;
    
    const csvData = [
      ['Metric', 'Value', 'Change (%)'],
      ['Total Users', metrics.totalUsers, ''],
      ['New Signups', metrics.newSignups, metrics.signupChange],
      ['Page Views', metrics.pageViews, metrics.pageViewChange],
      ['Unique Visitors', metrics.uniqueVisitors, ''],
      ['Active Users', metrics.activeUsers, metrics.activeUserChange],
      ['Avg Session Duration (s)', metrics.avgSessionDuration, metrics.sessionDurationChange],
      ['', '', ''],
      ['Activity Breakdown', '', ''],
      ['Posts', metrics.activityBreakdown.posts, ''],
      ['Likes', metrics.activityBreakdown.likes, ''],
      ['Comments', metrics.activityBreakdown.comments, ''],
      ['Follows', metrics.activityBreakdown.follows, ''],
      ['Unfollows', metrics.activityBreakdown.unfollows, ''],
    ];
    
    const csv = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${filter}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    if (!metrics) return;
    exportAnalyticsToPDF(metrics, filter);
  };

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const signupChartData = signupData?.data.map(item => ({
    date: format(parseISO(item.date), 'MMM dd'),
    signups: item.count
  })) || [];

  const activityChartData = activityData ? [
    { name: 'Posts', value: activityData.breakdown.posts, color: COLORS[0] },
    { name: 'Likes', value: activityData.breakdown.likes, color: COLORS[1] },
    { name: 'Comments', value: activityData.breakdown.comments, color: COLORS[2] },
    { name: 'Follows', value: activityData.breakdown.follows, color: COLORS[3] },
    { name: 'Unfollows', value: activityData.breakdown.unfollows, color: COLORS[4] },
  ] : [];

  const sessionChartData = sessionData ? [
    { name: '0-5 min', value: sessionData.distribution['0-5min'] },
    { name: '5-15 min', value: sessionData.distribution['5-15min'] },
    { name: '15-30 min', value: sessionData.distribution['15-30min'] },
    { name: '30-60 min', value: sessionData.distribution['30-60min'] },
    { name: '60+ min', value: sessionData.distribution['60min+'] },
  ] : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor platform metrics and user activity
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Period:</span>
              <div className="flex space-x-2">
                {(['today', 'week', 'month'] as FilterType[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setFilter(f);
                      setShowCustomPicker(false);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === f
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {f === 'today' ? 'Today' : f === 'week' ? 'Last 7 Days' : 'Last 30 Days'}
                  </button>
                ))}
                <button
                  onClick={() => setShowCustomPicker(!showCustomPicker)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'custom'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Custom Range
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-xs text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
              <button
                onClick={exportToPDF}
                disabled={!metrics}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">Export PDF</span>
              </button>
              <button
                onClick={exportToCSV}
                disabled={!metrics}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Export CSV</span>
              </button>
              <button
                onClick={fetchAllData}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="text-sm font-medium">Refresh</span>
              </button>
            </div>
          </div>

          {/* Custom Date Picker */}
          {showCustomPicker && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <button
                  onClick={handleCustomDateApply}
                  disabled={!customStart || !customEnd}
                  className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {metrics && (
          <>
            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Total Users"
                value={formatNumber(metrics.totalUsers)}
                icon={<Users className="w-6 h-6" />}
                color="blue"
              />
              
              <MetricCard
                title="New Signups"
                value={formatNumber(metrics.newSignups)}
                change={metrics.signupChange}
                icon={<UserPlus className="w-6 h-6" />}
                color="green"
              />
              
              <MetricCard
                title="Page Views"
                value={formatNumber(metrics.pageViews)}
                change={metrics.pageViewChange}
                icon={<Eye className="w-6 h-6" />}
                color="purple"
              />
              
              <MetricCard
                title="Avg Session"
                value={formatDuration(metrics.avgSessionDuration)}
                change={metrics.sessionDurationChange}
                icon={<Clock className="w-6 h-6" />}
                color="orange"
              />
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Users</h3>
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {formatNumber(metrics.activeUsers)}
                </p>
                {metrics.activeUserChange !== 0 && (
                  <div className="flex items-center space-x-1">
                    {metrics.activeUserChange > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${
                      metrics.activeUserChange > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {Math.abs(metrics.activeUserChange)}%
                    </span>
                  </div>
                )}
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Unique Visitors</h3>
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(metrics.uniqueVisitors)}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Activities</h3>
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(metrics.activityBreakdown.total)}
                </p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Signup Trend Chart */}
              {signupChartData.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Signup Trend
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={signupChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Line type="monotone" dataKey="signups" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Activity Breakdown Pie Chart */}
              {activityChartData.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Activity Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={activityChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {activityChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Session Duration Distribution */}
            {sessionChartData.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Session Duration Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sessionChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="value" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Activity Breakdown Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Activity Breakdown
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <ActivityItem label="Posts" value={metrics.activityBreakdown.posts} color="bg-blue-500" />
                <ActivityItem label="Likes" value={metrics.activityBreakdown.likes} color="bg-red-500" />
                <ActivityItem label="Comments" value={metrics.activityBreakdown.comments} color="bg-green-500" />
                <ActivityItem label="Follows" value={metrics.activityBreakdown.follows} color="bg-purple-500" />
                <ActivityItem label="Unfollows" value={metrics.activityBreakdown.unfollows} color="bg-gray-500" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  change?: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

function MetricCard({ title, value, change, icon, color }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{value}</p>
      {change !== undefined && change !== 0 && (
        <div className="flex items-center space-x-1">
          {change > 0 ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span className={`text-sm font-medium ${
            change > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {Math.abs(change)}%
          </span>
          <span className="text-xs text-gray-500">vs previous period</span>
        </div>
      )}
    </div>
  );
}

interface ActivityItemProps {
  label: string;
  value: number;
  color: string;
}

function ActivityItem({ label, value, color }: ActivityItemProps) {
  return (
    <div className="text-center">
      <div className={`${color} h-2 rounded-full mb-2`} style={{ width: '100%' }} />
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
    </div>
  );
}
