import { eventQueue } from '../services/eventQueue.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Analytics Middleware - Captures page views and user activity
 * Runs asynchronously to avoid blocking request processing
 */
export const analyticsMiddleware = (req, res, next) => {
  try {
    // Generate or retrieve session ID
    const sessionId = req.session?.id || req.cookies?.sessionId || uuidv4();
    
    // Store session ID in cookie if not present
    if (!req.cookies?.sessionId) {
      res.cookie('sessionId', sessionId, {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true
      });
    }

    // Extract user info
    const userId = req.auth?._id || req.user?._id || null;
    const userAgent = req.get('user-agent') || 'unknown';
    const path = req.path;
    const timestamp = new Date();

    // Capture response status code when response finishes
    res.on('finish', () => {
      try {
        const event = {
          eventType: 'page_view',
          timestamp,
          userId,
          sessionId,
          metadata: {
            path,
            userAgent,
            statusCode: res.statusCode
          }
        };

        // Queue event asynchronously (non-blocking)
        eventQueue.enqueue(event);
      } catch (error) {
        // Log error but don't throw - analytics should never break the app
        console.error('[Analytics] Error recording page view:', error.message);
      }
    });

    // Continue request processing
    next();
  } catch (error) {
    // Log error but continue - analytics failures should not block requests
    console.error('[Analytics] Middleware error:', error.message);
    next();
  }
};

/**
 * Track custom analytics events (signup, post, like, comment, etc.)
 * @param {string} eventType - Type of event
 * @param {string} userId - User ID
 * @param {string} sessionId - Session ID
 * @param {Object} metadata - Additional event metadata
 */
export const trackEvent = (eventType, userId, sessionId, metadata = {}) => {
  try {
    const event = {
      eventType,
      timestamp: new Date(),
      userId,
      sessionId,
      metadata
    };

    eventQueue.enqueue(event);
  } catch (error) {
    console.error('[Analytics] Error tracking event:', error.message);
  }
};

/**
 * Extract session ID from request
 * @param {Object} req - Express request object
 * @returns {string} - Session ID
 */
export const getSessionId = (req) => {
  return req.session?.id || req.cookies?.sessionId || uuidv4();
};
