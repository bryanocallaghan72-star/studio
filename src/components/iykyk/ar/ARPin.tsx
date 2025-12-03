
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ColorPinSVG } from '../ColorPinSVG';
import { ARPinData } from './ARPinLayer';

const typeColorMap: Record<string, string> = {
  'Sponsored Drop': '#a855f7', // purple-500
  'Daily Drop': '#f97316',     // orange-500
  'Fire': '#ef4444',             // red-500
  'Deals': '#22c55e',          // green-500
  'Quest': '#eab308',         // yellow-500
  'Reward': '#eab308',        // yellow-500
  'Default': '#3b82f6',         // blue-500
};

const getPinColor = (type: string): string => {
  if (type.toLowerCase().includes('sponsored')) return typeColorMap['Sponsored Drop'];
  if (type.toLowerCase().includes('daily')) return typeColorMap['Daily Drop'];
  if (type.toLowerCase().includes('fire')) return typeColorMap['Fire'];
  if (type.toLowerCase().includes('deal')) return typeColorMap['Deals'];
  if (type.toLowerCase().includes('quest')) return typeColorMap['Quest'];
  if (type.toLowerCase().includes('reward')) return typeColorMap['Reward'];
  return typeColorMap.Default;
};

type ARPinProps = {
  pin: ARPinData;
};

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
                 {pin.distanceMeters !== undefined && (
                    <p className="text-xs text-white/70 font-medium">
                        {pin.isUnlocked ? 'Unlocked ✨' : `${Math.round(pin.distanceMeters)}m away`}
                    </p>
                )}
            </div>
        </div>
      </Link>
    </motion.div>
  );
}
