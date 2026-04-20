
'use client';

import React, { useMemo } from 'react';
import { FireCard } from './FireCard';
import { motion } from 'framer-motion';
import { useHotItems } from '@/hooks/useHotItems';
import { useDemoTime } from '@/context/DemoTimeContext';
import { Loader2 } from 'lucide-react';

interface FireFeedProps {
  onClaim?: (venue: string, offer: string) => void;
}

export function FireFeed({ onClaim }: FireFeedProps) {
  const { hotItems, isLoading } = useHotItems();
  const { mockDate } = useDemoTime();

  const activeDrops = useMemo(() => {
    if (!hotItems) return [];
    return hotItems
      .filter(item => new Date(item.expiresAt).getTime() > mockDate.getTime())
      .sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime());
  }, [hotItems, mockDate]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#c4762a]" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg space-y-8">
      <div className="flex flex-col gap-1 px-1">
        <h1 className="text-4xl font-black tracking-tighter text-[#1a1208]">FIRE</h1>
        <p className="text-[13px] font-medium text-[#1a1208]/40 uppercase tracking-widest">
          Real-time drops • Bondi
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        {activeDrops.map((drop, index) => (
          <motion.div
            key={drop.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <FireCard 
              drop={{
                id: drop.id,
                venue: drop.venue,
                offer: drop.title,
                claimed: drop.claims,
                total: drop.claims + 5, // Simulated total
                expiresAt: drop.expiresAt,
                imageId: drop.imageId,
                isAlmostGone: drop.claims > 20
              }} 
              onClaim={() => onClaim?.(drop.venue, drop.title)} 
            />
          </motion.div>
        ))}
      </div>

      {activeDrops.length === 0 && (
        <div className="text-center py-24 px-6 border-2 border-dashed border-black/[0.05] rounded-3xl">
          <p className="text-sm font-bold text-[rgba(26,18,8,0.40)] uppercase tracking-widest">Quiet in this phase</p>
          <p className="text-xs text-[rgba(26,18,8,0.30)] mt-2">Switch vibes or check back later for more Fire drops.</p>
        </div>
      )}
    </div>
  );
}
