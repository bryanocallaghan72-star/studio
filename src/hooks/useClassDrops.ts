"use client";

import { useMemo } from 'react';
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { CLASS_DROPS } from '@/data/seeds/drops';
import type { ClassDrop } from '@/data/seeds/drops';
import { useDemoTime } from '@/context/DemoTimeContext';

const DATA_INIT_TIME = Date.now();

/**
 * Hook to fetch class drop data.
 * Migrated to fetch from Firestore with local seed data as fallback.
 * Shifting logic is maintained for local data to support God Mode phases.
 */
export function useClassDrops() {
  const { mockDate } = useDemoTime();
  const firestore = useFirestore();

  const classDropsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'classDrops'), orderBy('startTime', 'asc'));
  }, [firestore]);

  const { data: firestoreDrops, isLoading, error } = useCollection<ClassDrop>(classDropsQuery);

  const classDrops = useMemo(() => {
    if (isLoading) return [];

    // If Firestore has data, return it directly.
    // Instructor-created drops in Firestore are authoritative and do not use relative shifting.
    if (firestoreDrops && firestoreDrops.length > 0) {
      return firestoreDrops.map(drop => ({
        ...drop,
        // Ensure dates are strings for consistency (handles Firestore Timestamp conversion if necessary)
        startTime: typeof drop.startTime === 'string' ? drop.startTime : (drop.startTime as any).toDate?.().toISOString() || drop.startTime,
        expiresAt: typeof drop.expiresAt === 'string' ? drop.expiresAt : (drop.expiresAt as any).toDate?.().toISOString() || drop.expiresAt,
      }));
    }

    // Fallback: If Firestore is empty, use local data and apply timestamp shifting for demo consistency.
    return (CLASS_DROPS as ClassDrop[]).map(drop => {
      const shift = (isoString: string) => {
        const original = new Date(isoString).getTime();
        return new Date(original - DATA_INIT_TIME + mockDate.getTime()).toISOString();
      };

      return {
        ...drop,
        startTime: shift(drop.startTime),
        expiresAt: shift(drop.expiresAt),
      };
    });
  }, [firestoreDrops, isLoading, mockDate]);

  return {
    classDrops,
    isLoading,
    error,
  };
}
