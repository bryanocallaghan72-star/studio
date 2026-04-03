'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ColorPinSVG } from '../ColorPinSVG';
import { ARPinData } from './ARPinLayer';

const typeColorMap: Record<string, string> = {
  'Sponsored Drop': 'hsl(var(--color-cat-lens))',
  'Daily Drop': 'hsl(var(--color-cat-fire))',
  'Fire': 'hsl(var(--color-cat-fire))',
  'Deals': '#22c55e',
  'Quest': '#eab308',
  'Reward': '#eab308',
  'Default': 'hsl(var(--color-cat-fire))',
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
    <div
      key={pin.id}
      className="absolute"
      style={pin.style}
    >
      {/* CSS-only glow, isolated from Framer Motion transforms */}
      <div 
        className="absolute top-0 left-0 w-16 h-16 pointer-events-none"
      >
          <div
            style={{ backgroundColor: pinColor }}
            className="absolute -inset-1 rounded-full blur-xl animate-pulse opacity-40"
          ></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.8 }}
        transition={{ type: 'spring', stiffness: 100, damping: 10 }}
      >
        <Link href={`/venue/${pin.slug}`}>
          <div className="group relative cursor-pointer flex flex-col items-center">
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
    </div>
  );
}
