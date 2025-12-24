'use client';

import { useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { appData } from '@/lib/data';
import type { LayerType } from '@/app/ar/page';
import { ARPin } from './ARPin';
import { useARVenues, type ARVenue } from '@/hooks/useARVenues';

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
    const dropDetail = appData.arDrops.find(d => d.venue === rawPin.name);
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
            const fireVenues = new Set(appData.hotItems.map(item => item.venue));
            filteredPins = venuePins.filter(pin => fireVenues.has(pin.name));
            break;
        case 'deals':
            const dealVenues = new Set(appData.deals.map(item => item.venue));
            filteredPins = venuePins.filter(pin => dealVenues.has(pin.name));
            break;
        case 'drops':
             const dropVenues = new Set(appData.arDrops.map(item => item.venue));
             filteredPins = venuePins.filter(pin => dropVenues.has(pin.name));
             break;
        case 'quests':
            if (appData.quests) {
                const questVenues = new Set(appData.quests.map(item => item.venue));
                filteredPins = venuePins.filter(pin => questVenues.has(pin.name));
            }
            break;
        case 'rewards':
            if (appData.rewards) {
                const rewardVenues = new Set(appData.rewards.map(item => item.venue));
                filteredPins = venuePins.filter(pin => rewardVenues.has(pin.name));
            }
            break;
        case 'all':
        default:
            const allPinsMap = new Map<string, ARVenue>();
            
            const addPinToMap = (venueName: string, typeOverride: string) => {
              const venue = venuePins.find(p => p.name === venueName || p.slug === venueName);
              if (venue && !allPinsMap.has(venue.slug)) { // Prioritize what's added first
                allPinsMap.set(venue.slug, { ...venue, category: typeOverride });
              }
            };
            
            appData.hotItems.forEach(item => addPinToMap(item.venue, 'Fire'));
            appData.deals.forEach(item => addPinToMap(item.venue, 'Deals'));
            appData.arDrops.forEach(item => addPinToMap(item.venue, 'Drop'));

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
