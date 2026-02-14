import analyticsService from '../services/analyticsService.js';
import sessionService from '../services/sessionService.js';

/**
 * Get date range based on filter
 * @param {string} filter - 'today', 'week', 'month', 'custom'
 * @param {string} customStart - Custom start date (ISO string)
 * @param {string} customEnd - Custom end date (ISO string)
 * @returns {Object} - { startDate, endDate, prevStartDate, prevEndDate }
 */
const getDateRange = (filter, customStart, customEnd) => {
  const now = new Date();
  let startDate, endDate, prevStartDate, prevEndDate;

  switch (filter) {
    case 'today':
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);
      
      prevStartDate = new Date(startDate);
      prevStartDate.setDate(prevStartDate.getDate() - 1);
      prevEndDate = new Date(endDate);
      prevEndDate.setDate(prevEndDate.getDate() - 1);
      break;

    case 'week':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);
      
      prevStartDate = new Date(startDate);
      prevStartDate.setDate(prevStartDate.getDate() - 7);
      prevEndDate = new Date(endDate);
      prevEndDate.setDate(prevEndDate.getDate() - 7);
      break;

    case 'month':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 30);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);
      
      prevStartDate = new Date(startDate);
      prevStartDate.setDate(prevStartDate.getDate() - 30);
      prevEndDate = new Date(endDate);
      prevEndDate.setDate(prevEndDate.getDate() - 30);
      break;

    case 'custom':
      if (!customStart || !customEnd) {
        throw new Error('Custom date range requires start and end dates');
      }
      startDate = new Date(customStart);
      endDate = new Date(customEnd);
      
      if (startDate > endDate) {
        throw new Error('Start date must be before or equal to end date');
      }
      
      const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      prevStartDate = new Date(startDate);
      prevStartDate.setDate(prevStartDate.getDate() - daysDiff);
      prevEndDate = new Date(endDate);
      prevEndDate.setDate(prevEndDate.getDate() - daysDiff);
      break;

    default:
      throw new Error('Invalid filter type');
  }

  return { startDate, endDate, prevStartDate, prevEndDate };
};

/**
 * Get overview metrics
 * GET /api/admin/analytics/overview
 */
const getOverview = async (req, res) => {
  try {
    const { filter = 'today', start, end } = req.query;
    const { startDate, endDate, prevStartDate, prevEndDate } = getDateRange(filter, start, end);

    const metrics = await analyticsService.getOverviewMetrics(
      startDate,
      endDate,
      prevStartDate,
      prevEndDate
    );

    res.json(metrics);
  } catch (error) {
    console.error('[Analytics] Error getting overview:', error.message);
    res.status(400).json({ error: error.message });
  }
};

/**
 * Get signup trends
 * GET /api/admin/analytics/signups
 */
const getSignups = async (req, res) => {
  try {
    const { filter = 'today', granularity = 'daily', start, end } = req.query;
    const { startDate, endDate } = getDateRange(filter, start, end);

    const [trend, total, prevTotal] = await Promise.all([
      analyticsService.getSignupTrend(startDate, endDate, granularity),
      analyticsService.getNewSignups(startDate, endDate),
      analyticsService.getNewSignups(
        new Date(startDate.getTime() - (endDate - startDate)),
        startDate
      )
    ]);

    const change = analyticsService.calculatePercentageChange(total, prevTotal);

    res.json({ data: trend, total, change });
  } catch (error) {
    console.error('[Analytics] Error getting signups:', error.message);
    res.status(400).json({ error: error.message });
  }
};

/**
 * Get activity breakdown and trends
 * GET /api/admin/analytics/activity
 */
const getActivity = async (req, res) => {
  try {
    const { filter = 'today', start, end } = req.query;
    const { startDate, endDate } = getDateRange(filter, start, end);

    const [breakdown, trend] = await Promise.all([
      analyticsService.getActivityBreakdown(startDate, endDate),
      analyticsService.getActivityTrend(startDate, endDate)
    ]);

    res.json({ breakdown, trend });
  } catch (error) {
    console.error('[Analytics] Error getting activity:', error.message);
    res.status(400).json({ error: error.message });
  }
};

/**
 * Get session analytics
 * GET /api/admin/analytics/sessions
 */
const getSessions = async (req, res) => {
  try {
    const { filter = 'today', start, end } = req.query;
    const { startDate, endDate } = getDateRange(filter, start, end);

    const [avgDuration, distribution] = await Promise.all([
      sessionService.getAverageDuration(startDate, endDate),
      sessionService.getDurationDistribution(startDate, endDate)
    ]);

    res.json({ avgDuration, distribution });
  } catch (error) {
    console.error('[Analytics] Error getting sessions:', error.message);
    res.status(400).json({ error: error.message });
  }
};

export default {
  getOverview,
  getSignups,
  getActivity,
  getSessions
};
