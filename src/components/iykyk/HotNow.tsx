
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, Ticket, Users } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { QRCodeDialog } from './QRCodeDialog';
import { appData } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useFirestore, useUser, setDocumentNonBlocking } from '@/firebase';
import { doc, collection } from 'firebase/firestore';

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


export function HotNow() {
    const [selectedDeal, setSelectedDeal] = useState<(typeof appData.hotItems)[0] | null>(null);
    const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
    const firestore = useFirestore();
    const { user } = useUser();

    const handleClaimPerk = (item: (typeof appData.hotItems)[0]) => {
        setSelectedDeal(item);
        setIsQRDialogOpen(true);

        if (!user || !firestore) return;

        // Log the claim for the user
        const claimedDealRef = doc(firestore, 'users', user.uid, 'claimedDeals', item.id);
        const claimData = {
            itemId: item.id,
            itemTitle: item.title,
            itemType: 'fire',
            venueName: item.venue,
            creatorId: item.creatorId || null,
            claimedAt: new Date().toISOString(),
        };
        setDocumentNonBlocking(claimedDealRef, claimData, { merge: true });

        // If there's a creator, log the influenced action
        if (item.creatorId) {
            const influenceRef = doc(collection(firestore, 'users', item.creatorId, 'influencedActions'));
            const influenceData = {
                actionId: influenceRef.id,
                userId: user.uid,
                actionType: 'claimDeal',
                itemId: item.id,
                timestamp: new Date().toISOString(),
            };
            setDocumentNonBlocking(influenceRef, influenceData, { merge: true });
        }
    };

    const activeItems = appData.hotItems.filter(item => new Date(item.expiresAt).getTime() > Date.now());

    return (
        <>
            <section>
                <div className="flex items-center gap-3 mb-4">
                    <Flame className="h-8 w-8 text-destructive animate-pulse" />
                    <h2 className="text-3xl font-bold tracking-tight">iykyk Fire</h2>
                </div>
                <p className="text-muted-foreground mb-4">What’s hot right now. Catch it before it's gone!</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {activeItems.map(item => {
                        const image = item.imageId ? PlaceHolderImages.find(img => img.id === item.imageId) : null;
                        const creator = item.creatorId ? appData.creators.find(c => c.id === item.creatorId) : null;
                        return (
                            <Card key={item.id} className="group relative overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1 border-2 border-transparent hover:border-primary">
                                <div className="absolute inset-0">
                                {image ? (
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
                                ) : <div className="bg-secondary h-full w-full"/>}
                                </div>
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
                                        <h3 className="text-2xl font-bold leading-tight">{item.venue}</h3>
                                        <p className="text-white/90 mt-1">{item.title}: {item.description}</p>
                                    </div>
                                    <div className='mt-6'>
                                        {item.claims && (
                                            <div className="mb-2 flex items-center justify-center gap-2 text-sm font-semibold text-white bg-black/30 p-2 rounded-lg backdrop-blur-sm">
                                                <Users className="h-4 w-4 text-primary" />
                                                <span>{item.claims} claimed this!</span>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between rounded-lg bg-destructive/80 p-3 backdrop-blur-sm border border-destructive-foreground/30">
                                            <p className="text-sm font-medium text-destructive-foreground">Ends in:</p>
                                            <Countdown expiresAt={item.expiresAt} />
                                        </div>
                                        <Button 
                                            variant="secondary" 
                                            className="w-full mt-3 font-bold"
                                            onClick={() => handleClaimPerk(item)}
                                            disabled={!user}
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
