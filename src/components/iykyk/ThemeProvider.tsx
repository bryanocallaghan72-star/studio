"use client";

import { useEffect, useState } from 'react';

// For "day" mode, we want the light theme to be the default.
const isDayTime = () => {
  const hours = new Date().getHours();
  // Day time is between 6 AM and 6 PM
  return hours > 6 && hours < 18;
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // This effect runs only on the client to avoid hydration mismatch
    // Set theme based on time of day
    // const currentTheme = isDayTime() ? 'light' : 'dark';
    // For now, let's default to light theme as requested
    const currentTheme = 'light';
    setTheme(currentTheme);
  }, []);
  
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return <>{children}</>;
}
