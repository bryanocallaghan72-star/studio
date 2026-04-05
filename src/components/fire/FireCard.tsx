'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Flame, Ticket, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface FireDrop {
  id: string;
  venue: string;
  offer: string;
  claimed: number;
  total: number;
  endsInMinutes: number;
  image: string;
  isAlmostGone?: boolean;
}

const Countdown = ({ minutes }: { minutes: number }) => {
  const [timeLeft, setTimeLeft] = useState(minutes * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const h = Math.floor(timeLeft / 3600);
  const m = Math.floor((timeLeft % 3600) / 60);
  const s = timeLeft % 60;

  return (
    <span className="font-mono text-xl font-bold tracking-tighter">
      {h > 0 ? `${h}:` : ''}{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
    </span>
  );
};

export function FireCard({ drop, onClaim }: { drop: FireDrop; onClaim: () => void }) {
  return (
    <Card className="group relative overflow-hidden rounded-[24px] border-none bg-white shadow-xl shadow-black/5 transition-all active:scale-[0.98]">
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={drop.image}
          alt={drop.venue}
          fill
          unoptimized
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div 
          className="absolute inset-0 z-10" 
          style={{ 
            background: 'linear-gradient(to top, rgba(8,10,13,0.9) 0%, rgba(8,10,13,0.2) 50%, transparent 100%)' 
          }} 
        />
        
        <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-1">
          <Badge className="w-fit bg-[#c4762a] text-white border-none flex items-center gap-1 px-2.5 py-1 shadow-lg">
            <Flame size={12} fill="currentColor" />
            <span className="text-[10px] font-black uppercase tracking-widest">Hot Now</span>
          </Badge>
          <h3 className="text-xl font-bold text-white drop-shadow-md">{drop.venue}</h3>
        </div>
      </div>

      <CardContent className="p-5">
        <div className="space-y-5">
          <p className="text-lg font-bold text-[#1a1208] leading-tight line-clamp-2">
            {drop.offer}
          </p>

          <div className="flex items-center justify-between border-b border-black/[0.04] pb-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#1a1208]/60">
                <Users size={14} strokeWidth={2.5} />
                <span>{drop.claimed}/{drop.total} claimed</span>
              </div>
              {drop.isAlmostGone && (
                <div className="flex items-center gap-1 ml-1 bg-red-50 px-2 py-0.5 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-red-500 text-[11px] font-bold uppercase tracking-tight">Almost gone</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col justify-center rounded-2xl bg-[#c4762a] p-4 text-white shadow-lg shadow-[#c4762a]/20">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Ends in</span>
              <Countdown minutes={drop.endsInMinutes} />
            </div>
            <Button 
              className="h-auto rounded-2xl bg-[#c4762a] hover:bg-[#a66324] text-white font-black text-lg py-0 flex flex-col items-center justify-center gap-0 shadow-lg active:scale-95 transition-all"
              onClick={onClaim}
            >
              <Ticket size={18} className="mb-0.5" />
              <span className="uppercase tracking-tighter">Claim</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
