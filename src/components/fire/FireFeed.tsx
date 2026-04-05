'use client';

import React from 'react';
import { FireCard, type FireDrop } from './FireCard';
import { motion } from 'framer-motion';

const MOCK_FIRE_DROPS: FireDrop[] = [
  {
    id: '1',
    venue: 'Icebergs Dining Room',
    offer: 'First round of drinks on us with any main',
    claimed: 34,
    total: 50,
    endsInMinutes: 45,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
  },
  {
    id: '2',
    venue: 'Toko Bondi',
    offer: '15% off the full omakase menu tonight',
    claimed: 18,
    total: 40,
    endsInMinutes: 90,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80',
  },
  {
    id: '3',
    venue: 'Fluidform Pilates',
    offer: 'Last spot: 25% off the 5pm Reformer class',
    claimed: 11,
    total: 12,
    endsInMinutes: 28,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
    isAlmostGone: true,
  },
  {
    id: '4',
    venue: 'North Bondi Fish',
    offer: 'Free glass of rosé with any seafood platter',
    claimed: 27,
    total: 60,
    endsInMinutes: 120,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
  },
];

export function FireFeed() {
  return (
    <div className="mx-auto w-full max-w-lg space-y-8">
      <div className="flex flex-col gap-1 px-1">
        <h1 className="text-4xl font-black tracking-tighter text-[#1a1208]">FIRE</h1>
        <p className="text-[13px] font-medium text-[#1a1208]/40 uppercase tracking-widest">
          Real-time drops • Bondi
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        {MOCK_FIRE_DROPS.map((drop, index) => (
          <motion.div
            key={drop.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <FireCard drop={drop} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
