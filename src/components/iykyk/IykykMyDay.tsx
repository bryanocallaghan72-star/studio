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
import { generateItinerary } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { ItineraryOption } from '@/lib/data';

export function IykykMyDay() {
    const [view, setView] = useState<'selection' | 'itinerary'>('selection');
    const [itinerary, setItinerary] = useState<Itinerary | null>(null);
    const [currentVibe, setCurrentVibe] = useState<ItineraryOption | null>(null);
    const [isConfirmationOpen, setConfirmationOpen] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);
    const { toast } = useToast();

    const handleSelectVibe = async (option: ItineraryOption) => {
        setCurrentVibe(option);
        setView('itinerary');
        setItinerary(null);
        setIsShuffling(true);

        try {
            const result = await generateItinerary(option.request);

            if (result.success) {
                const newStopsWithIds = result.success.stops.map((stop, index) => ({
                    ...stop,
                    id: `${stop.title}-${index}-${Date.now()}`
                }));
                setItinerary({ ...result.success, stops: newStopsWithIds });
            } else if (result.error) {
                toast({
                    variant: "destructive",
                    title: result.error.title,
                    description: result.error.message,
                });
                // Return to selection if generation fails
                setView('selection');
                setCurrentVibe(null);
            }
        } catch (error) {
            console.error('Initial generation failed:', error);
            toast({
                variant: "destructive",
                title: "Generation Failed",
                description: "Something went wrong. Please try again.",
            });
            setView('selection');
            setCurrentVibe(null);
        } finally {
            setIsShuffling(false);
        }
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
    
    const handleShuffle = async () => {
        if (!itinerary || !currentVibe) return;

        setIsShuffling(true);
        try {
            const heldStops = itinerary.stops.filter(s => s.isHeld);
            const unlockedStopsCount = itinerary.stops.length - heldStops.length;

            if (unlockedStopsCount === 0) {
                return;
            }

            /**
             * CRITICAL FIX: The ItineraryRequestSchema in schemas.ts explicitly omits 'id' and 'isHeld'
             * for the heldStops array using .omit(). If we pass the full objects, Zod validation
             * on the server will fail with an 'unrecognized_keys' error.
             */
            const cleanedHeldStops = heldStops.map(({ id, isHeld, ...rest }) => rest);

            const request = {
                ...(currentVibe.request as Record<string, unknown>),
                heldStops: cleanedHeldStops,
                numberOfNewStops: unlockedStopsCount,
            };

            const result = await generateItinerary(request as any);

            if (result.success) {
                const newStopsWithIds = result.success.stops.map((stop, index) => ({
                    ...stop,
                    id: `${stop.title}-${index}-${Date.now()}`
                }));
                setItinerary({ ...result.success, stops: newStopsWithIds });
            } else if (result.error) {
                toast({
                    variant: "destructive",
                    title: result.error.title,
                    description: result.error.message,
                });
            }
        } catch (error) {
            console.error('Shuffle failed:', error);
            toast({
                variant: "destructive",
                title: "Shuffle Failed",
                description: "Something went wrong. Please try again.",
            });
        } finally {
            setIsShuffling(false);
        }
    };


    const handleStartPlan = (finalItinerary: Itinerary) => {
        setItinerary(finalItinerary);
        setConfirmationOpen(true);
    }
    
    const parseTime = (time: string): number => {
        const cleaned = time.trim().toUpperCase();
        const match = cleaned.match(
            /^(\d{1,2}):?(\d{2})?\s*(AM|PM)?$/
        );
        if (!match) return 0;
        let hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2] ?? '0', 10);
        const meridiem = match[3];
        if (meridiem === 'PM' && hours !== 12) hours += 12;
        if (meridiem === 'AM' && hours === 12) hours = 0;
        return hours * 60 + minutes;
    };

    const getConfirmationMessage = () => {
        if (!itinerary?.stops?.length) return "";
        const stops = [...itinerary.stops].sort((a, b) => parseTime(a.time) - parseTime(b.time));
        const venueList = stops.map(s => s.location).join(', then ');
        return `You're all set! Head to ${venueList}. Have an amazing time in Bondi!`;
    }

    return (
        <div className="w-full flex flex-col min-h-[40rem] overflow-hidden bg-[#f2ece0] border-none relative pb-32">
            <AnimatePresence mode="wait">
                {isShuffling && view === 'itinerary' && (
                    <motion.div
                        key="loader-shuffle"
                        className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                       <Loader2 className="h-10 w-10 animate-spin" style={{ color: 'var(--phase-accent)' }} />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {view === 'selection' ? (
                    <EventAndItinerarySelectionPage key="selection" onSelectVibe={handleSelectVibe} />
                ) : itinerary ? (
                    <IykykMyDayItineraryPage
                        key="itinerary"
                        itineraryData={{...itinerary, description: currentVibe?.description, title: itinerary.title || currentVibe?.title}}
                        onStartPlan={handleStartPlan}
                        onBack={handleBackToSelection}
                        onShuffle={handleShuffle}
                        onToggleHold={handleToggleHold}
                        onSwap={handleSwap}
                        isPending={isShuffling}
                    />
                ) : (
                    <div key="loading" className="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-10 w-10 animate-spin" style={{ color: 'var(--phase-accent)' }} />
                            <p className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--phase-text)', opacity: 0.5 }}>Finding your Bondi rhythm...</p>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            <Dialog open={isConfirmationOpen} onOpenChange={setConfirmationOpen}>
                <DialogContent className="bg-white border-none rounded-3xl shadow-2xl max-w-sm mx-auto">
                    <DialogHeader className="items-center text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#c4762a]/10 mb-4">
                          <CheckCircle2 className="h-8 w-8 text-[#c4762a]" />
                        </div>
                        <DialogTitle className="text-2xl font-bold text-[#1a1208]">{itinerary?.title}</DialogTitle>
                        <DialogDescription className="text-center pt-2 text-[rgba(26,18,8,0.50)] leading-relaxed">
                            {getConfirmationMessage()}
                        </DialogDescription>
                    </DialogHeader>
                    {itinerary && (
                         <div className="space-y-4 py-6 text-center border-y border-black/[0.05] my-2">
                            {[...itinerary.stops].sort((a, b) => 
                                parseTime(a.time) - parseTime(b.time)
                            ).map((stop, index) => (
                                <div key={index} className="flex items-center justify-center gap-4">
                                    <div className="text-sm font-black text-[#c4762a] w-16 text-right uppercase tracking-tighter">{stop.time}</div>
                                    <div className="font-bold text-[#1a1208] flex-1 text-left">{stop.location}</div>
                                </div>
                            ))}
                        </div>
                    )}
                    <Button onClick={() => setConfirmationOpen(false)} className="w-full bg-[#c4762a] text-white hover:bg-[#b06824] rounded-2xl h-14 font-black text-lg shadow-lg shadow-[#c4762a]/20">
                        Let's Go!
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    );
}