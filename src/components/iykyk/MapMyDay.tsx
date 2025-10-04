

"use client";

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Loader2, Shuffle, Wand2, ArrowLeft, CheckCircle2, ThumbsUp, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { generateItinerary } from '@/app/actions';
import { Itinerary, ItineraryRequest } from '@/ai/schemas';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle as DialogTitleComponent, DialogFooter } from '@/components/ui/dialog';


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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentVibe, setCurrentVibe] = useState<ItineraryRequest | null>(null);

    function handleGenerateItinerary(request: ItineraryRequest) {
        setError(null);
        setItinerary(null);
        setCurrentVibe(request);
        startTransition(async () => {
          const response = await generateItinerary(request);
          if (response.error) {
            setError(response.error);
          } else if (response.success) {
            setItinerary(response.success);
          }
        });
    }

    function handleBack() {
        setItinerary(null);
        setError(null);
        setCurrentVibe(null);
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

    const ItineraryBuilder = () => {
        if (!itinerary) return null;

        return (
            <div className="h-full flex flex-col">
                <CardHeader>
                    <div className="flex items-center justify-between">
                         <Button variant="ghost" size="icon" onClick={handleBack} className="text-muted-foreground">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <CardTitle className="text-2xl text-center">{itinerary.title}</CardTitle>
                        <Button variant="ghost" size="icon" className="text-muted-foreground">
                            <Shuffle className="h-5 w-5" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                     {itinerary.stops.map((stop, index) => (
                        <Card key={index} className="p-4">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-4 items-start">
                                    <div className="text-lg font-bold text-primary w-16">{stop.time}</div>
                                    <div>
                                        <h4 className="font-semibold text-lg">{stop.location}</h4>
                                        <p className="text-sm text-muted-foreground">{stop.description}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon"><ThumbsUp className="h-5 w-5 text-muted-foreground hover:text-primary" /></Button>
                                    <Button variant="ghost" size="icon"><RefreshCw className="h-5 w-5 text-muted-foreground hover:text-primary" /></Button>
                                </div>
                            </div>
                        </Card>
                     ))}
                </CardContent>
                <div className="p-6 pt-0">
                     <Button size="lg" className="w-full" onClick={() => setIsModalOpen(true)}>Start Plan</Button>
                </div>
            </div>
        )
    };

    const ItineraryModal = () => {
        if (!itinerary) return null;
    
        const summaryDescription = `All good, you're booked in for ${itinerary.stops[0].description.toLowerCase()} at ${itinerary.stops[0].location}, then jump over to ${itinerary.stops[1].location} for some ${itinerary.stops[1].title.toLowerCase()}. Finish the night at ${itinerary.stops[2].location}. You've Got This!`;

        return (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-md text-center p-8">
              <DialogHeader className="space-y-4">
                <div className="flex justify-center">
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                </div>
                <DialogTitleComponent className="text-2xl font-bold text-center">{itinerary.title}</DialogTitleComponent>
                <p className="text-muted-foreground text-center">
                    {summaryDescription}
                </p>
              </DialogHeader>
              <div className="my-6 space-y-4 text-left">
                {itinerary.stops.map((stop, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="font-bold text-primary text-lg w-20">{stop.time}</div>
                    <div>
                        <div className="text-lg font-semibold">{stop.location}</div>
                        <div className="text-sm text-muted-foreground">{stop.title}</div>
                    </div>
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button 
                    type="button" 
                    size="lg" 
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={() => setIsModalOpen(false)}
                >
                  Let's Go!
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );
    };

    return (
        <Card className="w-full flex flex-col min-h-[30rem]">
             <AnimatePresence mode="wait">
                <motion.div
                    key={itinerary ? "builder" : "selector"}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full flex flex-col"
                >
                    {isPending && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        </div>
                    )}
                    {error && (
                        <Alert variant="destructive" className="m-6">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {!itinerary ? <VibeSelector /> : <ItineraryBuilder />}
                </motion.div>
            </AnimatePresence>
            <ItineraryModal />
        </Card>
    );
}
