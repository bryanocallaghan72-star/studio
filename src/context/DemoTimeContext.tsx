'use client';
import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo } from 'react';
import { useUser } from '@/firebase';

type TimePhase = 'dawn' | 'day' | 'golden' | 'night';
const TIME_PHASES: TimePhase[] = ['dawn', 'day', 'golden', 'night'];

const PHASE_HOURS: Record<TimePhase, number> = {
  dawn: 7,
  day: 13,
  golden: 18,
  night: 22
};

interface DemoTimeContextType {
    currentPhase: TimePhase;
    mockDate: Date;
    cycleTime: () => void;
}

const DemoTimeContext = createContext<DemoTimeContextType | undefined>(undefined);

/**
 * Maps the current hour to a Bondi phase index.
 */
const getPhaseIndexForHour = (hour: number) => {
  if (hour >= 5 && hour < 10) return 0; // DAWN: 5am - 10am
  if (hour >= 10 && hour < 17) return 1; // DAY: 10am - 5pm
  if (hour >= 17 && hour < 21) return 2; // GOLDEN: 5pm - 9pm
  return 3; // NIGHT: 9pm - 5am
};

export const DemoTimeProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const [now, setNow] = useState(new Date());
  const [manualIndex, setManualIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    // Real-time interval to update the app state every 60 seconds
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Admin check for God Mode access
  const isAdmin = useMemo(() => {
    if (!mounted) return false;
    const isStaff = user?.email?.endsWith('@iykyk.com');
    const isOverride = localStorage.getItem('iykyk_godmode') === 'true';
    return !!(isStaff || isOverride);
  }, [user, mounted]);

  const computedIndex = getPhaseIndexForHour(now.getHours());
  const effectiveIndex = manualIndex !== null ? manualIndex : computedIndex;
  const currentPhase = TIME_PHASES[effectiveIndex];

  /**
   * Derive the mockDate used by discovery features.
   * In manual mode, we use a snapshot hour.
   * In real-time mode, we use the actual current date/time.
   */
  const mockDate = useMemo(() => {
    if (manualIndex !== null) {
      const d = new Date(now);
      d.setHours(PHASE_HOURS[currentPhase], 0, 0, 0);
      return d;
    }
    return now;
  }, [manualIndex, currentPhase, now]);

  useEffect(() => {
    if (mounted) {
      // Apply theme to HTML root for global CSS variable shifts
      document.documentElement.setAttribute('data-theme', currentPhase);
    }
  }, [currentPhase, mounted]);

  const cycleTime = () => {
    if (!isAdmin) return;
    setManualIndex((prev) => {
      const currentIdx = prev !== null ? prev : computedIndex;
      return (currentIdx + 1) % 4;
    });
  };

  // Prevent hydration mismatches
  if (!mounted) return null;

  return (
    <DemoTimeContext.Provider value={{ currentPhase, mockDate, cycleTime }}>
      <div
        data-theme={currentPhase}
        className="app-theme-wrapper"
        style={{ background: 'transparent', backgroundColor: 'transparent' }}
      >
        {children}
      </div>
    </DemoTimeContext.Provider>
  );
};

export const useDemoTime = () => {
    const context = useContext(DemoTimeContext);
    if (context === undefined) {
        throw new Error('useDemoTime must be used within a DemoTimeProvider');
    }
    return context;
};
