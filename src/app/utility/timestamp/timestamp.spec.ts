import { getTimestamp, getTimestampText, convTimestampTextToValue } from './timestamp';

describe('Timestamp', () => {
  it('should return a valid timestamp', () => {
    const timestamp = getTimestamp();
    expect(typeof timestamp).toBe('number');
    expect(timestamp).toBeGreaterThan(0);
  });

  it('should return a valid ISO timestamp', () => {
    const isoTimestamp = getTimestampText();
    expect(typeof isoTimestamp).toBe('string');
    expect(isoTimestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
  });

  it('can convert timestamp b/w value and text', () => {
    const text1 = '2025-09-05T19:18:20.456Z';
    const value1 = convTimestampTextToValue(text1);
    const text2 = new Date(value1).toISOString();
    console.log(`value1: ${value1}`);
    console.log(`text2: ${text2}`);
    expect(text2).toEqual(text1);
  });
});
