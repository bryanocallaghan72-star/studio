'use client';

import { useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { appData } from '@/lib/data';
import type { LayerType } from '@/app/ar/page';
import { ARPin } from './ARPin';
import { useARVenues, type ARVenue } from '@/hooks/useARVenues';
import { useUserLocation } from '@/hooks/useUserLocation';


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

// Haversine formula to calculate distance between two points on Earth.
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI/180; // φ, λ in radians
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  const d = R * c; // in metres
  return d;
}

/**
 * 2. Centralized enrichment function to create a consistent ARPinData object.
 * This is now the single source of truth for pin creation.
 */
function enrichPin(
    rawPin: ARVenue & { typeOverride?: string; distanceMeters?: number }, 
    position: { top: string, left: string }, 
    index: number,
    layer: LayerType
): ARPinData {
  const horizontalJitter = Math.floor(Math.random() * 11) - 5; // -5 to +5
  const verticalJitter = Math.floor(Math.random() * 11) - 5;

  const uniqueId = `${layer}-${rawPin.id}`;
  
  let category: ARPinData['category'] = 'default';
  let type = rawPin.typeOverride || rawPin.category || 'Default';
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
function getPinsForLayer(layer: LayerType, venuePins: ARVenue[], userCoords: { latitude: number, longitude: number } | null): ARPinData[] {
    let filteredPins: (ARVenue & {typeOverride?: string})[] = [];

    switch (layer) {
        case 'fire':
            const fireVenues = new Set(appData.hotItems.map(item => item.venue));
            filteredPins = venuePins
              .filter(pin => fireVenues.has(pin.name))
              .map(pin => ({...pin, typeOverride: 'Fire' }));
            break;
        case 'deals':
            const dealVenues = new Set(appData.deals.map(item => item.venue));
            filteredPins = venuePins
              .filter(pin => dealVenues.has(pin.name))
              .map(pin => ({...pin, typeOverride: 'Deals' }));
            break;
        case 'drops':
             const dropVenues = new Set(appData.arDrops.map(item => item.venue));
             filteredPins = venuePins
               .filter(pin => dropVenues.has(pin.name))
               .map(pin => ({...pin, typeOverride: 'Drop'})); // Type is further refined in enrichPin
             break;
        case 'quests':
            if (appData.quests) {
                const questVenues = new Set(appData.quests.map(item => item.venue));
                filteredPins = venuePins
                  .filter(pin => questVenues.has(pin.name))
                  .map(pin => ({ ...pin, typeOverride: 'Quest' }));
            }
            break;
        case 'rewards':
            if (appData.rewards) {
                const rewardVenues = new Set(appData.rewards.map(item => item.venue));
                filteredPins = venuePins
                    .filter(pin => rewardVenues.has(pin.name))
                    .map(pin => ({ ...pin, typeOverride: 'Reward' }));
            }
            break;
        case 'all':
        default:
            const findPin = (venueName: string) => venuePins.find(p => p.name === venueName);
            const firePins = appData.hotItems.map(item => findPin(item.venue) ? { ...findPin(item.venue)!, typeOverride: 'Fire' } : null);
            const dealPins = appData.deals.map(item => findPin(item.venue) ? { ...findPin(item.venue)!, typeOverride: 'Deals' } : null);
            const dropPins = appData.arDrops.map(item => findPin(item.venue) ? { ...findPin(item.venue)!, typeOverride: 'Drop' } : null);

            // Combine and remove duplicates, keeping the more "important" type
            const allPinsMap = new Map<string, ARVenue & { typeOverride?: string }>();
            [...firePins, ...dealPins, ...dropPins].forEach(pin => {
                if (pin) allPinsMap.set(pin.slug, pin);
            });
            filteredPins = Array.from(allPinsMap.values());
            break;
    }

    // New logic with pre-computation and safe sorting
    if (userCoords) {
        const pinsWithDistance = filteredPins.map(pin => {
            let distanceMeters;
            // ✅ Safe numeric check
            if (typeof pin.latitude === "number" && typeof pin.longitude === "number") {
                distanceMeters = getDistance(userCoords.latitude, userCoords.longitude, pin.latitude, pin.longitude);
            }
            return { ...pin, distanceMeters };
        });

        // ✅ Sort using the pre-computed distance
        pinsWithDistance.sort((a, b) => {
            if (a.distanceMeters === undefined) return 1;
            if (b.distanceMeters === undefined) return -1;
            return a.distanceMeters - b.distanceMeters;
        });
        
        // Return the enriched data, sliced AFTER sorting
        return pinsWithDistance
            .slice(0, MAX_PINS_DISPLAYED)
            .map((pin, index) => {
                // ✅ Deterministic position assignment
                const position = PREDEFINED_POSITIONS[index % PREDEFINED_POSITIONS.length];
                return enrichPin(pin, position, index, layer);
            });
    }

    // Fallback for when no user coordinates are available
    return filteredPins
      .slice(0, MAX_PINS_DISPLAYED)
      .map((pin, index) => {
          const position = PREDEFINED_POSITIONS[index % PREDEFINED_POSITIONS.length];
          return enrichPin(pin, position, index, layer);
      });
}

export function ARPinLayer({ activeLayer }: { activeLayer: LayerType }) {
    const { venues, isLoading, error } = useARVenues();
    const { coords: userCoords } = useUserLocation();

    const arPins = useMemo(() => {
        if (!venues || isLoading) {
            return [];
        }
        return getPinsForLayer(activeLayer, venues, userCoords);
    }, [activeLayer, venues, isLoading, userCoords]);

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
