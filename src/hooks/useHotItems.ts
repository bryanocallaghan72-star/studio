
"use client";

import { useMemo } from 'react';
import { HOT_ITEMS } from '@/data/seeds/drops';
import type { HotItem } from '@/data/seeds/drops';
import { useDemoTime } from '@/context/DemoTimeContext';

// Capture the time when the module loads to calculate stable relative offsets
const DATA_INIT_TIME = Date.now();

/**
 * Hook to fetch "hot item" data.
 * Updated to be phase-aware, shifting timestamps relative to the God Mode mock date.
 *
 * @returns An object containing the hotItems array, loading state, and error state.
 */
export function useHotItems() {
  const { mockDate } = useDemoTime();

  const hotItems = useMemo(() => {
    return (HOT_ITEMS as HotItem[]).map(item => {
      const originalExpiresAt = new Date(item.expiresAt).getTime();
      const offset = originalExpiresAt - DATA_INIT_TIME;
      
      return {
        ...item,
        // Shift expiration to be relative to the current God Mode mock date
        expiresAt: new Date(mockDate.getTime() + offset).toISOString(),
      };
    });
  }, [mockDate]);

  return {
    hotItems,
    isLoading: false,
    error: null,
  };
}
