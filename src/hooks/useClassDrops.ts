
"use client";

import { appData } from '@/lib/data';

// The canonical shape of a Class Drop object as returned by the hook.
export type ClassDrop = {
  id: string;
  venueId: string; // The slug for the venue
  venueName: string;
  className: string;
  classImageUrl: string;
  spotsAvailable: number;
  startTime: string;
  expiresAt: string;
  instructorHandle?: string;
  isFavoriteVenue?: boolean;
  hasUserClaimed?: boolean; // This is added client-side
  location: {
    lat: number;
    lng: number;
  };
};

/**
 * Hook to fetch class drop data.
 * In this phase, it returns mock data. It will be updated to fetch from
 * Firestore in a later phase.
 *
 * @returns An object containing the class drops array, loading state, and error state.
 */
export function useClassDrops() {
  return {
    classDrops: appData.classDrops as ClassDrop[],
    isLoading: false,
    error: null,
  };
}
