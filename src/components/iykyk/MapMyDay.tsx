"use client";

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Loader2, Shuffle, Wand2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { AnimatePresence, motion } from "framer-motion";
import { generateItinerary } from '@/app/actions';
import { Itinerary, ItineraryRequest } from '@/ai/schemas';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const vibes = [
    { 
        title: "Wellness Saturday", 
        description: "Stretch with an ocean view.",
        request: { vibe: "Wellness Saturday", pace: 2, budget: 2, travelMode: 'walk' }
    },
    { 
        title: "Tinder Date", 
        description: "Casual cocktails to break the ice.",
        request: { vibe: "Tinder Date - Bondi", pace: 2, budget: 3, travelMode: 'walk' }
    },
    { 
        title: "Date Night", 
        description: "Cliff-top glow & photo spots.",
        request: { vibe: "Date Night - Bondi", pace: 3, budget: 4, travelMode: 'rideshare' }
    },
    { 
        title: "Girls' Night Out", 
        description: "Margaritas & shared tapas.",
        request: { vibe: "Girls' Night Out - Bondi", pace: 4, budget: 3, travelMode: 'rideshare' }
    }
];

export function MapMyDay() {
    const [isPending, startTransition] = useTransition();
    const [itinerary, setItinerary] = useState<Itinerary | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [currentRequest, setCurrentRequest] = useState<ItineraryRequest | null>(null);

    function handleGenerateItinerary(request: ItineraryRequest) {
        setError(null);
        setItinerary(null);
        setCurrentRequest(request);
        startTransition(async () => {
          const response = await generateItinerary(request);
          if (response.error) {
            setError(response.error);
          } else if (response.success) {
            setItinerary(response.success);
          }
        });
    }

    const handleShuffle = () => {
        if (!currentRequest) return;
        handleGenerateItinerary(currentRequest);
    };
    
    const getRandomImage = (index: number) => {
        const imageIds = ["my-day-1", "my-day-2", "my-day-3", "my-day-4", "morning-1", "night-1", "late-night-1"];
        return PlaceHolderImages.find(img => img.id === imageIds[index % imageIds.length]);
    }

    const VibeSelector = () => (
        <>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Calendar className="h-8 w-8 text-primary" />
                    <CardTitle className="text-3xl font-bold tracking-tight">Map my Day</CardTitle>
                </div>
                <CardDescription>
                    Choose a vibe and instantly get a curated plan for your perfect day in Bondi.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vibes.map((vibe) => (
                    <Card key={vibe.title} className="flex flex-col justify-between p-6">
                        <div>
                            <h3 className="text-lg font-bold">{vibe.title}</h3>
                            <p className="text-muted-foreground text-sm mt-1">{vibe.description}</p>
                        </div>
                        <Button 
                            onClick={() => handleGenerateItinerary(vibe.request)} 
                            disabled={isPending} 
                            className="w-full mt-4 bg-accent text-accent-foreground hover:bg-accent/90"
                        >
                            <Wand2 className="mr-2 h-4 w-4" />
                            Generate Itinerary
                        </Button>
                    </Card>
                ))}
            </CardContent>
        </>
    );
    
    const ItineraryDisplay = () => (
      <div>
        <CardHeader>
            <div className="flex items-center justify-between">
                <Button variant="outline" size="sm" onClick={() => { setItinerary(null); setError(null); }} disabled={isPending}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Vibes
                </Button>
                 <Button variant="ghost" onClick={handleShuffle} disabled={isPending} size="sm">
                    {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Shuffle className="mr-2 h-4 w-4" /> Shuffle</>}
                 </Button>
            </div>
        </CardHeader>
        <CardContent>
            <h3 className="text-xl font-bold mb-4">{itinerary?.title}</h3>
            <AnimatePresence>
            {itinerary!.stops.map((activity, index) => {
                const image = getRandomImage(index);
                return (
                    <motion.div
                        key={activity.title + index}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-start gap-4 p-2 rounded-lg -mx-2 mb-2 hover:bg-secondary"
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
        </CardContent>
      </div>
    );

    return (
        <Card className="w-full flex flex-col min-h-[30rem]">
            {error && (
                <Alert variant="destructive" className="m-6">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {isPending && !itinerary && (
                <div className="flex flex-grow flex-col items-center justify-center text-center h-full text-muted-foreground p-8 rounded-lg bg-secondary/50">
                    <Wand2 className="h-12 w-12 mb-4 animate-pulse text-primary" />
                    <p className="font-medium">Crafting your perfect day...</p>
                    <p className="text-sm">This can take a moment!</p>
                </div>
            )}
            
            {!isPending && !itinerary && <VibeSelector />}
            
            {itinerary && <ItineraryDisplay />}
        </Card>
    );
}