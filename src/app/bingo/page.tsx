
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Trophy, Coffee } from "lucide-react";
import { getBingoPack, defaultBingoPack, BingoPack } from "@/lib/bingo-packs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function BingoGame() {
  const searchParams = useSearchParams();
  const gameId = searchParams.get('game');
  const pack = (gameId ? getBingoPack(gameId) : defaultBingoPack) || defaultBingoPack;

  const Icon = pack.id === 'matcha-ultra-bondi' ? Coffee : Trophy;

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
          <CardTitle>Spot all 5 to win!</CardTitle>
          <CardDescription>
            Difficulty: {pack.difficulty} | Vibe: {pack.vibe}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {pack.items.map((item) => (
            <div key={item.id} className="flex items-center space-x-3 rounded-md border p-4 transition-all has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
              <Checkbox id={item.id} className="h-6 w-6"/>
              <label
                htmlFor={item.id}
                className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {item.label}
              </label>
            </div>
          ))}
        </CardContent>
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
