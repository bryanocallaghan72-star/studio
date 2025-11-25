
'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Trophy, Coffee } from "lucide-react";
import { getBingoPack, defaultBingoPack, BingoPack } from "@/lib/bingo-packs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HarrysRedemptionTicket } from '@/components/iykyk/HarrysRedemptionTicket';
import { AnimatePresence, motion } from 'framer-motion';

function BingoGame() {
  const searchParams = useSearchParams();
  const gameId = searchParams.get('game');
  const pack = (gameId ? getBingoPack(gameId) : defaultBingoPack) || defaultBingoPack;
  const isMatchaBingo = pack.id === 'matcha-ultra-bondi';

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [isWon, setIsWon] = useState(false);
  const [isRedeemed, setIsRedeemed] = useState(false);

  useEffect(() => {
    // Reset state when the game changes
    setCheckedItems({});
    setIsWon(false);
    setIsRedeemed(false);
  }, [gameId]);
  
  useEffect(() => {
    const allChecked = pack.items.every(item => checkedItems[item.id]);
    if (allChecked && isMatchaBingo) {
      setIsWon(true);
    } else {
      setIsWon(false);
    }
  }, [checkedItems, pack.items, isMatchaBingo]);

  const handleCheckChange = (itemId: string, isChecked: boolean) => {
    setCheckedItems(prev => ({ ...prev, [itemId]: isChecked }));
  };

  const Icon = isMatchaBingo ? Coffee : Trophy;

  if (isRedeemed && isMatchaBingo) {
    return <HarrysRedemptionTicket />;
  }

  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <Icon className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{pack.title}</h2>
          <p className="text-muted-foreground">{pack.description}</p>
        </div>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Spot all {pack.items.length} to win!</CardTitle>
          <CardDescription>
            Difficulty: {pack.difficulty} | Vibe: {pack.vibe}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {pack.items.map((item) => (
            <div key={item.id} className="flex items-center space-x-3 rounded-md border p-4 transition-all has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
              <Checkbox 
                id={item.id} 
                className="h-6 w-6"
                checked={checkedItems[item.id] || false}
                onCheckedChange={(checked) => handleCheckChange(item.id, !!checked)}
              />
              <label
                htmlFor={item.id}
                className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {item.label}
              </label>
            </div>
          ))}
        </CardContent>
         {isMatchaBingo && (
           <CardFooter className="flex-col items-stretch p-4">
            <AnimatePresence>
              {isWon && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <Button 
                    className="w-full h-14 text-lg font-bold bg-green-500 hover:bg-green-600 text-white shadow-lg animate-pulse"
                    onClick={() => setIsRedeemed(true)}
                  >
                    🎉 REDEEM AT HARRY'S
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardFooter>
         )}
      </Card>
      
      <div className="mt-4 flex gap-4">
        <Button asChild variant="outline">
          <Link href="/bingo">Play Bondi Bingo</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/bingo?game=matcha-ultra-bondi">Play Matcha Bingo</Link>
        </Button>
      </div>
    </section>
  );
}

export default function BingoPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BingoGame />
        </Suspense>
    )
}
