import {
  surpriseOptions,
  type SurpriseOption,
  type Vibe,
} from './surprise-options';
import { getCurrentTimeBucket } from './time-buckets';

export function getSurpriseForNow(vibe: Vibe): SurpriseOption | null {
  const timeBucket = getCurrentTimeBucket();

  const candidates = surpriseOptions.filter(
    (s) => s.vibe === vibe && s.timeBuckets.includes(timeBucket)
  );

  if (!candidates.length) return null;

  const index = Math.floor(Math.random() * candidates.length);
  const candidate = candidates[index];
  return candidate ?? null;
}
