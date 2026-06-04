"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Ticket, Bed, Copy, Check } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import Link from 'next/link';
import { CheckCircle, CalendarPlus } from 'lucide-react';
import { useFirestore, useUser, setDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { doc, collection, serverTimestamp } from 'firebase/firestore';
import { useCreators } from '@/hooks/useCreators';
import { useStays } from '@/hooks/useStays';

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


export function FlashStays() {
    const [selectedStay, setSelectedStay] = useState<ReturnType<typeof useStays>['stays'][0] | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [redemptionCode, setRedemptionCode] = useState('');
    const [copied, setCopied] = useState(false);
    const firestore = useFirestore();
    const { user } = useUser();
    const { creatorsById } = useCreators();
    const { stays } = useStays();

    useEffect(() => {
        if (isDialogOpen) {
            const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
            let result = 'BND-';
            for (let i = 0; i < 3; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            setRedemptionCode(result);
        }
    }, [isDialogOpen]);

    const handleCopy = async () => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(redemptionCode);
            } else {
                const el = document.createElement("textarea");
                el.value = redemptionCode;
                el.style.position = "absolute";
                el.style.left = "-9999px";
                document.body.appendChild(el);
                el.select();
                document.execCommand("copy");
                document.body.removeChild(el);
            }
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleBookNow = (stay: ReturnType<typeof useStays>['stays'][0]) => {
        setSelectedStay(stay);
        setIsDialogOpen(true);

        if (!user || !firestore) return;

        // Unified Claims Collection write (Top-level)
        const claimsRef = collection(firestore, 'claims');
        addDocumentNonBlocking(claimsRef, {
            userId: user.uid,
            stayId: stay.id,
            title: stay.title,
            type: 'flash-stay',
            claimedAt: serverTimestamp(),
            status: 'claimed'
        });

        // Log the claim for the user (Private history)
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

    const activeStays = stays.filter(item => item.endsIn && new Date(Date.now() + item.endsIn).getTime() > Date.now());

    return (
        <div className="flex flex-col bg-[#f2ece0] min-h-screen p-4 md:p-6 pb-32">
            <section>
                <header className="mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[#c4762a]/10">
                            <Zap className="h-6 w-6 text-[#c4762a]" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tighter text-[#1a1208] uppercase italic">FLASH</h1>
                            <p className="text-[13px] font-bold text-[rgba(26,18,8,0.40)] uppercase tracking-widest">Last-minute · Creator picks</p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {activeStays.map(stay => {
                        const image = stay.imageId ? PlaceHolderImages.find(img => img.id === stay.imageId) : null;
                        const creator = stay.creatorId ? creatorsById[stay.creatorId] : null;
                        return (
                            <Card key={stay.id} className="group relative overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1 border-none rounded-2xl aspect-[4/5] md:aspect-[16/10] bg-white">
                                <div className="absolute inset-0">
                                {image ? (
                                    <>
                                        <Image
                                            src={image.imageUrl}
                                            alt={stay.description}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            data-ai-hint={image.imageHint}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                    </>
                                ) : <div className="bg-secondary h-full w-full"/>}
                                </div>
                                <CardContent className="relative z-10 flex flex-col justify-end h-full p-6 text-white">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Badge className="flex items-center gap-2 w-min whitespace-nowrap bg-[#c4762a] text-white border-none px-2.5 py-1 text-[10px] font-black uppercase tracking-widest shadow-lg">
                                                <Zap size={12} className="fill-current" />
                                                <span>FLASH</span>
                                            </Badge>
                                             {creator && (
                                                <div className='flex items-center gap-2 text-[11px] font-bold bg-black/30 backdrop-blur-md px-2 py-1 rounded-full border border-white/10'>
                                                    <Avatar className="h-5 w-5">
                                                        <AvatarImage src={creator.avatar} alt={creator.name} />
                                                        <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <span>@{creator.id}'s pick</span>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold leading-tight text-white">{stay.title}</h3>
                                            <p className="text-[#c4762a] font-black text-lg mt-1">
                                                ${stay.pricePerNight} <span className="text-white/60 text-xs font-normal">/ night</span>
                                            </p>
                                        </div>
                                        
                                        <div className="bg-[#c4762a]/80 p-3 rounded-xl backdrop-blur-sm border border-white/10 flex items-center justify-between">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/80">Deal ends in:</p>
                                            <Countdown expiresAt={new Date(Date.now() + stay.endsIn).toISOString()} />
                                        </div>

                                        <Button 
                                            className="w-full h-12 bg-[#c4762a] hover:bg-[#b06824] text-white font-bold rounded-2xl shadow-lg shadow-[#c4762a]/20 transition-all active:scale-95"
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
                    <DialogContent className="bg-[#f2ece0] border-none rounded-3xl shadow-2xl max-w-sm">
                        <DialogHeader className="items-center text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#c4762a]/10 mb-4">
                                <CheckCircle className="h-8 w-8 text-[#c4762a]" />
                            </div>
                            <DialogTitle className="text-2xl font-bold text-[#1a1208]">Your stay is booked!</DialogTitle>
                            <DialogDescription className="text-[rgba(26,18,8,0.60)]">
                                You're all set for your trip to Bondi. Enjoy your stay at {selectedStay.title}.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="flex flex-col items-center justify-center space-y-4 py-4">
                            <div className="relative w-full">
                                <div className="flex items-center justify-center rounded-2xl border border-black/[0.08] bg-white py-6 px-6 shadow-sm">
                                    <span className="font-mono text-4xl font-black tracking-[0.2em] text-[#1a1208]">
                                        {redemptionCode}
                                    </span>
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#c4762a] text-white shadow-lg transition-transform active:scale-90"
                                >
                                    {copied ? <Check size={18} /> : <Copy size={18} />}
                                </button>
                            </div>
                            <p className="text-[10px] font-bold text-[rgba(26,18,8,0.40)] uppercase tracking-widest">
                                Booking Ref: {redemptionCode}
                            </p>
                        </div>

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
