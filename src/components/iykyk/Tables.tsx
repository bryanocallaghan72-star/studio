
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Utensils, CheckCircle, Copy, Check, Plus, Loader2, X } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirestore, useUser, setDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { doc, collection, serverTimestamp } from 'firebase/firestore';
import { useTableDrops, type TableDrop } from '@/hooks/useTableDrops';
import { useVenues } from '@/hooks/useVenues';
import { useCreators } from '@/hooks/useCreators';
import { cn } from '@/lib/utils';
import { useDemoTime } from '@/context/DemoTimeContext';
import { useToast } from '@/hooks/use-toast';

type TableDropWithClaim = TableDrop & {
    hasUserClaimed: boolean;
};

const Countdown = ({ expiresAt }: { expiresAt: string }) => {
    const { mockDate } = useDemoTime();
    const [timeLeft, setTimeLeft] = useState(0);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const startRealTime = Date.now();

        const update = () => {
            const elapsed = Date.now() - startRealTime;
            const currentMockTime = mockDate.getTime() + elapsed;
            const remaining = new Date(expiresAt).getTime() - currentMockTime;
            setTimeLeft(remaining > 0 ? remaining : 0);
        };

        update();
        const intervalId = setInterval(update, 1000);
        return () => clearInterval(intervalId);
    }, [expiresAt, mockDate]);

    if (!isClient) {
        return <span className="font-mono text-lg font-semibold text-white">00:00:00</span>;
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

const TableDropCard = ({ drop, onClaim, venueName, creator }: { drop: TableDropWithClaim, onClaim: (drop: TableDropWithClaim) => void, venueName: string, creator: any }) => {
    const [formattedTimes, setFormattedTimes] = useState<{ start: string; end: string } | null>(null);
    const { user } = useUser();

    useEffect(() => {
        setFormattedTimes({
            start: new Date(drop.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            end: new Date(drop.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
    }, [drop.startTime, drop.endTime]);

    const handleClaim = () => {
        onClaim(drop);
    }

    return (
        <Card key={drop.id} className="group relative overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1 border-2 border-transparent hover:border-[#c4762a]/50 rounded-2xl bg-white shadow-sm">
            <div className="absolute inset-0">
                <Image
                    src={drop.venueImageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop'}
                    alt={venueName}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    data-ai-hint="restaurant interior"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
            </div>
            <CardContent className="relative z-10 flex flex-col justify-end h-full p-6 text-white min-h-[350px]">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Badge className="bg-[#c4762a] text-white border-none text-[10px] font-black uppercase tracking-widest px-2 py-0.5 shadow-lg">
                            <Utensils size={10} className="mr-1 fill-current" />
                            <span>DROP</span>
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
                        <h3 className="text-2xl font-bold leading-tight text-white" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.55)" }}>
                            {venueName}{drop.tableLabel && ` – ${drop.tableLabel}`}
                        </h3>
                        {formattedTimes ? (
                             <p className="text-white/90 mt-1 font-medium">Table for {drop.partySize} • {formattedTimes.start} – {formattedTimes.end}</p>
                        ) : (
                            <Skeleton className="h-5 w-48 mt-1 bg-white/20" />
                        )}
                    </div>
                </div>
                <div className='mt-6'>
                    <div className="flex items-center justify-between rounded-xl bg-[#c4762a]/80 p-3 backdrop-blur-md border border-white/10">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-white/80">Drop expires in:</p>
                        <Countdown expiresAt={drop.expiresAt} />
                    </div>
                    <Button
                        className="w-full mt-3 h-12 bg-[#c4762a] text-white hover:bg-[#b06824] rounded-2xl font-bold shadow-lg shadow-[#c4762a]/20 transition-all active:scale-95"
                        onClick={handleClaim}
                        disabled={drop.hasUserClaimed || !user}
                    >
                        {drop.hasUserClaimed ? 'Spot Secured' : 
                         drop.priceToClaimCents > 0 ? `Claim Table ($${drop.priceToClaimCents / 100})` : 'Claim Table'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

const TablesSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        <Skeleton className="h-[400px] w-full rounded-2xl" />
        <Skeleton className="h-[400px] w-full rounded-2xl" />
    </div>
);

export function Tables() {
    const [claimedDrops, setClaimedDrops] = useState<string[]>([]);
    const [confirmingDrop, setConfirmingDrop] = useState<TableDrop | null>(null);
    const [successfulDrop, setSuccessfulDrop] = useState<TableDrop | null>(null);
    const [redemptionCode, setRedemptionCode] = useState('');
    const [copied, setCopied] = useState(false);
    const [isClient, setIsClient] = useState(false);
    
    // Create Drop State
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isSubmittingDrop, setIsSubmittingDrop] = useState(false);
    const [newDrop, setNewDrop] = useState({
        venueName: '',
        tableLabel: '',
        partySize: 2,
        startTime: '',
        endTime: '',
        expiresAt: '',
        priceToClaimCents: 0,
        currency: 'AUD'
    });

    const firestore = useFirestore();
    const { user } = useUser();
    const { mockDate } = useDemoTime();
    const { toast } = useToast();

    const { tableDrops, isLoading: areDropsLoading } = useTableDrops();
    const { venues, isLoading: areVenuesLoading } = useVenues();
    const { creatorsById, isLoading: areCreatorsLoading } = useCreators();

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (successfulDrop) {
            const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
            let result = 'BND-';
            for (let i = 0; i < 3; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            setRedemptionCode(result);
        }
    }, [successfulDrop]);

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

    const venuesBySlug = useMemo(() => {
        if (!venues) return {};
        return venues.reduce((acc, venue) => {
            if (venue.slug) {
                acc[venue.slug] = venue;
            }
            return acc;
        }, {} as Record<string, (typeof venues)[number]>);
    }, [venues]);

    const handleClaimClick = (drop: TableDropWithClaim) => {
        setConfirmingDrop(drop);
    };

    const handleConfirmClaim = () => {
        if (!confirmingDrop || !user || !firestore) return;
        
        const venueKey = confirmingDrop.venueId;
        const venue = venueKey ? venuesBySlug[venueKey] : undefined;
        const venueName = venue?.name ?? confirmingDrop.venueName;

        setClaimedDrops(prev => [...prev, confirmingDrop!.id]);
        setSuccessfulDrop(confirmingDrop);
        setConfirmingDrop(null);

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

    const handleCreateTableDrop = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firestore || !user) return;

        setIsSubmittingDrop(true);

        const dropData = {
            venueName: newDrop.venueName,
            tableLabel: newDrop.tableLabel,
            partySize: Number(newDrop.partySize),
            startTime: new Date(newDrop.startTime).toISOString(),
            endTime: new Date(newDrop.endTime).toISOString(),
            expiresAt: new Date(newDrop.expiresAt).toISOString(),
            priceToClaimCents: Number(newDrop.priceToClaimCents),
            currency: newDrop.currency,
            venueId: '', // Default to empty if not mapped
            venueImageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop',
            location: { lat: -33.8908, lng: 151.2743 },
            createdAt: serverTimestamp(),
            isFavoriteVenue: false,
        };

        try {
            await addDocumentNonBlocking(collection(firestore, 'tableDrops'), dropData);
            toast({
                title: "Table Released! 🤙",
                description: `${newDrop.venueName} is now live on the Tables feed.`,
            });
            setIsCreateDialogOpen(false);
            setNewDrop({
                venueName: '',
                tableLabel: '',
                partySize: 2,
                startTime: '',
                endTime: '',
                expiresAt: '',
                priceToClaimCents: 0,
                currency: 'AUD'
            });
        } catch (error) {
            console.error("Table drop creation failed:", error);
            toast({
                variant: "destructive",
                title: "Release failed",
                description: "Something went wrong. Please try again.",
            });
        } finally {
            setIsSubmittingDrop(false);
        }
    };
    
    const liveDrops = useMemo(() => {
        if (!isClient || !tableDrops) return [];
        // Filter based on God Mode mockDate
        return tableDrops
            .filter(drop => new Date(drop.expiresAt).getTime() > mockDate.getTime())
            .map(drop => ({ ...drop, hasUserClaimed: claimedDrops.includes(drop.id) }))
            .sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime());
    }, [tableDrops, isClient, claimedDrops, mockDate]);

    const favoriteDrops = useMemo(() => liveDrops.filter(drop => drop.isFavoriteVenue), [liveDrops]);

    const isLoading = !isClient || areDropsLoading || areVenuesLoading || areCreatorsLoading;
    
    if (!isClient) {
        return <TablesSkeleton />;
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-[#f2ece0] p-4 md:p-6 pb-32">
            <header className="mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#c4762a]/10">
                        <Utensils className="h-6 w-6 text-[#c4762a]" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter text-[#1a1208] uppercase italic">TABLES</h1>
                        <p className="text-[13px] font-bold text-[rgba(26,18,8,0.40)] uppercase tracking-widest">Last-minute tables · Bondi</p>
                    </div>
                </div>
            </header>

            {isLoading ? <TablesSkeleton /> : (
                <Tabs defaultValue="live" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-[rgba(26,18,8,0.06)] rounded-full p-1 h-12 border-none">
                        <TabsTrigger 
                            value="hit-list"
                            className="rounded-full text-[13px] font-bold data-[state=active]:bg-white data-[state=active]:text-[#1a1208] data-[state=active]:shadow-sm text-[rgba(26,18,8,0.40)]"
                        >
                            My Hit List
                        </TabsTrigger>
                        <TabsTrigger 
                            value="live"
                            className="rounded-full text-[13px] font-bold data-[state=active]:bg-white data-[state=active]:text-[#1a1208] data-[state=active]:shadow-sm text-[rgba(26,18,8,0.40)]"
                        >
                            Live Drops
                        </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="hit-list" className="mt-8">
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
                            <div className="text-center py-24 px-6 border-2 border-dashed border-black/[0.05] rounded-3xl">
                                <p className="text-sm font-bold text-[rgba(26,18,8,0.40)] uppercase tracking-widest">No matching drops</p>
                                <p className="text-xs text-[rgba(26,18,8,0.30)] mt-2">Add favorites from the Map or Feed to see their tables here first.</p>
                            </div>
                        )}
                    </TabsContent>
                    
                    <TabsContent value="live" className="mt-8">
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
                            <div className="text-center py-24">
                                <p className="text-sm font-bold text-[rgba(26,18,8,0.40)] uppercase tracking-widest">No live drops</p>
                                <p className="text-xs text-[rgba(26,18,8,0.30)] mt-2">Check back soon for last-minute table drops in Bondi.</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            )}

            {/* Create Table Drop FAB */}
            <button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="fixed bottom-36 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#c4762a] text-white shadow-lg shadow-[#c4762a]/30 transition-transform active:scale-90 hover:bg-[#b06824] focus:outline-none"
                aria-label="Release table"
            >
                <Plus size={28} strokeWidth={3} />
            </button>

            {/* Create Table Drop Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-md bg-[#f2ece0] border-none rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tighter text-[#1a1208] uppercase italic">RELEASE TABLE</DialogTitle>
                        <DialogDescription className="text-[rgba(26,18,8,0.50)] font-medium">Post immediate availability to Bondi locals.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateTableDrop} className="space-y-5 py-4">
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-[#c4762a]">Venue Name</Label>
                            <Input 
                                required
                                value={newDrop.venueName}
                                onChange={e => setNewDrop({...newDrop, venueName: e.target.value})}
                                placeholder="e.g. Totti's"
                                className="rounded-xl border-black/[0.08] bg-white h-12 text-sm font-bold text-[#1a1208]"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-[#c4762a]">Table Description</Label>
                            <Input 
                                value={newDrop.tableLabel}
                                onChange={e => setNewDrop({...newDrop, tableLabel: e.target.value})}
                                placeholder="e.g. Courtyard Window"
                                className="rounded-xl border-black/[0.08] bg-white h-12 text-sm font-bold text-[#1a1208]"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#c4762a]">Party Size</Label>
                                <Input 
                                    type="number"
                                    required
                                    value={newDrop.partySize}
                                    onChange={e => setNewDrop({...newDrop, partySize: Number(e.target.value)})}
                                    className="rounded-xl border-black/[0.08] bg-white h-12 text-sm font-bold text-[#1a1208]"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#c4762a]">Price (Cents)</Label>
                                <Input 
                                    type="number"
                                    required
                                    value={newDrop.priceToClaimCents}
                                    onChange={e => setNewDrop({...newDrop, priceToClaimCents: Number(e.target.value)})}
                                    className="rounded-xl border-black/[0.08] bg-white h-12 text-sm font-bold text-[#1a1208]"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#c4762a]">Start Time</Label>
                                <Input 
                                    type="datetime-local"
                                    required
                                    value={newDrop.startTime}
                                    onChange={e => setNewDrop({...newDrop, startTime: e.target.value})}
                                    className="rounded-xl border-black/[0.08] bg-white h-12 text-sm font-bold text-[#1a1208]"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#c4762a]">End Time</Label>
                                <Input 
                                    type="datetime-local"
                                    required
                                    value={newDrop.endTime}
                                    onChange={e => setNewDrop({...newDrop, endTime: e.target.value})}
                                    className="rounded-xl border-black/[0.08] bg-white h-12 text-sm font-bold text-[#1a1208]"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-[#c4762a]">Drop Expires</Label>
                            <Input 
                                type="datetime-local"
                                required
                                value={newDrop.expiresAt}
                                onChange={e => setNewDrop({...newDrop, expiresAt: e.target.value})}
                                className="rounded-xl border-black/[0.08] bg-white h-12 text-sm font-bold text-[#1a1208]"
                            />
                        </div>
                        <DialogFooter className="pt-4">
                            <Button 
                                type="submit" 
                                disabled={isSubmittingDrop}
                                className="w-full h-14 bg-[#c4762a] hover:bg-[#b06824] text-white font-black text-lg rounded-2xl shadow-xl shadow-[#c4762a]/20"
                            >
                                {isSubmittingDrop ? <Loader2 className="animate-spin h-6 w-6" /> : "RELEASE TABLE 🤙"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            
            {confirmingDrop && (() => {
                const venue = venuesBySlug[confirmingDrop.venueId];
                const venueName = venue?.name ?? confirmingDrop.venueName;
                return (
                    <Dialog open={!!confirmingDrop} onOpenChange={() => setConfirmingDrop(null)}>
                        <DialogContent className="bg-[#f2ece0] border-none rounded-3xl shadow-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold text-[#1a1208]">Confirm Your Table</DialogTitle>
                                <DialogDescription className="text-[rgba(26,18,8,0.60)]">
                                    You're claiming a table for {confirmingDrop.partySize} at <strong>{venueName}</strong> from {new Date(confirmingDrop.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.
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
                const venue = venuesBySlug[successfulDrop.venueId];
                const venueName = venue?.name ?? successfulDrop.venueName;
                return (
                    <Dialog open={!!successfulDrop} onOpenChange={() => setSuccessfulDrop(null)}>
                        <DialogContent className="p-0 border-0 bg-transparent shadow-none max-w-sm">
                           <div className="relative overflow-hidden rounded-3xl bg-[#f2ece0] shadow-2xl border-none text-[#1a1208]">
                             <div className="p-8 flex flex-col items-center text-center">
                                <div className="h-20 w-20 flex items-center justify-center rounded-full bg-[#c4762a]/10 mb-6">
                                    <CheckCircle className="h-10 w-10 text-[#c4762a]" />
                                </div>
                                <h2 className="text-3xl font-black tracking-tighter uppercase italic">YOU'RE IN</h2>
                                <p className="font-bold mt-2 text-[rgba(26,18,8,0.50)] uppercase tracking-widest text-[10px]">Table Claimed at</p>
                                <p className="text-2xl font-bold mt-1">{venueName}</p>
                                
                                <div className="my-6 w-full space-y-2 text-left bg-white/50 p-5 rounded-2xl border border-black/[0.05]">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] font-bold text-[rgba(26,18,8,0.40)] uppercase">Party Size</span>
                                        <span className="font-bold">{successfulDrop.partySize} People</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] font-bold text-[rgba(26,18,8,0.40)] uppercase">Time</span>
                                        <span className="font-bold">{new Date(successfulDrop.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="pt-2 border-t border-black/[0.05] mt-2">
                                        <p className="text-[10px] text-center text-[rgba(26,18,8,0.40)] italic font-medium">Please arrive by {new Date(new Date(successfulDrop.startTime).getTime() + 15 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>

                                <div className="relative w-full mb-6">
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
                                
                                <p className="text-[10px] mt-2 font-bold text-[rgba(26,18,8,0.30)] uppercase tracking-widest">Show this code upon arrival</p>
                             </div>
                             <div className="p-4 bg-black/[0.03] border-t border-black/[0.05]">
                                <Button className="w-full h-14 bg-[#c4762a] hover:bg-[#b06824] text-white font-black text-lg rounded-2xl shadow-xl shadow-[#c4762a]/20" onClick={() => setSuccessfulDrop(null)}>DONE</Button>
                             </div>
                           </div>
                        </DialogContent>
                    </Dialog>
                )
            })()}
        </div>
    );
}
