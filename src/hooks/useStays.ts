"use client";

import { STAYS } from '@/data/seeds/drops';
import type { Stay } from '@/data/seeds/drops';

/**
 * Hook to fetch stay data.
 * This returns mock data from the centralized drops seed file.
 *
 * @returns An object containing the stays array, loading state, and error state.
 */
export function useStays() {
  return {
    stays: STAYS as Stay[],
    isLoading: false,
    error: null,
  };
}
