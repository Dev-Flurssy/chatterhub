import mongoose from "mongoose";

// Analytics Events Collection - stores raw event data
const analyticsEventSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
    enum: ['page_view', 'signup', 'post', 'like', 'comment', 'follow', 'unfollow'],
    index: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  metadata: {
    path: String,
    userAgent: String,
    statusCode: Number,
    activityType: String
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
analyticsEventSchema.index({ eventType: 1, timestamp: -1 });
analyticsEventSchema.index({ userId: 1, timestamp: -1 });

// TTL index - automatically delete events older than 90 days
analyticsEventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

// Analytics Sessions Collection - tracks user sessions
const analyticsSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },
  startTime: {
    type: Date,
    required: true,
    index: true
  },
  endTime: {
    type: Date,
    default: null,
    index: true
  },
  duration: {
    type: Number, // in seconds
    default: null
  },
  pageViews: {
    type: Number,
    default: 0
  },
  lastActivity: {
    type: Date,
    required: true
  }
});

// Compound index for user session queries
analyticsSessionSchema.index({ userId: 1, startTime: -1 });

// Analytics Daily Stats Collection - pre-aggregated daily statistics
const analyticsDailyStatsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
    index: true
  },
  metrics: {
    newSignups: { type: Number, default: 0 },
    pageViews: { type: Number, default: 0 },
    uniqueVisitors: { type: Number, default: 0 },
    totalActivities: { type: Number, default: 0 },
    activityBreakdown: {
      posts: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      follows: { type: Number, default: 0 },
      unfollows: { type: Number, default: 0 }
    },
    activeUsers: { type: Number, default: 0 },
    avgSessionDuration: { type: Number, default: 0 },
    sessionCount: { type: Number, default: 0 }
  },
  computed: {
    type: Boolean,
    default: false
  },
  computedAt: {
    type: Date
  }
});

export const AnalyticsEvent = mongoose.model('AnalyticsEvent', analyticsEventSchema);
export const AnalyticsSession = mongoose.model('AnalyticsSession', analyticsSessionSchema);
export const AnalyticsDailyStats = mongoose.model('AnalyticsDailyStats', analyticsDailyStatsSchema);
