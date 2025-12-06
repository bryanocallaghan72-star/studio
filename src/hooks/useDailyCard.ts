
'use client';

import { useState, useEffect } from 'react';
import { useLocalStorage } from 'react-use';
import { alignmentCards, AlignmentCardData } from '@/lib/alignment-cards';

// Defines the shape of the data stored in localStorage
interface StoredCardState {
  date: string; // Stored as 'YYYY-MM-DD'
  cardId: string;
}

const STORAGE_KEY = 'iykyk-alignment-card';

/**
 * A custom hook to manage the daily alignment card.
 * - On the first visit of a new day, it selects a random card.
 * - It persists this card's ID in localStorage for the entire day.
 * - On subsequent visits during the same day, it retrieves the stored card.
 *
 * @returns {AlignmentCardData | null} The alignment card for the current day, or null if not yet determined.
 */
export function useDailyCard(): AlignmentCardData | null {
  const [storedState, setStoredState] = useLocalStorage<StoredCardState>(STORAGE_KEY);
  const [dailyCard, setDailyCard] = useState<AlignmentCardData | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // This check ensures localStorage is only accessed on the client-side
    if (typeof window !== 'undefined') {
      const todayStr = new Date().toISOString().split('T')[0];

      // If we have a stored card and it's for today, use it.
      if (storedState?.date === todayStr) {
        const foundCard = alignmentCards.find(card => card.id === storedState.cardId);
        setDailyCard(foundCard || null);
      } else {
        // Otherwise, it's a new day or the first visit. Pick a new card.
        const randomIndex = Math.floor(Math.random() * alignmentCards.length);
        const newCard = alignmentCards[randomIndex];
        if (newCard) {
          setDailyCard(newCard);
          // Save the new card's state to localStorage for today.
          setStoredState({ date: todayStr, cardId: newCard.id });
        }
      }
      setIsInitialized(true);
    }
  }, [storedState, setStoredState]);

  // Return the card only after initialization to prevent hydration mismatch
  return isInitialized ? dailyCard : null;
}
