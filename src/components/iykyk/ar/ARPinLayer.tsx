'use client';

import { useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { appData } from '@/lib/data';
import type { LayerType } from '@/app/ar/page';
import { ARPin, type ARPinData } from './ARPin';

const MAX_PINS_DISPLAYED = 6;

function getPinsForLayer(layer: LayerType, data: typeof appData): ARPinData[] {
    let filteredVenues = [];

    switch (layer) {
        case 'fire':
            const fireVenues = new Set(data.hotItems.map(item => item.venue));
            filteredVenues = data.map.pins.filter(pin => fireVenues.has(pin.name));
            break;
        case 'deals':
            const dealVenues = new Set(data.deals.map(item => item.venue));
            filteredVenues = data.map.pins.filter(pin => dealVenues.has(pin.name));
            break;
        case 'drops':
             const dropVenues = new Set(data.arDrops.map(item => item.venue));
             const pins = data.map.pins.filter(pin => dropVenues.has(pin.name));
             return pins.map(pin => {
                const detail = data.arDrops.find(d => d.venue === pin.name);
                return {
                  ...pin,
                  name: detail?.title || pin.name,
                  type: detail?.isSponsored ? 'Sponsored Drop' : 'Daily Drop',
                }
             }).slice(0, MAX_PINS_DISPLAYED).map((pin, index) => {
                const horizontalJitter = (index % 4) * 5 - 10; // -10, -5, 0, 5
                return {
                    id: pin.id,
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
        case 'all':
        default:
            filteredVenues = data.map.pins;
            break;
    }

    return filteredVenues.slice(0, MAX_PINS_DISPLAYED).map((pin, index) => {
      const horizontalJitter = (index % 4) * 5 - 10; // -10, -5, 0, 5
      return {
        id: pin.id,
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
