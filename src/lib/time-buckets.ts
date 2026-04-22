import type { TimeBucket } from './surprise-options';

/**
 * Returns the relevant time bucket for content logic (e.g. Surprise Me).
 * Supports an optional Date override for God Mode.
 */
export function getCurrentTimeBucket(date?: Date): TimeBucket {
  const targetDate = date ?? new Date();
  const hour = targetDate.getHours();

  if (hour >= 5 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 16) return 'day';
  if (hour >= 16 && hour < 19) return 'goldenHour';
  return 'night';
}

/**
 * Returns the relevant time category for UI tabs (e.g. Flow page).
 * Supports an optional Date override for God Mode.
 */
export function getCurrentTimeCategory(date?: Date): 'morning' | 'day' | 'golden' | 'night' {
  const targetDate = date ?? new Date();
  const hour = targetDate.getHours();

  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'day';
  if (hour >= 17 && hour < 20) return 'golden';
  return 'night';
}
