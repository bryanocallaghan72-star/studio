
"use client";

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Loader2, Shuffle, Wand2, Sparkles } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { AnimatePresence, motion } from "framer-motion";
import { generateItinerary } from '@/app/actions';
import { Itinerary } from '@/ai/flows/generate-itinerary-flow';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const vibes = [
    "Tinder Date - Bondi",
    "Single & Ready to Mingle",
    "Date Night - Bondi",
    "Wellness Saturday",
    "Ladies' Lunch",
    "Quick Bondi Lunch",
    "Girls' Night Out",
];

// Fisher-Yates shuffle algorithm
const shuffleArray = (array: any[]) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
};

export function MapMyDay() {
    const [isPending, startTransition] = useTransition();
    const [itinerary, setItinerary] = useState<Itinerary | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedVibe, setSelectedVibe] = useState<string | null>(null);


    function handleVibeSelection(vibe: string) {
        setError(null);
        setItinerary(null);
        setSelectedVibe(vibe);
        startTransition(async () => {
          const response = await generateItinerary(vibe);
          if (response.error) {
            setError(response.error);
          } else if (response.success) {
            setItinerary(response.success);
          }
        });
    }

    const handleShuffle = () => {
        if (itinerary) {
            setItinerary(prev => prev ? ({ ...prev, stops: shuffleArray([...prev.stops]) }) : null);
        }
    };
    
    // Helper to get a semi-random image from placeholders
    const getRandomImage = (index: number) => {
        const imageIds = ["my-day-1", "my-day-2", "my-day-3", "my-day-4", "morning-1", "night-1", "late-night-1"];
        return PlaceHolderImages.find(img => img.id === imageIds[index % imageIds.length]);
    }

    return (
        <Card className="w-full flex flex-col">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Calendar className="h-6 w-6 text-primary" />
                        <CardTitle>Map my Day</CardTitle>
                    </div>
                    {itinerary && (
                         <Button variant="ghost" size="icon" onClick={handleShuffle}>
                            <Shuffle className="h-5 w-5" />
                            <span className="sr-only">Shuffle</span>
                        </Button>
                    )}
                </div>
                <CardDescription>Choose a vibe (e.g., "Wellness Saturday," "Tinder Date") and get an instant itinerary.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
                 <div className="mb-6">
                    <h4 className="font-semibold text-sm mb-3">Choose your vibe:</h4>
                    <div className="flex flex-wrap gap-2">
                        {vibes.map(vibe => (
                            <Button 
                                key={vibe}
                                variant={selectedVibe === vibe && !isPending ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleVibeSelection(vibe)}
                                disabled={isPending}
                            >
                                {isPending && selectedVibe === vibe ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Sparkles className="mr-2 h-4 w-4" />
                                )}
                                {vibe}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="mt-6 space-y-4 flex-grow">
                    {error && (
                        <Alert variant="destructive">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    
                    {!isPending && !itinerary && !error && (
                         <div className="flex flex-col items-center justify-center text-center h-full text-muted-foreground p-8 rounded-lg bg-secondary/50">
                            <Calendar className="h-12 w-12 mb-4" />
                            <p className="font-medium">Your curated day awaits.</p>
                            <p className="text-sm">Select a vibe above to get started!</p>
                        </div>
                    )}
                    
                    {itinerary && (
                         <AnimatePresence>
                         {itinerary.stops.map((activity, index) => {
                             const image = getRandomImage(index);
                             return (
                                 <motion.div
                                     key={activity.title + index} // Add index to key for shuffle to re-animate
                                     layout
                                     initial={{ opacity: 0, y: 20 }}
                                     animate={{ opacity: 1, y: 0 }}
                                     exit={{ opacity: 0, y: -20 }}
                                     transition={{ duration: 0.3 }}
                                     className="flex items-start gap-4 p-2 rounded-lg hover:bg-secondary"
                                 >
                                     {image && (
                                         <Image
                                             src={image.imageUrl}
                                             alt={image.description}
                                             width={64}
                                             height={64}
                                             className="rounded-md object-cover aspect-square"
                                             data-ai-hint={image.imageHint}
                                         />
                                     )}
                                     <div className="flex-grow">
                                         <p className="font-bold">{activity.title}</p>
                                         <p className="text-sm font-semibold text-primary">{activity.time}</p>
                                         <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                                         <p className="text-xs text-muted-foreground mt-1">📍 {activity.location}</p>
                                     </div>
                                 </motion.div>
                             );
                         })}
                         </AnimatePresence>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
