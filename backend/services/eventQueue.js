import { AnalyticsEvent } from '../models/analytics.model.js';

/**
 * EventQueue - In-memory queue for analytics events
 * Buffers events and flushes them in batches to optimize database writes
 */
class EventQueue {
  constructor(maxSize = 1000, flushInterval = 5000) {
    this.queue = [];
    this.maxSize = maxSize;
    this.flushInterval = flushInterval;
    this.circuitBreakerActive = false;
    this.batchWriter = new BatchWriter();
    
    // Start periodic flushing
    this.flushTimer = setInterval(() => this.flush(), this.flushInterval);
  }

  /**
   * Add event to queue
   * @param {Object} event - Analytics event object
   * @returns {boolean} - Success status
   */
  enqueue(event) {
    // Circuit breaker: stop accepting events if queue is full
    if (this.queue.length >= this.maxSize) {
      if (!this.circuitBreakerActive) {
        console.error('[EventQueue] Queue overflow - circuit breaker activated');
        this.circuitBreakerActive = true;
      }
      return false;
    }

    this.queue.push(event);
    
    // Deactivate circuit breaker if queue has space again
    if (this.circuitBreakerActive && this.queue.length < this.maxSize * 0.8) {
      console.log('[EventQueue] Circuit breaker deactivated');
      this.circuitBreakerActive = false;
    }

    return true;
  }

  /**
   * Flush all queued events to database
   * @returns {Promise<number>} - Number of events written
   */
  async flush() {
    if (this.queue.length === 0) return 0;

    const eventsToWrite = [...this.queue];
    this.queue = [];

    try {
      const written = await this.batchWriter.writeBatch(eventsToWrite);
      return written;
    } catch (error) {
      console.error('[EventQueue] Flush failed:', error.message);
      // Re-queue events on failure (up to max size)
      this.queue = [...eventsToWrite.slice(0, this.maxSize - this.queue.length), ...this.queue];
      throw error;
    }
  }

  /**
   * Get current queue size
   * @returns {number}
   */
  size() {
    return this.queue.length;
  }

  /**
   * Stop the flush timer
   */
  stop() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }
}

/**
 * BatchWriter - Writes batches of events to MongoDB
 */
class BatchWriter {
  constructor(maxRetries = 3, retryDelay = 1000) {
    this.maxRetries = maxRetries;
    this.retryDelay = retryDelay;
  }

  /**
   * Write batch of events to MongoDB with retry logic
   * @param {Array} events - Array of event objects
   * @returns {Promise<number>} - Number of events written
   */
  async writeBatch(events) {
    if (!events || events.length === 0) return 0;

    let lastError;
    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        const result = await AnalyticsEvent.insertMany(events, { ordered: false });
        return result.length;
      } catch (error) {
        lastError = error;
        console.error(`[BatchWriter] Write attempt ${attempt + 1} failed:`, error.message);
        
        // Wait before retrying (exponential backoff)
        if (attempt < this.maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay * Math.pow(2, attempt)));
        }
      }
    }

    throw new Error(`Failed to write batch after ${this.maxRetries} attempts: ${lastError.message}`);
  }

  /**
   * Schedule periodic flushing (used by EventQueue)
   * @param {number} interval - Flush interval in milliseconds
   * @param {Function} flushFn - Function to call for flushing
   * @returns {NodeJS.Timeout}
   */
  scheduleFlush(interval, flushFn) {
    return setInterval(flushFn, interval);
  }
}

// Singleton instance
const eventQueue = new EventQueue();

export { EventQueue, BatchWriter, eventQueue };
