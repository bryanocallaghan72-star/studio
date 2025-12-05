
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Utensils, CheckCircle } from "lucide-react";
import Image from "next/image";
import { appData } from '@/lib/data';
import type { TableDrop } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';

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

const TableDropCard = ({ drop, onClaim }: { drop: TableDrop, onClaim: (drop: TableDrop) => void }) => {
    const creator = drop.creatorPickHandle ? appData.creators.find(c => c.id === drop.creatorPickHandle) : null;
    const startTime = new Date(drop.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endTime = new Date(drop.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const handleClaim = () => {
        onClaim(drop);
    }

    return (
        <Card key={drop.id} className="group relative overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1 border-2 border-transparent hover:border-primary">
            <div className="absolute inset-0">
                <Image
                    src={drop.venueImageUrl}
                    alt={drop.venueName}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    data-ai-hint="restaurant interior"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
            </div>
            <CardContent className="relative z-10 flex flex-col justify-end h-full p-6 text-white min-h-[300px]">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <Badge variant="destructive" className="flex items-center gap-2 w-min whitespace-nowrap">
                            <Utensils className="h-4 w-4" />
                            <span>DROP</span>
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
                    <h3 className="text-2xl font-bold leading-tight">{drop.venueName}{drop.tableLabel && ` – ${drop.tableLabel}`}</h3>
                    <p className="text-white/90 mt-1">Table for {drop.partySize} • {startTime} – {endTime}</p>
                </div>
                <div className='mt-6'>
                    <div className="flex items-center justify-between rounded-lg bg-destructive/80 p-3 backdrop-blur-sm border border-destructive-foreground/30">
                        <p className="text-sm font-medium text-destructive-foreground">Drop expires in:</p>
                        <Countdown expiresAt={drop.expiresAt} />
                    </div>
                    <Button
                        className="w-full mt-3 font-bold"
                        onClick={handleClaim}
                        disabled={drop.hasUserClaimed}
                    >
                        {drop.hasUserClaimed ? 'Claimed' : 
                         drop.priceToClaimCents > 0 ? `Claim Table ($${drop.priceToClaimCents / 100})` : 'Claim Table'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export function Tables() {
    const [claimedDrops, setClaimedDrops] = useState<string[]>([]);
    const [selectedDrop, setSelectedDrop] = useState<TableDrop | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleClaimDrop = (drop: TableDrop) => {
        setClaimedDrops(prev => [...prev, drop.id]);
        setSelectedDrop(drop);
        setIsDialogOpen(true);
    };

    const liveDrops = appData.tableDrops
        .filter(drop => new Date(drop.expiresAt).getTime() > Date.now())
        .map(drop => ({ ...drop, hasUserClaimed: claimedDrops.includes(drop.id) }))
        .sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime());

    const favoriteDrops = liveDrops.filter(drop => drop.isFavoriteVenue);
    
    return (
        <>
            <section>
                <div className="flex items-center gap-3 mb-4">
                    <Utensils className="h-8 w-8 text-primary" />
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">iykyk Tables</h2>
                        <p className="text-muted-foreground">Last-minute tables at your favourite spots. Claim before they’re gone.</p>
                    </div>
                </div>

                <Tabs defaultValue="live" className="w-full mt-4">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="hit-list">My Hit List</TabsTrigger>
                        <TabsTrigger value="live">Live Drops</TabsTrigger>
                    </TabsList>
                    <TabsContent value="hit-list" className="mt-6">
                        {favoriteDrops.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {favoriteDrops.map(drop => (
                                    <TableDropCard key={drop.id} drop={drop} onClaim={handleClaimDrop} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <p className="text-muted-foreground">No drops from your hit list yet.</p>
                                <p className="text-sm text-muted-foreground/80 mt-2">Add favourites in Vibe, Fire or the map to see their tables here.</p>
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="live" className="mt-6">
                         {liveDrops.length > 0 ? (
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {liveDrops.map(drop => (
                                    <TableDropCard key={drop.id} drop={drop} onClaim={handleClaimDrop} />
                                ))}
                            </div>
                         ) : (
                            <div className="text-center py-20">
                                <p className="text-muted-foreground">No live drops right now. Check back soon!</p>
                            </div>
                         )}
                    </TabsContent>
                </Tabs>
            </section>
            
            {selectedDrop && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader className="items-center text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-2">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <DialogTitle className="text-2xl">Table Claimed!</DialogTitle>
                            <DialogDescription>
                                You're all set! Your table for {selectedDrop.partySize} at {selectedDrop.venueName} is confirmed.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                             <Button variant="outline" className="w-full" onClick={() => setIsDialogOpen(false)}>Done</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}
