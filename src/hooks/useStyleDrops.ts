
"use client";

import { STYLE_DROPS } from '@/data/seeds/drops';
import type { StyleDrop } from '@/data/seeds/drops';

/**
 * Hook to fetch style drop data.
 * In this phase, it returns mock data from lib/data.
 * It will be updated to fetch from Firestore in a later phase.
 *
 * @returns An object containing the style drops array, loading state, and error state.
 */
export function useStyleDrops() {
  // Ensure every drop has a slug for consistency, falling back from venueId.
  const processedDrops = STYLE_DROPS.map(drop => ({
    ...drop,
    slug: drop.slug || drop.venueId || '',
  }));

  return {
    styleDrops: processedDrops as StyleDrop[],
    isLoading: false,
    error: null,
  };
}
