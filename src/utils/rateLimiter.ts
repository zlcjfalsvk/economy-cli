import pLimit from 'p-limit';
import { RATE_LIMIT_CONFIG } from './config.js';

class RateLimiter {
  private limit: ReturnType<typeof pLimit>;
  private lastRequestTime: number = 0;

  constructor() {
    this.limit = pLimit(Math.floor(RATE_LIMIT_CONFIG.maxRequestsPerMinute / 60));
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    return this.limit(async () => {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      
      if (timeSinceLastRequest < RATE_LIMIT_CONFIG.requestInterval) {
        const delay = RATE_LIMIT_CONFIG.requestInterval - timeSinceLastRequest;
        await this.sleep(delay);
      }

      this.lastRequestTime = Date.now();
      return fn();
    });
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getActiveCount(): number {
    return this.limit.activeCount;
  }

  getPendingCount(): number {
    return this.limit.pendingCount;
  }
}

export const rateLimiter = new RateLimiter();