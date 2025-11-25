
'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock } from 'lucide-react'; // Ensure you have lucide-react

export function HarrysRedemptionTicket() {
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds

  // Simple countdown timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full max-w-md mx-auto p-1">
      {/* THE TICKET CONTAINER */}
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl border border-stone-200">
        
        {/* HOLOGRAPHIC HEADER (The "Live" Element) */}
        {/* We use a moving gradient to prove it's not a screenshot */}
        <div className="bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-700 bg-[length:200%_200%] animate-[gradient-xy] p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          <h2 className="text-white text-xs font-bold tracking-[0.3em] uppercase mb-1">
            Official Winner
          </h2>
          <h1 className="text-3xl font-black text-white tracking-tighter">
            HARRY'S BONDI
          </h1>
          <div className="mt-2 inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-medium">
            <CheckCircle2 className="w-3 h-3" /> Verified Spotter
          </div>
        </div>

        {/* TICKET BODY */}
        <div className="p-6 flex flex-col items-center text-center bg-[#FFFBEB]"> 
           {/* Using your 'Day' palette background */}
          
          <div className="space-y-1 mb-6">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">REWARD</p>
            <p className="text-4xl font-bold text-teal-900">$4 MATCHA</p>
            <p className="text-sm text-teal-800/60 font-medium">+ Priority Seating</p>
          </div>

          {/* THE LIVE CODE */}
          <div className="w-full bg-white border-2 border-dashed border-stone-300 rounded-xl p-4 mb-4 relative">
             <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#FFFBEB] rounded-full" />
             <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#FFFBEB] rounded-full" />
             
             <p className="text-xs text-stone-400 mb-1">SHOW TO STAFF</p>
             <p className="text-3xl font-mono font-bold text-stone-800 tracking-widest">
               HARRY-882
             </p>
          </div>

          {/* TIMER */}
          <div className="flex items-center gap-2 text-red-500 font-mono text-sm font-bold animate-pulse">
            <Clock className="w-4 h-4" />
            Expires in: {formatTime(timeLeft)}
          </div>

          <p className="text-[10px] text-stone-400 mt-6 max-w-xs leading-relaxed">
            Valid only at Harry's Bondi. One redemption per user per day. 
            Do not close this screen until redeemed.
          </p>
        </div>

        {/* TEAR STRIP EFFECT AT BOTTOM */}
        <div className="h-2 bg-teal-900 w-full" />
      </div>
    </div>
  );
}
