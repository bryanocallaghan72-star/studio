
"use client";

import { useState } from "react";
import Link from "next/link";
import { Map, Pin, ShoppingBag, Beer, Utensils, Coffee, Heart, Sun, Dumbbell, Calendar, Sparkles } from "lucide-react";
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const categories = [
    { name: "All", icon: Sparkles },
    { name: "Brunch", icon: Coffee },
    { name: "Lunch", icon: Utensils },
    { name: "Restaurants", icon: Utensils },
    { name: "Nightlife", icon: Beer },
    { name: "Health & Fitness", icon: Dumbbell },
    { name: "Vibes", icon: Sun },
    { name: "Sushi", icon: Utensils },
    { name: "Cocktails", icon: Beer },
    { name: "Retail", icon: ShoppingBag },
    { name: "Events", icon: Calendar },
];

const venues = [
    {
      name: "Icebergs Dining Room",
      slug: "icebergs-dining-room",
      category: "Restaurants",
      position: { top: "80%", left: "30%" },
      color: "fill-blue-400",
    },
    {
      name: "Hotel Ravesis",
      slug: "hotel-ravesis",
      category: "Nightlife",
      position: { top: "30%", left: "55%" },
      color: "fill-pink-400",
    },
    {
      name: "The Depot",
      slug: "the-depot",
      category: "Brunch",
      position: { top: "65%", left: "65%" },
      color: "fill-orange-400",
    },
    {
      name: "Bondi Beach",
      slug: "bondi-beach",
      category: "Vibes",
      position: { top: "15%", left: "25%" },
      color: "fill-cyan-400",
    },
    {
      name: "Raw Bar",
      slug: "raw-bar",
      category: "Sushi",
      position: { top: "50%", left: "40%" },
      color: "fill-red-400",
    },
    {
        name: "Speedo's Cafe",
        slug: "speedos-cafe",
        category: "Brunch",
        position: { top: "25%", left: "80%" },
        color: "fill-yellow-400",
    },
    {
        name: "Totti's",
        slug: "tottis",
        category: "Restaurants",
        position: { top: "75%", left: "85%" },
        color: "fill-green-500",
    },
    {
        name: "Bondi Trattoria",
        slug: "bondi-trattoria",
        category: "Restaurants",
        position: { top: "55%", left: "20%" },
        color: "fill-teal-500",
    },
    {
        name: "The Corner House",
        slug: "the-corner-house",
        category: "Cocktails",
        position: { top: "45%", left: "75%" },
        color: "fill-purple-500",
    },
    {
      name: "Harry's Bondi",
      slug: "harrys-bondi",
      category: "Brunch",
      position: { top: "40%", left: "15%" },
      color: "fill-red-500",
    },
    {
      name: "LULU",
      slug: "lulu-pan-asian",
      category: "Restaurants",
      position: { top: "60%", left: "50%" },
      color: "fill-lime-500",
    },
    {
      name: "RND Izakaya",
      slug: "rnd-izakaya",
      category: "Restaurants",
      position: { top: "70%", left: "10%" },
      color: "fill-indigo-500",
    },
    {
      name: "Luca and Luca",
      slug: "luca-and-luca-gelato",
      category: "Brunch",
      position: { top: "20%", left: "70%" },
      color: "fill-rose-400",
    },
    {
      name: "Volume One",
      slug: "volume-one",
      category: "Cocktails",
      position: { top: "85%", left: "55%" },
      color: "fill-amber-500",
    },
];


export function IykykVibeMap() {
  const mapImage = PlaceHolderImages.find((img) => img.id === "map-1");
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredVenues = venues.filter(venue => 
    activeFilter === "All" || venue.category === activeFilter
  );

  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <Map className="h-8 w-8 text-primary" />
        <h2 className="text-3xl font-bold tracking-tight">iykyk Vibe</h2>
      </div>
      <p className="text-muted-foreground mb-4">
        Explore Bondi's landscape. Tap a pin to feel the vibe.
      </p>

      <ScrollArea className="w-full whitespace-nowrap rounded-lg">
        <div className="flex w-max space-x-2 pb-4">
            {categories.map((category) => (
                <Button 
                    key={category.name}
                    variant={activeFilter === category.name ? "default" : "outline"}
                    onClick={() => setActiveFilter(category.name)}
                    className="flex-shrink-0"
                >
                    <category.icon className="mr-2 h-4 w-4" />
                    {category.name}
                </Button>
            ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <Card className="overflow-hidden mt-2">
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

            {filteredVenues.map((venue) => (
              <Tooltip key={venue.name}>
                <TooltipTrigger asChild>
                   <Link href={`/venue/${venue.slug}`}>
                    <button
                        className="absolute transition-transform hover:scale-110 focus:outline-none"
                        style={{
                        top: venue.position.top,
                        left: venue.position.left,
                        transform: "translate(-50%, -50%)",
                        }}
                    >
                        <Pin className={cn("h-10 w-10 text-background drop-shadow-lg", venue.color)} strokeWidth={1.5} />
                    </button>
                  </Link>
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
