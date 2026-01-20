
"use client";

import { HOT_ITEMS } from '@/data/seeds/drops';
import type { HotItem } from '@/data/seeds/drops';

/**
 * Hook to fetch "hot item" data.
 * In Phase 1, this returns mock data. It will be updated to fetch from
 * Firestore in a later phase.
 *
 * @returns An object containing the hotItems array, loading state, and error state.
 */
export function useHotItems() {
  // For Phase 1, we simply return the mock data with a consistent shape.
  return {
    hotItems: HOT_ITEMS as HotItem[],
    isLoading: false,
    error: null,
  };
}
