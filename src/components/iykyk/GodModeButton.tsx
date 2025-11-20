
'use client';
import React from 'react';
import { useDemoTime } from '@/context/DemoTimeContext';

const GodModeButton = () => {
  const { cycleTime, currentPhase } = useDemoTime();
  
  const phaseLabels: Record<string, string> = {
    dawn:   '🌅 DAWN',
    day:    '☀️ DAY',
    golden: '🥂 GOLDEN',
    dusk:   '🌙 DUSK'
  };

  return (
    <div style={{ position: 'fixed', bottom: '80px', right: '20px', zIndex: 10000 }}>
      <button
        onClick={cycleTime}
        style={{
          background: 'rgba(0,0,0,0.8)',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '30px',
          padding: '10px 20px',
          fontWeight: 'bold',
          cursor: 'pointer',
          fontFamily: 'monospace',
          backdropFilter: 'blur(4px)'
        }}
      >
        {phaseLabels[currentPhase]}
      </button>
    </div>
  );
};
export default GodModeButton;
