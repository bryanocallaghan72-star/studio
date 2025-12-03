
'use client';

import { useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { appData } from '@/lib/data';
import type { LayerType } from '@/app/ar/page';
import { ARPin } from './ARPin';

export type ARPinData = {
  id: string;
  name: string;
  type: string;
  slug: string;
  style: React.CSSProperties;
};


const MAX_PINS_DISPLAYED = 6;

function getPinsForLayer(layer: LayerType, data: typeof appData): ARPinData[] {
    let filteredVenues: any[] = [];

    switch (layer) {
        case 'fire':
            const fireVenues = new Set(data.hotItems.map(item => item.venue));
            filteredVenues = data.map.pins.filter(pin => fireVenues.has(pin.name)).map(pin => ({...pin, type: 'Fire'}));
            break;
        case 'deals':
            const dealVenues = new Set(data.deals.map(item => item.venue));
            filteredVenues = data.map.pins.filter(pin => dealVenues.has(pin.name)).map(pin => ({...pin, type: 'Deals'}));
            break;
        case 'drops':
             const dropVenues = new Set(data.arDrops.map(item => item.venue));
             const pins = data.map.pins.filter(pin => dropVenues.has(pin.name));
             return pins.map((pin, index) => {
                const detail = data.arDrops.find(d => d.venue === pin.name);
                const horizontalJitter = (index % 4) * 5 - 10;
                return {
                    id: `drop-${pin.id}`,
                    name: detail?.title || pin.name,
                    type: detail?.isSponsored ? 'Sponsored Drop' : 'Daily Drop',
                    slug: pin.slug,
                    style: {
                      top: `${15 + (index % 3) * 25}%`,
                      left: `${15 + (index % 2) * 50 + horizontalJitter}%`,
                      animationDelay: `${index * 0.15}s`,
                    },
                }
             }).slice(0, MAX_PINS_DISPLAYED);
        case 'all':
        default:
            // For 'all', let's show a mix of types for visual variety
            const firePin = data.map.pins.find(p => data.hotItems.some(item => item.venue === p.name));
            const dealPin = data.map.pins.find(p => data.deals.some(item => item.venue === p.name));
            const dropPin = data.map.pins.find(p => data.arDrops.some(item => item.venue === p.name));

            let mixedPins = [];
            if (firePin) mixedPins.push({...firePin, type: 'Fire', uniqueId: `fire-${firePin.id}`});
            if (dealPin) mixedPins.push({...dealPin, type: 'Deals', uniqueId: `deal-${dealPin.id}`});
            if (dropPin) {
                const detail = data.arDrops.find(d => d.venue === dropPin.name);
                mixedPins.push({...dropPin, name: detail?.title || dropPin.name, type: detail?.isSponsored ? 'Sponsored Drop' : 'Daily Drop', uniqueId: `drop-${dropPin.id}` });
            }
            
            // Fill the rest with default pins if needed
            const existingIds = new Set(mixedPins.map(p => p.id));
            const remainingPins = data.map.pins.filter(p => !existingIds.has(p.id));
            mixedPins.push(...remainingPins.slice(0, MAX_PINS_DISPLAYED - mixedPins.length).map(p => ({...p, type: p.type || 'Default', uniqueId: `default-${p.id}`})));

            filteredVenues = mixedPins;
            break;
    }

    return filteredVenues.slice(0, MAX_PINS_DISPLAYED).map((pin, index) => {
      const horizontalJitter = (index % 4) * 5 - 10; // -10, -5, 0, 5
      return {
        id: pin.uniqueId || `${pin.type.toLowerCase().replace(' ','-')}-${pin.id}`,
        name: pin.name,
        type: pin.type,
        slug: pin.slug,
        style: {
          top: `${15 + (index % 3) * 25}%`,
          left: `${15 + (index % 2) * 50 + horizontalJitter}%`,
          animationDelay: `${index * 0.15}s`,
        },
      }
    });
}

export function ARPinLayer({ activeLayer }: { activeLayer: LayerType }) {
    const arPins = useMemo(() => getPinsForLayer(activeLayer, appData), [activeLayer]);

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
