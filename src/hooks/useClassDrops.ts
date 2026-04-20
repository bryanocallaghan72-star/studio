
"use client";

import { useMemo } from 'react';
import { CLASS_DROPS } from '@/data/seeds/drops';
import type { ClassDrop } from '@/data/seeds/drops';
import { useDemoTime } from '@/context/DemoTimeContext';

const DATA_INIT_TIME = Date.now();

/**
 * Hook to fetch class drop data.
 * Updated to be phase-aware, shifting timestamps relative to the God Mode mock date.
 */
export function useClassDrops() {
  const { mockDate } = useDemoTime();

  const classDrops = useMemo(() => {
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
  }, [mockDate]);

  return {
    classDrops,
    isLoading: false,
    error: null,
  };
}
