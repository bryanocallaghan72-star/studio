
'use client';

import { useState, useEffect } from 'react';

const useTimeOfDayTheme = () => {
  const [theme, setTheme] = useState('dusk');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after the component has mounted.
    setIsClient(true);
  }, []);

  useEffect(() => {
    // This effect runs only on the client, and only after isClient is true.
    if (!isClient) return;

    const getTheme = () => {
      const currentHour = new Date().getHours();
      if (currentHour >= 5 && currentHour < 9) return 'dawn';
      if (currentHour >= 9 && currentHour < 17) return 'day';
      if (currentHour >= 17 && currentHour < 20) return 'golden-hour';
      return 'dusk';
    };

    const currentTheme = getTheme();
    setTheme(currentTheme);

    const themes = {
      dawn: {
        '--background': '220 20% 98%', // Light blue-gray sky
        '--foreground': '220 25% 20%', // Dark slate
        '--card': '220 15% 100%', // White cards
        '--card-foreground': '220 25% 20%',
        '--popover': '220 15% 100%',
        '--popover-foreground': '220 25% 20%',
        '--primary': '30 95% 65%', // Soft orange sun
        '--primary-foreground': '220 25% 20%',
        '--secondary': '220 20% 95%', // Lighter blue-gray
        '--secondary-foreground': '220 25% 20%',
        '--muted': '220 15% 90%',
        '--muted-foreground': '220 10% 45%',
        '--accent': '30 90% 80%', // Lighter orange
        '--accent-foreground': '220 25% 20%',
        '--destructive': '0 84.2% 60.2%',
        '--destructive-foreground': '210 40% 98%',
        '--border': '220 15% 90%',
        '--input': '220 15% 90%',
        '--ring': '30 95% 65%',
      },
      day: {
        '--background': '40 45% 95%', // iykyk-sand
        '--foreground': '220 36% 10%', // iykyk-ink
        '--card': '38 40% 86%', // iykyk-sand-deep
        '--card-foreground': '220 36% 10%',
        '--popover': '38 40% 86%',
        '--popover-foreground': '220 36% 10%',
        '--primary': '45 100% 70%', // iykyk-gold
        '--primary-foreground': '220 36% 10%',
        '--secondary': '38 40% 86%',
        '--secondary-foreground': '220 36% 10%',
        '--muted': '38 40% 86%',
        '--muted-foreground': '220 9% 46%',
        '--accent': '44 100% 82%', // iykyk-gold-soft
        '--accent-foreground': '220 36% 10%',
        '--destructive': '0 84.2% 60.2%',
        '--destructive-foreground': '210 40% 98%',
        '--border': '42 20% 86%',
        '--input': '42 20% 86%',
        '--ring': '45 100% 70%',
      },
      'golden-hour': {
        '--background': '25 60% 96%', // Warm cream
        '--foreground': '25 30% 20%', // Deep brown
        '--card': '30 70% 90%', // Lighter cream
        '--card-foreground': '25 30% 20%',
        '--popover': '30 70% 90%',
        '--popover-foreground': '25 30% 20%',
        '--primary': '35 90% 60%', // Rich gold
        '--primary-foreground': '25 30% 10%',
        '--secondary': '30 70% 90%',
        '--secondary-foreground': '25 30% 20%',
        '--muted': '30 70% 90%',
        '--muted-foreground': '25 20% 45%',
        '--accent': '35 85% 80%', // Soft gold
        '--accent-foreground': '25 30% 20%',
        '--destructive': '0 84.2% 60.2%',
        '--destructive-foreground': '210 40% 98%',
        '--border': '30 50% 85%',
        '--input': '30 50% 85%',
        '--ring': '35 90% 60%',
      },
      dusk: {
        '--background': '222.2 84% 4.9%',
        '--foreground': '210 40% 98%',
        '--card': '222.2 84% 4.9%',
        '--card-foreground': '210 40% 98%',
        '--popover': '222.2 84% 4.9%',
        '--popover-foreground': '210 40% 98%',
        '--primary': '210 40% 98%',
        '--primary-foreground': '222.2 47.4% 11.2%',
        '--secondary': '217.2 32.6% 17.5%',
        '--secondary-foreground': '210 40% 98%',
        '--muted': '217.2 32.6% 17.5%',
        '--muted-foreground': '215 20.2% 65.1%',
        '--accent': '217.2 32.6% 17.5%',
        '--accent-foreground': '210 40% 98%',
        '--destructive': '0 62.8% 30.6%',
        '--destructive-foreground': '210 40% 98%',
        '--border': '217.2 32.6% 17.5%',
        '--input': '217.2 32.6% 17.5%',
        '--ring': '212.7 26.8% 83.9%',
      }
    };

    const root = document.documentElement;
    
    // Clear any existing theme classes
    root.classList.remove('theme-dawn', 'theme-day', 'theme-golden-hour', 'theme-dusk');

    // Add the new theme class
    root.classList.add(`theme-${currentTheme}`);
    
    const selectedTheme = themes[currentTheme as keyof typeof themes];
    for (const [key, value] of Object.entries(selectedTheme)) {
      root.style.setProperty(key, value);
    }
    
  }, [isClient]); // This effect depends on isClient, ensuring it runs after client mount.

  return theme;
};

export { useTimeOfDayTheme };
