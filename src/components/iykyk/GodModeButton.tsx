'use client';
import React, { useState, useEffect } from 'react';
import { useDemoTime } from '@/context/DemoTimeContext';
import { useUser } from '@/firebase';

/**
 * Floating action button for cycling time phases manually.
 * RESTRICTED: Only visible to @iykyk.com users or via local storage override.
 */
const GodModeButton = () => {
  const { cycleTime, currentPhase } = useDemoTime();
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    // Perform admin check on mount and user change
    const isAd = user?.email?.endsWith('@iykyk.com') || (typeof window !== 'undefined' && localStorage.getItem('iykyk_godmode') === 'true');
    setIsAdmin(!!isAd);
  }, [user]);

  if (!isAdmin) return null;
  
  const phaseLabels: Record<string, string> = {
    dawn:   '🌅 DAWN',
    day:    '☀️ DAY',
    golden: '🥂 GOLDEN',
    night:  '🌙 NIGHT'
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
