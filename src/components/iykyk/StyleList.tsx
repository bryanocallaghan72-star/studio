'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shirt, CheckCircle, Ticket, MapPin } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { QRCodeSVG } from './QRCodeSVG';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStyleDrops, type StyleDrop } from '@/hooks/useStyleDrops';
import { useVenues } from '@/hooks/useVenues';
import { appData } from '@/lib/data'; // Keep for creators until useCreators is made

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

const StyleDropCard = ({ drop, venueName, onClaim }: { drop: StyleDrop, venueName: string, onClaim: (drop: StyleDrop) => void }) => {
    const creator = drop.creatorPickHandle ? appData.creators.find(c => c.id === drop.creatorPickHandle) : null;
    const router = useRouter();

    const handleClaim = () => onClaim(drop);

    const handleMapClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/map?venue=${drop.slug}`);
    };

    return (
        <Card key={drop.id} className="group relative overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1 border-2 border-transparent hover:border-rose-500">
            <div className="absolute inset-0">
                <Image
                    src={drop.venueImageUrl}
                    alt={venueName}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    data-ai-hint="fashion boutique"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
            </div>
            <CardContent className="relative z-10 flex flex-col justify-end h-full p-6 text-white min-h-[350px]">
                <div>
                    <div className="flex items-center justify-between mb-2">
                         <Badge variant="destructive" className="flex items-center gap-2 w-min whitespace-nowrap bg-rose-500/80 border-rose-400 text-white">
                            <Ticket className="h-4 w-4" />
                            <span>DROP</span>
                        </Badge>
                         {creator && (
                            <Link href={`/profile/${creator.id}`} className='flex items-center gap-2 text-xs font-semibold bg-black/30 backdrop-blur-sm p-1 rounded-full'>
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={creator.avatar} alt={creator.name} />
                                    <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>with @{creator.id}</span>
                            </Link>
                        )}
                    </div>
                     <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-2xl font-bold leading-tight text-white" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.55)" }}>
                                {drop.title} at {venueName}
                            </h3>
                            <p className="text-white/90 mt-1 line-clamp-2">{drop.description}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="text-white/80 hover:text-white" onClick={handleMapClick}>
                            <MapPin className="h-6 w-6" />
                        </Button>
                     </div>
                </div>
                <div className='mt-6'>
                    <div className="flex items-center justify-between rounded-lg bg-rose-600/80 p-3 backdrop-blur-sm border border-white/30">
                        <p className="text-sm font-medium text-white/90">Drop expires in:</p>
                        <Countdown expiresAt={drop.expiresAt} />
                    </div>
                    <Button
                        className="w-full mt-3 font-bold bg-white text-black hover:bg-gray-200"
                        onClick={handleClaim}
                        disabled={drop.hasUserClaimed}
                    >
                        {drop.hasUserClaimed ? 'Claimed' :
                         drop.priceToClaimCents > 0 ? `Claim for $${drop.priceToClaimCents / 100}` : 'Claim Free Access'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

const StylePageSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        <Skeleton className="h-[400px] w-full rounded-2xl" />
        <Skeleton className="h-[400px] w-full rounded-2xl" />
    </div>
);

export function StyleList() {
    const [claimedDrops, setClaimedDrops] = useState<string[]>([]);
    const [confirmingDrop, setConfirmingDrop] = useState<StyleDrop | null>(null);
    const [successfulDrop, setSuccessfulDrop] = useState<StyleDrop | null>(null);

    const { styleDrops, isLoading: areDropsLoading } = useStyleDrops();
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


    const handleClaimClick = (drop: StyleDrop) => setConfirmingDrop(drop);

    const handleConfirmClaim = () => {
        if (!confirmingDrop) return;
        setClaimedDrops(prev => [...prev, confirmingDrop.id]);
        setSuccessfulDrop(confirmingDrop);
        setConfirmingDrop(null);
    };
    
    const liveDrops = (styleDrops || [])
        .filter(drop => new Date(drop.expiresAt).getTime() > Date.now())
        .map(drop => ({ ...drop, hasUserClaimed: claimedDrops.includes(drop.id) }))
        .sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime());
    
    const isLoading = areDropsLoading || areVenuesLoading;

    return (
        <>
            <section>
                <div className="flex items-center gap-3 mb-4">
                    <Shirt className="h-8 w-8 text-rose-500" />
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">iykyk Style Drops</h2>
                        <p className="text-muted-foreground">Exclusive access and offers from Bondi's fashion scene.</p>
                    </div>
                </div>
                
                 {isLoading ? <StylePageSkeleton /> : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                        {liveDrops.length > 0 ? liveDrops.map(drop => {
                            const key = drop.slug ?? drop.venueId;
                            const venueName = (key ? venuesBySlug[key]?.name : undefined) ?? drop.venueName ?? "A special place";
                            return (
                                <StyleDropCard key={drop.id} drop={drop} venueName={venueName} onClaim={handleClaimClick} />
                            )
                        }) : (
                            <div className="text-center py-20 col-span-full">
                                <p className="text-muted-foreground">No live style drops right now. Check back soon!</p>
                            </div>
                        )}
                    </div>
                )}
            </section>
            
            {confirmingDrop && (() => {
                const key = confirmingDrop.slug ?? confirmingDrop.venueId;
                const venueName = (key ? venuesBySlug[key]?.name : undefined) ?? confirmingDrop.venueName ?? "A special place";
                return (
                    <Dialog open={!!confirmingDrop} onOpenChange={() => setConfirmingDrop(null)}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Confirm Your Claim</DialogTitle>
                                <DialogDescription>
                                    You're about to claim: <strong>{confirmingDrop.title}</strong> at {venueName}.
                                    {confirmingDrop.priceToClaimCents > 0 && ` A fee of $${confirmingDrop.priceToClaimCents / 100} will be charged.`}
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setConfirmingDrop(null)}>Cancel</Button>
                                <Button className="bg-rose-500 hover:bg-rose-600" onClick={handleConfirmClaim}>Confirm</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )
            })()}

            {successfulDrop && (() => {
                const key = successfulDrop.slug ?? successfulDrop.venueId;
                const venueName = (key ? venuesBySlug[key]?.name : undefined) ?? successfulDrop.venueName ?? "A special place";
                 return (
                 <Dialog open={!!successfulDrop} onOpenChange={() => setSuccessfulDrop(null)}>
                    <DialogContent>
                        <DialogHeader className="items-center text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-2">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <DialogTitle className="text-2xl">Claimed!</DialogTitle>
                            <DialogDescription>
                                Your drop for <strong>{successfulDrop.title}</strong> at {venueName} is confirmed.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col items-center justify-center space-y-4 p-4">
                          <div className="p-4 bg-white rounded-lg border">
                            <QRCodeSVG className="h-48 w-48" />
                          </div>
                          <p className="text-sm text-muted-foreground text-center">
                            Show this code to the staff to redeem your drop.
                          </p>
                        </div>
                         <DialogFooter>
                            <Link href={`/venue/${successfulDrop.slug}`} className="w-full">
                                <Button className="w-full" onClick={() => setSuccessfulDrop(null)}>View Venue</Button>
                            </Link>
                         </DialogFooter>
                    </DialogContent>
                </Dialog>
                 )
            })()}
        </>
    );
}
