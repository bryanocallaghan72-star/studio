
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dumbbell, CheckCircle, Zap } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirestore, useUser, setDocumentNonBlocking } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { useVenues } from '@/hooks/useVenues';
import { useClassDrops, type ClassDrop } from '@/hooks/useClassDrops';
import { appData } from '@/lib/data'; // Keep for creators

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
        return <span className="font-mono text-lg font-semibold text-white">Loading...</span>;
    }

    if (timeLeft <= 0) {
        return <span className="font-mono text-lg font-bold text-white">ENDED</span>;
    }
    
    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    return (
        <span className="font-mono text-lg font-semibold text-white">
            {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
    );
};


const ClassDropCard = ({ drop, venueName, onClaim }: { drop: ClassDrop, venueName: string, onClaim: (drop: ClassDrop) => void }) => {
    const creator = drop.instructorHandle ? appData.creators.find(c => c.id === drop.instructorHandle) : null;
    const [formattedTime, setFormattedTime] = useState<string | null>(null);
    const { user } = useUser();

     useEffect(() => {
        setFormattedTime(new Date(drop.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, [drop.startTime]);

    const handleClaim = () => onClaim(drop);

    return (
        <Card key={drop.id} className="group relative overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1 border-2 border-transparent hover:border-pink-500">
            <div className="absolute inset-0">
                <Image
                    src={drop.classImageUrl}
                    alt={drop.className}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    data-ai-hint="fitness class"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
            </div>
            <CardContent className="relative z-10 flex flex-col justify-end h-full p-6 text-white min-h-[350px]">
                <div>
                    <div className="flex items-center justify-between mb-2">
                         <Badge variant="destructive" className="flex items-center gap-2 w-min whitespace-nowrap bg-pink-500/80 border-pink-400 text-white">
                            <Zap className="h-4 w-4" />
                            <span>DROP</span>
                        </Badge>
                         {creator && (
                            <div className='flex items-center gap-2 text-xs font-semibold bg-black/30 backdrop-blur-sm p-1 rounded-full'>
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={creator.avatar} alt={creator.name} />
                                    <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>with @{creator.id}</span>
                            </div>
                        )}
                    </div>
                     <h3 className="text-2xl font-bold leading-tight text-white" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.55)" }}>
                        {drop.className} at {venueName}
                    </h3>
                    {formattedTime ? (
                        <p className="text-white/90 mt-1">{drop.spotsAvailable} Spot{drop.spotsAvailable > 1 ? 's' : ''} at {formattedTime}</p>
                    ) : (
                         <Skeleton className="h-5 w-32 mt-1 bg-white/20" />
                    )}
                </div>
                <div className='mt-6'>
                    <div className="flex items-center justify-between rounded-lg bg-pink-600/80 p-3 backdrop-blur-sm border border-white/30">
                        <p className="text-sm font-medium text-white/90">Drop expires in:</p>
                        <Countdown expiresAt={drop.expiresAt} />
                    </div>
                    <Button
                        className="w-full mt-3 font-bold bg-white text-black hover:bg-gray-200"
                        onClick={handleClaim}
                        disabled={drop.hasUserClaimed || !user}
                    >
                        {drop.hasUserClaimed ? 'Claimed' : 'Claim Spot'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

const ActivePageSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        <Skeleton className="h-[400px] w-full rounded-2xl" />
        <Skeleton className="h-[400px] w-full rounded-2xl" />
    </div>
);

export function ActivePage() {
    const [isClient, setIsClient] = useState(false);
    const [claimedDrops, setClaimedDrops] = useState<string[]>([]);
    const [confirmingDrop, setConfirmingDrop] = useState<ClassDrop | null>(null);
    const [successfulDrop, setSuccessfulDrop] = useState<ClassDrop | null>(null);
    const firestore = useFirestore();
    const { user } = useUser();
    
    const { classDrops, isLoading: areDropsLoading } = useClassDrops();
    const { venues, isLoading: areVenuesLoading } = useVenues();

    const venuesBySlug = useMemo(() => {
        if (!venues) return {};
        return venues.reduce((acc, venue) => {
            if (venue.slug) {
                acc[venue.slug] = venue;
            }
            return acc;
        }, {} as Record<string, (typeof venues)[number]>);
    }, [venues]);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleClaimClick = (drop: ClassDrop) => setConfirmingDrop(drop);

    const handleConfirmClaim = () => {
        if (!confirmingDrop || !user || !firestore) return;
        
        const venueName = venuesBySlug[confirmingDrop.venueId]?.name ?? confirmingDrop.venueName;
        
        setClaimedDrops(prev => [...prev, confirmingDrop!.id]);
        setSuccessfulDrop(confirmingDrop);
        setConfirmingDrop(null);

        // Log the claim for the user
        const claimedDealRef = doc(firestore, 'users', user.uid, 'claimedDeals', confirmingDrop.id);
        const claimData = {
            itemId: confirmingDrop.id,
            itemTitle: `${confirmingDrop.className} at ${venueName}`,
            itemType: 'active',
            venueName: venueName,
            creatorId: confirmingDrop.instructorHandle || null,
            claimedAt: new Date().toISOString(),
        };
        setDocumentNonBlocking(claimedDealRef, claimData, { merge: true });
        
        // Log influence for instructor
        if (confirmingDrop.instructorHandle) {
            const influenceRef = doc(collection(firestore, 'users', confirmingDrop.instructorHandle, 'influencedActions'));
            const influenceData = {
                actionId: influenceRef.id,
                userId: user.uid,
                actionType: 'claimDeal',
                itemId: confirmingDrop.id,
                timestamp: new Date().toISOString(),
            };
            setDocumentNonBlocking(influenceRef, influenceData, { merge: true });
        }
    };
    
    const liveDrops = (classDrops || [])
        .filter(drop => new Date(drop.expiresAt).getTime() > Date.now())
        .map(drop => ({ ...drop, hasUserClaimed: claimedDrops.includes(drop.id) }))
        .sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime());
    
    const favoriteDrops = liveDrops.filter(drop => drop.isFavoriteVenue);
    
    const isLoading = !isClient || areDropsLoading || areVenuesLoading;

    return (
        <>
            <section>
                <div className="flex items-center gap-3 mb-4">
                    <Dumbbell className="h-8 w-8 text-pink-500" />
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">iykyk Active</h2>
                        <p className="text-muted-foreground">Last-minute spots at Bondi's top studios. Claim yours.</p>
                    </div>
                </div>
                
                 {isLoading ? <ActivePageSkeleton /> : (
                    <Tabs defaultValue="live" className="w-full mt-4">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="hit-list">My Hit List</TabsTrigger>
                            <TabsTrigger value="live">Live Drops</TabsTrigger>
                        </TabsList>
                        <TabsContent value="hit-list" className="mt-6">
                            {favoriteDrops.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {favoriteDrops.map(drop => {
                                        const venueName = venuesBySlug[drop.venueId]?.name ?? drop.venueName;
                                        return <ClassDropCard key={drop.id} drop={drop} venueName={venueName} onClaim={handleClaimClick} />;
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-20">
                                    <p className="text-muted-foreground">No drops from your hit list yet.</p>
                                    <p className="text-sm text-muted-foreground/80 mt-2">Favorite a studio to see their drops here first.</p>
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value="live" className="mt-6">
                            {liveDrops.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {liveDrops.map(drop => {
                                        const venueName = venuesBySlug[drop.venueId]?.name ?? drop.venueName;
                                        return <ClassDropCard key={drop.id} drop={drop} venueName={venueName} onClaim={handleClaimClick} />;
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-20">
                                    <p className="text-muted-foreground">No live class drops right now. Check back soon!</p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                )}
            </section>
            
            {confirmingDrop && (() => {
                const venueName = venuesBySlug[confirmingDrop.venueId]?.name ?? confirmingDrop.venueName;
                return (
                    <Dialog open={!!confirmingDrop} onOpenChange={() => setConfirmingDrop(null)}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Claim this spot?</DialogTitle>
                                <DialogDescription>
                                    You're about to claim a spot for <strong>{confirmingDrop.className}</strong> at {venueName}.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setConfirmingDrop(null)}>Cancel</Button>
                                <Button className="bg-pink-500 hover:bg-pink-600" onClick={handleConfirmClaim}>Confirm</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )
            })()}

            {successfulDrop && (() => {
                 const venueName = venuesBySlug[successfulDrop.venueId]?.name ?? successfulDrop.venueName;
                 return (
                 <Dialog open={!!successfulDrop} onOpenChange={() => setSuccessfulDrop(null)}>
                    <DialogContent>
                        <DialogHeader className="items-center text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-2">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <DialogTitle className="text-2xl">You're in!</DialogTitle>
                            <DialogDescription>
                                Your spot for <strong>{successfulDrop.className}</strong> at {venueName} is confirmed.
                            </DialogDescription>
                        </DialogHeader>
                         <DialogFooter>
                             <Button className="w-full" onClick={() => setSuccessfulDrop(null)}>Awesome</Button>
                         </DialogFooter>
                    </DialogContent>
                </Dialog>
                )
            })()}
        </>
    );
}
