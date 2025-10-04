"use client";

import { useEffect, useState } from 'react';

// Day is from 9 AM to 8 PM (20:00)
const isDayTime = () => {
  const hours = new Date().getHours();
  return hours >= 9 && hours < 20;
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

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
