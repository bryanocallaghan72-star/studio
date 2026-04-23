'use client';

import { useState, useMemo } from 'react';
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
import { useVenues } from '@/hooks/useVenues';

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
    const { venues, isLoading: isVenuesLoading } = useVenues();

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
        
        // Check real Firestore venues first
        const realVenue = venues?.find(v => v.name === item.location || v.slug === item.location);
        if (realVenue) return realVenue.category || realVenue.details?.category || 'Restaurants';
        
        // Fallback to legacy appData pins mapping
        const pin = appData.map.pins.find(p => p.name === item.location);
        return pin?.type || 'Restaurants';
    }
    
    const getImageForStop = (stop: ItineraryStop) => {
        const venue = venues?.find(v => v.name === stop.location || v.slug === stop.location);
        
        // If venue has a photo, use it (handles proxy/direct)
        const photoRef = venue?.photos?.[0] || venue?.photoReference;
        if (photoRef) {
            return {
                imageUrl: photoRef.startsWith('http') 
                    ? photoRef 
                    : `/api/place-photo?ref=${encodeURIComponent(photoRef)}`,
                imageHint: 'venue'
            };
        }

        // Category-based fallback image
        const category = venue?.category || venue?.details?.category || getItemType(stop);
        const typeToImage: { [key: string]: string } = {
            'Brunch': 'coffee-1',
            'Sushi': 'sushi-1',
            'Cocktails': 'cocktail-101',
            'Restaurants': 'my-day-3',
            'Food': 'my-day-3',
            'Nightlife': 'nightlife-1',
            'Health & Fitness': 'fitness-1',
            'Vibes': 'sunset-yoga',
        };
        const imageId = typeToImage[category] || 'night-1';
        return PlaceHolderImages.find(img => img.id === imageId) || PlaceHolderImages[0];
    }

    const getVenueImageUrl = (venue: any) => {
        const photoRef = venue.photos?.[0] || venue.photoReference;
        if (photoRef) {
          return photoRef.startsWith('http') 
            ? photoRef 
            : `/api/place-photo?ref=${encodeURIComponent(photoRef)}`;
        }
        return PlaceHolderImages.find(p => p.id === 'sushi-1')!.imageUrl;
    };

    const filteredSwapOptions = useMemo(() => {
        if (!editingItem || !venues) return [];
        
        const currentCategory = getItemType(editingItem);
        const search = swapQuery.toLowerCase();
        
        // Primary search: matches category AND search term
        let filtered = venues.filter(v => {
            const vCategory = v.category || v.details?.category;
            const matchesCategory = vCategory === currentCategory;
            const matchesSearch = v.name.toLowerCase().includes(search);
            const isNotCurrent = v.name !== editingItem.location && v.slug !== editingItem.location;
            return matchesCategory && matchesSearch && isNotCurrent;
        });

        // Fallback: search across all categories if query is specific and no category matches
        if (filtered.length === 0 && search) {
             filtered = venues.filter(v => 
                v.name.toLowerCase().includes(search) && 
                v.name !== editingItem.location && 
                v.slug !== editingItem.location
             );
        } else if (filtered.length === 0 && !search) {
             // If no category matches and no search, just show a handful of venues
             filtered = venues.filter(v => v.name !== editingItem.location).slice(0, 10);
        }

        return filtered.slice(0, 15);
    }, [editingItem, venues, swapQuery]);

    return (
        <motion.div
            key="builder"
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full bg-[#f2ece0] overflow-y-auto p-6"
        >
            <div className="flex items-center justify-between mb-8">
                <Button onClick={onBack} variant="ghost" size="icon" className="text-[#1a1208] hover:bg-black/5"><ArrowLeft size={20} /></Button>
                <div className='text-center'>
                    <h2 className="text-xl font-bold text-[#1a1208]">{itineraryData.title}</h2>
                    <p className="text-[11px] font-bold tracking-wider uppercase text-[rgba(26,18,8,0.40)]">{itineraryData.description}</p>
                </div>
                <div className="w-10"></div>
            </div>

            <div className="flex-grow space-y-4 pb-40">
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
                                <Card className={cn('rounded-2xl p-4 border border-black/[0.08] shadow-sm flex items-center transition-all duration-300 bg-white', stop.isHeld ? 'ring-2 ring-[#c4762a] ring-offset-2' : '')}>
                                    <Button onClick={() => onToggleHold(stop)} variant="ghost" size="icon" className="flex-shrink-0 mr-4 group">
                                        <HoldIcon size={20} className={stop.isHeld ? 'text-[#c4762a]' : 'text-[rgba(26,18,8,0.30)] group-hover:text-[#c4762a] transition-colors'} />
                                    </Button>
                                    <div className="w-14 h-14 bg-black/[0.03] rounded-xl overflow-hidden flex-shrink-0 border border-black/[0.05] relative">
                                        <Image src={image.imageUrl} alt={stop.location} fill className="object-cover" data-ai-hint={image.imageHint} />
                                    </div>
                                    <div className="ml-4 flex-grow">
                                        <p className="text-[10px] font-black tracking-wider uppercase text-[#c4762a]">{stop.time}</p>
                                        <p className="text-[15px] font-bold text-[#1a1208] leading-tight mt-0.5">{stop.location}</p>
                                    </div>
                                    <Button onClick={() => setEditingItem(stop)} variant="ghost" size="icon" className="text-[rgba(26,18,8,0.35)] hover:bg-black/5 flex-shrink-0 ml-2"><RefreshCw size={16} /></Button>
                                </Card>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            <div className="mt-8 flex space-x-3 sticky bottom-[83px] bg-[#f2ece0] py-4 pb-[env(safe-area-inset-bottom)]">
                <Button 
                    className="flex-grow h-14 bg-[#c4762a] text-white hover:bg-[#b06824] rounded-2xl font-black shadow-lg shadow-[#c4762a]/20" 
                    onClick={() => onStartPlan(itineraryData)}
                >
                    Start Plan
                </Button>
                <Button 
                    variant="outline" 
                    className="flex-grow h-14 border-black/[0.08] bg-white text-[#1a1208] hover:bg-black/5 rounded-2xl font-bold" 
                    onClick={onShuffle} 
                    disabled={isPending}
                >
                    {isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Shuffle className="mr-2 h-4 w-4" />}
                    Shuffle
                </Button>
            </div>

            {editingItem && (
                <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
                    <DialogContent className="bg-white border-none rounded-3xl shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-[#1a1208] text-xl font-bold">Swap Stop</DialogTitle>
                            <DialogDescription className="text-[rgba(26,18,8,0.50)]">Find an alternative for your itinerary.</DialogDescription>
                        </DialogHeader>
                        <div className="relative mb-4 mt-2">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(26,18,8,0.30)]" />
                            <Input 
                                type="text" 
                                value={swapQuery} 
                                onChange={(e) => setSwapQuery(e.target.value)} 
                                placeholder={`Search ${getItemType(editingItem)} venues...`} 
                                className="w-full pl-10 pr-4 py-2.5 bg-[rgba(26,18,8,0.04)] border-none text-[#1a1208] placeholder:text-[rgba(26,18,8,0.30)] rounded-xl" 
                            />
                        </div>
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                            {isVenuesLoading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="animate-spin h-6 w-6 text-[#c4762a]" />
                                </div>
                            ) : filteredSwapOptions.length > 0 ? (
                                filteredSwapOptions.map((item) => (
                                    <button 
                                        key={item.id} 
                                        onClick={() => handleSwapClick(editingItem, item)} 
                                        className="w-full flex items-center bg-white border border-black/[0.06] rounded-2xl p-3 transition-all hover:bg-black/[0.02] hover:border-black/[0.12] active:scale-[0.98]"
                                    >
                                        <div className="w-12 h-12 bg-black/[0.03] rounded-xl overflow-hidden flex-shrink-0 relative">
                                            <Image 
                                                src={getVenueImageUrl(item)} 
                                                alt={item.name} 
                                                fill 
                                                className="object-cover" 
                                            />
                                        </div>
                                        <div className="ml-4 text-left">
                                            <p className="text-[#1a1208] font-bold text-sm">{item.name}</p>
                                            <p className="text-[11px] text-[rgba(26,18,8,0.50)] line-clamp-1">
                                                {item.description || item.details?.description || item.category || item.details?.category || 'Bondi Venue'}
                                            </p>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="text-center py-8 text-sm text-muted-foreground">
                                    No alternatives found. Try searching...
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </motion.div>
    );
};