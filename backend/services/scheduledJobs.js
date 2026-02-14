import cron from 'node-cron';
import analyticsService from './analyticsService.js';
import sessionService from './sessionService.js';

/**
 * Scheduled Jobs Service
 * Runs periodic tasks for analytics aggregation and cleanup
 */
class ScheduledJobs {
  constructor() {
    this.jobs = [];
  }

  /**
   * Start all scheduled jobs
   */
  start() {
    console.log('[ScheduledJobs] Starting scheduled jobs...');

    // Daily aggregation job - runs at midnight every day
    const dailyAggregation = cron.schedule('0 0 * * *', async () => {
      console.log('[ScheduledJobs] Running daily aggregation...');
      try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        await analyticsService.aggregateDailyStats(yesterday);
        console.log('[ScheduledJobs] Daily aggregation completed');
      } catch (error) {
        console.error('[ScheduledJobs] Daily aggregation failed:', error.message);
      }
    });

    // Session cleanup job - runs every 6 hours
    const sessionCleanup = cron.schedule('0 */6 * * *', async () => {
      console.log('[ScheduledJobs] Running session cleanup...');
      try {
        const cleaned = await sessionService.cleanupOrphanedSessions();
        console.log(`[ScheduledJobs] Session cleanup completed: ${cleaned} sessions cleaned`);
      } catch (error) {
        console.error('[ScheduledJobs] Session cleanup failed:', error.message);
      }
    });

    // Data retention cleanup - runs weekly on Sunday at 2 AM
    const dataRetention = cron.schedule('0 2 * * 0', async () => {
      console.log('[ScheduledJobs] Running data retention cleanup...');
      try {
        // MongoDB TTL index handles this automatically, but we can add custom logic here
        console.log('[ScheduledJobs] Data retention cleanup completed (handled by TTL index)');
      } catch (error) {
        console.error('[ScheduledJobs] Data retention cleanup failed:', error.message);
      }
    });

    this.jobs.push(dailyAggregation, sessionCleanup, dataRetention);
    console.log('[ScheduledJobs] All scheduled jobs started');
  }

  /**
   * Stop all scheduled jobs
   */
  stop() {
    console.log('[ScheduledJobs] Stopping scheduled jobs...');
    this.jobs.forEach(job => job.stop());
    this.jobs = [];
    console.log('[ScheduledJobs] All scheduled jobs stopped');
  }
}

export default new ScheduledJobs();
