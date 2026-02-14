# Admin Analytics Dashboard - Complete Guide

## Overview

The Admin Analytics Dashboard provides comprehensive real-time and historical insights into ChatterHub's platform metrics, user activity, and engagement patterns.

## Features Implemented ✅

### 1. Real-Time Metrics
- **Total Users**: Current count of all registered users
- **New Signups**: New user registrations with percentage change
- **Page Views**: Total page views with trend comparison
- **Average Session Duration**: User engagement time with change indicator
- **Active Users**: Users who performed activities in the selected period
- **Unique Visitors**: Distinct visitors (authenticated and anonymous)
- **Total Activities**: Sum of all user interactions

### 2. Interactive Charts
- **Signup Trend Line Chart**: Visualizes user growth over time
- **Activity Distribution Pie Chart**: Shows breakdown of user activities (posts, likes, comments, follows, unfollows)
- **Session Duration Bar Chart**: Displays distribution of session lengths (0-5min, 5-15min, 15-30min, 30-60min, 60min+)

### 3. Time Filtering
- **Today**: Current day metrics with auto-refresh every 60 seconds
- **Last 7 Days**: Weekly overview
- **Last 30 Days**: Monthly overview
- **Custom Range**: Select any date range with date picker

### 4. Data Export
- **CSV Export**: Download analytics data as CSV file
- Includes all metrics and activity breakdown
- Filename includes filter type and date

### 5. Auto-Refresh
- Automatically refreshes data every 60 seconds when viewing "Today" metrics
- Manual refresh button available for all time periods
- Last updated timestamp displayed

### 6. Scheduled Jobs
- **Daily Aggregation**: Runs at midnight to compute daily statistics
- **Session Cleanup**: Runs every 6 hours to close orphaned sessions
- **Data Retention**: TTL index automatically removes events older than 90 days

## Architecture

### Backend Components

```
backend/
├── models/
│   └── analytics.model.js          # MongoDB schemas for analytics data
├── services/
│   ├── eventQueue.js               # In-memory event queue with batch processing
│   ├── analyticsService.js         # Business logic for metrics calculation
│   ├── sessionService.js           # Session tracking and duration calculation
│   └── scheduledJobs.js            # Cron jobs for aggregation and cleanup
├── middleware/
│   └── analytics.middleware.js     # Request interceptor for page view tracking
├── controllers/
│   └── analytics.controller.js     # API endpoint handlers
└── routes/
    └── analytics.route.js          # API route definitions
```

### Frontend Components

```
frontend-new/
├── src/
│   ├── lib/
│   │   └── analyticsApi.ts         # API client with TypeScript types
│   └── pages/
│       └── AdminDashboard.tsx      # Main dashboard component with charts
```

## API Endpoints

All endpoints require admin authentication (`requireAuth` + `isAdmin` middleware).

### GET /api/admin/analytics/overview
Returns overview metrics for the dashboard.

**Query Parameters:**
- `filter`: 'today' | 'week' | 'month' | 'custom'
- `start`: ISO date string (required for custom filter)
- `end`: ISO date string (required for custom filter)

**Response:**
```json
{
  "totalUsers": 150,
  "newSignups": 12,
  "signupChange": 20,
  "pageViews": 1250,
  "pageViewChange": 15,
  "uniqueVisitors": 85,
  "avgSessionDuration": 420,
  "sessionDurationChange": 10,
  "activeUsers": 45,
  "activeUserChange": 25,
  "activityBreakdown": {
    "posts": 30,
    "likes": 150,
    "comments": 45,
    "follows": 20,
    "unfollows": 5,
    "total": 250
  },
  "lastUpdated": "2024-02-13T10:30:00.000Z"
}
```

### GET /api/admin/analytics/signups
Returns signup trend data.

**Query Parameters:**
- `filter`: 'today' | 'week' | 'month' | 'custom'
- `granularity`: 'daily' | 'weekly' | 'monthly'
- `start`: ISO date string (optional)
- `end`: ISO date string (optional)

**Response:**
```json
{
  "data": [
    { "date": "2024-02-10", "count": 5 },
    { "date": "2024-02-11", "count": 8 },
    { "date": "2024-02-12", "count": 12 }
  ],
  "total": 25,
  "change": 20
}
```

### GET /api/admin/analytics/activity
Returns activity breakdown and trends.

**Query Parameters:**
- `filter`: 'today' | 'week' | 'month' | 'custom'
- `start`: ISO date string (optional)
- `end`: ISO date string (optional)

**Response:**
```json
{
  "breakdown": {
    "posts": 30,
    "likes": 150,
    "comments": 45,
    "follows": 20,
    "unfollows": 5,
    "total": 250
  },
  "trend": [
    { "date": "2024-02-10", "type": "post", "count": 10 },
    { "date": "2024-02-10", "type": "like", "count": 50 }
  ]
}
```

### GET /api/admin/analytics/sessions
Returns session analytics.

**Query Parameters:**
- `filter`: 'today' | 'week' | 'month' | 'custom'
- `start`: ISO date string (optional)
- `end`: ISO date string (optional)

**Response:**
```json
{
  "avgDuration": 420,
  "distribution": {
    "0-5min": 15,
    "5-15min": 30,
    "15-30min": 25,
    "30-60min": 20,
    "60min+": 10
  }
}
```

## Event Tracking

The system automatically tracks the following events:

### Page Views
- Captured on every HTTP request
- Includes: path, user ID, session ID, user agent, status code
- Non-blocking async processing

### User Activities
- **signup**: User registration
- **post**: Post creation
- **like**: Post like
- **comment**: Post comment
- **follow**: User follow
- **unfollow**: User unfollow

### Sessions
- **Start**: On user login
- **End**: On user logout
- **Duration**: Calculated automatically (end - start)
- **Cleanup**: Orphaned sessions closed after 24 hours

## Database Collections

### analytics_events
Stores raw event data with TTL index (90 days).

```javascript
{
  eventType: 'page_view' | 'signup' | 'post' | 'like' | 'comment' | 'follow' | 'unfollow',
  timestamp: Date,
  userId: ObjectId | null,
  sessionId: String,
  metadata: {
    path: String,
    userAgent: String,
    statusCode: Number
  }
}
```

**Indexes:**
- `{ timestamp: -1 }`
- `{ eventType: 1, timestamp: -1 }`
- `{ userId: 1, timestamp: -1 }`
- `{ sessionId: 1 }`
- `{ createdAt: 1 }` (TTL: 90 days)

### analytics_sessions
Tracks user sessions.

```javascript
{
  sessionId: String (unique),
  userId: ObjectId | null,
  startTime: Date,
  endTime: Date | null,
  duration: Number | null,
  pageViews: Number,
  lastActivity: Date
}
```

**Indexes:**
- `{ sessionId: 1 }` (unique)
- `{ userId: 1, startTime: -1 }`
- `{ startTime: -1 }`
- `{ endTime: 1 }`

### analytics_daily_stats
Pre-aggregated daily statistics for faster queries.

```javascript
{
  date: Date (unique),
  metrics: {
    newSignups: Number,
    pageViews: Number,
    uniqueVisitors: Number,
    totalActivities: Number,
    activityBreakdown: {
      posts: Number,
      likes: Number,
      comments: Number,
      follows: Number,
      unfollows: Number
    },
    activeUsers: Number,
    avgSessionDuration: Number,
    sessionCount: Number
  },
  computed: Boolean,
  computedAt: Date
}
```

**Indexes:**
- `{ date: -1 }` (unique)

## Performance Optimizations

### Event Queue
- In-memory buffer (max 1000 events)
- Batch inserts every 5 seconds
- Circuit breaker prevents overflow
- Retry logic with exponential backoff

### Caching
- Total user count cached (can be extended)
- Daily stats pre-aggregated for historical queries

### Database Indexes
- Optimized for time-range queries
- Compound indexes for common query patterns
- TTL index for automatic data cleanup

### Non-Blocking Processing
- Analytics middleware doesn't block requests
- Events queued asynchronously
- Error-resilient (failures don't break app)

## Setup Instructions

### 1. Backend Setup

The analytics system is already integrated. No additional setup required.

### 2. Create Admin User

```bash
cd backend
node createAdmin.js
```

Follow the prompts to create an admin account.

### 3. Start the Application

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend-new
npm run dev
```

### 4. Access Dashboard

1. Navigate to `http://localhost:5173`
2. Sign in with admin credentials
3. Click "Dashboard" in the header
4. View real-time analytics

## Usage Guide

### Viewing Metrics

1. **Select Time Period**: Choose Today, Last 7 Days, Last 30 Days, or Custom Range
2. **View Charts**: Scroll down to see signup trends, activity distribution, and session duration
3. **Export Data**: Click "Export CSV" to download metrics
4. **Refresh**: Click "Refresh" button or wait for auto-refresh (Today filter only)

### Custom Date Range

1. Click "Custom Range" button
2. Select start and end dates
3. Click "Apply"
4. View metrics for selected period

### Understanding Metrics

- **Percentage Changes**: Compare current period with previous equivalent period
- **Green Arrow**: Positive change (increase)
- **Red Arrow**: Negative change (decrease)
- **Activity Breakdown**: Visual representation of user engagement types

## Scheduled Jobs

### Daily Aggregation (Midnight)
Computes and stores daily statistics for faster historical queries.

### Session Cleanup (Every 6 Hours)
Closes orphaned sessions (older than 24 hours without end time).

### Data Retention (Weekly)
TTL index automatically removes events older than 90 days.

## Troubleshooting

### No Data Showing

1. **Check if events are being tracked:**
   - Open MongoDB Compass
   - Check `analytics_events` collection
   - Verify events are being created

2. **Check admin permissions:**
   - Ensure user has `role: 'admin'`
   - Check browser console for 403 errors

3. **Check backend logs:**
   - Look for analytics-related errors
   - Verify scheduled jobs are running

### Charts Not Rendering

1. **Check browser console** for JavaScript errors
2. **Verify data format** matches expected structure
3. **Clear browser cache** and reload

### Performance Issues

1. **Check event queue size:**
   - Monitor backend logs for queue overflow warnings
   - Adjust `maxSize` in `eventQueue.js` if needed

2. **Check database indexes:**
   - Run `db.analytics_events.getIndexes()` in MongoDB
   - Ensure all indexes are created

3. **Monitor query performance:**
   - Use MongoDB profiler
   - Optimize slow queries

## Future Enhancements

- [ ] Real-time WebSocket updates
- [ ] More chart types (area charts, heatmaps)
- [ ] User activity logs (detailed timeline)
- [ ] Geolocation tracking
- [ ] Device and browser analytics
- [ ] Conversion funnel analysis
- [ ] A/B testing metrics
- [ ] Email reports (daily/weekly summaries)
- [ ] Alerts and notifications (threshold-based)
- [ ] Dashboard customization (drag-and-drop widgets)

## Security Considerations

- All analytics endpoints require admin authentication
- Session IDs are generated securely (UUID v4)
- No sensitive user data stored in analytics events
- TTL index ensures data retention compliance
- Error messages don't expose system internals

## License

Part of ChatterHub - Social Media Platform
