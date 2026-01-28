
'use client';

import { collection, query } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase, WithId } from '@/firebase';
import type { Venue } from '@/types/venue';

/**
 * A hook to fetch all venue documents from the Firestore 'venues' collection.
 *
 * @returns An object containing the venues array, loading state, and error state.
 */
export function useVenues() {
  const firestore = useFirestore();

  const venuesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'venues'));
  }, [firestore]);

  const { data: venues, isLoading, error } = useCollection<WithId<Venue>>(venuesQuery);

  return { venues, isLoading, error };
}
