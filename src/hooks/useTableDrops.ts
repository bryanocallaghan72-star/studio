"use client";

import { appData } from '@/lib/data';

// The shape of a table drop, based on its usage in the UI.
export type TableDrop = {
  id: string;
  venueId: string; // The slug for the venue
  venueName: string;
  venueImageUrl: string;
  expiresAt: string;
  startTime: string;
  endTime: string;
  partySize: number;
  tableLabel?: string;
  priceToClaimCents: number;
  creatorPickHandle?: string;
  isFavoriteVenue?: boolean;
  hasUserClaimed?: boolean; // This is added client-side
};

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
    tableDrops: appData.tableDrops as TableDrop[],
    isLoading: false,
    error: null,
  };
}