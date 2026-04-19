'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Sparkles, MapPin, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { surpriseOptions, type SurpriseOption, type Vibe } from '@/lib/surprise-options';
import { getCurrentTimeBucket } from '@/lib/time-buckets';
import { useDemoTime } from '@/context/DemoTimeContext';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const VIBE_LABELS: { id: Vibe; label: string }[] = [
  { id: 'active', label: 'Active' },
  { id: 'chill', label: 'Chill' },
  { id: 'social', label: 'Social' },
];


const SurpriseMePlaceholder = () => (
    <Card className="bg-white border border-black/[0.08] shadow-sm rounded-2xl">
        <CardContent className="p-5 flex flex-col gap-4">
             <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#c4762a]" />
                    <span className="text-[#c4762a] font-bold tracking-widest text-[11px] uppercase">
                        Surprise Me
                    </span>
                </div>
                 <Skeleton className="h-5 w-20 rounded-full bg-[rgba(26,18,8,0.06)]" />
            </div>
             <div className="flex gap-2">
                <Skeleton className="h-8 w-20 rounded-full bg-[rgba(26,18,8,0.06)]" />
                <Skeleton className="h-8 w-20 rounded-full bg-[rgba(26,18,8,0.06)]" />
                <Skeleton className="h-8 w-20 rounded-full bg-[rgba(26,18,8,0.06)]" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-5 w-3/4 bg-[rgba(26,18,8,0.06)]" />
                <Skeleton className="h-4 w-full bg-[rgba(26,18,8,0.06)]" />
            </div>
             <div className="mt-2">
                 <Skeleton className="h-10 w-full rounded-xl bg-[rgba(26,18,8,0.06)]" />
            </div>
        </CardContent>
    </Card>
);


export function SurpriseMe() {
  const { mockDate } = useDemoTime();
  const [vibe, setVibe] = useState<Vibe>('chill');
  const [current, setCurrent] = useState<SurpriseOption | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Filter logic synchronized with God Mode time
  const getSurprise = useCallback((v: Vibe) => {
    const timeBucket = getCurrentTimeBucket(mockDate);
    const candidates = surpriseOptions.filter(
      (s) => s.vibe === v && s.timeBuckets.includes(timeBucket)
    );

    if (!candidates.length) return null;

    const index = Math.floor(Math.random() * candidates.length);
    return candidates[index] ?? null;
  }, [mockDate]);

  useEffect(() => {
    // Refresh the surprise when phase or vibe changes
    setIsClient(true);
    setCurrent(getSurprise(vibe));
  }, [vibe, getSurprise]);

  const handleSurprise = () => {
    setCurrent(getSurprise(vibe));
  };

  const vibeLabel = useMemo(
    () => VIBE_LABELS.find((v) => v.id === vibe)?.label ?? 'Chill',
    [vibe]
  );
  
  if (!isClient) {
    return <SurpriseMePlaceholder />;
  }

  if (!current) {
    // Fallback if no candidates are found
    return (
      <Card className="bg-white border border-black/[0.08] shadow-sm rounded-2xl">
        <CardContent className="p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#c4762a]" />
              <span className="text-[#c4762a] font-bold tracking-widest text-[11px] uppercase">
                Surprise Me
              </span>
            </div>
          </div>
          <p className="text-sm text-[rgba(26,18,8,0.50)]">
            No ideas for this vibe right now. Try another vibe.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-black/[0.08] shadow-sm rounded-2xl">
      <CardContent className="p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#c4762a]" />
            <span className="text-[#c4762a] font-bold tracking-widest text-[11px] uppercase">
              Surprise Me
            </span>
          </div>
          <Badge variant="secondary" className="bg-[rgba(26,18,8,0.06)] text-[#1a1208] border-none text-[10px] font-bold uppercase tracking-tight px-2 py-0.5">
            Bondi · {vibeLabel}
          </Badge>
        </div>

        {/* Vibe selector */}
        <div className="flex gap-2">
          {VIBE_LABELS.map((v) => {
            const isActive = v.id === vibe;
            return (
              <button
                key={v.id}
                onClick={() => setVibe(v.id)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[12px] font-bold transition-all duration-200",
                  isActive 
                    ? "bg-[#c4762a] text-white shadow-md shadow-[#c4762a]/10" 
                    : "bg-[rgba(26,18,8,0.06)] text-[rgba(26,18,8,0.50)] hover:bg-[rgba(26,18,8,0.1)]"
                )}
              >
                {v.label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-[#1a1208] leading-snug">
            {current?.title}
          </h3>
          <p className="text-sm text-[rgba(26,18,8,0.55)] leading-relaxed">
            {current?.description}
          </p>
          {current?.locationHint && (
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-[rgba(26,18,8,0.40)] pt-1 uppercase tracking-tight">
              <MapPin className="h-3 w-3" />
              <span>{current.locationHint}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="pt-1">
          <Button
            type="button"
            className="w-full bg-[#c4762a] hover:bg-[#b06824] text-white font-bold rounded-xl h-11 shadow-lg shadow-[#c4762a]/15"
            onClick={handleSurprise}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Surprise me again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
