'use client';

import { useState, useEffect } from 'react';

const useTimeOfDayTheme = () => {
  const [theme, setTheme] = useState('dusk');

  useEffect(() => {
    const getTheme = () => {
      const currentHour = new Date().getHours();
      if (currentHour >= 5 && currentHour < 9) return 'dawn'; 
      if (currentHour >= 9 && currentHour < 17) return 'day';
      if (currentHour >= 17 && currentHour < 20) return 'goldenHour';
      return 'dusk';
    };

    const currentTheme = getTheme();
    setTheme(currentTheme);

    const themes = {
      dawn: {
        '--bg-primary': '#fef3c7',
        '--bg-secondary': '#e0f2fe',
        '--text-primary': '#4b5563',
        '--text-secondary': '#6b7280',
        '--accent-primary': '#fb923c',
        '--accent-secondary': '#67e8f9',
        '--border-color': '#d1d5db',
        '--gradient': 'linear-gradient(to bottom right, var(--bg-primary), var(--bg-secondary))',
      },
      day: {
        '--bg-primary': '#ffffff',
        '--bg-secondary': '#f0f9ff',
        '--text-primary': '#1f2937',
        '--text-secondary': '#4b5563',
        '--accent-primary': '#38bdf8',
        '--accent-secondary': '#fbbf24',
        '--border-color': '#e5e7eb',
        '--gradient': 'linear-gradient(to bottom, var(--bg-secondary), var(--bg-primary))',
      },
      goldenHour: {
        '--bg-primary': '#fff7ed',
        '--bg-secondary': '#fff1f2',
        '--text-primary': '#44403c',
        '--text-secondary': '#57534e',
        '--accent-primary': '#f59e0b',
        '--accent-secondary': '#f472b6',
        '--border-color': '#f3e8ff',
        '--gradient': 'linear-gradient(to bottom right, #fde68a, #fbcfe8)',
      },
      dusk: {
        '--bg-primary': '#0f172a',
        '--bg-secondary': '#1e293b',
        '--text-primary': '#f8fafc',
        '--text-secondary': '#94a3b8',
        '--accent-primary': '#fbbf24',
        '--accent-secondary': '#22d3ee',
        '--border-color': '#334155',
        '--gradient': 'linear-gradient(to bottom, var(--bg-secondary), var(--bg-primary))',
      }
    };

    const root = document.documentElement;
    const selectedTheme = themes[currentTheme];
    for (const [key, value] of Object.entries(selectedTheme)) {
      root.style.setProperty(key, value);
    }
  }, []);

  return theme;
};

export { useTimeOfDayTheme };
