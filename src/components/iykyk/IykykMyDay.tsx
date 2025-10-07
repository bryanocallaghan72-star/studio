

"use client";

import { useState, useTransition, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, CheckCircle2, Sparkles, Search, Lock, LockOpen, X } from "lucide-react";
import { Itinerary, ItineraryRequest, ItineraryStop } from '@/ai/schemas';
import { AnimatePresence, motion } from "framer-motion";
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '../ui/input';
import { appData } from '@/lib/data';
import { generateItinerary as generateItineraryAction } from '@/app/actions';


const EventAndItinerarySelectionPage = ({ onSelectVibe }) => {
  const [activeTab, setActiveTab] = useState('solo');
  return (
    <motion.div
      key="selector"
      initial={{ opacity: 0, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full bg-background overflow-y-auto p-6 text-center"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="w-6"></div>
        <h2 className="text-2xl font-bold text-foreground flex-grow text-center">Plan My Day or Event</h2>
        <div className="w-6"></div>
      </div>
      <div className="flex justify-center mb-6 w-full max-w-sm bg-card rounded-full p-2 shadow-inner mx-auto">
        <button className={`flex-1 px-4 py-2 rounded-full font-semibold transition-colors ${activeTab === 'solo' ? 'bg-primary text-primary-foreground' : 'text-secondary-foreground'}`} onClick={() => setActiveTab('solo')}>Solo Itinerary</button>
        <button className={`flex-1 px-4 py-2 rounded-full font-semibold transition-colors ${activeTab === 'group' ? 'bg-primary text-primary-foreground' : 'text-secondary-foreground'}`} onClick={() => setActiveTab('group')}>Plan an Event</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeTab === 'solo' ? (appData.mapMyDayOptions.map(option => (
            <Card key={option.id} className="rounded-2xl p-6 shadow-xl flex flex-col items-center justify-between text-center transition-all hover:shadow-2xl hover:-translate-y-1">
                <CardHeader className="p-0">
                    <CardTitle className="text-lg font-bold">{option.title}</CardTitle>
                    <CardDescription className="text-sm mt-1">{option.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-0 mt-4 w-full">
                    <Button onClick={() => onSelectVibe(option)} className="w-full font-bold shadow-lg">View Itinerary</Button>
                </CardContent>
            </Card>
        ))) : (appData.groupEventsOptions.map(option => (
            <Card key={option.id} className="rounded-2xl p-6 shadow-xl flex flex-col items-center justify-between text-center transition-all hover:shadow-2xl hover:-translate-y-1">
                <CardHeader className="p-0">
                    <CardTitle className="text-lg font-bold">{option.title}</CardTitle>
                    <CardDescription className="text-sm mt-1">{option.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-0 mt-4 w-full">
                     <Button onClick={() => onSelectVibe(option)} className="w-full font-bold shadow-lg">View Itinerary</Button>
                </CardContent>
            </Card>
        )))}
      </div>
    </motion.div>
  );
};

const IykykMyDayItineraryPage = ({ itineraryData, onStartPlan, onBack, onShuffle, onToggleHold, onSwap, isPending }) => {
  const [editingItem, setEditingItem] = useState<ItineraryStop | null>(null);
  const [swapQuery, setSwapQuery] = useState('');

  if (!itineraryData) {
    return null; 
  }

  const handleSwapClick = (originalItem, newItem) => {
    onSwap(originalItem, newItem);
    setEditingItem(null);
    setSwapQuery('');
  };

  const getItemType = (item) => {
    if (!item?.location) return 'Restaurants';
    const venue = appData.map.pins.find(p => p.name === item.location);
    return venue?.type || 'Restaurants';
  }

  const filteredSwapOptions = editingItem ? appData.map.pins.filter(pin => pin.type === getItemType(editingItem) && pin.name.toLowerCase().includes(swapQuery.toLowerCase())) : [];

  return (
    <motion.div
        key="builder"
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col h-full bg-background overflow-y-auto p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <Button onClick={onBack} variant="ghost" size="icon" className="text-foreground hover:bg-accent"><ArrowLeft size={24} /></Button>
        <div className='text-center'>
            <h2 className="text-2xl font-bold text-foreground">{itineraryData.title}</h2>
            <p className="text-muted-foreground text-sm">{itineraryData.description}</p>
        </div>
        <div className="w-10"></div>
      </div>
      
      <div className="flex-grow space-y-4 pt-4">
        <AnimatePresence>
          {itineraryData.stops.map((stop, index) => {
              const HoldIcon = stop.isHeld ? Lock : LockOpen;
              return (
              <motion.div
                key={stop.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={`rounded-2xl p-4 shadow-lg flex items-center transition-all duration-300 bg-card ${stop.isHeld ? 'border-2 border-primary' : 'border-transparent'}`}>
                    <Button onClick={() => onToggleHold(stop)} variant="ghost" size="icon" className="flex-shrink-0 mr-4 group">
                      <HoldIcon size={24} className={stop.isHeld ? 'text-primary' : 'text-muted-foreground group-hover:text-primary transition-colors'} />
                    </Button>
                    <div className="w-16 h-16 bg-primary/20 rounded-xl overflow-hidden flex-shrink-0">
                        <Image src={`https://picsum.photos/seed/${stop.location.replace(/\s+/g, '-')}/64/64`} alt={stop.location} width={64} height={64} className="w-full h-full object-cover" />
                    </div>
                    <div className="ml-4 flex-grow">
                        <p className="font-semibold text-foreground">{stop.title}</p>
                        <p className="text-sm text-muted-foreground">{stop.location}</p>
                    </div>
                    <Button onClick={() => setEditingItem(stop)} variant="ghost" size="icon" className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0 ml-4"><Sparkles size={24} /></Button>
                </Card>
              </motion.div>
              );
          })}
        </AnimatePresence>
      </div>

      <div className="mt-auto flex space-x-4 pt-4 sticky bottom-0 bg-background py-4">
        <Button className="flex-grow h-14 font-bold text-lg shadow-2xl" onClick={() => onStartPlan(itineraryData)}>Start Plan</Button>
        <Button variant="outline" className="flex-grow h-14 font-bold text-lg shadow-2xl bg-card" onClick={onShuffle} disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin mr-2"/> : 'Shuffle'}
        </Button>
      </div>

      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Swap {editingItem.location}</DialogTitle>
              <DialogDescription>Find an alternative for your itinerary.</DialogDescription>
            </DialogHeader>
            <div className="relative mb-4">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input type="text" value={swapQuery} onChange={(e) => setSwapQuery(e.target.value)} placeholder={`Search ${getItemType(editingItem)} venues...`} className="w-full pl-10 pr-4 py-3" />
            </div>
            <div className="space-y-4 max-h-64 overflow-y-auto">
                {filteredSwapOptions.map((item, index) => (
                <button key={index} onClick={() => handleSwapClick(editingItem, item)} className="w-full flex items-center bg-secondary rounded-xl p-3 shadow-lg transition-transform duration-100 hover:scale-[1.02] active:scale-[0.98]">
                    <div className="w-16 h-16 bg-gray-700 rounded-xl overflow-hidden flex-shrink-0">
                      <Image src={`https://picsum.photos/seed/${item.name.replace(/\s+/g, '-')}/64/64`} alt="Venue" width={64} height={64} className="w-full h-full object-cover" />
                    </div>
                    <div className="ml-4 text-left">
                        <p className="text-foreground font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                </button>
                ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
};


export function IykykMyDay() {
    const [isPending, startTransition] = useTransition();
    const [view, setView] = useState<'selection' | 'itinerary'>('selection');
    const [itinerary, setItinerary] = useState<Itinerary | null>(null);
    const [currentVibe, setCurrentVibe] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isConfirmationOpen, setConfirmationOpen] = useState(false);

    const handleSelectVibe = (option) => {
        setError(null);
        setCurrentVibe(option);

        const initialStops = option.mockItinerary.map((s, index) => ({
            time: s.time,
            title: s.name,
            location: s.name,
            description: s.notes,
            isHeld: false,
            id: `${s.name}-${index}-${Date.now()}`, // More robust unique ID
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

        startTransition(async () => {
            const request: ItineraryRequest = {
                vibe: currentVibe?.request?.vibe || 'A fun day in Bondi',
                pace: currentVibe?.request?.pace || 3,
                budget: currentVibe?.request?.budget || 3,
                travelMode: currentVibe?.request?.travelMode || 'walking',
                numberOfNewStops: nonHeldStops.length,
                heldStops: heldStops.map(({ id, isHeld, ...rest }) => rest), // Omit client-side fields
            };
            
            setError(null);
            const result = await generateItineraryAction(request);

            if (result.error) {
                setError(result.error);
            } else if (result.success) {
                const newStops = result.success.stops.map((s, index) => ({ 
                    ...s, 
                    isHeld: false, 
                    id: `new-${s.location}-${index}-${Date.now()}` 
                }));

                // Combine held stops with the newly generated ones
                const finalStops = [...heldStops, ...newStops];
                
                // Sort stops by time (e.g., "9:00 AM", "1:00 PM", "9:00 PM")
                finalStops.sort((a, b) => {
                    const timeA = new Date(`1970-01-01 ${a.time}`);
                    const timeB = new Date(`1970-01-01 ${b.time}`);
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
            {error && (
                 <motion.div
                    key="error"
                    className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-20 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <p className="text-destructive text-center mb-4">{error}</p>
                    <Button onClick={() => {
                        setError(null);
                        if (itinerary) {
                            // just hide error and let them try again
                        } else {
                           handleBackToSelection();
                        }
                    }}>Try again</Button>
                </motion.div>
            )}

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
                                const timeA = new Date(`1970-01-01 ${a.time}`);
                                const timeB = new Date(`1970-01-01 ${b.time}`);
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
