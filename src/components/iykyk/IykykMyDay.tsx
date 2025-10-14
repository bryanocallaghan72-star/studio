
'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Itinerary, ItineraryStop } from '@/ai/schemas';
import { AnimatePresence, motion } from "framer-motion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EventAndItinerarySelectionPage } from './my-day/EventAndItinerarySelectionPage';
import { IykykMyDayItineraryPage } from './my-day/IykykMyDayItineraryPage';
import { appData } from '@/lib/data';

export function IykykMyDay() {
    const [view, setView] = useState<'selection' | 'itinerary'>('selection');
    const [itinerary, setItinerary] = useState<Itinerary | null>(null);
    const [currentVibe, setCurrentVibe] = useState<any | null>(null);
    const [isConfirmationOpen, setConfirmationOpen] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);

    const handleSelectVibe = (option: any) => {
        setCurrentVibe(option);

        const initialStops = option.mockItinerary.map((s: any, index: number) => ({
            time: s.time,
            title: s.name,
            location: s.name,
            description: s.notes,
            isHeld: false,
            id: `${s.name}-${index}-${Date.now()}`,
        }));
        
        setItinerary({
            title: option.title,
            stops: initialStops,
        });

        setView('itinerary');
    };

    const handleBackToSelection = () => {
        setView('selection');
        setItinerary(null);
        setCurrentVibe(null);
    };

    const handleToggleHold = (stopToToggle: ItineraryStop) => {
        if (!itinerary) return;
        const newStops = itinerary.stops.map(stop => 
            stop.id === stopToToggle.id
                ? { ...stop, isHeld: !stop.isHeld } 
                : stop
        );
        setItinerary({ ...itinerary, stops: newStops });
    };

    const handleSwap = (originalStop: ItineraryStop, newVenue: any) => {
        if (!itinerary) return;
        const newStops = itinerary.stops.map(stop =>
            stop.id === originalStop.id
                ? { ...stop, title: newVenue.name, location: newVenue.name, description: newVenue.description }
                : stop
        );
        setItinerary({ ...itinerary, stops: newStops });
    };
    
    const handleShuffle = () => {
        if (!itinerary) return;

        setIsShuffling(true);

        setTimeout(() => {
            const heldStops = itinerary.stops.filter(stop => stop.isHeld);
            const stopsToShuffle = itinerary.stops.filter(stop => !stop.isHeld);
    
            if (stopsToShuffle.length === 0) {
                setIsShuffling(false);
                return;
            };
    
            const venueTypes = new Set(stopsToShuffle.map(stop => {
                const venue = appData.map.pins.find(p => p.name === stop.location);
                return venue?.type || 'Restaurants';
            }));
    
            const replacementPool = appData.map.pins.filter(pin => 
                venueTypes.has(pin.type) && 
                !itinerary.stops.some(s => s.location === pin.name)
            );
    
            const shuffledPool = [...replacementPool].sort(() => Math.random() - 0.5);
    
            const newShuffledStops = stopsToShuffle.map((oldStop) => {
                const replacement = shuffledPool.pop();
                if (replacement) {
                    return {
                        ...oldStop,
                        title: replacement.name,
                        location: replacement.name,
                        description: replacement.description,
                        isHeld: false,
                        id: `shuffled-${replacement.name}-${Date.now()}`
                    };
                }
                return oldStop;
            });
    
            const finalStops = [...heldStops, ...newShuffledStops].sort((a, b) => {
                const timeA = new Date(`1970/01/01 ${a.time.replace(/\s/g, '')}`);
                const timeB = new Date(`1970/01/01 ${b.time.replace(/\s/g, '')}`);
                return timeA.getTime() - timeB.getTime();
            });
    
            setItinerary({ ...itinerary, stops: finalStops });
            setIsShuffling(false);
        }, 300); // Simulate a quick shuffle
    };


    const handleStartPlan = (finalItinerary: Itinerary) => {
        setItinerary(finalItinerary);
        setConfirmationOpen(true);
    }
    
    const getConfirmationMessage = () => {
        if (!currentVibe) return "";
        return currentVibe.curatedMessage;
    }

    const CurrentPage = () => {
        if (view === 'selection') {
            return <EventAndItinerarySelectionPage onSelectVibe={handleSelectVibe} />;
        }
        if (itinerary) {
            return <IykykMyDayItineraryPage
                itineraryData={{...itinerary, description: currentVibe?.description, title: itinerary.title || currentVibe?.title}}
                onStartPlan={handleStartPlan}
                onBack={handleBackToSelection}
                onShuffle={handleShuffle}
                onToggleHold={handleToggleHold}
                onSwap={handleSwap}
                isPending={isShuffling}
            />;
        }
        return (
             <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
             </div>
        );
    }

    return (
        <Card className="w-full flex flex-col min-h-[40rem] overflow-hidden bg-transparent border-none shadow-none relative">
            <AnimatePresence mode="wait">
                {isShuffling && view === 'itinerary' && (
                    <motion.div
                        key="loader-shuffle"
                        className="absolute inset-0 flex items-center justify-center bg-background/80 z-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                       <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                <CurrentPage />
            </AnimatePresence>

            <Dialog open={isConfirmationOpen} onOpenChange={setConfirmationOpen}>
                <DialogContent>
                    <DialogHeader className="items-center text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-2">
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                        </div>
                        <DialogTitle>{itinerary?.title}</DialogTitle>
                        <DialogDescription className="text-center pt-2">
                            {getConfirmationMessage()}
                        </DialogDescription>
                    </DialogHeader>
                    {itinerary && (
                         <div className="space-y-4 py-4 text-center">
                            {itinerary.stops.sort((a, b) => {
                                const timeA = new Date(`1970/01/01 ${a.time.replace(/\s/g, '')}`);
                                const timeB = new Date(`1970/01/01 ${b.time.replace(/\s/g, '')}`);
                                return timeA.getTime() - timeB.getTime();
                            }).map((stop, index) => (
                                <div key={index} className="flex items-center justify-center gap-4">
                                    <div className="text-lg font-bold text-primary">{stop.time}</div>
                                    <div className="font-semibold">{stop.location}</div>
                                </div>
                            ))}
                        </div>
                    )}
                    <Button onClick={() => setConfirmationOpen(false)} className="w-full">Let's Go!</Button>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
