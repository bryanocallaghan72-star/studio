'use client';

import { useEffect } from 'react';
import { useDemoTime } from '@/context/DemoTimeContext';
import { useSoundContext } from '@/context/SoundContext';

export function AmbienceController() {
    const { currentPhase } = useDemoTime();
    const { playAmbience, stopAmbience, isMuted } = useSoundContext();

    useEffect(() => {
        if (!isMuted) {
            playAmbience(currentPhase);
        } else {
            stopAmbience();
        }
        
        return () => {
            stopAmbience();
        }
    }, [currentPhase, isMuted, playAmbience, stopAmbience]);

    return null; // This component renders nothing
}
