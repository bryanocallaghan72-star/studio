
"use client";

import { appData } from '@/lib/data';

// The canonical shape of a Hot Item object as returned by the hook.
export type HotItem = {
  id: string;
  title: string;
  venue: string; // This is the mock venue name, used as a fallback
  venueId: string; // This is the slug used for lookup
  description: string;
  imageId: string;
  expiresAt: string;
  claims: number;
  creatorId?: string;
};

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
    hotItems: appData.hotItems as HotItem[],
    isLoading: false,
    error: null,
  };
}
