'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type ARPinData = {
  id: string;
  name: string;
  type: string;
  slug: string;
  style: React.CSSProperties;
};

type ARPinProps = {
  pin: ARPinData;
};

export function ARPin({ pin }: ARPinProps) {
  return (
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
          <div
            className={cn(
              'animate-pulse absolute -inset-2.5 rounded-full blur-lg',
              pin.type === 'Sponsored Drop' ? 'bg-purple-500/40' : 'bg-primary/30'
            )}
          ></div>
          <div
            className={cn(
              'relative rounded-full border-2 border-white/50 bg-black/60 px-4 py-2 text-center shadow-lg backdrop-blur-md transition-all group-hover:scale-110',
              pin.type === 'Sponsored Drop' ? 'group-hover:bg-purple-500' : 'group-hover:bg-primary'
            )}
          >
            <p className="font-bold text-white">{pin.name}</p>
            <Badge
              variant={pin.type === 'Sponsored Drop' ? 'default' : 'secondary'}
              className={cn('mt-1', pin.type === 'Sponsored Drop' && 'bg-purple-500 border-purple-400')}
            >
              {pin.type}
            </Badge>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
