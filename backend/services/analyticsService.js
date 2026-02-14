import { AnalyticsEvent, AnalyticsDailyStats } from '../models/analytics.model.js';
import User from '../models/user.model.js';
import sessionService from './sessionService.js';

/**
 * Analytics Service - Business logic for computing metrics and aggregating data
 */
class AnalyticsService {
  /**
   * Get total registered users
   * @returns {Promise<number>}
   */
  async getTotalUsers() {
    try {
      const count = await User.countDocuments();
      return count;
    } catch (error) {
      console.error('[AnalyticsService] Error getting total users:', error.message);
      throw error;
    }
  }

  /**
   * Get new signups in date range
   * @param {Date} startDate
   * @param {Date} endDate
   * @returns {Promise<number>}
   */
  async getNewSignups(startDate, endDate) {
    try {
      const count = await AnalyticsEvent.countDocuments({
        eventType: 'signup',
        timestamp: { $gte: startDate, $lte: endDate }
      });
      return count;
    } catch (error) {
      console.error('[AnalyticsService] Error getting new signups:', error.message);
      throw error;
    }
  }

  /**
   * Get signup trend data
   * @param {Date} startDate
   * @param {Date} endDate
   * @param {string} granularity - 'daily', 'weekly', 'monthly'
   * @returns {Promise<Array>}
   */
  async getSignupTrend(startDate, endDate, granularity = 'daily') {
    try {
      let groupBy;
      if (granularity === 'daily') {
        groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } };
      } else if (granularity === 'weekly') {
        groupBy = { $dateToString: { format: '%Y-W%V', date: '$timestamp' } };
      } else {
        groupBy = { $dateToString: { format: '%Y-%m', date: '$timestamp' } };
      }

      const trend = await AnalyticsEvent.aggregate([
        {
          $match: {
            eventType: 'signup',
            timestamp: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: groupBy,
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      return trend.map(item => ({ date: item._id, count: item.count }));
    } catch (error) {
      console.error('[AnalyticsService] Error getting signup trend:', error.message);
      throw error;
    }
  }

  /**
   * Get page views in date range
   * @param {Date} startDate
   * @param {Date} endDate
   * @returns {Promise<number>}
   */
  async getPageViews(startDate, endDate) {
    try {
      const count = await AnalyticsEvent.countDocuments({
        eventType: 'page_view',
        timestamp: { $gte: startDate, $lte: endDate }
      });
      return count;
    } catch (error) {
      console.error('[AnalyticsService] Error getting page views:', error.message);
      throw error;
    }
  }

  /**
   * Get unique visitors in date range
   * @param {Date} startDate
   * @param {Date} endDate
   * @returns {Promise<Object>}
   */
  async getUniqueVisitors(startDate, endDate) {
    try {
      const result = await AnalyticsEvent.aggregate([
        {
          $match: {
            eventType: 'page_view',
            timestamp: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: null,
            uniqueSessions: { $addToSet: '$sessionId' },
            authenticatedSessions: {
              $addToSet: {
                $cond: [{ $ne: ['$userId', null] }, '$sessionId', null]
              }
            }
          }
        }
      ]);

      if (result.length === 0) {
        return { total: 0, authenticated: 0, anonymous: 0 };
      }

      const uniqueSessions = result[0].uniqueSessions.length;
      const authenticatedSessions = result[0].authenticatedSessions.filter(s => s !== null).length;

      return {
        total: uniqueSessions,
        authenticated: authenticatedSessions,
        anonymous: uniqueSessions - authenticatedSessions
      };
    } catch (error) {
      console.error('[AnalyticsService] Error getting unique visitors:', error.message);
      throw error;
    }
  }

  /**
   * Get activity breakdown by type
   * @param {Date} startDate
   * @param {Date} endDate
   * @returns {Promise<Object>}
   */
  async getActivityBreakdown(startDate, endDate) {
    try {
      const result = await AnalyticsEvent.aggregate([
        {
          $match: {
            eventType: { $in: ['post', 'like', 'comment', 'follow', 'unfollow'] },
            timestamp: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: '$eventType',
            count: { $sum: 1 }
          }
        }
      ]);

      const breakdown = {
        posts: 0,
        likes: 0,
        comments: 0,
        follows: 0,
        unfollows: 0,
        total: 0
      };

      result.forEach(item => {
        breakdown[item._id + 's'] = item.count;
        breakdown.total += item.count;
      });

      return breakdown;
    } catch (error) {
      console.error('[AnalyticsService] Error getting activity breakdown:', error.message);
      throw error;
    }
  }

  /**
   * Get activity trend over time
   * @param {Date} startDate
   * @param {Date} endDate
   * @returns {Promise<Array>}
   */
  async getActivityTrend(startDate, endDate) {
    try {
      const trend = await AnalyticsEvent.aggregate([
        {
          $match: {
            eventType: { $in: ['post', 'like', 'comment', 'follow', 'unfollow'] },
            timestamp: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
              type: '$eventType'
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.date': 1 } }
      ]);

      return trend.map(item => ({
        date: item._id.date,
        type: item._id.type,
        count: item.count
      }));
    } catch (error) {
      console.error('[AnalyticsService] Error getting activity trend:', error.message);
      throw error;
    }
  }

  /**
   * Get active users in date range
   * @param {Date} startDate
   * @param {Date} endDate
   * @returns {Promise<number>}
   */
  async getActiveUsers(startDate, endDate) {
    try {
      const result = await AnalyticsEvent.aggregate([
        {
          $match: {
            eventType: { $in: ['post', 'like', 'comment', 'follow', 'unfollow'] },
            timestamp: { $gte: startDate, $lte: endDate },
            userId: { $ne: null }
          }
        },
        {
          $group: {
            _id: null,
            uniqueUsers: { $addToSet: '$userId' }
          }
        }
      ]);

      return result.length > 0 ? result[0].uniqueUsers.length : 0;
    } catch (error) {
      console.error('[AnalyticsService] Error getting active users:', error.message);
      throw error;
    }
  }

  /**
   * Calculate percentage change
   * @param {number} current
   * @param {number} previous
   * @returns {number}
   */
  calculatePercentageChange(current, previous) {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }
    return Math.round(((current - previous) / previous) * 100);
  }

  /**
   * Get overview metrics for dashboard
   * @param {Date} startDate
   * @param {Date} endDate
   * @param {Date} prevStartDate
   * @param {Date} prevEndDate
   * @returns {Promise<Object>}
   */
  async getOverviewMetrics(startDate, endDate, prevStartDate, prevEndDate) {
    try {
      const [
        totalUsers,
        newSignups,
        prevSignups,
        pageViews,
        prevPageViews,
        uniqueVisitors,
        avgSessionDuration,
        prevAvgSessionDuration,
        activeUsers,
        prevActiveUsers,
        activityBreakdown
      ] = await Promise.all([
        this.getTotalUsers(),
        this.getNewSignups(startDate, endDate),
        this.getNewSignups(prevStartDate, prevEndDate),
        this.getPageViews(startDate, endDate),
        this.getPageViews(prevStartDate, prevEndDate),
        this.getUniqueVisitors(startDate, endDate),
        sessionService.getAverageDuration(startDate, endDate),
        sessionService.getAverageDuration(prevStartDate, prevEndDate),
        this.getActiveUsers(startDate, endDate),
        this.getActiveUsers(prevStartDate, prevEndDate),
        this.getActivityBreakdown(startDate, endDate)
      ]);

      return {
        totalUsers,
        newSignups,
        signupChange: this.calculatePercentageChange(newSignups, prevSignups),
        pageViews,
        pageViewChange: this.calculatePercentageChange(pageViews, prevPageViews),
        uniqueVisitors: uniqueVisitors.total,
        avgSessionDuration,
        sessionDurationChange: this.calculatePercentageChange(avgSessionDuration, prevAvgSessionDuration),
        activeUsers,
        activeUserChange: this.calculatePercentageChange(activeUsers, prevActiveUsers),
        activityBreakdown,
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('[AnalyticsService] Error getting overview metrics:', error.message);
      throw error;
    }
  }

  /**
   * Aggregate daily stats for a specific date
   * @param {Date} date
   * @returns {Promise<Object>}
   */
  async aggregateDailyStats(date) {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const [
        newSignups,
        pageViews,
        uniqueVisitors,
        activityBreakdown,
        activeUsers,
        avgSessionDuration,
        sessionCount
      ] = await Promise.all([
        this.getNewSignups(startOfDay, endOfDay),
        this.getPageViews(startOfDay, endOfDay),
        this.getUniqueVisitors(startOfDay, endOfDay),
        this.getActivityBreakdown(startOfDay, endOfDay),
        this.getActiveUsers(startOfDay, endOfDay),
        sessionService.getAverageDuration(startOfDay, endOfDay),
        AnalyticsEvent.countDocuments({
          eventType: 'page_view',
          timestamp: { $gte: startOfDay, $lte: endOfDay }
        })
      ]);

      const stats = await AnalyticsDailyStats.findOneAndUpdate(
        { date: startOfDay },
        {
          date: startOfDay,
          metrics: {
            newSignups,
            pageViews,
            uniqueVisitors: uniqueVisitors.total,
            totalActivities: activityBreakdown.total,
            activityBreakdown: {
              posts: activityBreakdown.posts,
              likes: activityBreakdown.likes,
              comments: activityBreakdown.comments,
              follows: activityBreakdown.follows,
              unfollows: activityBreakdown.unfollows
            },
            activeUsers,
            avgSessionDuration,
            sessionCount
          },
          computed: true,
          computedAt: new Date()
        },
        { upsert: true, new: true }
      );

      return stats;
    } catch (error) {
      console.error('[AnalyticsService] Error aggregating daily stats:', error.message);
      throw error;
    }
  }
}

export default new AnalyticsService();
