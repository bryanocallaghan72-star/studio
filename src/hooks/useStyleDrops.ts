"use client";

import { appData } from '@/lib/data';

// The shape of a style drop, based on its usage in the UI.
export type StyleDrop = {
  id: string;
  venueName: string;
  venueImageUrl: string;
  title: string;
  description: string;
  expiresAt: string;
  priceToClaimCents: number;
  currency: string;
  creatorPickHandle?: string;
  hasUserClaimed?: boolean; // This is added client-side
  slug: string;
  venueId?: string; // Legacy field
};

/**
 * Hook to fetch style drop data.
 * In this phase, it returns mock data from lib/data.
 * It will be updated to fetch from Firestore in a later phase.
 *
 * @returns An object containing the style drops array, loading state, and error state.
 */
export function useStyleDrops() {
  // Ensure every drop has a slug for consistency, falling back from venueId.
  const processedDrops = appData.styleDrops.map(drop => ({
    ...drop,
    slug: drop.slug || drop.venueId || '',
  }));

  return {
    styleDrops: processedDrops as StyleDrop[],
    isLoading: false,
    error: null,
  };
}
