const ANALYTICS_BASE = '/api/admin/analytics';

/** Get auth token from localStorage */
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) return null;
    const parsed = JSON.parse(jwt);
    return parsed.token;
  } catch {
    return null;
  }
};

/** Unified response handler */
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorMessage: string;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || 'Something went wrong';
    } catch {
      errorMessage = await response.text();
    }
    throw new Error(`Error ${response.status}: ${errorMessage}`);
  }
  return response.json();
};

export interface OverviewMetrics {
  totalUsers: number;
  newSignups: number;
  signupChange: number;
  pageViews: number;
  pageViewChange: number;
  uniqueVisitors: number;
  avgSessionDuration: number;
  sessionDurationChange: number;
  activeUsers: number;
  activeUserChange: number;
  activityBreakdown: {
    posts: number;
    likes: number;
    comments: number;
    follows: number;
    unfollows: number;
    total: number;
  };
  lastUpdated: string;
}

export interface SignupData {
  data: Array<{ date: string; count: number }>;
  total: number;
  change: number;
}

export interface ActivityData {
  breakdown: {
    posts: number;
    likes: number;
    comments: number;
    follows: number;
    unfollows: number;
    total: number;
  };
  trend: Array<{ date: string; type: string; count: number }>;
}

export interface SessionData {
  avgDuration: number;
  distribution: {
    '0-5min': number;
    '5-15min': number;
    '15-30min': number;
    '30-60min': number;
    '60min+': number;
  };
}

export type FilterType = 'today' | 'week' | 'month' | 'custom';

export const analyticsApi = {
  /** Get overview metrics */
  getOverview: async (filter: FilterType = 'today', start?: string, end?: string): Promise<OverviewMetrics> => {
    const token = getAuthToken();
    const params = new URLSearchParams({ filter });
    if (start) params.append('start', start);
    if (end) params.append('end', end);

    const response = await fetch(`${ANALYTICS_BASE}/overview?${params}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });
    return handleResponse<OverviewMetrics>(response);
  },

  /** Get signup trends */
  getSignups: async (
    filter: FilterType = 'today',
    granularity: 'daily' | 'weekly' | 'monthly' = 'daily',
    start?: string,
    end?: string
  ): Promise<SignupData> => {
    const token = getAuthToken();
    const params = new URLSearchParams({ filter, granularity });
    if (start) params.append('start', start);
    if (end) params.append('end', end);

    const response = await fetch(`${ANALYTICS_BASE}/signups?${params}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });
    return handleResponse<SignupData>(response);
  },

  /** Get activity breakdown and trends */
  getActivity: async (filter: FilterType = 'today', start?: string, end?: string): Promise<ActivityData> => {
    const token = getAuthToken();
    const params = new URLSearchParams({ filter });
    if (start) params.append('start', start);
    if (end) params.append('end', end);

    const response = await fetch(`${ANALYTICS_BASE}/activity?${params}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });
    return handleResponse<ActivityData>(response);
  },

  /** Get session analytics */
  getSessions: async (filter: FilterType = 'today', start?: string, end?: string): Promise<SessionData> => {
    const token = getAuthToken();
    const params = new URLSearchParams({ filter });
    if (start) params.append('start', start);
    if (end) params.append('end', end);

    const response = await fetch(`${ANALYTICS_BASE}/sessions?${params}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });
    return handleResponse<SessionData>(response);
  },
};
