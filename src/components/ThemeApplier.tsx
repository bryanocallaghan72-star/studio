'use client';

import { useTimeOfDayTheme } from '@/hooks/useTimeOfDayTheme';
import { ReactNode } from 'react';

export function ThemeApplier({ children }: { children: ReactNode }) {
  useTimeOfDayTheme(); // This hook applies the theme by manipulating the DOM
  return <>{children}</>;
}
