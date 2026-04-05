'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bed, Star, CheckCircle, CalendarPlus } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { useCreators } from '@/hooks/useCreators';
import { useStays } from '@/hooks/useStays';

export function StaysList() {
    const [selectedStay, setSelectedStay] = useState<ReturnType<typeof useStays>['stays'][0] | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { creatorsById } = useCreators();
    const { stays } = useStays();

    const handleBookNow = (stay: ReturnType<typeof useStays>['stays'][0]) => {
        setSelectedStay(stay);
        setIsDialogOpen(true);
    };

    return (
        <div className="flex min-h-screen w-full flex-col bg-[#f2ece0] p-4 md:p-6 pb-32">
            <section>
                <header className="mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[#c4762a]/10">
                            <Bed className="h-6 w-6 text-[#c4762a]" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tighter text-[#1a1208] uppercase italic">STAYS</h1>
                            <p className="text-[13px] font-bold text-[rgba(26,18,8,0.40)] uppercase tracking-widest">“Map to Mattress” · Creator Picks</p>
                        </div>
                    </div>
                </header>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {stays.map(stay => {
                        const image = PlaceHolderImages.find(img => img.id === stay.imageId);
                        const creator = stay.creatorId ? creatorsById[stay.creatorId] : null;
                        return (
                            <Card key={stay.id} className="group relative overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 rounded-2xl aspect-[4/5] md:aspect-[16/10] border-none shadow-sm">
                                <div className="absolute inset-0">
                                    {image && (
                                        <Image
                                            src={image.imageUrl}
                                            alt={stay.description}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            data-ai-hint={image.imageHint}
                                        />
                                    )}
                                    <div 
                                        className="absolute inset-0" 
                                        style={{ background: 'linear-gradient(to top, rgba(8,10,13,0.90) 0%, rgba(8,10,13,0.60) 40%, transparent 70%)' }} 
                                    />
                                </div>
                                <CardContent className="relative z-10 flex flex-col justify-end h-full p-6 text-white">
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-2xl font-bold leading-tight text-white">{stay.title}</h3>
                                            <div className="flex items-center gap-2 mt-1 text-white/80">
                                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                                <span className="font-semibold">{stay.rating}</span>
                                                <span>·</span>
                                                <span className="font-bold text-[#c4762a]">${stay.pricePerNight}</span>
                                                <span className="text-white/60">/ night</span>
                                            </div>
                                        </div>
                                        
                                        <p className="text-white/60 italic text-sm leading-relaxed line-clamp-2">"{stay.description}"</p>

                                        <div className='flex items-center justify-between pt-2'>
                                            {creator && (
                                                <Link href={`/profile/${creator.id}`} className='flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition-colors w-fit'>
                                                    <Avatar className="h-8 w-8 border border-white/20">
                                                        <AvatarImage src={creator.avatar} alt={creator.name} />
                                                        <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="hidden sm:inline">Rec by @{creator.id}</span>
                                                    <span className="sm:hidden">@{creator.id}</span>
                                                </Link>
                                            )}
                                            <Button 
                                                className="bg-[#c4762a] hover:bg-[#b06824] text-white font-semibold rounded-2xl h-11 px-6 shadow-lg shadow-[#c4762a]/20 transition-all active:scale-95"
                                                onClick={() => handleBookNow(stay)}
                                            >
                                                Book Now
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </section>
            
            {selectedStay && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="bg-[#f2ece0] border-none rounded-3xl shadow-2xl">
                        <DialogHeader className="items-center text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#c4762a]/10 mb-4">
                                <CheckCircle className="h-8 w-8 text-[#c4762a]" />
                            </div>
                            <DialogTitle className="text-2xl font-bold text-[#1a1208]">Your stay is booked!</DialogTitle>
                            <DialogDescription className="text-[rgba(26,18,8,0.60)]">
                                You're all set for your trip to Bondi. Enjoy your stay at {selectedStay.title}.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex-col sm:flex-col sm:space-x-0 gap-2 mt-4">
                            <Link href="/my-day" className="w-full">
                                <Button className="w-full h-14 bg-[#c4762a] hover:bg-[#b06824] text-white font-black text-lg rounded-2xl shadow-xl shadow-[#c4762a]/20">
                                    <CalendarPlus className="mr-2 h-5 w-5"/>
                                    Plan Your Itinerary
                                </Button>
                            </Link>
                             <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-[rgba(26,18,8,0.40)]">Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}