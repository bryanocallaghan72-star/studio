import type { TimeBucket } from './surprise-options';

export function getCurrentTimeBucket(date = new Date()): TimeBucket {
  const hour = date.getHours();

  if (hour >= 5 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 16) return 'day';
  if (hour >= 16 && hour < 19) return 'goldenHour';
  return 'night';
}
