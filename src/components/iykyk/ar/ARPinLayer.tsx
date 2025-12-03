
'use client';

import { useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { appData } from '@/lib/data';
import type { LayerType } from '@/app/ar/page';
import { ARPin } from './ARPin';

// A raw pin from the appData source
type RawPin = (typeof appData.map.pins)[0];

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

/**
 * 2. Centralized enrichment function to create a consistent ARPinData object.
 * This is now the single source of truth for pin creation.
 * @param rawPin - The original pin data from appData.
 * @param index - The index in the list, used for styling.
 * @param layer - The active layer, used for generating a unique ID.
 * @returns A fully enriched ARPinData object.
 */
function enrichPin(rawPin: RawPin & { typeOverride?: string }, index: number, layer: LayerType): ARPinData {
  const horizontalJitter = (index % 4) * 5 - 10; // -10, -5, 0, 5

  // 4. Enforce unique pin IDs by prefixing with the layer.
  const uniqueId = `${layer}-${rawPin.id}`;
  
  let category: ARPinData['category'] = 'default';
  let type = rawPin.typeOverride || rawPin.type || 'Default';
  let isSponsored = false;

  // Normalize category and type
  if (type.toLowerCase().includes('fire')) {
    category = 'fire';
  } else if (type.toLowerCase().includes('deal')) {
    category = 'deal';
  } else if (type.toLowerCase().includes('drop')) {
    category = 'drop';
    // Check for drop-specific details
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
    style: {
      top: `${15 + (index % 3) * 25}%`,
      left: `${15 + (index % 2) * 50 + horizontalJitter}%`,
      animationDelay: `${index * 0.15}s`,
    },
  };
}


/**
 * 3. Refactored getPinsForLayer to use the enrichment function.
 * This function now only filters data and delegates the complex logic.
 * @param layer The active AR layer.
 * @returns An array of enriched ARPinData objects ready for rendering.
 */
function getPinsForLayer(layer: LayerType): ARPinData[] {
    let filteredPins: RawPin[] = [];

    switch (layer) {
        case 'fire':
            const fireVenues = new Set(appData.hotItems.map(item => item.venue));
            filteredPins = appData.map.pins
              .filter(pin => fireVenues.has(pin.name))
              .map(pin => ({...pin, typeOverride: 'Fire' }));
            break;
        case 'deals':
            const dealVenues = new Set(appData.deals.map(item => item.venue));
            filteredPins = appData.map.pins
              .filter(pin => dealVenues.has(pin.name))
              .map(pin => ({...pin, typeOverride: 'Deals' }));
            break;
        case 'drops':
             const dropVenues = new Set(appData.arDrops.map(item => item.venue));
             filteredPins = appData.map.pins
               .filter(pin => dropVenues.has(pin.name))
               .map(pin => ({...pin, typeOverride: 'Drop'})); // Type is further refined in enrichPin
             break;
        case 'all':
        default:
            // For 'all', just use a slice of the main pins list for variety.
            // The enrichment function will handle assigning the correct default types.
            filteredPins = appData.map.pins;
            break;
    }

    return filteredPins
      .slice(0, MAX_PINS_DISPLAYED)
      .map((pin, index) => enrichPin(pin, index, layer));
}

export function ARPinLayer({ activeLayer }: { activeLayer: LayerType }) {
    const arPins = useMemo(() => getPinsForLayer(activeLayer), [activeLayer]);

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
