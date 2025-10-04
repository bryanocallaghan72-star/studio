"use client";

import { useEffect, useState } from 'react';

// For "dawn" mode, we want the dark theme to be the default.
const isDayTime = () => {
  return false; // Always return false to default to dark theme
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // This effect runs only on the client
    const currentTheme = isDayTime() ? 'light' : 'dark';
    setTheme(currentTheme);
  }, []);
  
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return <>{children}</>;
}
