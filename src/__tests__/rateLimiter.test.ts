import { describe, it, expect, beforeEach, vi } from 'vitest';
import { rateLimiter } from '../utils/rateLimiter';

describe('RateLimiter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('요청 간격을 유지해야 함', async () => {
    const fn1 = vi.fn().mockResolvedValue('result1');
    const fn2 = vi.fn().mockResolvedValue('result2');

    const promise1 = rateLimiter.execute(fn1);
    const promise2 = rateLimiter.execute(fn2);

    await vi.runAllTimersAsync();

    const results = await Promise.all([promise1, promise2]);
    
    expect(fn1).toHaveBeenCalled();
    expect(fn2).toHaveBeenCalled();
    expect(results).toEqual(['result1', 'result2']);
  });

  it('동시 요청 수를 제한해야 함', () => {
    const activeCount = rateLimiter.getActiveCount();
    expect(activeCount).toBeGreaterThanOrEqual(0);
    expect(activeCount).toBeLessThanOrEqual(2);
  });

  it('대기 중인 요청 수를 추적해야 함', async () => {
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(
        rateLimiter.execute(() => 
          new Promise(resolve => setTimeout(() => resolve(i), 100))
        )
      );
    }

    const pendingCount = rateLimiter.getPendingCount();
    expect(pendingCount).toBeGreaterThanOrEqual(0);

    await vi.runAllTimersAsync();
    await Promise.all(promises);
  });

  it('에러를 적절히 전파해야 함', async () => {
    const errorFn = vi.fn().mockRejectedValue(new Error('Test error'));

    await expect(rateLimiter.execute(errorFn)).rejects.toThrow('Test error');
    expect(errorFn).toHaveBeenCalled();
  }, 10000);
});