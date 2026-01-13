
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Ticket, Bed } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { QRCodeDialog } from './QRCodeDialog';
import { appData } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import Link from 'next/link';
import { CheckCircle, CalendarPlus } from 'lucide-react';
import { useFirestore, useUser, setDocumentNonBlocking } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { useCreators } from '@/hooks/useCreators';


const Countdown = ({ expiresAt }: { expiresAt: string }) => {
    const [timeLeft, setTimeLeft] = useState(new Date(expiresAt).getTime() - Date.now());
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;

        const intervalId = setInterval(() => {
            const newTimeLeft = new Date(expiresAt).getTime() - Date.now();
            if (newTimeLeft <= 0) {
                setTimeLeft(0);
                clearInterval(intervalId);
            } else {
                setTimeLeft(newTimeLeft);
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [isClient, expiresAt]);

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


export function FlashStays() {
    const [selectedStay, setSelectedStay] = useState<(typeof appData.stays)[0] | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const firestore = useFirestore();
    const { user } = useUser();
    const { creators } = useCreators();

    const creatorsById = useMemo(() => {
        if (!creators) return {};
        return creators.reduce((acc, creator) => {
            acc[creator.id] = creator;
            return acc;
        }, {} as Record<string, (typeof creators)[number]>);
    }, [creators]);

    const handleBookNow = (stay: (typeof appData.stays)[0]) => {
        setSelectedStay(stay);
        setIsDialogOpen(true);

        if (!user || !firestore) return;

        // Log the claim for the user
        const claimedDealRef = doc(firestore, 'users', user.uid, 'claimedDeals', stay.id);
        const claimData = {
            itemId: stay.id,
            itemTitle: stay.title,
            itemType: 'stay',
            venueName: stay.title, // For stays, venue is the stay itself
            creatorId: stay.creatorId || null,
            claimedAt: new Date().toISOString(),
        };
        setDocumentNonBlocking(claimedDealRef, claimData, { merge: true });

        // If there's a creator, log the influenced action
        if (stay.creatorId) {
            const influenceRef = doc(collection(firestore, 'users', stay.creatorId, 'influencedActions'));
            const influenceData = {
                actionId: influenceRef.id,
                userId: user.uid,
                actionType: 'bookStay',
                itemId: stay.id,
                timestamp: new Date().toISOString(),
            };
            setDocumentNonBlocking(influenceRef, influenceData, { merge: true });
        }
    };

    const activeStays = appData.stays.filter(item => item.endsIn && new Date(Date.now() + item.endsIn).getTime() > Date.now());

    return (
        <>
            <section>
                <div className="flex items-center gap-3 mb-4">
                    <Zap className="h-8 w-8 text-purple-500 animate-pulse" />
                    <h2 className="text-3xl font-bold tracking-tight">iykyk Flash Stays</h2>
                </div>
                <p className="text-muted-foreground mb-4">Last-minute deals on creator-approved stays. Book it before it's gone!</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {activeStays.map(stay => {
                        const image = stay.imageId ? PlaceHolderImages.find(img => img.id === stay.imageId) : null;
                        const creator = stay.creatorId ? creatorsById[stay.creatorId] : null;
                        return (
                            <Card key={stay.id} className="group relative overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1 border-2 border-transparent hover:border-primary">
                                <div className="absolute inset-0">
                                {image ? (
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
                                ) : <div className="bg-secondary h-full w-full"/>}
                                </div>
                                <CardContent className="relative z-10 flex flex-col justify-end h-full p-6 text-white min-h-[300px]">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge variant="destructive" className="flex items-center gap-2 w-min whitespace-nowrap bg-purple-500 hover:bg-purple-600">
                                                <Zap className="h-4 w-4" />
                                                <span>FLASH</span>
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
                                        <h3 className="text-2xl font-bold leading-tight">{stay.title}</h3>
                                        <p className="text-white/90 mt-1">${stay.pricePerNight} / night</p>
                                    </div>
                                    <div className='mt-6'>
                                        <div className="flex items-center justify-between rounded-lg bg-destructive/80 p-3 backdrop-blur-sm border border-destructive-foreground/30">
                                            <p className="text-sm font-medium text-destructive-foreground">Deal ends in:</p>
                                            <Countdown expiresAt={new Date(Date.now() + stay.endsIn).toISOString()} />
                                        </div>
                                        <Button 
                                            variant="secondary" 
                                            className="w-full mt-3 font-bold"
                                            onClick={() => handleBookNow(stay)}
                                            disabled={!user}
                                        >
                                            <Bed className="mr-2 h-5 w-5"/>
                                            Book Stay
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </section>
            {selectedStay && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader className="items-center text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-2">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <DialogTitle className="text-2xl">Your stay is booked!</DialogTitle>
                            <DialogDescription>
                                You're all set for your trip to Bondi. Enjoy your stay at {selectedStay.title}.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex-col sm:flex-col sm:space-x-0 gap-2">
                            <Link href="/my-day" className="w-full">
                                <Button className="w-full h-12">
                                    <CalendarPlus className="mr-2"/>
                                    Plan Your Itinerary
                                </Button>
                            </Link>
                             <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}
