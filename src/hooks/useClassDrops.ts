
"use client";

import { CLASS_DROPS } from '@/data/seeds/drops';
import type { ClassDrop } from '@/data/seeds/drops';


/**
 * Hook to fetch class drop data.
 * In this phase, it returns mock data. It will be updated to fetch from
 * Firestore in a later phase.
 *
 * @returns An object containing the class drops array, loading state, and error state.
 */
export function useClassDrops() {
  return {
    classDrops: CLASS_DROPS as ClassDrop[],
    isLoading: false,
    error: null,
  };
}
