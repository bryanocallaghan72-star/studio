
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, Ticket } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { QRCodeDialog } from './QRCodeDialog';
import { appData } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const hotItems = [
    {
        title: "Happy Hour Rush",
        venue: "The Rum Diary Bar",
        description: "50% off all cocktails.",
        imageId: "deal-1",
        endsIn: 50 * 60 * 1000, // 50 minutes
        creatorId: "shannon",
    },
    {
        title: "Sunset Special",
        venue: "North Bondi Fish",
        description: "Half-price oysters until 7 PM.",
        imageId: "my-day-3",
        endsIn: 2 * 60 * 60 * 1000, // 2 hours
    },
    {
        title: "Last Minute Spot",
        venue: "Fluidform Pilates",
        description: "25% off the 5pm Reformer class.",
        imageId: "fitness-1",
        endsIn: 30 * 60 * 1000, // 30 minutes
    },
    {
        title: "Live DJ Set Special",
        venue: "The Bucket List",
        description: "$12 Aperol Spritz for the first hour.",
        imageId: "hot-1",
        endsIn: 60 * 60 * 1000, // 60 minutes
        creatorId: "alice",
    }
];

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
        return <span className="font-mono text-lg font-semibold text-background">Loading...</span>;
    }

    if (timeLeft <= 0) {
        return <span className="font-mono text-lg font-bold text-destructive-foreground">ENDED</span>;
    }

    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    return (
        <span className="font-mono text-lg font-semibold text-background">
            {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
    );
};


export function HotNow() {
    const [selectedDeal, setSelectedDeal] = useState<(typeof hotItems)[0] | null>(null);
    const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);

    const handleClaimPerk = (item: (typeof hotItems)[0]) => {
        setSelectedDeal(item);
        setIsQRDialogOpen(true);
    };

    return (
        <>
            <section>
                <div className="flex items-center gap-3 mb-4">
                    <Flame className="h-8 w-8 text-destructive animate-pulse" />
                    <h2 className="text-3xl font-bold tracking-tight">iykyk Fire</h2>
                </div>
                <p className="text-muted-foreground mb-4">What’s hot right now. Catch it before it's gone!</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {hotItems.map(item => {
                        const image = PlaceHolderImages.find(img => img.id === item.imageId);
                        const creator = item.creatorId ? appData.creators.find(c => c.id === item.creatorId) : null;
                        return (
                            <Card key={item.title} className="group relative overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1 border-2 border-transparent hover:border-primary">
                                {image && (
                                    <>
                                        <Image
                                            src={image.imageUrl}
                                            alt={item.description}
                                            fill
                                            className="object-cover transition-transform group-hover:scale-105"
                                            data-ai-hint={image.imageHint}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
                                    </>
                                )}
                                <CardContent className="relative z-10 flex flex-col justify-end h-full p-6 text-white min-h-[300px]">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge variant="destructive" className="flex items-center gap-2 w-min whitespace-nowrap">
                                                <Flame className="h-4 w-4" />
                                                <span>HOT</span>
                                            </Badge>
                                            {creator && (
                                                <div className='flex items-center gap-2 text-xs font-semibold bg-black/30 backdrop-blur-sm p-1 rounded-full'>
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src={creator.avatar} alt={creator.name} />
                                                        <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <span>@{creator.id}'s pick</span>
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="text-2xl font-bold leading-tight">{item.title}</h3>
                                        <p className="text-white/90 mt-1">{item.description} at <span className="font-semibold">{item.venue}</span></p>
                                    </div>
                                    <div className='mt-6'>
                                        <div className="flex items-center justify-between rounded-lg bg-destructive/80 p-3 backdrop-blur-sm border border-destructive-foreground/30">
                                            <p className="text-sm font-medium text-destructive-foreground">Ends in:</p>
                                            <Countdown endsIn={item.endsIn} />
                                        </div>
                                        <Button 
                                            variant="secondary" 
                                            className="w-full mt-3 font-bold"
                                            onClick={() => handleClaimPerk(item)}
                                        >
                                            <Ticket className="mr-2 h-5 w-5"/>
                                            Claim Perk
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </section>
            {selectedDeal && (
                <QRCodeDialog
                    isOpen={isQRDialogOpen}
                    onOpenChange={setIsQRDialogOpen}
                    deal={selectedDeal}
                />
            )}
        </>
    );
}
