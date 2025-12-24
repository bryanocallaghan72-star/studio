'use client';

import { useMemo } from 'react';
import { collection, query, DocumentData } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase, WithId } from '@/firebase';

// Define the shape of the venue data we need for the AR pins.
export type ARVenue = WithId<{
  slug: string;
  name: string;
  latitude: number;
  longitude: number;
  category?: string;
}>;

/**
 * Custom hook to subscribe to the Firestore 'venues' collection for AR purposes.
 *
 * @returns An object containing the live venue data, loading state, and any errors.
 */
export function useARVenues() {
  const firestore = useFirestore();

  // Memoize the Firestore query to prevent re-renders.
  const venuesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'venues'));
  }, [firestore]);

  // Use the generic useCollection hook to fetch and subscribe to the data.
  const { data: venues, isLoading, error } = useCollection<ARVenue>(venuesQuery);

  return { venues, isLoading, error };
}
