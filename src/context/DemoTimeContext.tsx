'use client';
import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo } from 'react';

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

export const DemoTimeProvider = ({ children }: { children: ReactNode }) => {
  const [phaseIndex, setPhaseIndex] = useState(1); // Default to 'day' for initial SSR
  const [mounted, setMounted] = useState(false);
  
  const currentPhase = TIME_PHASES[phaseIndex];

  // Derive the mockDate from the currentPhase to serve as the app's clock
  const mockDate = useMemo(() => {
    const d = new Date();
    d.setHours(PHASE_HOURS[currentPhase], 0, 0, 0);
    return d;
  }, [currentPhase]);

  useEffect(() => {
    // On mount, determine the correct phase based on the real clock
    const hour = new Date().getHours();
    let initialIndex = 3; // Default: NIGHT (9pm - 5am)
    
    if (hour >= 5 && hour < 10) {
      initialIndex = 0; // DAWN (5am - 10am)
    } else if (hour >= 10 && hour < 17) {
      initialIndex = 1; // DAY (10am - 5pm)
    } else if (hour >= 17 && hour < 21) {
      initialIndex = 2; // GOLDEN (5pm - 9pm)
    }

    setPhaseIndex(initialIndex);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      // Apply data-theme to the root element so global CSS variables and 
      // body backgrounds work correctly across the entire app.
      document.documentElement.setAttribute('data-theme', currentPhase);
    }
  }, [currentPhase, mounted]);

  const cycleTime = () => {
    setPhaseIndex((prev) => (prev + 1) % TIME_PHASES.length);
  };

  // Hydration fix: don't render children until we're on the client
  // and the theme attribute has been applied.
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
