
'use client';

import { useEffect, useState } from 'react';
import { useLocalStorage } from 'react-use';

type MatchaStatus = {
  date: string; // YYYY-MM-DD
  used: boolean;
};

const STORAGE_KEY = 'matcha-bingo-status';

/**
 * Returns true once per day, only during the "matcha window" (e.g. 8–11am),
 * so the Matcha Bingo icon can glow or animate.
 */
export function useMatchaBingoHighlight(): boolean {
  const [isLive, setIsLive] = useState(false);
  const [status, setStatus] = useLocalStorage<MatchaStatus>(STORAGE_KEY);

  useEffect(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const hour = now.getHours();

    // Matcha window: adjust if needed, but keep simple hour logic.
    const inMatchaWindow = hour >= 8 && hour < 11;

    const dailyStatus: MatchaStatus =
      status?.date === todayStr ? status : { date: todayStr, used: false };

    if (inMatchaWindow && !dailyStatus.used) {
      setIsLive(true);
      setStatus({ date: todayStr, used: true });
    } else {
      setIsLive(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isLive;
}
