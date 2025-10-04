
"use client";

import { useState, useTransition, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, CheckCircle2, Sparkles, X, Search, Pin } from "lucide-react";
import { generateItinerary } from '@/app/actions';
import { Itinerary, ItineraryRequest, ItineraryStop } from '@/ai/schemas';
import { AnimatePresence, motion } from "framer-motion";
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '../ui/input';


const appData = {
  mapMyDayOptions: [
    { id: "tinder-date", title: "Tinder Date", description: "Casual cocktails to break the ice.", request: { vibe: "Tinder Date - Bondi", pace: 2, budget: 3, travelMode: 'walk' } },
    { id: "date-night", title: "Date Night", description: "Cliff-top glow & photo spots.", request: { vibe: "Date Night - Bondi", pace: 3, budget: 4, travelMode: 'rideshare' } },
    { id: "wellness-saturday", title: "Wellness Saturday", description: "Stretch with an ocean view.", request: { vibe: "Wellness Saturday", pace: 2, budget: 2, travelMode: 'walk' } },
    { id: "girls-night-out", title: "Girls' Night Out", description: "Margaritas & shared tapas.", request: { vibe: "Girls' Night Out - Bondi", pace: 4, budget: 3, travelMode: 'rideshare' } }
  ],
  groupEventsOptions: [
    { id: "corporate-event", title: "Corporate Event", description: "Team building with a Bondi twist.", request: { vibe: "Corporate Event - Bondi" } },
    { id: "birthday-bash", title: "Birthday Bash", description: "Celebrate with sun, surf, and good times.", request: { vibe: "Birthday Bash - Bondi" } },
  ],
  map: {
    pins: [
        { name: "Icebergs Dining Room", description: "Iconic ocean views and fine dining.", type: "Restaurants" },
        { name: "Hotel Ravesis", description: "Stylish beachfront bar and restaurant.", type: "Nightlife" },
        { name: "The Depot", description: "Popular spot for brunch and coffee.", type: "Brunch" },
        { name: "Raw Bar", description: "Authentic Japanese sushi and sashimi.", type: "Sushi" },
        { name: "Speedo's Cafe", description: "Insta-famous colorful brunch dishes.", type: "Brunch" },
        { name: "Totti's", description: "Vibrant Italian restaurant with a leafy courtyard.", type: "Restaurants" },
        { name: "The Corner House", description: "Cozy bar with a great cocktail list.", type: "Cocktails" },
        { name: "Harry's Bondi", description: "Classic brunch fare with a modern twist.", type: "Brunch" },
        { name: "LULU", description: "Modern Pan-Asian cuisine in a chic setting.", type: "Restaurants" },
        { name: "RND Izakaya", description: "Japanese pub food and creative cocktails.", type: "Sushi" },
        { name: "Luca and Luca", description: "Artisanal gelato with unique flavors.", type: "Brunch" },
        { name: "Volume One", description: "Hidden gem for craft cocktails.", type: "Cocktails" },
        { name: "Bills", description: "Famous for ricotta hotcakes and scrambled eggs.", type: "Brunch" },
        { name: "Sean's", description: "Farm-to-table dining with ocean views.", type: "Restaurants" },
        { name: "La Piadina", description: "Authentic Italian flatbread sandwiches.", type: "Restaurants" },
        { name: "The Bucket List", description: "Casual beachside bar with a lively atmosphere.", type: "Nightlife" },
        { name: "Porch and Parlour", description: "Bohemian-style cafe with healthy options.", type: "Brunch" },
        { name: "Anatomy", description: "Boutique fitness studio offering various classes.", type: "Health & Fitness" },
        { name: "Acai Brothers", description: "Superfood bar specializing in acai bowls.", type: "Health & Fitness" }
    ]
  }
};


const EventAndItinerarySelectionPage = ({ onSelectVibe, onSelectEvent }) => {
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
                    <Button onClick={() => onSelectVibe(option.request)} className="w-full font-bold shadow-lg">View Itinerary</Button>
                </CardContent>
            </Card>
        ))) : (appData.groupEventsOptions.map(option => (
            <Card key={option.id} className="rounded-2xl p-6 shadow-xl flex flex-col items-center justify-between text-center">
                <CardHeader className="p-0">
                    <CardTitle className="text-lg font-bold">{option.title}</CardTitle>
                    <CardDescription className="text-sm mt-1">{option.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-0 mt-4 w-full">
                     <Button onClick={() => onSelectVibe(option.request)} className="w-full font-bold shadow-lg">View Itinerary</Button>
                </CardContent>
            </Card>
        )))}
      </div>
    </motion.div>
  );
};

const MapMyDayItineraryPage = ({ itineraryData, onStartPlan, onBack, onShuffle }) => {
  const [shuffledItinerary, setShuffledItinerary] = useState<ItineraryStop[]>([]);
  const [heldStops, setHeldStops] = useState<Record<string, boolean>>({});
  const [editingItem, setEditingItem] = useState<ItineraryStop | null>(null);
  const [swapQuery, setSwapQuery] = useState('');
  
  useEffect(() => { 
    if (itineraryData?.stops) {
      setShuffledItinerary([...itineraryData.stops]); 
      setHeldStops({}); 
    }
  }, [itineraryData]);

  if (!itineraryData) {
    return null; // Don't render anything if there's no itinerary data
  }

  const handleToggleHold = (stop: ItineraryStop) => {
    setHeldStops(prev => ({ ...prev, [stop.title]: !prev[stop.title] }));
  };
  
  const handleSwap = (originalItem, newItem) => {
    const newItinerary = shuffledItinerary.map(item => (item.title === originalItem.title && item.location === originalItem.location) ? { ...item, location: newItem.name, description: newItem.description } : item);
    setShuffledItinerary(newItinerary);
    setEditingItem(null);
    setSwapQuery('');
  };

  const getItemType = (item) => {
    const title = item.title.toLowerCase();
    if (title.includes('cocktail') || title.includes('bar')) return 'Cocktails';
    if (title.includes('sushi')) return 'Sushi';
    if (title.includes('brunch') || title.includes('cafe')) return 'Brunch';
    return 'Restaurants';
  }

  const filteredSwapOptions = editingItem ? appData.map.pins.filter(pin => pin.type === getItemType(editingItem) && pin.name.toLowerCase().includes(swapQuery.toLowerCase())).map(pin => ({ name: pin.name, description: pin.description })) : [];

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
        <h2 className="text-2xl font-bold text-foreground text-center flex-grow">{itineraryData.title}</h2>
        <div className="w-10"></div>
      </div>
      <p className="text-muted-foreground text-sm mb-6 text-center">Your curated plan. Hold your favorites, shuffle the rest!</p>
      
      <div className="flex-grow space-y-4">
        {shuffledItinerary.map((stop, index) => {
            const isHeld = !!heldStops[stop.title];
            return (
            <Card key={`${stop.title}-${index}`} className={`rounded-2xl p-4 shadow-xl flex items-center transition-all duration-300 ${isHeld ? 'border-2 border-primary' : 'border'}`}>
                <Button onClick={() => handleToggleHold(stop)} variant="ghost" size="icon" className="flex-shrink-0 mr-4">
                  <Pin size={24} className={isHeld ? 'text-primary fill-primary' : 'text-muted-foreground'} />
                </Button>
                <div className="w-16 h-16 bg-secondary rounded-xl overflow-hidden flex-shrink-0">
                    <Image src={`https://picsum.photos/seed/${stop.location.replace(/\s+/g, '-')}/64/64`} alt={stop.location} width={64} height={64} className="w-full h-full object-cover" />
                </div>
                <div className="ml-4 flex-grow">
                    <p className="font-semibold text-foreground">{stop.time} - {stop.location}</p>
                    <p className="text-sm text-muted-foreground">{stop.description}</p>
                </div>
                <Button onClick={() => setEditingItem(stop)} variant="ghost" size="icon" className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0 ml-4"><Sparkles size={24} /></Button>
            </Card>);
        })}
      </div>

      <div className="mt-auto flex space-x-4 pt-4 sticky bottom-6">
        <Button className="flex-grow h-14 font-bold text-lg shadow-2xl" onClick={() => onStartPlan(itineraryData)}>Start Plan</Button>
        <Button variant="secondary" className="flex-grow h-14 font-bold text-lg shadow-2xl border" onClick={onShuffle}>Shuffle</Button>
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
                <button key={index} onClick={() => handleSwap(editingItem, item)} className="w-full flex items-center bg-secondary rounded-xl p-3 shadow-lg transition-transform duration-100 hover:scale-[1.02] active:scale-[0.98]">
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
    const [currentVibe, setCurrentVibe] = useState<ItineraryRequest | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isConfirmationOpen, setConfirmationOpen] = useState(false);

    const handleSelectVibe = (request: ItineraryRequest) => {
        setError(null);
        setItinerary(null);
        setCurrentVibe(request);
        startTransition(async () => {
          const response = await generateItinerary(request);
          if (response.error) {
            setError(response.error);
            // Optional: Show error toast
          } else if (response.success) {
            setItinerary(response.success);
            setView('itinerary');
          }
        });
    };

    const handleBackToSelection = () => {
        setView('selection');
        setItinerary(null);
        setCurrentVibe(null);
    };

    const handleShuffle = () => {
        if (!currentVibe) return;
         startTransition(async () => {
          // Future: Implement shuffle with held items
          const response = await generateItinerary(currentVibe);
          if (response.error) {
            setError(response.error);
          } else if (response.success) {
            setItinerary(response.success);
          }
        });
    }

    const handleStartPlan = (finalItinerary: Itinerary) => {
        setItinerary(finalItinerary);
        setConfirmationOpen(true);
    }
    
    const getConfirmationMessage = () => {
        if (!itinerary || !itinerary.stops || itinerary.stops.length === 0) return "";
        const stopNames = itinerary.stops.map(s => s.location).slice(0, 2);
        const lastStop = itinerary.stops[itinerary.stops.length - 1].location;
        let message = `All good, you're booked in for a cheeky cocktail at ${stopNames[0]}`;
        if (stopNames.length > 1) {
            message += `, then jump over to ${stopNames[1]} for some delicious food.`
        }
        message += ` Finish the night at ${lastStop} with some wicked cocktails. You've Got This!`
        return message;
    }

    return (
        <Card className="w-full flex flex-col min-h-[40rem] overflow-hidden bg-background border-none shadow-none relative">
            <AnimatePresence mode="wait">
                {isPending && (
                    <motion.div
                        key="loader"
                        className="absolute inset-0 flex items-center justify-center bg-background/80 z-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                       <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </motion.div>
                )}
                
                {view === 'selection' && (
                    <EventAndItinerarySelectionPage
                        onSelectVibe={handleSelectVibe}
                        onSelectEvent={() => {}} 
                    />
                )}
                
                {view === 'itinerary' && itinerary && (
                    <MapMyDayItineraryPage
                        itineraryData={itinerary}
                        onStartPlan={handleStartPlan}
                        onBack={handleBackToSelection}
                        onShuffle={handleShuffle}
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
