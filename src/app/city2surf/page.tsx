'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FireFeed } from '@/components/fire/FireFeed';
import { ClaimModal } from '@/components/claim/ClaimModal';

const LAUNCH_DATE = new Date('2026-08-09T06:00:00+10:00');

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  return { days, hours, mins, isLive: diff === 0 };
}

export default function City2SurfPage() {
  const [claimData, setClaimData] = useState<{ venue: string; offer: string } | null>(null);
  const { days, hours, mins, isLive } = useCountdown(LAUNCH_DATE);

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f2ece0] pb-32">
      <div className="px-4 pt-10 pb-6 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#c4762a]">
            iykyk x City2Surf
          </span>
          <h1 className="mt-3 text-4xl md:text-5xl font-black text-[#1a1208] leading-tight">
            You made it to Bondi.
          </h1>
          <p className="mt-3 text-base text-[#1a1208]/60 max-w-md mx-auto leading-relaxed">
            One day only. Sunday 9 August. The venues Bondi locals actually rate,
            with finisher-only offers. Gone by sunset.
          </p>

          {!isLive && (
            <div className="mt-6 inline-flex items-center gap-4 rounded-2xl border border-black/[0.08] bg-white px-6 py-3 shadow-sm">
              {[
                { v: days, l: 'days' },
                { v: hours, l: 'hrs' },
                { v: mins, l: 'min' },
              ].map(({ v, l }) => (
                <div key={l} className="flex flex-col items-center min-w-[44px]">
                  <span className="font-mono text-2xl font-black text-[#1a1208]">{String(v).padStart(2, '0')}</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#1a1208]/40">{l}</span>
                </div>
              ))}
            </div>
          )}

          {isLive && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#c4762a] px-5 py-2 text-white shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
              <span className="text-sm font-black uppercase tracking-wider">Live now - Today only</span>
            </div>
          )}
        </motion.div>
      </div>

      <div className="px-4 md:px-6">
        <FireFeed onClaim={(venue, offer) => setClaimData({ venue, offer })} />
      </div>

      <div className="mt-10 px-4 md:px-6">
        <Link
          href="/claim-venue"
          className="block rounded-[24px] border border-dashed border-[#c4762a]/40 bg-[#c4762a]/5 p-6 text-center transition-colors hover:bg-[#c4762a]/10"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#c4762a]">
            Bondi venue owners
          </span>
          <p className="mt-2 text-lg font-bold text-[#1a1208]">
            90,000 finishers are coming. Claim your venue - free.
          </p>
          <p className="mt-1 text-sm text-[#1a1208]/50">
            Submit your race-day offer before spots close
          </p>
        </Link>
      </div>

      <ClaimModal
        isOpen={!!claimData}
        onClose={() => setClaimData(null)}
        venueName={claimData?.venue || ''}
        offerText={claimData?.offer || ''}
        source="fire"
      />
    </div>
  );
}
