
"use client";

import { useState, useTransition, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, CheckCircle2, Sparkles, Search } from "lucide-react";
import { generateItinerary } from '@/app/actions';
import { Itinerary, ItineraryRequest, ItineraryStop } from '@/ai/schemas';
import { AnimatePresence, motion } from "framer-motion";
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '../ui/input';
import { appData } from '@/lib/data';


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
            <Card key={option.id} className="rounded-2xl p-6 shadow-xl flex flex-col items-center justify-between text-center">
                <CardHeader className="p-0">
                    <CardTitle className="text-lg font-bold">{option.title}</CardTitle>
                    <CardDescription className="text-sm mt-1">{option.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-0 mt-4 w-full">
                    <Button onClick={() => onSelectVibe(option)} className="w-full font-bold shadow-lg">View Itinerary</Button>
                </CardContent>
            </Card>
        ))) : (appData.groupEventsOptions.map(option => (
            <Card key={option.id} className="rounded-2xl p-6 shadow-xl flex flex-col items-center justify-between text-center">
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

const MapMyDayItineraryPage = ({ itineraryData, onStartPlan, onBack, onShuffle, onToggleHold, onSwap }) => {
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
        {itineraryData.stops.map((stop, index) => {
            return (
            <Card key={`${stop.location}-${index}`} className={`rounded-2xl p-4 shadow-lg flex items-center transition-all duration-300 bg-card ${stop.isHeld ? 'border-2 border-primary' : ''}`}>
                <Button onClick={() => onToggleHold(stop)} variant="ghost" size="icon" className="flex-shrink-0 mr-4">
                  <CheckCircle2 size={24} className={stop.isHeld ? 'text-primary fill-primary/20' : 'text-muted-foreground'} />
                </Button>
                <div className="w-16 h-16 bg-primary/20 rounded-xl overflow-hidden flex-shrink-0">
                    <Image src={`https://picsum.photos/seed/${stop.location.replace(/\s+/g, '-')}/64/64`} alt={stop.location} width={64} height={64} className="w-full h-full object-cover" />
                </div>
                <div className="ml-4 flex-grow">
                    <p className="font-semibold text-foreground">{stop.title}</p>
                    <p className="text-sm text-muted-foreground">{stop.location}</p>
                </div>
                <Button onClick={() => setEditingItem(stop)} variant="ghost" size="icon" className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0 ml-4"><Sparkles size={24} /></Button>
            </Card>);
        })}
      </div>

      <div className="mt-auto flex space-x-4 pt-4 sticky bottom-0 bg-background py-4">
        <Button className="flex-grow h-14 font-bold text-lg shadow-2xl" onClick={() => onStartPlan(itineraryData)}>Start Plan</Button>
        <Button variant="outline" className="flex-grow h-14 font-bold text-lg shadow-2xl bg-card" onClick={onShuffle}>Shuffle</Button>
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


export function MapMyDay() {
    const [isPending, startTransition] = useTransition();
    const [view, setView] = useState<'selection' | 'itinerary'>('selection');
    const [itinerary, setItinerary] = useState<Itinerary | null>(null);
    const [currentVibe, setCurrentVibe] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isConfirmationOpen, setConfirmationOpen] = useState(false);

    const handleSelectVibe = (option) => {
        setError(null);
        setItinerary(null);
        setCurrentVibe(option);

        startTransition(async () => {
            const response = await generateItinerary(option.request);
             if (response.error) {
                setError(response.error);
            } else if (response.success) {
                setItinerary({...response.success, stops: response.success.stops.map(s => ({...s, isHeld: false}))});
            }
            setView('itinerary');
        });
    };

    const handleBackToSelection = () => {
        setView('selection');
        setItinerary(null);
        setCurrentVibe(null);
    };

    const handleToggleHold = (stopToToggle: ItineraryStop) => {
        if (!itinerary) return;
        const newStops = itinerary.stops.map(stop => 
            stop.location === stopToToggle.location 
                ? { ...stop, isHeld: !stop.isHeld } 
                : stop
        );
        setItinerary({ ...itinerary, stops: newStops });
    };

    const handleSwap = (originalStop: ItineraryStop, newVenue: any) => {
        if (!itinerary) return;
        const newStops = itinerary.stops.map(stop =>
            stop.location === originalStop.location
                ? { ...stop, title: newVenue.name, location: newVenue.name, description: newVenue.description }
                : stop
        );
        setItinerary({ ...itinerary, stops: newStops });
    };

    const handleShuffle = () => {
        if (!currentVibe || !itinerary) return;

        startTransition(async () => {
            const heldStops = itinerary.stops.filter(stop => stop.isHeld);
            const numberOfNewStops = itinerary.stops.length - heldStops.length;

            if (numberOfNewStops === 0) {
                // All stops are held, so no need to call the AI
                return;
            }

            const request: ItineraryRequest = {
                ...currentVibe.request,
                vibe: currentVibe.title, // Use the original vibe title for context
                heldStops: heldStops,
                numberOfNewStops: numberOfNewStops,
            };

            const response = await generateItinerary(request);
            if (response.success) {
                // The AI now returns the full itinerary with held stops included
                setItinerary({...response.success, stops: response.success.stops.map(s => ({...s, isHeld: !!s.isHeld}))});
            } else {
                setError("Sorry, I couldn't shuffle the itinerary right now.");
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

    return (
        <Card className="w-full flex flex-col min-h-[40rem] overflow-hidden bg-transparent border-none shadow-none relative">
            <AnimatePresence mode="wait">
                {isPending ? (
                    <motion.div
                        key="loader"
                        className="absolute inset-0 flex items-center justify-center bg-background/80 z-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                       <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </motion.div>
                ) : error ? (
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
                                handleShuffle(); // Retry shuffle
                            } else {
                                handleBackToSelection();
                            }
                        }}>Try again</Button>
                    </motion.div>
                ) : null}
                
                {view === 'selection' ? (
                    <EventAndItinerarySelectionPage
                        onSelectVibe={handleSelectVibe}
                    />
                ) : (
                    itinerary && <MapMyDayItineraryPage
                        itineraryData={{...itinerary, description: currentVibe?.description, title: currentVibe?.title}}
                        onStartPlan={handleStartPlan}
                        onBack={handleBackToSelection}
                        onShuffle={handleShuffle}
                        onToggleHold={handleToggleHold}
                        onSwap={handleSwap}
                    />
                )}
            </AnimatePresence>

            <Dialog open={isConfirmationOpen} onOpenChange={setConfirmationOpen}>
                <DialogContent>
                    <DialogHeader className="items-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                        </div>
                        <DialogTitle>Itinerary Confirmed!</DialogTitle>
                        <DialogDescription className="text-center">
                            {getConfirmationMessage()}
                        </DialogDescription>
                    </DialogHeader>
                    {itinerary && (
                         <div className="space-y-4 py-4">
                            {itinerary.stops.map((stop, index) => (
                                <div key={index} className="flex items-center gap-4">
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
