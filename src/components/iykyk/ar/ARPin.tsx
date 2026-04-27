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

  // DEPTH CALCULATIONS
  const distance = pin.distanceMeters ?? 50;
  const scale = Math.max(0.45, 1 - distance / 220);
  const opacity = Math.max(0.55, 1 - distance / 380);
  const blur = Math.min(3, distance / 60);
  const zIndex = Math.floor(1000 - distance);

  return (
    <div
      key={pin.id}
      className="absolute"
      style={{ ...pin.style, zIndex }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ 
          opacity, 
          y: 0, 
          scale 
        }}
        exit={{ opacity: 0, y: -20, scale: 0.8 }}
        transition={{ type: 'spring', stiffness: 100, damping: 10 }}
        style={{ filter: blur > 0 ? `blur(${blur}px)` : 'none' }}
      >
        <Link href={`/venue/${pin.slug}`}>
          <div className="group relative cursor-pointer flex flex-col items-center">
              {/* Dynamic Glow - Intensity tied to scale (proximity) */}
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 pointer-events-none"
              >
                  <div
                    style={{ 
                      backgroundColor: pinColor,
                      opacity: scale * 0.4
                    }}
                    className="absolute inset-0 rounded-full blur-xl animate-pulse"
                  />
              </div>

              <ColorPinSVG color={pinColor} className="w-16 h-16 drop-shadow-2xl" />

              <div
                  className={cn(
                  'mt-2 rounded-full border-2 border-white/30 bg-glass-dark px-4 py-1.5 text-center shadow-lg backdrop-blur-md transition-all group-hover:scale-110 group-hover:border-white/50'
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
