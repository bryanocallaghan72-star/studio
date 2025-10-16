
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { ArrowLeft, Loader2, Lock, LockOpen, Search, Shuffle } from "lucide-react";
import { ItineraryStop } from '@/ai/schemas';
import { appData } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';


type ItineraryPageProps = {
    itineraryData: any;
    onStartPlan: (data: any) => void;
    onBack: () => void;
    onShuffle: () => void;
    onToggleHold: (stop: ItineraryStop) => void;
    onSwap: (originalStop: ItineraryStop, newVenue: any) => void;
    isPending: boolean;
};

export const IykykMyDayItineraryPage = ({ itineraryData, onStartPlan, onBack, onShuffle, onToggleHold, onSwap, isPending }: ItineraryPageProps) => {
    const [editingItem, setEditingItem] = useState<ItineraryStop | null>(null);
    const [swapQuery, setSwapQuery] = useState('');

    if (!itineraryData) {
        return null;
    }

    const handleSwapClick = (originalItem: ItineraryStop, newItem: any) => {
        onSwap(originalItem, newItem);
        setEditingItem(null);
        setSwapQuery('');
    };

    const getItemType = (item: ItineraryStop) => {
        if (!item?.location) return 'Restaurants';
        const venue = appData.map.pins.find(p => p.name === item.location);
        return venue?.type || 'Restaurants';
    }
    
    const getImageForStop = (stop: ItineraryStop) => {
        const venue = appData.map.pins.find(v => v.name === stop.location);
        if (!venue) return PlaceHolderImages[0]; // fallback
        
        const typeToImage: { [key: string]: string } = {
            'Brunch': 'coffee-1',
            'Sushi': 'sushi-1',
            'Cocktails': 'cocktail-101',
            'Restaurants': 'my-day-3',
            'Nightlife': 'nightlife-1',
            'Health & Fitness': 'fitness-1',
            'Vibes': 'sunset-yoga',
        };
        const imageId = typeToImage[venue.type] || 'night-1';
        return PlaceHolderImages.find(img => img.id === imageId) || PlaceHolderImages[0];
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
                    {itineraryData.stops.map((stop: ItineraryStop) => {
                        const HoldIcon = stop.isHeld ? Lock : LockOpen;
                        const image = getImageForStop(stop);
                        return (
                            <motion.div
                                key={stop.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Card className={cn('rounded-2xl p-4 shadow-lg flex items-center transition-all duration-300 bg-card', stop.isHeld ? 'border-2 border-primary' : 'border-transparent')}>
                                    <Button onClick={() => onToggleHold(stop)} variant="ghost" size="icon" className="flex-shrink-0 mr-4 group">
                                        <HoldIcon size={24} className={stop.isHeld ? 'text-primary' : 'text-muted-foreground group-hover:text-primary transition-colors'} />
                                    </Button>
                                    <div className="w-16 h-16 bg-primary/20 rounded-xl overflow-hidden flex-shrink-0">
                                        <Image src={image.imageUrl} alt={stop.location} width={64} height={64} className="w-full h-full object-cover" data-ai-hint={image.imageHint} />
                                    </div>
                                    <div className="ml-4 flex-grow">
                                        <p className="font-semibold text-foreground">{stop.title}</p>
                                        <p className="text-sm text-muted-foreground">{stop.location}</p>
                                    </div>
                                    <Button onClick={() => setEditingItem(stop)} variant="ghost" size="icon" className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0 ml-4"><Shuffle size={24} /></Button>
                                </Card>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            <div className="mt-auto flex space-x-4 pt-4 sticky bottom-0 bg-background py-4">
                <Button className="flex-grow h-14 font-bold text-lg shadow-2xl" onClick={() => onStartPlan(itineraryData)}>Start Plan</Button>
                <Button variant="outline" className="flex-grow h-14 font-bold text-lg shadow-2xl bg-card" onClick={onShuffle} disabled={isPending}>
                    {isPending ? <Loader2 className="animate-spin mr-2" /> : 'Shuffle'}
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
                            {filteredSwapOptions.map((item, index) => {
                                const image = PlaceHolderImages.find(p => p.id === 'sushi-1')!;
                                return (
                                    <button key={index} onClick={() => handleSwapClick(editingItem, item)} className="w-full flex items-center bg-secondary rounded-xl p-3 shadow-lg transition-transform duration-100 hover:scale-[1.02] active:scale-[0.98]">
                                        <div className="w-16 h-16 bg-gray-700 rounded-xl overflow-hidden flex-shrink-0">
                                            <Image src={image.imageUrl} alt={item.name} width={64} height={64} className="w-full h-full object-cover" data-ai-hint={image.imageHint} />
                                        </div>
                                        <div className="ml-4 text-left">
                                            <p className="text-foreground font-semibold">{item.name}</p>
                                            <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </motion.div>
    );
};
