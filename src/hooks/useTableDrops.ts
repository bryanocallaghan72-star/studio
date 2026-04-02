
"use client";

import { TABLE_DROPS } from '@/data/seeds/drops';
import type { TableDrop } from '@/data/seeds/drops';
export type { TableDrop } from '@/data/seeds/drops';
/**
 * Hook to fetch table drop data.
 * In Phase 1, this returns mock data. It will be updated to fetch from
 * Firestore in a later phase.
 *
 * @returns An object containing the table drops array, loading state, and error state.
 */
export function useTableDrops() {
  // For Phase 1, we simply return the mock data.
  // The structure is designed to be replaced with a real Firestore call.
  return {
    tableDrops: TABLE_DROPS as TableDrop[],
    isLoading: false,
    error: null,
  };
}
