
'use client';

import { useState, useTransition } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Itinerary, ItineraryRequest, ItineraryStop } from '@/ai/schemas';
import { AnimatePresence, motion } from "framer-motion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { generateItinerary as generateItineraryAction } from '@/app/actions';
import { EventAndItinerarySelectionPage } from './my-day/EventAndItinerarySelectionPage';
import { IykykMyDayItineraryPage } from './my-day/IykykMyDayItineraryPage';
import { useToast } from '@/hooks/use-toast';

export function IykykMyDay() {
    const [isPending, startTransition] = useTransition();
    const [view, setView] = useState<'selection' | 'itinerary'>('selection');
    const [itinerary, setItinerary] = useState<Itinerary | null>(null);
    const [currentVibe, setCurrentVibe] = useState<any | null>(null);
    const [isConfirmationOpen, setConfirmationOpen] = useState(false);
    const { toast } = useToast();

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
        if (!itinerary || !currentVibe) return;

        const heldStops = itinerary.stops.filter(s => s.isHeld);
        const nonHeldStops = itinerary.stops.filter(s => !s.isHeld);

        if (nonHeldStops.length === 0) {
            toast({
                title: "Everything is locked!",
                description: "Unlock some stops if you want to shuffle your plan.",
            });
            return;
        }

        startTransition(async () => {
            const request: ItineraryRequest = {
                vibe: currentVibe?.request?.vibe || 'A fun day in Bondi',
                pace: currentVibe?.request?.pace || 3,
                budget: currentVibe?.request?.budget || 3,
                travelMode: currentVibe?.request?.travelMode || 'walking',
                numberOfNewStops: nonHeldStops.length,
                heldStops: heldStops.map(({ id, isHeld, ...rest }) => rest),
            };
            
            const result = await generateItineraryAction(request);

            if (result.error) {
                toast({
                    title: result.error.title,
                    description: result.error.message,
                });
            } else if (result.success) {
                const newStops = result.success.stops.map((s, index) => ({ 
                    ...s, 
                    isHeld: false, 
                    id: `new-${s.location}-${index}-${Date.now()}` 
                }));

                const finalStops = [...heldStops, ...newStops];
                
                finalStops.sort((a, b) => {
                    // Handle potential AM/PM format issues gracefully
                    const timeA = new Date(`1970/01/01 ${a.time.replace(/\s/g, '')}`);
                    const timeB = new Date(`1970/01/01 ${b.time.replace(/\s/g, '')}`);
                    return timeA.getTime() - timeB.getTime();
                });
                
                setItinerary({ ...itinerary, stops: finalStops, title: result.success.title });
            }
        });
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
                isPending={isPending}
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
                {isPending && view === 'itinerary' && (
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
