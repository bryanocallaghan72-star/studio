"use client";

import { useMemo, useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ticket, Utensils, Droplet, ShoppingBag, Calendar, CalendarCheck2, CheckCircle, Copy, Check } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useDeals } from '@/hooks/useDeals';
import type { Deal } from '@/data/seeds/drops';
import { useVenues } from '@/hooks/useVenues';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';
import { useFirestore, useUser, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

const categories = [
    { name: 'All', icon: Ticket },
    { name: 'Food & Drink', icon: Utensils },
    { name: 'Fitness', icon: Droplet },
    { name: 'Shopping', icon: ShoppingBag },
    { name: 'Mid-week', icon: Calendar },
    { name: 'Weekend', icon: CalendarCheck2 },
];


const DealCardSkeleton = () => (
  <Card className="group overflow-hidden relative bg-card h-64">
    <Skeleton className="h-full w-full" />
  </Card>
);

export function Deals() {
    const [confirmingDeal, setConfirmingDeal] = useState<{ deal: Deal; venueName: string } | null>(null);
    const [successfulDeal, setSuccessfulDeal] = useState<{ deal: Deal; venueName: string } | null>(null);
    const [redemptionCode, setRedemptionCode] = useState('');
    const [copied, setCopied] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All');

    const { user } = useUser();
    const firestore = useFirestore();
    const { deals, isLoading: areDealsLoading } = useDeals();
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

    const handleClaimClick = (deal: Deal, venueName: string) => {
        setConfirmingDeal({ deal, venueName });
    };

    const handleConfirmClaim = () => {
        if (!confirmingDeal || !user || !firestore) return;
        
        const { deal, venueName } = confirmingDeal;
        
        // Generate the token code here so we can persist it immediately
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let generatedCode = 'BND-';
        for (let i = 0; i < 3; i++) {
            generatedCode += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        setRedemptionCode(generatedCode);

        // Firestore Write: Persistent claim record for venue attribution
        const claimsRef = collection(firestore, 'claims');
        addDocumentNonBlocking(claimsRef, {
            userId: user.uid,
            dropId: deal.id,
            venueName: venueName,
            offerTitle: deal.title,
            code: generatedCode,
            claimedAt: serverTimestamp(),
            type: 'deal',
            status: 'claimed'
        });

        setSuccessfulDeal(confirmingDeal);
        setConfirmingDeal(null);
    };

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

    const filteredDeals = useMemo(() => {
        if (!deals) return [];
        return deals.filter(deal => {
            if (activeCategory === 'All') return true;
            if (activeCategory === 'Weekend') return deal.tags?.includes('Weekend');
            if (activeCategory === 'Mid-week') return !deal.tags?.includes('Weekend');
            return deal.category === activeCategory;
        });
    }, [deals, activeCategory]);
    
    const isLoading = areDealsLoading || areVenuesLoading;

    return (
        <div className="flex flex-col bg-[#f2ece0] min-h-screen p-4 md:p-6 pb-32">
            <header className="mb-6">
                <div className="flex items-center gap-3 mb-1">
                     <Ticket className="h-8 w-8 text-[#c4762a]" />
                     <h2 className="text-3xl font-black tracking-tighter text-[#1a1208] italic uppercase">DEALS</h2>
                </div>
                <p className="text-[13px] font-bold text-[rgba(26,18,8,0.40)] uppercase tracking-widest leading-none">Exclusive Bondi perks · curated</p>
            </header>

            <div className="flex overflow-x-auto pb-4 mb-6 scrollbar-hide -mx-4 px-4 gap-2">
                {categories.map((category) => {
                    const Icon = category.icon;
                    const isActive = activeCategory === category.name;
                    return (
                        <button
                            key={category.name}
                            onClick={() => setActiveCategory(category.name)}
                            className={cn(
                                "flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-bold transition-all duration-200",
                                isActive 
                                    ? "bg-[#1a1208] text-white shadow-md" 
                                    : "bg-[rgba(26,18,8,0.06)] text-[rgba(26,18,8,0.45)] hover:bg-[rgba(26,18,8,0.1)]"
                            )}
                        >
                            <Icon className="h-3.5 w-3.5" />
                            {category.name}
                        </button>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
                {isLoading ? (
                  <>
                    <DealCardSkeleton />
                    <DealCardSkeleton />
                  </>
                ) : (
                  filteredDeals.map(deal => {
                     const image = PlaceHolderImages.find(img => img.id === deal.imageId);
                     const venueName = venuesBySlug[deal.venueSlug]?.name ?? "A special place";

                     return (
                        <Card key={deal.id} className="group overflow-hidden relative aspect-[16/10] transition-all hover:shadow-xl border border-black/[0.08] rounded-2xl bg-white">
                            <div className="absolute inset-0">
                                {image ? (
                                    <>
                                        <Image
                                            src={image.imageUrl}
                                            alt={deal.description}
                                            fill
                                            unoptimized
                                            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                                            data-ai-hint={image.imageHint}
                                        />
                                        <div 
                                            className="absolute inset-0" 
                                            style={{ background: 'linear-gradient(to top, rgba(8,10,13,0.85) 0%, rgba(8,10,13,0.4) 35%, transparent 55%)' }} 
                                        />
                                    </>
                                ) : (
                                    <div className="bg-secondary h-full w-full"/>
                                )}
                            </div>
                            
                            <Badge className="absolute top-3 right-3 bg-[#c4762a] text-white border-none font-black text-[10px] tracking-widest px-2 py-0.5 z-10 shadow-lg">
                                DEAL
                            </Badge>

                            <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
                                <div className="flex justify-between items-end gap-4">
                                    <div className="space-y-0.5">
                                        <h3 className="text-xl font-bold leading-tight">{deal.title}</h3>
                                        <p className="text-sm text-white/60 font-medium">{venueName} · {deal.validity}</p>
                                    </div>
                                    <Button 
                                        className="bg-[#c4762a] hover:bg-[#b06824] text-white font-bold rounded-full px-6 h-10 shadow-lg shadow-[#c4762a]/20 transition-all active:scale-95 flex-shrink-0"
                                        onClick={() => handleClaimClick(deal, venueName)}
                                    >
                                        Claim
                                    </Button>
                                </div>
                            </div>
                        </Card>
                     )
                  })
                )}
            </div>
             {filteredDeals.length === 0 && !isLoading && (
                <div className="text-center py-24 px-6 border-2 border-dashed border-black/[0.05] rounded-3xl">
                    <p className="text-sm font-bold text-[rgba(26,18,8,0.40)] uppercase tracking-widest">No deals active</p>
                    <p className="text-xs text-[rgba(26,18,8,0.30)] mt-2">Check back soon or try another category.</p>
                </div>
            )}

            {/* Confirmation Dialog */}
            {confirmingDeal && (
                <Dialog open={!!confirmingDeal} onOpenChange={() => setConfirmingDeal(null)}>
                    <DialogContent className="bg-[#f2ece0] border-none rounded-3xl shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-[#1a1208]">Claim This Deal?</DialogTitle>
                            <DialogDescription className="text-[rgba(26,18,8,0.60)]">
                                You're about to claim <strong>{confirmingDeal.deal.title}</strong> at {confirmingDeal.venueName}.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4 gap-2 flex-col sm:flex-row">
                            <Button variant="ghost" onClick={() => setConfirmingDeal(null)} className="text-[rgba(26,18,8,0.40)] font-bold">Cancel</Button>
                            <Button className="bg-[#c4762a] hover:bg-[#b06824] text-white font-bold rounded-xl h-12" onClick={handleConfirmClaim}>Confirm Claim</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Success Dialog */}
            {successfulDeal && (
                <Dialog open={!!successfulDeal} onOpenChange={() => setSuccessfulDeal(null)}>
                    <DialogContent className="sm:max-w-md bg-[#f2ece0] border-none rounded-3xl shadow-2xl">
                        <DialogHeader>
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#c4762a]/10 mb-4">
                                <CheckCircle className="h-6 w-6 text-[#c4762a]" />
                            </div>
                            <DialogTitle className="text-center text-2xl font-bold text-[#1a1208]">
                                Deal Claimed!
                            </DialogTitle>
                            <DialogDescription className="text-center text-[rgba(26,18,8,0.60)]">
                                {successfulDeal.deal.title} at <strong>{successfulDeal.venueName}</strong>
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col items-center justify-center space-y-6 p-4">
                            <div className="relative w-full">
                                <div className="flex items-center justify-center rounded-2xl border border-black/[0.08] bg-white py-8 px-6 shadow-sm">
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
                            <div className="text-center space-y-1">
                                <p className="text-xs font-bold text-[#c4762a] uppercase tracking-widest">
                                    Redemption Code
                                </p>
                                <p className="text-[11px] font-medium text-[rgba(26,18,8,0.40)]">
                                    Valid for 24 hours · Show at venue
                                </p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button className="w-full h-14 bg-[#c4762a] hover:bg-[#b06824] text-white font-black text-lg rounded-2xl" onClick={() => setSuccessfulDeal(null)}>
                                DONE
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
