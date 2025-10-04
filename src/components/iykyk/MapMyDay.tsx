

"use client";

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Loader2, Shuffle, Wand2, ArrowLeft, CheckCircle2, ThumbsUp, RefreshCw, Pin } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { generateItinerary } from '@/app/actions';
import { Itinerary, ItineraryRequest, ItineraryStop } from '@/ai/schemas';
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
    const [heldStops, setHeldStops] = useState<ItineraryStop[]>([]);

    function handleGenerateItinerary(request: ItineraryRequest) {
        setError(null);
        setItinerary(null);
        setHeldStops([]);
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
        setHeldStops([]);
    }
    
    function handleShuffle() {
        if (!currentVibe) return;
        // For now, this regenerates the whole itinerary.
        // In the future, it will respect held stops.
        startTransition(async () => {
            const response = await generateItinerary(currentVibe);
            if (response.error) {
                setError(response.error);
            } else if (response.success) {
                setItinerary(response.success);
            }
        });
    }

    function toggleHold(stop: ItineraryStop) {
        setHeldStops(prevHeld => {
            const isHeld = prevHeld.some(held => held.title === stop.title && held.location === stop.location);
            if (isHeld) {
                return prevHeld.filter(held => !(held.title === stop.title && held.location === stop.location));
            } else {
                return [...prevHeld, stop];
            }
        });
    }

    const VibeSelector = () => (
        <motion.div
            key="selector"
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3 }}
            className="h-full flex flex-col"
        >
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
                    <Card key={vibe.title} className="flex flex-col justify-between p-6 hover:shadow-lg transition-shadow">
                        <div>
                            <h3 className="text-lg font-bold">{vibe.title}</h3>
                            <p className="text-muted-foreground text-sm mt-1">{vibe.description}</p>
                        </div>
                        <Button 
                            onClick={() => handleGenerateItinerary(vibe.request)} 
                            disabled={isPending && currentVibe?.vibe === vibe.request.vibe}
                            className="w-full mt-4 bg-accent text-accent-foreground hover:bg-accent/90"
                        >
                             {isPending && currentVibe?.vibe === vibe.request.vibe ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                             ) : (
                                <Wand2 className="mr-2 h-4 w-4" />
                             )}
                            Generate Itinerary
                        </Button>
                    </Card>
                ))}
            </CardContent>
        </motion.div>
    );

    const ItineraryBuilder = () => {
        if (!itinerary) return null;
        const selectedVibe = vibes.find(v => v.request.vibe === currentVibe?.vibe);

        return (
            <motion.div
                key="builder"
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                transition={{ duration: 0.3 }}
                className="h-full flex flex-col bg-secondary/30"
            >
                <div className="p-4 bg-background">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={handleBack} className="text-muted-foreground">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className='text-center flex-grow'>
                            <h2 className="text-2xl font-bold">{selectedVibe?.title}</h2>
                            <p className="text-muted-foreground text-sm">{selectedVibe?.description}</p>
                        </div>
                        <div className="w-9"></div>
                    </div>
                </div>

                <div className="flex-grow p-4 space-y-3 overflow-y-auto">
                     {itinerary.stops.map((stop, index) => {
                        const isHeld = heldStops.some(held => held.title === stop.title && held.location === stop.location);
                        return (
                            <Card key={index} className="p-3 bg-card/80 backdrop-blur-sm">
                                <div className="flex items-center gap-4">
                                    <Button variant="ghost" size="icon" onClick={() => toggleHold(stop)}>
                                        <Pin className={`h-5 w-5 text-muted-foreground transition-colors ${isHeld ? 'text-primary fill-primary' : 'hover:text-primary'}`} />
                                    </Button>
                                    <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center text-xs text-primary/80">64x64</div>
                                    <div className="flex-grow">
                                        <h4 className="font-semibold text-md">{stop.location}</h4>
                                        <p className="text-sm text-muted-foreground">{stop.description}</p>
                                    </div>
                                    <Button variant="ghost" size="icon"><Wand2 className="h-5 w-5 text-muted-foreground hover:text-primary" /></Button>
                                </div>
                            </Card>
                         )
                     })}
                </div>

                <div className="p-4 grid grid-cols-2 gap-4 bg-background border-t">
                     <Button size="lg" className="w-full" onClick={() => setIsModalOpen(true)}>Start Plan</Button>
                     <Button size="lg" variant="outline" className="w-full" onClick={handleShuffle} disabled={isPending}>
                        {isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Shuffle className="mr-2 h-5 w-5" />
                        )}
                        Shuffle
                    </Button>
                </div>
            </motion.div>
        )
    };

    const ItineraryModal = () => {
        if (!itinerary) return null;
    
        const summaryDescription = `All good, you're booked in for ${itinerary.stops.length > 0 ? itinerary.stops[0].description.toLowerCase() : ''} at ${itinerary.stops.length > 0 ? itinerary.stops[0].location : ''}, then jump over to ${itinerary.stops.length > 1 ? itinerary.stops[1].location : ''} for some ${itinerary.stops.length > 1 ? itinerary.stops[1].title.toLowerCase() : ''}. ${itinerary.stops.length > 2 ? `Finish the night at ${itinerary.stops[2].location}.` : ''} You've Got This!`;

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
        <Card className="w-full flex flex-col min-h-[30rem] overflow-hidden">
             <AnimatePresence mode="wait">
                 {itinerary ? <ItineraryBuilder /> : <VibeSelector />}
             </AnimatePresence>

             {isPending && !itinerary && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            )}
            
            {error && !itinerary && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10 p-6">
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                            <Button variant="link" onClick={handleBack} className="p-0 mt-2">Go Back</Button>
                    </Alert>
                </div>
            )}

            <ItineraryModal />
        </Card>
    );
}
