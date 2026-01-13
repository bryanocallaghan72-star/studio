
'use client';

import { useMemo } from 'react';
import { collection } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase, WithId } from '@/firebase';

// Define the shape of a single claimed deal document
export type ClaimedDeal = WithId<{
  itemId: string;
  itemTitle: string;
  itemType: 'fire' | 'deal' | 'table' | 'active' | 'style' | 'stay';
  venueName: string;
  claimedAt: string;
  creatorId?: string;
}>;

/**
 * Hook to subscribe to a user's claimed deals subcollection.
 *
 * @param userId The ID of the user whose deals to fetch.
 * @returns An object containing the array of claimed deals, the count, loading state, and error state.
 */
export function useClaimedDeals(userId?: string) {
  const firestore = useFirestore();

  // Create a memoized query reference to the user's subcollection.
  // If no userId is provided, the query will be null.
  const claimedDealsQuery = useMemoFirebase(() => {
    if (!firestore || !userId) return null;
    return collection(firestore, 'users', userId, 'claimedDeals');
  }, [firestore, userId]);

  // useCollection handles the null query case gracefully.
  const { data: claimedDeals, isLoading, error } = useCollection<ClaimedDeal>(claimedDealsQuery);

  // Memoize the count to prevent recalculation on every render.
  const count = useMemo(() => claimedDeals?.length ?? 0, [claimedDeals]);

  return {
    claimedDeals: claimedDeals ?? [], // Ensure it's always an array
    count,
    isLoading,
    error,
  };
}
