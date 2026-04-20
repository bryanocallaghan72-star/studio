
"use client";

import { useMemo } from 'react';
import { TABLE_DROPS } from '@/data/seeds/drops';
import type { TableDrop } from '@/data/seeds/drops';
import { useDemoTime } from '@/context/DemoTimeContext';

const DATA_INIT_TIME = Date.now();

/**
 * Hook to fetch table drop data.
 * Updated to be phase-aware, shifting timestamps relative to the God Mode mock date.
 *
 * @returns An object containing the table drops array, loading state, and error state.
 */
export function useTableDrops() {
  const { mockDate } = useDemoTime();

  const tableDrops = useMemo(() => {
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
  }, [mockDate]);

  return {
    tableDrops,
    isLoading: false,
    error: null,
  };
}

export type { TableDrop };
