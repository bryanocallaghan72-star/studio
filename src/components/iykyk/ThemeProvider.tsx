"use client";

import { useEffect, useState } from 'react';

type Theme = 'dawn' | 'day' | 'golden-hour' | 'dusk';

const getThemeByTime = (): Theme => {
  const hours = new Date().getHours();
  if (hours >= 5 && hours < 9) {
    return 'dawn'; // 5 AM - 9 AM
  }
  if (hours >= 9 && hours < 17) {
    return 'day'; // 9 AM - 5 PM
  }
  if (hours >= 17 && hours < 20) {
    return 'golden-hour'; // 5 PM - 8 PM
  }
  return 'dusk'; // 8 PM onwards
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('day'); // Default to 'day'

  useEffect(() => {
    // This effect runs only on the client to avoid hydration mismatch
    const currentTheme = getThemeByTime();
    setTheme(currentTheme);
  }, []);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      // Remove all possible theme attributes
      root.removeAttribute('data-theme');
      root.classList.remove('dark'); // also remove fallback dark class

      // Set the new theme
      root.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return <>{children}</>;
}
