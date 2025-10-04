"use client";

import { useState, useTransition, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, CheckCircle2, Sparkles, X, Search } from "lucide-react";
import { generateItinerary } from '@/app/actions';
import { Itinerary, ItineraryRequest, ItineraryStop } from '@/ai/schemas';
import { AnimatePresence, motion } from "framer-motion";
import Image from 'next/image';

// Placeholder data structure similar to what the user code expects
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
    pins: [ // This is a simplified placeholder for swap functionality
        { name: "Icebergs Dining Room", description: "Iconic ocean views and fine dining.", type: "Restaurants" },
        { name: "Hotel Ravesis", description: "Stylish beachfront bar and restaurant.", type: "Nightlife" },
        { name: "The Depot", description: "Popular spot for brunch and coffee.", type: "Brunch" },
        { name: "Raw Bar", description: "Authentic Japanese sushi and sashimi.", type: "Sushi" },
        { name: "Speedo's Cafe", description: "Insta-famous colorful brunch dishes.", type: "Brunch" },
        { name: "Totti's", description: "Vibrant Italian restaurant with a leafy courtyard.", type: "Restaurants" },
        { name: "The Corner House", description: "Cozy bar with a great cocktail list.", type: "Cocktails" },
    ]
  }
};

const EventAndItinerarySelectionPage = ({ onSelectVibe, onBack }) => {
  const [activeTab, setActiveTab] = useState('solo');
  return (
    <motion.div
      key="selector"
      initial={{ opacity: 0, x: -300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full bg-[var(--bg-primary)] overflow-y-auto p-6 text-center"
    >
      <div className="flex items-center justify-between mb-6">
        {/* onBack is not used here as it's the main page, but kept for consistency */}
        <div className="w-6"></div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] flex-grow text-center">Plan My Day or Event</h2>
        <div className="w-6"></div>
      </div>
      <div className="flex justify-center mb-6 w-full max-w-sm bg-[var(--bg-secondary)] rounded-full p-2 shadow-inner mx-auto">
        <button className={`flex-1 px-4 py-2 rounded-full font-semibold transition-colors ${activeTab === 'solo' ? 'bg-[var(--accent-primary)] text-white' : 'text-[var(--text-secondary)]'}`} onClick={() => setActiveTab('solo')}>Solo Itinerary</button>
        <button className={`flex-1 px-4 py-2 rounded-full font-semibold transition-colors ${activeTab === 'group' ? 'bg-[var(--accent-primary)] text-white' : 'text-[var(--text-secondary)]'}`} onClick={() => setActiveTab('group')}>Plan an Event</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeTab === 'solo' ? (appData.mapMyDayOptions.map(option => (<div key={option.id} className="bg-[var(--bg-secondary)] rounded-2xl p-6 shadow-xl flex flex-col items-center justify-between"><div className="text-center"><h3 className="text-lg font-bold text-[var(--text-primary)]">{option.title}</h3><p className="text-sm text-[var(--text-secondary)] mt-1">{option.description}</p></div><button onClick={() => onSelectVibe(option.request)} className="mt-4 w-full px-4 py-2 bg-[var(--accent-primary)] text-white rounded-full font-bold shadow-lg transform active:scale-95 transition-transform">View Itinerary</button></div>))) : (appData.groupEventsOptions.map(option => (<div key={option.id} className="bg-[var(--bg-secondary)] rounded-2xl p-6 shadow-xl flex flex-col items-center justify-between"><div className="text-center"><h3 className="text-lg font-bold text-[var(--text-primary)]">{option.title}</h3><p className="text-sm text-[var(--text-secondary)] mt-1">{option.description}</p></div><button onClick={() => onSelectVibe(option.request)} className="mt-4 w-full px-4 py-2 bg-[var(--accent-primary)] text-white rounded-full font-bold shadow-lg transform active:scale-95 transition-transform">View Itinerary</button></div>)))}
      </div>
    </motion.div>
  );
};

const MapMyDayItineraryPage = ({ itineraryData, onStartPlan, onBack, onShuffle }) => {
  const [shuffledItinerary, setShuffledItinerary] = useState([]);
  const [definiteItems, setDefiniteItems] = useState({});
  const [editingItem, setEditingItem] = useState(null);
  const [swapQuery, setSwapQuery] = useState('');
  
  useEffect(() => { 
    if (itineraryData?.stops) {
      setShuffledItinerary([...itineraryData.stops]); 
      setDefiniteItems({}); 
    }
  }, [itineraryData]);

  if (!itineraryData) {
    return null; // Don't render anything if there's no itinerary data
  }

  const handleToggleDefinite = (item) => { setDefiniteItems(prev => ({ ...prev, [item.title]: !prev[item.title] })); };
  
  const handleSwap = (originalItem, newItem) => {
    const newItinerary = shuffledItinerary.map(item => (item.title === originalItem.title && item.location === originalItem.location) ? { ...item, location: newItem.name, description: newItem.notes } : item);
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

  const filteredSwapOptions = editingItem ? appData.map.pins.filter(pin => pin.type === getItemType(editingItem) && pin.name.toLowerCase().includes(swapQuery.toLowerCase())).map(pin => ({ name: pin.name, notes: pin.description })) : [];

  return (
    <motion.div
        key="builder"
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col h-full bg-[var(--bg-primary)] overflow-y-auto p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors"><ArrowLeft size={24} /></button>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] text-center flex-grow">{itineraryData.title}</h2>
        <div className="w-6"></div>
      </div>
      <p className="text-[var(--text-secondary)] text-sm mb-6 text-center">{itineraryData.description || 'Here is your generated plan.'}</p>
      
      <div className="flex-grow">
        {shuffledItinerary.map((item) => {
            const isDefinite = definiteItems[item.title];
            return (
            <div key={`${item.title}-${item.location}`} className={`bg-[var(--bg-secondary)] rounded-2xl p-4 mb-4 shadow-xl flex items-center transition-all duration-300 ${isDefinite ? 'border-2 border-emerald-400' : ''}`}>
                <button onClick={() => handleToggleDefinite(item)} className="flex-shrink-0 mr-4"><CheckCircle2 size={24} className={isDefinite ? 'text-emerald-400' : 'text-gray-600'} /></button>
                <div className="w-16 h-16 bg-gray-700 rounded-xl overflow-hidden flex-shrink-0">
                    <Image src={`https://picsum.photos/seed/${item.location.replace(/\s+/g, '-')}/64/64`} alt="Venue" width={64} height={64} className="w-full h-full object-cover" />
                </div>
                <div className="ml-4 flex-grow">
                    <p className="text-lg font-semibold text-[var(--text-primary)]">{item.location}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{item.description}</p>
                </div>
                <button onClick={() => setEditingItem(item)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex-shrink-0 ml-4"><Sparkles size={24} /></button>
            </div>);
        })}
      </div>

      <div className="mt-auto flex space-x-4 pt-4">
        <button className="flex-grow px-8 py-4 bg-[var(--accent-primary)] text-white rounded-full font-bold text-lg shadow-2xl transform active:scale-95 transition-transform" onClick={() => onStartPlan(itineraryData)}>Start Plan</button>
        <button className="flex-grow px-8 py-4 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-full font-bold text-lg shadow-2xl transform active:scale-95 transition-transform border-2 border-[var(--border-color)]" onClick={onShuffle}>Shuffle</button>
      </div>

      {editingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
            <div className="relative bg-[var(--bg-secondary)] rounded-3xl shadow-2xl p-8 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-[var(--text-primary)]">Swap {editingItem.location}</h3>
                    <button onClick={() => setEditingItem(null)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"><X size={24} /></button>
                </div>
                <p className="text-[var(--text-secondary)] text-sm mb-4">Find an alternative for your itinerary.</p>
                <div className="relative mb-4">
                    <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                    <input type="text" value={swapQuery} onChange={(e) => setSwapQuery(e.target.value)} placeholder={`Search ${getItemType(editingItem)} venues...`} className="w-full pl-10 pr-4 py-3 bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-full border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] placeholder-[var(--text-secondary)]" />
                </div>
                <div className="space-y-4 max-h-64 overflow-y-auto scrollbar-hide">
                    {filteredSwapOptions.map((item, index) => (
                    <button key={index} onClick={() => handleSwap(editingItem, item)} className="w-full flex items-center bg-[var(--bg-primary)] rounded-xl p-3 shadow-lg transition-transform duration-100 hover:scale-[1.02] active:scale-[0.98]">
                        <div className="w-16 h-16 bg-gray-700 rounded-xl overflow-hidden flex-shrink-0">
                          <Image src={`https://picsum.photos/seed/${item.name.replace(/\s+/g, '-')}/64/64`} alt="Venue" width={64} height={64} className="w-full h-full object-cover" />
                        </div>
                        <div className="ml-4 text-left">
                            <p className="text-[var(--text-primary)] font-semibold">{item.name}</p>
                            <p className="text-sm text-[var(--text-secondary)]">{item.notes}</p>
                        </div>
                    </button>
                    ))}
                </div>
            </div>
        </div>
      )}
    </motion.div>
  );
};


export function MapMyDay() {
    const [isPending, startTransition] = useTransition();
    const [currentView, setCurrentView] = useState('selection'); // 'selection' or 'itinerary'
    const [itinerary, setItinerary] = useState<Itinerary | null>(null);
    const [currentVibe, setCurrentVibe] = useState<ItineraryRequest | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSelectVibe = (request: ItineraryRequest) => {
        setError(null);
        setItinerary(null);
        setCurrentVibe(request);
        startTransition(async () => {
          const response = await generateItinerary(request);
          if (response.error) {
            setError(response.error);
            // Handle error display, maybe switch back to selection view with an error message
          } else if (response.success) {
            setItinerary(response.success);
            setCurrentView('itinerary');
          }
        });
    };

    const handleBackToSelection = () => {
        setCurrentView('selection');
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

    const handleStartPlan = (finalItinerary) => {
        // For now, just log it. Later this will trigger a confirmation modal.
        console.log("Starting plan:", finalItinerary);
        alert("Plan started! (Check console for details)");
    }

    return (
        <Card className="w-full flex flex-col min-h-[40rem] overflow-hidden bg-transparent border-none shadow-none">
            <AnimatePresence mode="wait">
                {isPending && (
                    <motion.div
                        key="loader"
                        className="absolute inset-0 flex items-center justify-center bg-black/50 z-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                       <Loader2 className="h-10 w-10 animate-spin text-white" />
                    </motion.div>
                )}

                {currentView === 'selection' && (
                    <EventAndItinerarySelectionPage
                        onSelectVibe={handleSelectVibe}
                        onBack={() => {}} // No back action on the main screen
                    />
                )}
                
                {currentView === 'itinerary' && itinerary && (
                    <MapMyDayItineraryPage
                        itineraryData={itinerary}
                        onStartPlan={handleStartPlan}
                        onBack={handleBackToSelection}
                        onShuffle={handleShuffle}
                    />
                )}
            </AnimatePresence>
        </Card>
    );
}
