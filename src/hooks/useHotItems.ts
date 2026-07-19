"use client";

import { collection } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { HotItem } from '@/data/seeds/drops';

/**
 * Hook to fetch "hot item" (Fire) drops.
 *
 * NOW LIVE: reads the `hotItems` collection from Firestore in real-time
 * (onSnapshot), instead of the local seed file. Publish or edit an offer in
 * Firestore (via the /admin seeder or the console) and every open app updates
 * instantly — no deploy needed.
 */
export function useHotItems() {
  const firestore = useFirestore();

  const hotItemsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'hotItems') : null),
    [firestore]
  );

  const { data, isLoading, error } = useCollection<HotItem>(hotItemsRef);

  return {
    hotItems: (data ?? []) as HotItem[],
    isLoading,
    error,
  };
}
