
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Trophy } from "lucide-react";

const bingoItems = [
  { id: "barefoot", label: "Someone barefoot" },
  { id: "linen", label: "Someone in linen" },
  { id: "hat", label: "A hat you’d instantly borrow" },
  { id: "surfboard", label: "A surfboard you wish you owned" },
  { id: "dog", label: "A dog that looks like it runs Bondi" },
];

export default function BingoPage() {
  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <Trophy className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Bondi Beach Style Bingo</h2>
          <p className="text-muted-foreground">A micro-game to play while you walk the promenade.</p>
        </div>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Spot all 5 to win!</CardTitle>
          <CardDescription>Difficulty: 2/10 | Vibe: Fun, Observant, Social</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {bingoItems.map((item) => (
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
    </section>
  );
}
