"use client";

import { useMemo } from 'react';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';

// Define the shape of a creator for type safety
export type Creator = {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  activity?: { name: string; uv: number }[];
};

/**
 * Hook to fetch creator data from Firestore.
 * Fetches users where isCreator is true.
 *
 * @returns An object containing the creators array, a creatorsById map, loading state, and error state.
 */
export function useCreators() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const creatorsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'users'), where('isCreator', '==', true));
  }, [firestore, user]);

  const { data: rawCreators, isLoading, error } = useCollection<any>(creatorsQuery);

  // Transform Firestore docs into the expected Creator shape
  const creators = useMemo((): Creator[] => {
    return (rawCreators || []).map(c => ({
      id: c.id,
      name: c.username || 'Bondi Local',
      bio: c.bio || '',
      avatar: c.avatarUrl || `https://api.dicebear.com/8.x/lorelei/svg?seed=${c.id}`,
      activity: [] // Activity metrics can be linked here in future phases
    }));
  }, [rawCreators]);

  // Create a memoized lookup table for creators by their ID
  const creatorsById = useMemo(() => {
    return creators.reduce((acc, creator) => {
      acc[creator.id] = creator;
      return acc;
    }, {} as Record<string, Creator>);
  }, [creators]);

  return {
    creators,
    creatorsById,
    isLoading: isUserLoading || isLoading,
    error,
  };
}
