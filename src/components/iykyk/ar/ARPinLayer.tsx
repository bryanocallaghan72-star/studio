'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { appData } from '@/lib/data';
import { cn } from '@/lib/utils';
import type { LayerType } from '@/app/ar/page';

type ARPinLayerProps = {
    activeLayer: LayerType;
};

function getPinsForLayer(layer: LayerType, data: typeof appData) {
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
             }).slice(0, 6).map((pin, index) => ({
                id: pin.id,
                name: pin.name,
                type: pin.type,
                slug: pin.slug,
                style: {
                  top: `${15 + (index % 3) * 25}%`,
                  left: `${15 + (index % 2) * 50 + Math.random() * 10 - 5}%`,
                  animationDelay: `${index * 0.15}s`,
                },
             }));
        case 'all':
        default:
            filteredVenues = data.map.pins;
            break;
    }

    return filteredVenues.slice(0, 6).map((pin, index) => ({
      id: pin.id,
      name: pin.name,
      type: pin.type,
      slug: pin.slug,
      style: {
        top: `${15 + (index % 3) * 25}%`,
        left: `${15 + (index % 2) * 50 + Math.random() * 10 - 5}%`,
        animationDelay: `${index * 0.15}s`,
      },
    }));
}

export function ARPinLayer({ activeLayer }: ARPinLayerProps) {
    const arPins = useMemo(() => getPinsForLayer(activeLayer, appData), [activeLayer]);

    return (
        <div className="relative z-10 h-full w-full">
            <AnimatePresence>
                {arPins.map(pin => (
                    <motion.div
                        key={pin.id}
                        className="absolute"
                        style={pin.style}
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.8 }}
                        transition={{ type: 'spring', stiffness: 100 }}
                    >
                        <Link href={`/venue/${pin.slug || pin.name.toLowerCase().replace(/ /g, '-')}`}>
                            <div className="group relative cursor-pointer">
                                <div className={cn(
                                    "animate-pulse absolute -inset-2.5 rounded-full blur-lg",
                                    pin.type === 'Sponsored Drop' ? 'bg-purple-500/40' : 'bg-primary/30'
                                )}></div>
                                <div className={cn(
                                    "relative rounded-full border-2 border-white/50 bg-black/60 px-4 py-2 text-center shadow-lg backdrop-blur-md transition-all group-hover:scale-110",
                                    pin.type === 'Sponsored Drop' ? 'group-hover:bg-purple-500' : 'group-hover:bg-primary'
                                )}>
                                    <p className="font-bold text-white">{pin.name}</p>
                                    <Badge variant={pin.type === 'Sponsored Drop' ? 'default' : 'secondary'} className={cn(
                                        "mt-1",
                                        pin.type === 'Sponsored Drop' && 'bg-purple-500 border-purple-400'
                                    )}>{pin.type}</Badge>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
