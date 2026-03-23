import { sleep } from './sleep';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Sleep', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should wait for the specified milliseconds', async () => {
    const promise = sleep(1000);
    vi.advanceTimersByTime(1000);
    await expect(promise).resolves.toBeUndefined();
  });
});
