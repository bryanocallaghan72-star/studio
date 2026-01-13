
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Utensils, CheckCircle } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirestore, useUser, setDocumentNonBlocking } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { useTableDrops, type TableDrop } from '@/hooks/useTableDrops';
import { useVenues } from '@/hooks/useVenues';
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

const TableDropCard = ({ drop, onClaim, venueName, creator }: { drop: TableDrop, onClaim: (drop: TableDrop) => void, venueName: string, creator: any }) => {
    const [formattedTimes, setFormattedTimes] = useState<{ start: string; end: string } | null>(null);
    const { user } = useUser();

    useEffect(() => {
        // Format times on the client to avoid hydration mismatch
        setFormattedTimes({
            start: new Date(drop.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            end: new Date(drop.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
    }, [drop.startTime, drop.endTime]);


    const handleClaim = () => {
        onClaim(drop);
    }

    return (
        <Card key={drop.id} className="group relative overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1 border-2 border-transparent hover:border-primary">
            <div className="absolute inset-0">
                <Image
                    src={drop.venueImageUrl}
                    alt={venueName}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    data-ai-hint="restaurant interior"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
            </div>
            <CardContent className="relative z-10 flex flex-col justify-end h-full p-6 text-white min-h-[300px]">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <Badge variant="destructive" className="flex items-center gap-2 w-min whitespace-nowrap text-white">
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
                    <h3 className="text-2xl font-bold leading-tight text-white" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.55)" }}>
                        {venueName}{drop.tableLabel && ` – ${drop.tableLabel}`}
                    </h3>
                    {formattedTimes ? (
                         <p className="text-white/90 mt-1">Table for {drop.partySize} • {formattedTimes.start} – {formattedTimes.end}</p>
                    ) : (
                        <Skeleton className="h-5 w-48 mt-1 bg-white/20" />
                    )}
                </div>
                <div className='mt-6'>
                    <div className="flex items-center justify-between rounded-lg bg-destructive/80 p-3 backdrop-blur-sm border border-destructive-foreground/30">
                        <p className="text-sm font-medium text-white/90">Drop expires in:</p>
                        <Countdown expiresAt={drop.expiresAt} />
                    </div>
                    <Button
                        className="w-full mt-3 font-bold"
                        onClick={handleClaim}
                        disabled={drop.hasUserClaimed || !user}
                    >
                        {drop.hasUserClaimed ? 'Claimed' : 
                         drop.priceToClaimCents > 0 ? `Claim Table ($${drop.priceToClaimCents / 100})` : 'Claim Table'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

const TablesSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        <Skeleton className="h-[350px] w-full rounded-2xl" />
        <Skeleton className="h-[350px] w-full rounded-2xl" />
    </div>
);


export function Tables() {
    const [claimedDrops, setClaimedDrops] = useState<string[]>([]);
    const [confirmingDrop, setConfirmingDrop] = useState<TableDrop | null>(null);
    const [successfulDrop, setSuccessfulDrop] = useState<TableDrop | null>(null);
    const [isClient, setIsClient] = useState(false);
    const firestore = useFirestore();
    const { user } = useUser();

    const { tableDrops, isLoading: areDropsLoading } = useTableDrops();
    const { venues, isLoading: areVenuesLoading } = useVenues();
    const { creatorsById } = useCreators();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const venuesBySlug = useMemo(() => {
        if (!venues) return {};
        return venues.reduce((acc, venue) => {
            if (venue.slug) {
                acc[venue.slug] = venue;
            }
            return acc;
        }, {} as Record<string, (typeof venues)[number]>);
    }, [venues]);

    const handleClaimClick = (drop: TableDrop) => {
        setConfirmingDrop(drop);
    };

    const handleConfirmClaim = () => {
        if (!confirmingDrop || !user || !firestore) return;
        
        const venueKey = confirmingDrop.venueId;
        const venue = venueKey ? venuesBySlug[venueKey] : undefined;
        const venueName = venue?.name ?? confirmingDrop.venueName;

        // Optimistically update UI
        setClaimedDrops(prev => [...prev, confirmingDrop!.id]);
        setSuccessfulDrop(confirmingDrop);
        setConfirmingDrop(null);

        // Log claim for user
        const claimedDealRef = doc(firestore, 'users', user.uid, 'claimedDeals', confirmingDrop.id);
        const claimData = {
            itemId: confirmingDrop.id,
            itemTitle: `Table at ${venueName}`,
            itemType: 'table',
            venueName: venueName,
            creatorId: confirmingDrop.creatorPickHandle || null,
            claimedAt: new Date().toISOString(),
        };
        setDocumentNonBlocking(claimedDealRef, claimData, { merge: true });

        // Log influence for creator
        if (confirmingDrop.creatorPickHandle) {
            const influenceRef = doc(collection(firestore, 'users', confirmingDrop.creatorPickHandle, 'influencedActions'));
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
    
    const liveDrops = tableDrops
        .filter(drop => new Date(drop.expiresAt).getTime() > Date.now())
        .map(drop => ({ ...drop, hasUserClaimed: claimedDrops.includes(drop.id) }))
        .sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime());

    const favoriteDrops = liveDrops.filter(drop => drop.isFavoriteVenue);

    const isLoading = !isClient || areDropsLoading || areVenuesLoading;
    
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

                {isLoading ? <TablesSkeleton /> : (
                    <Tabs defaultValue="live" className="w-full mt-4">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="hit-list">My Hit List</TabsTrigger>
                            <TabsTrigger value="live">Live Drops</TabsTrigger>
                        </TabsList>
                        <TabsContent value="hit-list" className="mt-6">
                            {favoriteDrops.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {favoriteDrops.map(drop => {
                                        const venue = venuesBySlug[drop.venueId];
                                        const venueName = venue?.name ?? drop.venueName;
                                        const creator = drop.creatorPickHandle ? creatorsById[drop.creatorPickHandle] : null;
                                        return <TableDropCard key={drop.id} drop={drop} onClaim={handleClaimClick} venueName={venueName} creator={creator} />
                                    })}
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
                                    {liveDrops.map(drop => {
                                        const venue = venuesBySlug[drop.venueId];
                                        const venueName = venue?.name ?? drop.venueName;
                                        const creator = drop.creatorPickHandle ? creatorsById[drop.creatorPickHandle] : null;
                                        return <TableDropCard key={drop.id} drop={drop} onClaim={handleClaimClick} venueName={venueName} creator={creator} />
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-20">
                                    <p className="text-muted-foreground">No live drops right now. Check back soon!</p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                )}
            </section>
            
            {/* Confirmation Modal */}
            {confirmingDrop && (() => {
                const venue = venuesBySlug[confirmingDrop.venueId];
                const venueName = venue?.name ?? confirmingDrop.venueName;
                return (
                    <Dialog open={!!confirmingDrop} onOpenChange={() => setConfirmingDrop(null)}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Claim this table?</DialogTitle>
                                <DialogDescription>
                                    You are about to claim a table for {confirmingDrop.partySize} at <strong>{venueName}</strong> from {new Date(confirmingDrop.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.
                                    {confirmingDrop.priceToClaimCents > 0 && ` A fee of $${confirmingDrop.priceToClaimCents / 100} will be charged.`}
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setConfirmingDrop(null)}>Cancel</Button>
                                <Button onClick={handleConfirmClaim}>Confirm</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )
            })()}

            {/* Success "Golden Ticket" Modal */}
            {successfulDrop && (() => {
                const venue = venuesBySlug[successfulDrop.venueId];
                const venueName = venue?.name ?? successfulDrop.venueName;
                return (
                    <Dialog open={!!successfulDrop} onOpenChange={() => setSuccessfulDrop(null)}>
                        <DialogContent className="p-0 border-0 bg-transparent shadow-none max-w-sm">
                           <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-300 to-amber-500 shadow-2xl border border-amber-300 text-black">
                             <div className="p-8 flex flex-col items-center text-center">
                                <CheckCircle className="h-16 w-16 text-white mb-4" />
                                <h2 className="text-2xl font-bold tracking-tight">Table Claimed!</h2>
                                <p className="font-semibold mt-2">You claimed a table at</p>
                                <p className="text-3xl font-bold">{venueName}</p>
                                
                                <div className="my-6 w-full space-y-2 text-left bg-black/5 p-4 rounded-lg">
                                    <p><strong>Party Size:</strong> {successfulDrop.partySize}</p>
                                    <p><strong>Time:</strong> {new Date(successfulDrop.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    <p className="font-semibold">Please arrive by {new Date(new Date(successfulDrop.startTime).getTime() + 15 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>

                                {/* Placeholder for QR Code */}
                                <div className="bg-white p-3 rounded-lg shadow-inner">
                                    <svg width="128" height="128" viewBox="0 0 100 100"><path fill="#000" d="M0 0h30v30H0z m10 10h10v10H10zM70 0h30v30H70z m10 10h10v10H80zM0 70h30v30H0z m10 10h10v10H10zM40 0h10v10H40z m20 0h10v10H60zM40 20h10v10H40z m20 10h10v10H60z m-30 10h10v10H30z m30 0h10v10H60z m-20 0h10v10H40zM30 50h10v10H30z m20 0h10v10H50zM70 40h10v10H70z m10 10h10v10H80z m-10 10h10v10H70z m10 10h10v10H80zM40 70h10v10H40z m20 0h10v10H60z m-30 20h10v10H30z m30 0h10v10H60z m-20 0h10v10H40z"/></svg>
                                </div>
                                
                                <p className="text-xs mt-4 opacity-70">Show this screen upon arrival.</p>
                             </div>
                             <DialogFooter className="p-4 bg-black/10">
                                <Button className="w-full bg-white text-black hover:bg-white/90" onClick={() => setSuccessfulDrop(null)}>Done</Button>
                             </DialogFooter>
                           </div>
                        </DialogContent>
                    </Dialog>
                )
            })()}
        </>
    );
}
