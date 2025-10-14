
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bed, Flame, Star, Ticket } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { appData } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Link from 'next/link';

const Countdown = ({ endsIn }: { endsIn: number }) => {
    const [timeLeft, setTimeLeft] = useState(endsIn);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        if (timeLeft <= 0) return;

        const intervalId = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1000);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timeLeft]);
    
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <span className="font-mono text-sm font-semibold text-background">Loading...</span>;
    }

    if (timeLeft <= 0) {
        return <span className="font-mono text-sm font-bold text-destructive-foreground">ENDED</span>;
    }

    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    return (
        <span className="font-mono text-sm font-semibold text-background">
            {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
    );
};

export function StaysDeals() {

    return (
        <section>
            <div className="flex items-center gap-3 mb-4">
                <Bed className="h-8 w-8 text-primary" />
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">iykyk Stays: Deals</h2>
                    <p className="text-muted-foreground">Last minute availability and deals on creator-approved stays.</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {appData.stays.map(stay => {
                    const image = PlaceHolderImages.find(img => img.id === stay.imageId);
                    const creator = appData.creators.find(c => c.id === stay.creatorId);
                    return (
                        <Card key={stay.id} className="group relative overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1 border-2 border-transparent hover:border-primary">
                            <div className="relative h-96 w-full">
                                {image && (
                                    <>
                                        <Image
                                            src={image.imageUrl}
                                            alt={stay.description}
                                            fill
                                            className="object-cover transition-transform group-hover:scale-105"
                                            data-ai-hint={image.imageHint}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
                                    </>
                                )}
                            </div>
                            <CardContent className="relative z-10 flex flex-col justify-end h-full p-6 text-white absolute inset-0">
                                <div>
                                    <Badge variant="destructive" className="flex items-center gap-2 w-min whitespace-nowrap mb-2">
                                        <Flame className="h-4 w-4" />
                                        <span>Last Minute Deal!</span>
                                    </Badge>
                                    <h3 className="text-2xl font-bold leading-tight">{stay.title}</h3>
                                     <div className="flex items-center gap-2 mt-2">
                                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                        <span className="font-bold">{stay.rating}</span>
                                        <span className='text-white/80'>·</span>
                                        <span className="font-bold">${stay.pricePerNight}</span>
                                        <span className='text-white/80'>/ night</span>
                                     </div>
                                </div>
                                
                                <div className='mt-6'>
                                     {creator && (
                                        <Link href={`/profile/${creator.id}`} className='flex items-center gap-2 text-xs font-semibold bg-black/30 backdrop-blur-sm p-1.5 rounded-full mb-4 w-fit hover:bg-black/50 transition-colors'>
                                            <Avatar className="h-7 w-7">
                                                <AvatarImage src={creator.avatar} alt={creator.name} />
                                                <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className='pr-2'>Recommended by @{creator.id}</span>
                                        </Link>
                                    )}
                                    <div className="flex items-center justify-between rounded-lg bg-primary/90 p-3 backdrop-blur-sm border border-primary-foreground/30">
                                        <p className="text-sm font-medium text-primary-foreground">Deal ends in:</p>
                                        <Countdown endsIn={stay.endsIn} />
                                    </div>
                                    <Button 
                                        variant="secondary" 
                                        className="w-full mt-3 font-bold"
                                    >
                                        <Ticket className="mr-2 h-5 w-5"/>
                                        Book Now
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </section>
    );
}