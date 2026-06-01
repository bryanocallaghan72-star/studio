'use client';

import { useState, useEffect, useMemo } from 'react';
import { useVenues } from './useVenues';
import { rankVenues, type ScoredVenue, type ScoringContext } from '@/lib/scoring';

type UseContextualVenuesOptions = {
  mood?: string | null;
  distanceMap?: Record<string, number>; // venueSlug/id -> distanceMeters
  limit?: number; // default 10
};

/**
 * Hook to fetch venues and rank them contextually based on the current 
 * phase of day, weather at Bondi, and user mood.
 */
export function useContextualVenues(options: UseContextualVenuesOptions = {}) {
  const { mood = null, distanceMap = {}, limit = 10 } = options;
  const { venues: rawVenues, isLoading: isVenuesLoading } = useVenues();
  
  const [weather, setWeather] = useState<ScoringContext['weather']>('sunny');
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);

  // 1. Derive Phase from current hour
  const phase = useMemo((): ScoringContext['phase'] => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour <= 11) return 'morning';
    if (hour >= 12 && hour <= 16) return 'afternoon';
    if (hour >= 17 && hour <= 20) return 'evening';
    return 'night';
  }, []);

  // 2. Fetch current weather for Bondi Beach
  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=-33.8908&longitude=151.2743&current=weather_code,wind_speed_10m&timezone=Australia%2FSydney'
        );
        if (!res.ok) throw new Error('Weather API failure');
        
        const data = await res.json();
        const code = data.current?.weather_code ?? 0;
        const wind = data.current?.wind_speed_10m ?? 0;

        let derived: ScoringContext['weather'] = 'sunny';
        
        // Mapping WMO codes to our ScoringContext types
        if (code <= 1) {
          derived = 'sunny';
        } else if (code >= 2 && code <= 3) {
          derived = 'cloudy';
        } else if (
          (code >= 51 && code <= 67) || 
          (code >= 71 && code <= 77) || 
          (code >= 80 && code <= 99)
        ) {
          derived = 'rainy';
        }

        // Wind override
        if (wind > 30) {
          derived = 'windy';
        }

        setWeather(derived);
      } catch (err) {
        console.warn('Weather fetch failed, defaulting to sunny:', err);
        setWeather('sunny');
      } finally {
        setIsWeatherLoading(false);
      }
    }
    fetchWeather();
  }, []);

  // 3. Score and Rank Venues
  const rankedVenues = useMemo(() => {
    if (!rawVenues) return [];

    const context: ScoringContext = {
      phase,
      weather,
      mood,
    };

    const scoredVenues: ScoredVenue[] = rawVenues.map((v) => {
      // Handle legacy and new schema vibe tags
      const tags = v.vibeTags || v.details?.vibeTags || [];
      
      return {
        id: v.id,
        slug: v.slug,
        name: v.name ?? v.slug,
        score: 0,
        vibeTags: tags,
        seating: (v as any).seating,
        cuisine: (v as any).cuisine,
        distanceMeters: distanceMap[v.slug] ?? distanceMap[v.id] ?? 0,
      };
    });

    return rankVenues(scoredVenues, context).slice(0, limit);
  }, [rawVenues, phase, weather, mood, distanceMap, limit]);

  return {
    venues: rankedVenues,
    isLoading: isVenuesLoading || isWeatherLoading,
    phase,
    weather,
  };
}
