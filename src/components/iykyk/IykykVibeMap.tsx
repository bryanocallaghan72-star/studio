"use client";

import { Map, Pin } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const venues = [
  {
    name: "The Beachcomber Bar",
    category: "Bar",
    position: { top: "30%", left: "55%" },
    color: "bg-accent",
  },
  {
    name: "Sakura Sushi",
    category: "Restaurant",
    position: { top: "50%", left: "40%" },
    color: "bg-primary",
  },
  {
    name: "Morning Glory Cafe",
    category: "Cafe",
    position: { top: "65%", left: "65%" },
    color: "bg-destructive",
  },
  {
    name: "Bondi Beach",
    category: "Beach",
    position: { top: "15%", left: "25%" },
    color: "bg-blue-400",
  },
  {
    name: "Icebergs Pool",
    category: "Fitness",
    position: { top: "80%", left: "30%" },
    color: "bg-teal-500",
  },
];

export function IykykVibeMap() {
  const mapImage = PlaceHolderImages.find((img) => img.id === "map-1");

  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <Map className="h-8 w-8 text-primary" />
        <h2 className="text-3xl font-bold tracking-tight">iykyk Vibe</h2>
      </div>
      <p className="text-muted-foreground mb-4">
        Explore Bondi's landscape. Tap a pin to feel the vibe.
      </p>
      <Card className="overflow-hidden">
        <TooltipProvider>
          <CardContent className="p-0 relative w-full aspect-[4/3] md:aspect-video">
            {mapImage ? (
              <Image
                src={mapImage.imageUrl}
                alt={mapImage.description}
                fill
                className="object-cover"
                data-ai-hint={mapImage.imageHint}
              />
            ) : (
              <div className="w-full h-full bg-secondary flex items-center justify-center">
                <p className="text-muted-foreground">Map loading...</p>
              </div>
            )}
            <div className="absolute inset-0 bg-black/10" />

            {venues.map((venue) => (
              <Tooltip key={venue.name}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute w-8 h-8 rounded-full shadow-lg transition-transform hover:scale-110"
                    style={{
                      top: venue.position.top,
                      left: venue.position.left,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <span className={cn("absolute h-4 w-4 rounded-full", venue.color, "animate-pulse")} />
                    <span className={cn("h-2.5 w-2.5 rounded-full", venue.color, "ring-4 ring-background")} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">{venue.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {venue.category}
                  </p>
                </TooltipContent>
              </Tooltip>
            ))}
          </CardContent>
        </TooltipProvider>
      </Card>
    </section>
  );
}
