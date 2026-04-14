'use client';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type TimePhase = 'dawn' | 'day' | 'golden' | 'dusk';
const TIME_PHASES: TimePhase[] = ['dawn', 'day', 'golden', 'dusk'];

interface DemoTimeContextType {
    currentPhase: TimePhase;
    cycleTime: () => void;
}

const DemoTimeContext = createContext<DemoTimeContextType | undefined>(undefined);

export const DemoTimeProvider = ({ children }: { children: ReactNode }) => {
  const [phaseIndex, setPhaseIndex] = useState(1); // Default to 'day'
  const currentPhase = TIME_PHASES[phaseIndex];

  useEffect(() => {
    // Apply data-theme to the root element so global CSS variables and 
    // body backgrounds work correctly across the entire app.
    document.documentElement.setAttribute('data-theme', currentPhase);
  }, [currentPhase]);

  const cycleTime = () => {
    setPhaseIndex((prev) => (prev + 1) % TIME_PHASES.length);
  };

  return (
    <DemoTimeContext.Provider value={{ currentPhase, cycleTime }}>
      <div data-theme={currentPhase} className="app-theme-wrapper">
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
