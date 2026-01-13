
"use client";

import { useMemo } from 'react';
import { appData } from '@/lib/data';

// Define the shape of a creator for type safety
export type Creator = {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  activity: { name: string; uv: number }[];
};

/**
 * Hook to fetch creator data.
 * In this phase, it returns mock data from lib/data.
 * It will be updated to fetch from Firestore in a later phase.
 *
 * @returns An object containing the creators array, a creatorsById map, loading state, and error state.
 */
export function useCreators() {
  const creators = appData.creators as Creator[];

  // Create a memoized lookup table for creators by their ID
  const creatorsById = useMemo(() => {
    if (!creators) return {};
    return creators.reduce((acc, creator) => {
      acc[creator.id] = creator;
      return acc;
    }, {} as Record<string, Creator>);
  }, [creators]);

  return {
    creators,
    creatorsById,
    isLoading: false,
    error: null,
  };
}
