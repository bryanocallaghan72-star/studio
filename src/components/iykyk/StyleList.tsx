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
import { useStyleDrops } from '@/hooks/useStyleDrops';
import type { StyleDrop } from '@/data/seeds/drops';
import { useVenues } from '@/hooks/useVenues';

type StyleDropWithClaim = StyleDrop & {
    hasUserClaimed: boolean;
  };

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

const StyleDropCard = ({ drop, venueName, onClaim }: { drop: StyleDropWithClaim, venueName: string, onClaim: (drop: StyleDropWithClaim) => void }) => {
    const router = useRouter();

    const handleClaim = () => onClaim(drop);

    const handleMapClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/map?venue=${drop.slug}`);
    };

    return (
        <Card key={drop.id} className="group relative overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1 border-2 border-transparent hover:border-[#c4762a]/50">
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
                         <Badge className="flex items-center gap-2 w-min whitespace-nowrap bg-[#c4762a] text-white border-none text-[10px] font-black uppercase tracking-widest px-2 py-0.5 shadow-lg">
                            <Ticket className="h-3 w-3" />
                            <span>DROP</span>
                        </Badge>
                    </div>
                     <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-2xl font-bold leading-tight text-white" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.55)" }}>
                                {drop.title} at {venueName}
                            </h3>
                            <p className="text-white/90 mt-1 line-clamp-2 text-sm">{drop.description}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="text-white/80 hover:text-white bg-black/20 backdrop-blur-sm rounded-full ml-2 flex-shrink-0" onClick={handleMapClick}>
                            <MapPin className="h-5 w-5" />
                        </Button>
                     </div>
                </div>
                <div className='mt-6'>
                    <div className="flex items-center justify-between rounded-xl bg-[rgba(26,18,8,0.35)] p-3 backdrop-blur-md border border-white/10">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-white/80">Drop expires in:</p>
                        <Countdown expiresAt={drop.expiresAt} />
                    </div>
                    <Button
                        className="w-full mt-3 h-12 bg-[#c4762a] text-white hover:bg-[#b06824] rounded-2xl font-semibold shadow-lg shadow-[#c4762a]/20 transition-all active:scale-95"
                        onClick={handleClaim}
                        disabled={drop.hasUserClaimed}
                    >
                        {drop.hasUserClaimed ? 'Spot Secured' :
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
    
    const liveDrops: StyleDropWithClaim[] = (styleDrops ?? [])
    .filter((drop) => new Date(drop.expiresAt).getTime() > Date.now())
    .map((drop) => ({
      ...drop,
      hasUserClaimed: claimedDrops.includes(drop.id),
    }))
    .sort(
      (a, b) =>
        new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime()
    );
    
    const isLoading = areDropsLoading || areVenuesLoading;

    return (
        <div className="flex min-h-screen w-full flex-col bg-[#f2ece0] p-4 md:p-6 pb-32">
            <header className="mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#c4762a]/10">
                        <Shirt className="h-6 w-6 text-[#c4762a]" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter text-[#1a1208] uppercase italic">STYLE</h1>
                        <p className="text-[13px] font-bold text-[rgba(26,18,8,0.40)] uppercase tracking-widest">Bondi drops · curate your look</p>
                    </div>
                </div>
            </header>
                
            {isLoading ? <StylePageSkeleton /> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {liveDrops.length > 0 ? liveDrops.map(drop => {
                        const key = drop.slug ?? drop.venueId;
                        const venueName = (key ? venuesBySlug[key]?.name : undefined) ?? drop.venueName ?? "A special place";
                        return (
                            <StyleDropCard key={drop.id} drop={drop} venueName={venueName} onClaim={handleClaimClick} />
                        )
                    }) : (
                        <div className="text-center py-24 px-6 border-2 border-dashed border-black/[0.05] rounded-3xl col-span-full">
                            <p className="text-sm font-bold text-[rgba(26,18,8,0.40)] uppercase tracking-widest">No style drops live</p>
                            <p className="text-xs text-[rgba(26,18,8,0.30)] mt-2">Check back soon for exclusive access to Bondi collections.</p>
                        </div>
                    )}
                </div>
            )}
            
            {confirmingDrop && (() => {
                const key = confirmingDrop.slug ?? confirmingDrop.venueId;
                const venueName = (key ? venuesBySlug[key]?.name : undefined) ?? confirmingDrop.venueName ?? "A special place";
                return (
                    <Dialog open={!!confirmingDrop} onOpenChange={() => setConfirmingDrop(null)}>
                        <DialogContent className="bg-[#f2ece0] border-none rounded-3xl shadow-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold text-[#1a1208]">Secure Access</DialogTitle>
                                <DialogDescription className="text-[rgba(26,18,8,0.60)]">
                                    You're claiming: <strong>{confirmingDrop.title}</strong> at {venueName}.
                                    {confirmingDrop.priceToClaimCents > 0 && ` A reservation fee of $${confirmingDrop.priceToClaimCents / 100} applies.`}
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="mt-4 gap-2 flex-col sm:flex-row">
                                <Button variant="ghost" onClick={() => setConfirmingDrop(null)} className="text-[rgba(26,18,8,0.40)]">Cancel</Button>
                                <Button className="bg-[#c4762a] hover:bg-[#b06824] text-white font-bold rounded-xl h-12" onClick={handleConfirmClaim}>Confirm Claim</Button>
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
                    <DialogContent className="bg-[#f2ece0] border-none rounded-3xl shadow-2xl max-w-sm">
                        <div className="py-8 flex flex-col items-center text-center">
                            <div className="h-20 w-20 flex items-center justify-center rounded-full bg-[#c4762a]/10 mb-6">
                                <CheckCircle className="h-10 w-10 text-[#c4762a]" />
                            </div>
                            <h2 className="text-3xl font-black tracking-tighter text-[#1a1208]">YOU'RE IN</h2>
                            <p className="mt-3 text-sm text-[rgba(26,18,8,0.60)] leading-relaxed px-4">
                                Your access for <strong>{successfulDrop.title}</strong> at {venueName} is confirmed. Show your code upon arrival.
                            </p>
                        </div>
                        <div className="flex flex-col items-center justify-center space-y-4 p-4 bg-white/50 rounded-2xl mb-6">
                          <QRCodeSVG className="h-40 w-48" />
                          <p className="text-[10px] font-bold text-[rgba(26,18,8,0.40)] uppercase tracking-widest">
                            Store ID: STYLE-{successfulDrop.id.slice(-4).toUpperCase()}
                          </p>
                        </div>
                         <DialogFooter>
                            <Button className="w-full h-14 bg-[#c4762a] hover:bg-[#b06824] text-white font-black text-lg rounded-2xl shadow-xl shadow-[#c4762a]/20" onClick={() => setSuccessfulDrop(null)}>
                               DONE
                            </Button>
                         </DialogFooter>
                    </DialogContent>
                </Dialog>
                 )
            })()}
        </div>
    );
}
