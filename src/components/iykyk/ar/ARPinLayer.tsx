
'use client';

import { useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { LayerType } from '@/app/ar/page';
import { ARPin } from './ARPin';
import { useARVenues, type ARVenue } from '@/hooks/useARVenues';
import { AR_DROPS, DEALS, HOT_ITEMS } from '@/data/seeds/drops';

// 1. Expanded ARPinData type for future features
export type ARPinData = {
  id: string; // Guaranteed unique ID
  name: string;
  type: string; // User-facing type, e.g., "Sponsored Drop"
  slug: string;
  style: React.CSSProperties;
  category: 'fire' | 'deal' | 'drop' | 'quest' | 'reward' | 'default';
  
  // Future-proofing fields
  lat?: number;
  lng?: number;
  distanceMeters?: number;
  isUnlocked?: boolean;
  expiresAt?: number;
  isSponsored?: boolean;
};

const MAX_PINS_DISPLAYED = 6;

// A set of predefined, balanced positions for the pins.
const PREDEFINED_POSITIONS = [
    { top: '15%', left: '20%' }, // Top-left
    { top: '20%', left: '65%' }, // Top-right
    { top: '45%', left: '15%' }, // Mid-left
    { top: '50%', left: '70%' }, // Mid-right
    { top: '70%', left: '25%' }, // Bottom-left
    { top: '65%', left: '60%' }, // Bottom-right
];

/**
 * 2. Centralized enrichment function to create a consistent ARPinData object.
 * This is now the single source of truth for pin creation.
 */
function enrichPin(
    rawPin: ARVenue, 
    position: { top: string, left: string }, 
    index: number,
    layer: LayerType
): ARPinData {
  const horizontalJitter = Math.floor(Math.random() * 11) - 5; // -5 to +5
  const verticalJitter = Math.floor(Math.random() * 11) - 5;

  const uniqueId = `${layer}-${rawPin.id}`;
  
  let category: ARPinData['category'] = 'default';
  let type = rawPin.category || 'Default';
  let isSponsored = false;

  // Normalize category and type
  if (type.toLowerCase().includes('fire')) {
    category = 'fire';
  } else if (type.toLowerCase().includes('deal')) {
    category = 'deal';
  } else if (type.toLowerCase().includes('drop')) {
    category = 'drop';
    const dropDetail = AR_DROPS.find(d => d.venue === rawPin.name);
    if (dropDetail) {
      type = dropDetail.isSponsored ? 'Sponsored Drop' : 'Daily Drop';
      isSponsored = dropDetail.isSponsored;
    }
  } else if (type.toLowerCase().includes('quest')) {
    category = 'quest';
  } else if (type.toLowerCase().includes('reward')) {
    category = 'reward';
  }
  
  return {
    id: uniqueId,
    name: rawPin.name,
    slug: rawPin.slug,
    type: type,
    category: category,
    isSponsored: isSponsored,
    lat: rawPin.latitude,
    lng: rawPin.longitude,
    distanceMeters: rawPin.distanceMeters,
    style: {
      top: `calc(${position.top} + ${verticalJitter}px)`,
      left: `calc(${position.left} + ${horizontalJitter}px)`,
      animationDelay: `${index * 0.15}s`,
    },
  };
}


/**
 * 3. Refactored getPinsForLayer to use the enrichment function.
 * This function now only filters data and delegates the complex logic.
 */
function getPinsForLayer(layer: LayerType, venuePins: ARVenue[]): ARPinData[] {
    let filteredPins: ARVenue[] = [];

    switch (layer) {
        case 'fire':
            const fireVenues = new Set(HOT_ITEMS.map(item => item.venue));
            filteredPins = venuePins.filter(pin => fireVenues.has(pin.name));
            break;
        case 'deals':
            const dealVenues = new Set(DEALS.map(item => item.venueSlug));
            filteredPins = venuePins.filter(pin => dealVenues.has(pin.slug));
            break;
        case 'drops':
             const dropVenues = new Set(AR_DROPS.map(item => item.venue));
             filteredPins = venuePins.filter(pin => dropVenues.has(pin.name));
             break;
        // The 'quests' and 'rewards' cases can be implemented here once their data exists
        case 'all':
        default:
            const allPinsMap = new Map<string, ARVenue>();
            
            const addPinToMap = (venueNameOrSlug: string, typeOverride: string) => {
              const venue = venuePins.find(p => p.name === venueNameOrSlug || p.slug === venueNameOrSlug);
              if (venue && !allPinsMap.has(venue.slug)) { // Prioritize what's added first
                allPinsMap.set(venue.slug, { ...venue, category: typeOverride });
              }
            };
            
            HOT_ITEMS.forEach(item => addPinToMap(item.venueId, 'Fire'));
            DEALS.forEach(item => addPinToMap(item.venueSlug, 'Deals'));
            AR_DROPS.forEach(item => addPinToMap(item.venueId, 'Drop'));

            filteredPins = Array.from(allPinsMap.values());
            break;
    }
    
    // Slice AFTER filtering, and then enrich the final list
    return filteredPins
        .slice(0, MAX_PINS_DISPLAYED)
        .map((pin, index) => {
            const position = PREDEFINED_POSITIONS[index % PREDEFINED_POSITIONS.length];
            return enrichPin(pin, position, index, layer);
        });
}

export function ARPinLayer({ activeLayer }: { activeLayer: LayerType }) {
    const { venues, isLoading, error } = useARVenues();

    const arPins = useMemo(() => {
        if (!venues || isLoading) {
            return [];
        }
        return getPinsForLayer(activeLayer, venues);
    }, [activeLayer, venues, isLoading]);

    if (error) {
        // You could render an error state here if needed
        console.error("AR Pin Layer Error:", error);
    }
    
    return (
        <div className="relative z-10 h-full w-full">
            <AnimatePresence>
                {arPins.map(pin => (
                    <ARPin key={pin.id} pin={pin} />
                ))}
            </AnimatePresence>
        </div>
    );
}
