import { AnalyticsSession } from '../models/analytics.model.js';

/**
 * Session Service - Manages user session tracking for analytics
 */
class SessionService {
  /**
   * Start a new session
   * @param {string} sessionId - Session identifier
   * @param {string} userId - User ID (optional)
   * @returns {Promise<Object>} - Created session
   */
  async startSession(sessionId, userId = null) {
    try {
      const session = await AnalyticsSession.create({
        sessionId,
        userId,
        startTime: new Date(),
        lastActivity: new Date(),
        pageViews: 0
      });
      
      return session;
    } catch (error) {
      // Session might already exist, update it instead
      if (error.code === 11000) {
        return await AnalyticsSession.findOneAndUpdate(
          { sessionId },
          {
            userId,
            lastActivity: new Date()
          },
          { new: true }
        );
      }
      throw error;
    }
  }

  /**
   * End a session
   * @param {string} sessionId - Session identifier
   * @returns {Promise<Object>} - Updated session
   */
  async endSession(sessionId) {
    try {
      const session = await AnalyticsSession.findOne({ sessionId });
      if (!session) {
        console.warn(`[SessionService] Session not found: ${sessionId}`);
        return null;
      }

      const endTime = new Date();
      const duration = Math.floor((endTime - session.startTime) / 1000); // seconds

      session.endTime = endTime;
      session.duration = duration;
      await session.save();

      return session;
    } catch (error) {
      console.error('[SessionService] Error ending session:', error.message);
      throw error;
    }
  }

  /**
   * Update session activity
   * @param {string} sessionId - Session identifier
   * @returns {Promise<Object>} - Updated session
   */
  async updateActivity(sessionId) {
    try {
      const session = await AnalyticsSession.findOneAndUpdate(
        { sessionId },
        {
          lastActivity: new Date(),
          $inc: { pageViews: 1 }
        },
        { new: true, upsert: true }
      );

      return session;
    } catch (error) {
      console.error('[SessionService] Error updating activity:', error.message);
      throw error;
    }
  }

  /**
   * Get average session duration for a date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<number>} - Average duration in seconds
   */
  async getAverageDuration(startDate, endDate) {
    try {
      const result = await AnalyticsSession.aggregate([
        {
          $match: {
            startTime: { $gte: startDate, $lte: endDate },
            duration: { $ne: null, $gt: 0 }
          }
        },
        {
          $group: {
            _id: null,
            avgDuration: { $avg: '$duration' }
          }
        }
      ]);

      return result.length > 0 ? Math.round(result[0].avgDuration) : 0;
    } catch (error) {
      console.error('[SessionService] Error calculating average duration:', error.message);
      throw error;
    }
  }

  /**
   * Get session duration distribution
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<Object>} - Distribution by time ranges
   */
  async getDurationDistribution(startDate, endDate) {
    try {
      const sessions = await AnalyticsSession.find({
        startTime: { $gte: startDate, $lte: endDate },
        duration: { $ne: null, $gt: 0 }
      }).select('duration');

      const distribution = {
        '0-5min': 0,
        '5-15min': 0,
        '15-30min': 0,
        '30-60min': 0,
        '60min+': 0
      };

      sessions.forEach(session => {
        const minutes = session.duration / 60;
        if (minutes <= 5) distribution['0-5min']++;
        else if (minutes <= 15) distribution['5-15min']++;
        else if (minutes <= 30) distribution['15-30min']++;
        else if (minutes <= 60) distribution['30-60min']++;
        else distribution['60min+']++;
      });

      return distribution;
    } catch (error) {
      console.error('[SessionService] Error getting distribution:', error.message);
      throw error;
    }
  }

  /**
   * Cleanup orphaned sessions (older than 24 hours without end time)
   * @returns {Promise<number>} - Number of sessions cleaned up
   */
  async cleanupOrphanedSessions() {
    try {
      const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

      const orphanedSessions = await AnalyticsSession.find({
        startTime: { $lt: cutoffTime },
        endTime: null
      });

      let cleanedCount = 0;
      for (const session of orphanedSessions) {
        const duration = Math.floor((session.lastActivity - session.startTime) / 1000);
        session.endTime = session.lastActivity;
        session.duration = duration;
        await session.save();
        cleanedCount++;
      }

      console.log(`[SessionService] Cleaned up ${cleanedCount} orphaned sessions`);
      return cleanedCount;
    } catch (error) {
      console.error('[SessionService] Error cleaning up sessions:', error.message);
      throw error;
    }
  }
}

export default new SessionService();
