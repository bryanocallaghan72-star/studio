
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ColorPinSVG } from '../ColorPinSVG'; // Corrected import path

export type ARPinData = {
  id: string;
  name: string;
  type: string;
  slug: string;
  style: React.CSSProperties;
};

const typeColorMap: Record<string, string> = {
    'Sponsored Drop': '#a855f7', // purple-500
    'Fire': '#f97316',           // orange-500
    'Deals': '#22c55e',          // green-500
    'Quests': '#eab308',         // yellow-500
    'Default': '#8b5cf6',
};

const getPinColor = (type: string) => {
    if (type.toLowerCase().includes('drop')) return typeColorMap['Sponsored Drop'];
    if (type.toLowerCase().includes('fire')) return typeColorMap['Fire'];
    if (type.toLowerCase().includes('deal')) return typeColorMap['Deals'];
    if (type.toLowerCase().includes('quest')) return typeColorMap['Quests'];
    return typeColorMap.Default;
}

export function ARPin({ pin }: ARPinProps) {
  const pinColor = getPinColor(pin.type);

  return (
    <motion.div
      key={pin.id}
      className="absolute"
      style={pin.style}
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 100, damping: 10 }}
    >
      <Link href={`/venue/${pin.slug}`}>
        <div className="group relative cursor-pointer flex flex-col items-center">
            
            <div 
              style={{'--pin-glow-color': pinColor} as React.CSSProperties}
              className={cn(
                'absolute -inset-2.5 rounded-full blur-xl animate-pulse',
                'bg-[var(--pin-glow-color)] opacity-40'
              )}
            ></div>
            
            <ColorPinSVG color={pinColor} className="w-16 h-16 drop-shadow-2xl" />

            <div
                className={cn(
                'mt-2 rounded-full border-2 border-white/30 bg-black/60 px-4 py-1.5 text-center shadow-lg backdrop-blur-md transition-all group-hover:scale-110 group-hover:border-white/50'
                )}
            >
                <p className="font-bold text-white text-sm whitespace-nowrap">{pin.name}</p>
            </div>
        </div>
      </Link>
    </motion.div>
  );
}
