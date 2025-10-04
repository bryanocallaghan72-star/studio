

"use client";

import { useState, useTransition, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, CheckCircle2, Sparkles, X, Search, Wand2, ThumbsUp, RefreshCw, Pin } from "lucide-react";
import { generateItinerary } from '@/app/actions';
import { Itinerary, ItineraryRequest, ItineraryStop } from '@/ai/schemas';
import { AnimatePresence, motion } from "framer-motion";
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '../ui/input';


const appData = {
  mapMyDayOptions: [
    {
      id: 'mmd1',
      title: 'Tinder Date - Bondi',
      description: 'Casual cocktails to break the ice',
      request: { vibe: "Tinder Date - Bondi", pace: 2, budget: 3, travelMode: 'walk' },
      stops: [
        { time: '18:30', location: 'The Rum Diary Bar', description: 'Booked in for a cheeky cocktail.' },
        { time: '19:30', location: 'Totti\'s', description: 'Reservation for dinner and some delicious Italian food.' },
        { time: '21:00', location: 'Bondi Icebergs', description: 'Finish the night with some wicked cocktails.' }
      ],
      curatedMessage: 'All good, you\'re booked in for a cheeky cocktail at The Rum Diary Bar, then jump over to Totti\'s for some delicious Italian food. Finish the night at Icebergs with some wicked cocktails. You\'ve Got This!'
    },
    {
      id: 'mmd2',
      title: 'Single & Ready to Mingle - Bondi',
      description: 'Easy icebreakers over small plates',
      request: { vibe: "Single & Ready to Mingle - Bondi", pace: 3, budget: 3, travelMode: 'walk' },
      stops: [
        { time: '18:30', location: 'LULU', description: 'Trivia & tapas at the local.' },
        { time: '20:00', location: 'Hotel Ravesis', description: 'Rooftop cocktails - mingle hour.' },
        { time: '22:00', location: 'The Bucket List', description: 'Dancing & good energy!' }
      ],
      curatedMessage: 'Get ready to mingle! You\'re all set for trivia and tapas at Lulu, then hit the rooftop at Ravesis for some cocktails. Finish the night dancing at The Bucket List. Have fun!'
    },
    {
      id: 'mmd3',
      title: 'Wellness Saturday - Bondi',
      description: 'Stretch with an an ocean view',
      request: { vibe: "Wellness Saturday - Bondi", pace: 2, budget: 2, travelMode: 'walk' },
      stops: [
        { time: '08:00', location: 'Anatomy', description: 'Sunrise yoga at the Pavilion.' },
        { time: '09:30', location: 'Harry\'s Bondi', description: 'Acai bowl & green juice.' },
        { time: '11:00', location: 'Bondi Icebergs', description: 'Cold plunge & reset.' }
      ],
      curatedMessage: 'Your wellness day is all planned! Start with sunrise yoga at Anatomy, grab a healthy bite at Harry\'s, then finish with a refreshing cold plunge at Icebergs. A perfect reset!'
    },
    {
      id: 'mmd4',
      title: 'Date Night - Bondi',
      description: 'Cliffop glow & photo spots',
      request: { vibe: "Date Night - Bondi", pace: 3, budget: 4, travelMode: 'rideshare' },
      stops: [
        { time: '18:00', location: 'Totti\'s', description: 'Reservation for an amazing meal.' },
        { time: '19:30', location: 'Hotel Ravesis', description: 'Rooftop drinks with an ocean view.' },
        { time: '21:00', location: 'Bondi Icebergs', description: 'Sunset walk and cocktails at the pool.' }
      ],
      curatedMessage: 'All good, you\'re booked in for a cheeky cocktail at The Rum Diary Bar, then jump over to Totti\'s for some delicious Italian food. Finish the night at Icebergs with some wicked cocktails. You\'ve Got This!'
    },
    {
      id: 'mmd5',
      title: 'Girls\' Night Out - Bondi',
      description: 'Margaritas & shared tapas',
      request: { vibe: "Girls' Night Out - Bondi", pace: 4, budget: 3, travelMode: 'rideshare' },
      stops: [
        { time: '18:00', location: 'LULU', description: 'Margaritas and shared tapas.' },
        { time: '20:00', location: 'Hotel Ravesis', description: 'Skyline cocktails on the rooftop.' },
        { time: '22:00', location: 'The Bucket List', description: 'Dancing & good energy.' }
      ],
      curatedMessage: 'Your girls\' night out is all set! Start with margaritas at LULU, then hit the rooftop at Ravesis for cocktails. Finish the night dancing at The Bucket List. Have a blast!'
    },
    {
      id: 'mmd6',
      title: 'Ladies\' Lunch - Bondi',
      description: 'Window shop & try-ons',
      request: { vibe: "Ladies' Lunch - Bondi", pace: 2, budget: 4, travelMode: 'walk' },
      stops: [
        { time: '12:00', location: 'Raw Bar', description: 'Ricotta hotcakes & spritz.' },
        { time: '13:30', location: 'Totti\'s', description: 'Window shopping & try-ons.' },
        { time: '15:00', location: 'RND Izakaya', description: 'Champagne & oysters.' }
      ],
      curatedMessage: 'Lunch plans are sorted! You\'re all set for ricotta hotcakes and spritz at Raw Bar, then head over to Totti\'s for a window shop. Finish your afternoon with champagne and oysters at RND Izakaya. Enjoy!'
    },
    {
      id: 'mmd7',
      title: 'Quick Bondi Lunch',
      description: 'Grab a healthy and delicious bite on your break.',
      request: { vibe: "Quick Bondi Lunch - Bondi", pace: 1, budget: 2, travelMode: 'walk' },
      stops: [
        { time: '13:30', location: 'Raw Bar', description: 'Healthy and fresh lunch.' },
        { time: '14:30', location: 'La Piadina', description: 'A quick taco.' }
      ],
      curatedMessage: 'Your quick lunch is sorted! Head to Raw Bar for a fresh meal, or grab a quick taco at La Piadina. Enjoy!'
    }
  ],
  groupEventsOptions: [
    {
      id: 'ge1',
      title: 'Birthday Brunch',
      description: 'A boozy brunch for big groups. ~20 pax',
      request: { vibe: "Birthday Brunch - Bondi" },
      stops: [
        { time: '11:00', location: 'Harry\'s Bondi', description: 'Ricotta hotcakes for everyone.' },
        { time: '13:00', location: 'The Rum Diary Bar', description: 'Cocktail masterclass for the crew.' },
        { time: '15:00', location: 'Hotel Ravesis', description: 'Rooftop drinks to finish the day.' }
      ],
      curatedMessage: 'Your birthday brunch is set! Start with hotcakes at Harry\'s, then a cocktail masterclass at The Rum Diary Bar, and finish with rooftop drinks at Ravesis. Happy birthday!'
    },
    {
      id: 'ge2',
      title: 'Staff Party',
      description: 'Team building and celebrations. ~30 pax, $2500 budget.',
      request: { vibe: "Staff Party - Bondi" },
      stops: [
        { time: '18:00', location: 'Totti\'s', description: 'Dinner reservation for the whole team.' },
        { time: '20:30', location: 'The Bucket List', description: 'Live music and great vibes.' },
        { time: '22:00', location: 'The Corner House', description: 'Nightcap on the beach.' }
      ],
      curatedMessage: 'Your staff party is on! Start with an elegant dinner at Totti\'s, then head to The Bucket List for some live music, and finish the night with a nightcap at The Corner House. Time to celebrate!'
    },
    {
      id: 'ge3',
      title: 'Baby Shower',
      description: 'Bites and mocktails by the beach.',
      request: { vibe: "Baby Shower - Bondi" },
      stops: [
        { time: '12:00', location: 'Bills', description: 'Light lunch with a stunning view.' },
        { time: '14:00', location: 'Speedo\'s Cafe', description: 'Coffee and cake to celebrate.' },
        { time: '16:00', location: 'Bondi Icebergs', description: 'Photo op by the pool.' }
      ],
      curatedMessage: 'Your baby shower is all set! Start with a light lunch at Bills, then coffee and cake at Speedo\'s Cafe, and finish with a photo op at Bondi Icebergs. Congratulations!'
    },
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
        { name: "Acai Brothers", description: "Superfood bar specializing in acai bowls.", type: "Health & Fitness" },
        { name: "Bondi Trattoria", description: "Classic Italian dishes with a sea view.", type: "Restaurants" },
        { name: "El Indio", description: "Authentic Mexican street food.", type: "Restaurants" },
        { name: "The Rum Diary Bar", description: "Caribbean-themed bar with a wide rum selection.", type: "Cocktails" },
        { name: "The Shop & Wine Bar", description: "Cozy wine bar with a curated selection.", type: "Cocktails" },
        { name: "Upstairs at The Beresford", description: "Rooftop bar with city views and cocktails.", type: "Cocktails" },
        { name: "Fishbowl", description: "Healthy and delicious poke bowls.", type: "Sushi" },
        { name: "Ora", description: "Organic and healthy cafe with vegan options.", type: "Brunch" },
        { name: "Brown Sugar", description: "Modern Australian cuisine with a focus on local produce.", type: "Brunch" },
        { name: "Fika Swedish Kitchen", description: "Cozy cafe with Swedish pastries and coffee.", type: "Brunch" },
        { name: "The Nine", description: "Bright and airy cafe with a Mediterranean-inspired menu.", type: "Brunch" }
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
    return null; 
  }

  const handleToggleHold = (stop: ItineraryStop) => {
    setHeldStops(prev => ({ ...prev, [stop.location]: !prev[stop.location] }));
  };
  
  const handleSwap = (originalItem, newItem) => {
    const newItinerary = shuffledItinerary.map(item => (item.location === originalItem.location) ? { ...item, location: newItem.name, description: newItem.description } : item);
    setShuffledItinerary(newItinerary);
    setEditingItem(null);
    setSwapQuery('');
  };

  const getItemType = (item) => {
    const title = item.description.toLowerCase();
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
        <div className='text-center'>
            <h2 className="text-2xl font-bold text-foreground">{itineraryData.title}</h2>
            <p className="text-muted-foreground text-sm">{itineraryData.description}</p>
        </div>
        <div className="w-10"></div>
      </div>
      
      <div className="flex-grow space-y-4 pt-4">
        {shuffledItinerary.map((stop, index) => {
            const isHeld = !!heldStops[stop.location];
            return (
            <Card key={`${stop.location}-${index}`} className={`rounded-2xl p-4 shadow-lg flex items-center transition-all duration-300 bg-secondary/30 ${isHeld ? 'border-2 border-primary' : ''}`}>
                <Button onClick={() => handleToggleHold(stop)} variant="ghost" size="icon" className="flex-shrink-0 mr-4">
                  <Pin size={24} className={isHeld ? 'text-primary fill-primary' : 'text-muted-foreground'} />
                </Button>
                <div className="w-16 h-16 bg-primary/20 rounded-xl overflow-hidden flex-shrink-0">
                    <Image src={`https://picsum.photos/seed/${stop.location.replace(/\s+/g, '-')}/64/64`} alt={stop.location} width={64} height={64} className="w-full h-full object-cover" />
                </div>
                <div className="ml-4 flex-grow">
                    <p className="font-semibold text-foreground">{stop.location}</p>
                    <p className="text-sm text-muted-foreground">{stop.description}</p>
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
    const [currentVibe, setCurrentVibe] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isConfirmationOpen, setConfirmationOpen] = useState(false);

    const handleSelectVibe = (option) => {
        setError(null);
        const newItinerary: Itinerary = {
            title: option.title,
            stops: option.stops,
        };
        setItinerary(newItinerary);
        setCurrentVibe(option);
        setView('itinerary');
    };

    const handleBackToSelection = () => {
        setView('selection');
        setItinerary(null);
        setCurrentVibe(null);
    };

    const handleShuffle = () => {
        if (!currentVibe) return;

        const heldStops = itinerary?.stops.filter(stop => stop.isHeld) || [];
        const nonHeldStops = itinerary?.stops.filter(stop => !stop.isHeld) || [];
        
        // This is a placeholder for a real shuffle logic with alternatives.
        const shuffledNonHeld = [...nonHeldStops].sort(() => Math.random() - 0.5);

        const newItineraryStops = itinerary?.stops.map(stop => {
            if (stop.isHeld) return stop;
            return shuffledNonHeld.pop() || stop;
        }) || [];

        setItinerary({
            ...itinerary!,
            stops: newItineraryStops
        });
    }

    const handleStartPlan = (finalItinerary: Itinerary) => {
        setItinerary(finalItinerary);
        setConfirmationOpen(true);
    }
    
    const getConfirmationMessage = () => {
        if (!currentVibe) return "";
        return currentVibe.curatedMessage;
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
                
                {view === 'selection' ? (
                    <EventAndItinerarySelectionPage
                        onSelectVibe={handleSelectVibe}
                        onSelectEvent={handleSelectVibe} 
                    />
                ) : (
                    itinerary && <MapMyDayItineraryPage
                        itineraryData={{...itinerary, description: currentVibe?.description, title: currentVibe?.title}}
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

    