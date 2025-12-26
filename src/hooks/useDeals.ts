'use client';

import { appData } from '@/lib/data';

// Define the shape of a deal based on the mock data for type safety
export type Deal = {
  id: string;
  title: string;
  venueSlug: string;
  description: string;
  imageId: string;
  validity: string;
  category: string;
  tags: string[];
};

/**
 * Hook to fetch deal data.
 * In Phase 0, this returns mock data. It will be updated to fetch from
 * Firestore in a later phase.
 *
 * @returns An object containing the deals array, loading state, and error state.
 */
export function useDeals() {

  // For Phase 0, we simply return the mock data.
  // The structure is designed to be replaced with a real Firestore call.
  return {
    deals: appData.deals as Deal[],
    isLoading: false,
    error: null,
  };
}
