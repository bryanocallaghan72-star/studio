"use client";

import { appData } from '@/lib/data';

// Define the shape of a creator for type safety
export type Creator = {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  x: string;
  y: string;
  activity: { name: string; uv: number }[];
};

/**
 * Hook to fetch creator data.
 * In Phase 1, this returns mock data. It will be updated to fetch from
 * Firestore in a later phase.
 *
 * @returns An object containing the creators array, loading state, and error state.
 */
export function useCreators() {
  return {
    creators: appData.creators as Creator[],
    isLoading: false,
    error: null,
  };
}
