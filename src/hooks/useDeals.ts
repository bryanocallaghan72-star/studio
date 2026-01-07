
'use client';

import { appData } from '@/lib/data';

// The canonical shape of a Deal object as returned by the hook.
// venueSlug is now guaranteed.
export type Deal = {
  id: string;
  title: string;
  venueSlug: string; // Now required
  description: string;
  imageId: string;
  validity: string;
  category: string;
  tags?: string[]; // Made optional for safety
};

/**
 * Hook to fetch deal data.
 * In Phase 1, this returns mock data but ensures each deal object
 * has a consistent `venueSlug` for linking to live venue data.
 *
 * @returns An object containing the deals array, loading state, and error state.
 */
export function useDeals() {
  // Map over the raw data to enforce the Deal type and ensure venueSlug exists.
  const processedDeals = appData.deals.map((deal: any) => ({
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
