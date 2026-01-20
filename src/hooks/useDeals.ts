
'use client';

import { DEALS } from '@/data/seeds/drops';
import type { Deal } from '@/data/seeds/drops';


/**
 * Hook to fetch deal data.
 * In Phase 1, this returns mock data but ensures each deal object
 * has a consistent `venueSlug` for linking to live venue data.
 *
 * @returns An object containing the deals array, loading state, and error state.
 */
export function useDeals() {
  // Map over the raw data to enforce the Deal type and ensure venueSlug exists.
  const processedDeals = DEALS.map((deal: any) => ({
    ...deal,
    // Ensure venueSlug is present, falling back from venueId if necessary.
    venueSlug: deal.venueSlug || deal.venueId || '', 
  }));

  return {
    deals: processedDeals as Deal[],
    isLoading: false,
    error: null,
  };
}
