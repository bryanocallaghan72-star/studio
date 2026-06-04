"use client";

import { useMemo } from 'react';
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { TABLE_DROPS } from '@/data/seeds/drops';
import type { TableDrop } from '@/data/seeds/drops';
import { useDemoTime } from '@/context/DemoTimeContext';

const DATA_INIT_TIME = Date.now();

/**
 * Hook to fetch table drop data.
 * Migrated to fetch from Firestore with local seed data as fallback.
 * Shifting logic is maintained for local data to support God Mode phases.
 * 
 * @returns An object containing the table drops array, loading state, and error state.
 */
export function useTableDrops() {
  const { mockDate } = useDemoTime();
  const firestore = useFirestore();

  const tableDropsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'tableDrops'), orderBy('startTime', 'asc'));
  }, [firestore]);

  const { data: firestoreDrops, isLoading, error } = useCollection<TableDrop>(tableDropsQuery);

  const tableDrops = useMemo(() => {
    if (isLoading) return [];

    // If Firestore has data, return it directly.
    // Real drops in Firestore are authoritative and do not use relative shifting.
    if (firestoreDrops && firestoreDrops.length > 0) {
      return firestoreDrops.map(drop => ({
        ...drop,
        // Ensure dates are strings for consistency (handles Firestore Timestamp conversion if necessary)
        startTime: typeof drop.startTime === 'string' ? drop.startTime : (drop.startTime as any).toDate?.().toISOString() || drop.startTime,
        endTime: typeof drop.endTime === 'string' ? drop.endTime : (drop.endTime as any).toDate?.().toISOString() || drop.endTime,
        expiresAt: typeof drop.expiresAt === 'string' ? drop.expiresAt : (drop.expiresAt as any).toDate?.().toISOString() || drop.expiresAt,
      }));
    }

    // Fallback: If Firestore is empty, use local data and apply timestamp shifting for demo consistency.
    return (TABLE_DROPS as TableDrop[]).map(drop => {
      const shift = (isoString: string) => {
        const original = new Date(isoString).getTime();
        return new Date(original - DATA_INIT_TIME + mockDate.getTime()).toISOString();
      };

      return {
        ...drop,
        startTime: shift(drop.startTime),
        endTime: shift(drop.endTime),
        expiresAt: shift(drop.expiresAt),
      };
    });
  }, [firestoreDrops, isLoading, mockDate]);

  return {
    tableDrops,
    isLoading,
    error,
  };
}

export type { TableDrop };
