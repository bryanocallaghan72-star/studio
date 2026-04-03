'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useRef, useEffect } from 'react';
import useSound from 'use-sound';
import { useLocalStorage } from 'react-use';

export type Theme = 'dawn' | 'day' | 'golden' | 'dusk';

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playClick: () => void;
  playSuccess: () => void;
  playAmbience: (theme: Theme) => void;
  stopAmbience: () => void;
}

const placeholder = () => {};

const SoundContext = createContext<SoundContextType>({
  isMuted: true,
  toggleMute: placeholder,
  playClick: placeholder,
  playSuccess: placeholder,
  playAmbience: placeholder,
  stopAmbience: placeholder,
});

const SOUNDS = {
  click: '/sounds/click.wav',
  success: '/sounds/success.wav',
  ambience: {
    dawn: '/sounds/ambience-dawn.mp3',
    day: '/sounds/ambience-day.mp3',
    golden: '/sounds/ambience-golden.mp3',
    dusk: '/sounds/ambience-dusk.mp3',
  },
};

/**
 * SoundManager handles the actual useSound hooks to ensure they
 * only run on the client side, preventing SSR crashes.
 */
function SoundManager({ 
  children, 
  isMuted, 
  isClient, 
  setPlayers 
}: { 
  children: ReactNode; 
  isMuted: boolean; 
  isClient: boolean;
  setPlayers: (players: any) => void;
}) {
  const [playClickSfx] = useSound(SOUNDS.click, { volume: 0.2, soundEnabled: !isMuted && isClient });
  const [playSuccessSfx] = useSound(SOUNDS.success, { volume: 0.3, soundEnabled: !isMuted && isClient });
  
  const [playDawn, { stop: stopDawn }] = useSound(SOUNDS.ambience.dawn, { volume: 0.4, loop: true, soundEnabled: !isMuted && isClient });
  const [playDay, { stop: stopDay }] = useSound(SOUNDS.ambience.day, { volume: 0.4, loop: true, soundEnabled: !isMuted && isClient });
  const [playGolden, { stop: stopGolden }] = useSound(SOUNDS.ambience.golden, { volume: 0.4, loop: true, soundEnabled: !isMuted && isClient });
  const [playDusk, { stop: stopDusk }] = useSound(SOUNDS.ambience.dusk, { volume: 0.4, loop: true, soundEnabled: !isMuted && isClient });

  useEffect(() => {
    if (isClient) {
      setPlayers({
        click: playClickSfx,
        success: playSuccessSfx,
        ambience: {
          dawn: { play: playDawn, stop: stopDawn },
          day: { play: playDay, stop: stopDay },
          golden: { play: playGolden, stop: stopGolden },
          dusk: { play: playDusk, stop: stopDusk },
        }
      });
    }
  }, [isClient, isMuted, playClickSfx, playSuccessSfx, playDawn, stopDawn, playDay, stopDay, playGolden, stopGolden, playDusk, stopDusk, setPlayers]);

  return <>{children}</>;
}

export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const [isMuted, setIsMuted] = useLocalStorage('iykyk-sound-muted', true);
  const [isClient, setIsClient] = useState(false);
  const [players, setPlayers] = useState<any>(null);
  const activeAmbienceRef = useRef<{ stop: () => void; theme: Theme } | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const stopAmbience = useCallback(() => {
    if (activeAmbienceRef.current) {
        activeAmbienceRef.current.stop();
        activeAmbienceRef.current = null;
    }
  }, []);

  const playAmbience = useCallback((theme: Theme) => {
    if (!isClient || !players?.ambience) return;
    if (activeAmbienceRef.current?.theme === theme) {
      return;
    }
    
    stopAmbience();
    
    const player = players.ambience[theme];
    if (player) {
      player.play();
      activeAmbienceRef.current = { stop: player.stop, theme };
    }
  }, [players, stopAmbience, isClient]);

  const toggleMute = useCallback(() => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (newMutedState) {
        stopAmbience();
    }
  }, [isMuted, setIsMuted, stopAmbience]);
  
  useEffect(() => {
    if (isMuted) {
      stopAmbience();
    }
  }, [isMuted, stopAmbience]);

  const value = {
    isMuted: isMuted ?? true,
    toggleMute,
    playClick: () => players?.click?.(),
    playSuccess: () => players?.success?.(),
    playAmbience,
    stopAmbience
  };

  return (
    <SoundContext.Provider value={value}>
      <SoundManager isMuted={!!isMuted} isClient={isClient} setPlayers={setPlayers}>
        {children}
      </SoundManager>
    </SoundContext.Provider>
  );
};

export const useSoundContext = () => {
  return useContext(SoundContext);
};
