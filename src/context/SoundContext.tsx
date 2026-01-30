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

export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const [isMuted, setIsMuted] = useLocalStorage('iykyk-sound-muted', true);
  const activeAmbienceRef = useRef<{ stop: () => void; theme: Theme } | null>(null);

  const [playClickSfx] = useSound(SOUNDS.click, { volume: 0.2, soundEnabled: !isMuted });
  const [playSuccessSfx] = useSound(SOUNDS.success, { volume: 0.3, soundEnabled: !isMuted });
  
  const [playDawn, { stop: stopDawn }] = useSound(SOUNDS.ambience.dawn, { volume: 0.4, loop: true, soundEnabled: !isMuted });
  const [playDay, { stop: stopDay }] = useSound(SOUNDS.ambience.day, { volume: 0.4, loop: true, soundEnabled: !isMuted });
  const [playGolden, { stop: stopGolden }] = useSound(SOUNDS.ambience.golden, { volume: 0.4, loop: true, soundEnabled: !isMuted });
  const [playDusk, { stop: stopDusk }] = useSound(SOUNDS.ambience.dusk, { volume: 0.4, loop: true, soundEnabled: !isMuted });

  const ambiencePlayers = {
      dawn: { play: playDawn, stop: stopDawn },
      day: { play: playDay, stop: stopDay },
      golden: { play: playGolden, stop: stopGolden },
      dusk: { play: playDusk, stop: stopDusk },
  };
  
  const stopAmbience = useCallback(() => {
    if (activeAmbienceRef.current) {
        activeAmbienceRef.current.stop();
        activeAmbienceRef.current = null;
    }
  }, []);

  const playAmbience = useCallback((theme: Theme) => {
    if (activeAmbienceRef.current?.theme === theme) {
      return; // Already playing
    }
    
    if (activeAmbienceRef.current) {
      stopAmbience();
    }
    
    const player = ambiencePlayers[theme];
    player.play();
    activeAmbienceRef.current = { stop: player.stop, theme };
  }, [ambiencePlayers, stopAmbience]);

  const toggleMute = useCallback(() => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (newMutedState) {
        stopAmbience();
    }
  }, [isMuted, setIsMuted, stopAmbience]);
  
  // When mute state changes globally, stop ambience if newly muted.
  useEffect(() => {
    if (isMuted) {
      stopAmbience();
    }
  }, [isMuted, stopAmbience]);


  const value = {
    isMuted: isMuted ?? true,
    toggleMute,
    playClick: playClickSfx as () => void,
    playSuccess: playSuccessSfx as () => void,
    playAmbience,
    stopAmbience
  };

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
};

export const useSoundContext = () => {
  return useContext(SoundContext);
};
