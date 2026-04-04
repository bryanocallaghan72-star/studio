'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { ArrowLeft, Loader2, Lock, LockOpen, Search, Shuffle, RefreshCw } from "lucide-react";
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
        if (!venue) return PlaceHolderImages[0];
        
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
            className="flex flex-col h-full bg-[#080a0d] overflow-y-auto p-6"
        >
            <div className="flex items-center justify-between mb-8">
                <Button onClick={onBack} variant="ghost" size="icon" className="text-[#f4f0e8] hover:bg-white/5"><ArrowLeft size={20} /></Button>
                <div className='text-center'>
                    <h2 className="text-xl font-bold text-[#f4f0e8]">{itineraryData.title}</h2>
                    <p className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">{itineraryData.description}</p>
                </div>
                <div className="w-10"></div>
            </div>

            <div className="flex-grow space-y-4">
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
                                <Card className={cn('rounded-2xl p-4 shadow-lg flex items-center transition-all duration-300 bg-[#0d1117]', stop.isHeld ? 'border-2' : 'border-white/[0.06]')} style={{ borderColor: stop.isHeld ? 'var(--phase-accent)' : undefined }}>
                                    <Button onClick={() => onToggleHold(stop)} variant="ghost" size="icon" className="flex-shrink-0 mr-4 group">
                                        <HoldIcon size={20} className={stop.isHeld ? '' : 'text-muted-foreground group-hover:opacity-100 transition-opacity'} style={{ color: stop.isHeld ? 'var(--phase-accent)' : undefined }} />
                                    </Button>
                                    <div className="w-14 h-14 bg-white/5 rounded-xl overflow-hidden flex-shrink-0 border border-white/5">
                                        <Image src={image.imageUrl} alt={stop.location} width={56} height={56} className="w-full h-full object-cover" data-ai-hint={image.imageHint} />
                                    </div>
                                    <div className="ml-4 flex-grow">
                                        <p className="text-[10px] font-bold tracking-wider uppercase" style={{ color: 'var(--phase-accent)' }}>{stop.time}</p>
                                        <p className="text-[15px] font-semibold text-[#f4f0e8] leading-tight mt-0.5">{stop.location}</p>
                                    </div>
                                    <Button onClick={() => setEditingItem(stop)} variant="ghost" size="icon" className="text-muted-foreground hover:bg-white/5 flex-shrink-0 ml-2"><RefreshCw size={16} /></Button>
                                </Card>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            <div className="mt-8 flex space-x-3 sticky bottom-0 bg-[#080a0d] py-4">
                <Button className="flex-grow h-12 btn-phase-cta" onClick={() => onStartPlan(itineraryData)}>Start Plan</Button>
                <Button variant="outline" className="flex-grow h-12 btn-phase-ghost" onClick={onShuffle} disabled={isPending}>
                    {isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Shuffle className="mr-2 h-4 w-4" />}
                    Shuffle
                </Button>
            </div>

            {editingItem && (
                <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
                    <DialogContent className="bg-card border-border rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-[#f4f0e8]">Swap Stop</DialogTitle>
                            <DialogDescription className="text-muted-foreground">Find an alternative for your itinerary.</DialogDescription>
                        </DialogHeader>
                        <div className="relative mb-4">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input type="text" value={swapQuery} onChange={(e) => setSwapQuery(e.target.value)} placeholder={`Search ${getItemType(editingItem)} venues...`} className="w-full pl-10 pr-4 py-2 bg-white/5 border-white/10 text-[#f4f0e8]" />
                        </div>
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                            {filteredSwapOptions.map((item, index) => (
                                <button key={index} onClick={() => handleSwapClick(editingItem, item)} className="w-full flex items-center bg-white/5 border border-white/5 rounded-xl p-3 transition-all hover:bg-white/10 hover:border-white/10">
                                    <div className="w-12 h-12 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                                        <Image src={PlaceHolderImages.find(p => p.id === 'sushi-1')!.imageUrl} alt={item.name} width={48} height={48} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="ml-4 text-left">
                                        <p className="text-[#f4f0e8] font-semibold text-sm">{item.name}</p>
                                        <p className="text-[11px] text-muted-foreground line-clamp-1">{item.description}</p>
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
