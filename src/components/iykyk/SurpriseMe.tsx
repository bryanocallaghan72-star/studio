
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Sparkles, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { getSurpriseForNow } from '@/lib/get-surprise';
import type { SurpriseOption, Vibe } from '@/lib/surprise-options';
import { Skeleton } from '@/components/ui/skeleton';

const VIBE_LABELS: { id: Vibe; label: string }[] = [
  { id: 'active', label: 'Active' },
  { id: 'chill', label: 'Chill' },
  { id: 'social', label: 'Social' },
];


const SurpriseMePlaceholder = () => (
    <Card className="bg-card/80 backdrop-blur shadow-md border border-border/60">
        <CardContent className="p-4 flex flex-col gap-3">
             <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Surprise Me
                    </span>
                </div>
                 <Skeleton className="h-5 w-20 rounded-full" />
            </div>
             <div className="flex gap-2 mt-1">
                <Skeleton className="h-7 w-20 rounded-full" />
                <Skeleton className="h-7 w-20 rounded-full" />
                <Skeleton className="h-7 w-20 rounded-full" />
            </div>
            <div className="mt-3 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
            </div>
             <div className="flex items-center justify-between gap-2 mt-3">
                 <Skeleton className="h-8 w-32 rounded-md" />
            </div>
        </CardContent>
    </Card>
);


export function SurpriseMe() {
  const [vibe, setVibe] = useState<Vibe>('chill');
  const [current, setCurrent] = useState<SurpriseOption | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after the component has mounted.
    setIsClient(true);
    setCurrent(getSurpriseForNow('chill'));
  }, []);

  const handleSurprise = () => {
    const next = getSurpriseForNow(vibe);
    setCurrent(next);
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
      <Card className="bg-card/80 backdrop-blur shadow-md border border-border/60">
        <CardContent className="p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Surprise Me
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            No ideas for this vibe right now. Try another vibe.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/80 backdrop-blur shadow-md border border-border/60">
      <CardContent className="p-4 flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Surprise Me
            </span>
          </div>
          <Badge variant="secondary" className="text-[10px]">
            Bondi · {vibeLabel}
          </Badge>
        </div>

        {/* Vibe selector */}
        <div className="flex gap-2 mt-1">
          {VIBE_LABELS.map((v) => (
            <Button
              key={v.id}
              type="button"
              size="sm"
              variant={v.id === vibe ? 'default' : 'outline'}
              className="h-7 px-3 text-xs"
              onClick={() => {
                setVibe(v.id);
                const next = getSurpriseForNow(v.id);
                setCurrent(next);
              }}
            >
              {v.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-3">
          <h3 className="text-lg font-semibold leading-snug">
            {current?.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {current?.description}
          </p>
        </div>

        {current?.locationHint && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <MapPin className="h-3 w-3" />
            <span>{current.locationHint}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between gap-2 mt-3">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="text-xs"
            onClick={handleSurprise}
          >
            <Sparkles className="h-3 w-3 mr-1" />
            Surprise me again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
