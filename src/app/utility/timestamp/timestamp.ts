/**
 * Get current timestamp.
 * @returns Timestamp.
 */
export function getTimestamp(): number {
  return Date.now();
}

/**
 * Get current timestamp in ISO format.
 * @returns Timestamp in ISO format.
 */
export function getTimestampText(): string {
  return new Date().toISOString();
}

/**
 * Convert ISO timestamp text to timestamp value.
 * @param timestamp ISO形式のタイムスタンプテキスト
 * return タイムスタンプ値
 */
export function convTimestampTextToValue(timestamp: string): number {
  const date = new Date(timestamp);
  return date.getTime();
}
