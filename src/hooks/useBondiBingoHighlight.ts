
'use client';

import { useState, useEffect } from 'react';
import { useLocalStorage } from 'react-use';

type BingoSlot = 'day' | 'evening';
type BingoStatus = {
  date: string; // YYYY-MM-DD
  usedSlots: BingoSlot[];
};

// Define the time windows for the bingo slots
const BINGO_SLOTS: Record<BingoSlot, { start: number; end: number }> = {
  day: { start: 10, end: 15 },      // 10:00 AM to 3:00 PM (15:00)
  evening: { start: 16, end: 20 }, // 4:30 PM (16:30) to 8:00 PM (20:00)
};

/**
 * A client-side hook to determine if the Bondi Bingo icon should be highlighted.
 * It returns `true` if the current time is within a defined "Bingo Slot"
 * and that slot has not yet been "used" today, based on data in localStorage.
 *
 * @returns {boolean} - True if the bingo highlight should be active.
 */
export function useBondiBingoHighlight(): boolean {
  const [isLive, setIsLive] = useState(false);
  const [status, setStatus] = useLocalStorage<BingoStatus>('bondi-bingo-status');

  useEffect(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const currentHour = today.getHours();

    // Determine the current slot, if any
    let currentSlot: BingoSlot | null = null;
    if (currentHour >= BINGO_SLOTS.day.start && currentHour < BINGO_SLOTS.day.end) {
      currentSlot = 'day';
    } else if (currentHour >= BINGO_SLOTS.evening.start && currentHour < BINGO_SLOTS.evening.end) {
      currentSlot = 'evening';
    }

    // Reset if it's a new day
    const dailyStatus = (status?.date === todayStr) ? status : { date: todayStr, usedSlots: [] };

    if (currentSlot && !dailyStatus.usedSlots.includes(currentSlot)) {
      // We are in a live, unused slot
      setIsLive(true);
      
      // Mark this slot as used for today
      // We create a new object to ensure the hook dependency array detects the change
      setStatus({ 
        date: todayStr, 
        usedSlots: [...dailyStatus.usedSlots, currentSlot]
      });

    } else {
      // Not in a live slot or slot already used
      setIsLive(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  return isLive;
}
