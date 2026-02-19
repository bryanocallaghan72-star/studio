
"use client";

import { CLASS_DROPS } from '@/data/seeds/drops';
import type { ClassDrop } from '@/data/seeds/drops';

export function useClassDrops() {
  return {
    classDrops: CLASS_DROPS as ClassDrop[],
    isLoading: false,
    error: null,
  };
}
