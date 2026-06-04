'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dumbbell, CheckCircle, Zap, Clock, Copy, Check, Plus, Loader2, X } from "lucide-react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirestore, useUser, setDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { useVenues } from '@/hooks/useVenues';
import { useClassDrops } from '@/hooks/useClassDrops';
import type { ClassDrop } from '@/data/seeds/drops';
import { useCreators } from '@/hooks/useCreators';
import { cn } from '@/lib/utils';
import { useDemoTime } from '@/context/DemoTimeContext';
import { useToast } from '@/hooks/use-toast';

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
        return <span className="font-mono text-base font-bold">00:00:00</span>;
    }

    if (timeLeft <= 0) {
        return <span className="font-mono text-base font-bold">ENDED</span>;
    }
    
    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    return (
        <span className="font-mono text-base font-bold">
            {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
    );
};

const ClassDropCard = ({ drop, venueName, onClaim }: { drop: ClassDrop, venueName: string, onClaim: (drop: ClassDrop) => void }) => {
    const [formattedTime, setFormattedTime] = useState<string | null>(null);
    const { user } = useUser();
    const [hasUserClaimed, setHasUserClaimed] = useState(false);

     useEffect(() => {
        setFormattedTime(new Date(drop.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, [drop.startTime]);

    const handleClaim = () => {
        setHasUserClaimed(true);
        onClaim(drop);
      };      

    return (
        <Card key={drop.id} className="group overflow-hidden bg-white border border-black/[0.08] rounded-2xl transition-all hover:shadow-md">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                <Image
                    src={drop.classImageUrl}
                    alt={drop.className}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    data-ai-hint="fitness class"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <Badge className="bg-[#c4762a] text-white border-none text-[10px] font-black uppercase tracking-widest px-2 py-0.5">
                        <Zap size={10} className="mr-1 fill-current" />
                        DROP
                    </Badge>
                    <span className="text-[11px] font-bold tracking-tight text-[rgba(26,18,8,0.40)] uppercase">
                        Live drop · Venue offer
                    </span>
                </div>

                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-[#1a1208] leading-tight">
                        {drop.className}
                    </h3>
                    <p className="text-[13px] font-medium text-[rgba(26,18,8,0.50)]">
                        {venueName} · {drop.spotsAvailable} spot{drop.spotsAvailable > 1 ? 's' : ''} left
                    </p>
                    <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#c4762a]">
                        <Clock size={12} />
                        Starts at {formattedTime || '...'}
                    </div>
                </div>

                <div className="bg-[rgba(26,18,8,0.04)] border border-black/[0.05] rounded-xl p-3 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[rgba(26,18,8,0.45)] uppercase tracking-wide">Expires in</span>
                    <div className="text-[#c4762a]">
                        <Countdown expiresAt={drop.expiresAt} />
                    </div>
                </div>

                <Button
                    className="w-full h-12 rounded-xl bg-[#c4762a] text-white font-bold hover:bg-[#b06824] shadow-lg shadow-[#c4762a]/10"
                    onClick={handleClaim}
                    disabled={hasUserClaimed || !user}
                >
                    {hasUserClaimed ? 'Spot Claimed' : 'Claim Spot'}
                </Button>
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
    const [redemptionCode, setRedemptionCode] = useState('');
    const [copied, setCopied] = useState(false);

    // Create Drop State
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isSubmittingDrop, setIsSubmittingDrop] = useState(false);
    const [newDrop, setNewDrop] = useState({
        className: '',
        venueName: '',
        spotsAvailable: 5,
        startTime: '',
        expiresAt: '',
        instructorHandle: '',
        classImageUrl: ''
    });

    const firestore = useFirestore();
    const { user } = useUser();
    const { mockDate } = useDemoTime();
    const { toast } = useToast();
    
    const { classDrops, isLoading: areDropsLoading } = useClassDrops();
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

    const handleClaimClick = (drop: ClassDrop) => setConfirmingDrop(drop);

    const handleConfirmClaim = () => {
        if (!confirmingDrop || !user || !firestore) return;
        
        const venueName = venuesBySlug[confirmingDrop.venueId]?.name ?? confirmingDrop.venueName;
        
        setClaimedDrops(prev => [...prev, confirmingDrop!.id]);
        setSuccessfulDrop(confirmingDrop);
        setConfirmingDrop(null);

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

    const handleCreateDrop = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firestore || !user) return;

        setIsSubmittingDrop(true);

        const dropData = {
            className: newDrop.className,
            venueName: newDrop.venueName,
            venueId: '',
            spotsAvailable: Number(newDrop.spotsAvailable),
            startTime: new Date(newDrop.startTime).toISOString(),
            expiresAt: new Date(newDrop.expiresAt).toISOString(),
            instructorHandle: newDrop.instructorHandle || null,
            classImageUrl: newDrop.classImageUrl || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
            isFavoriteVenue: false,
            location: { lat: -33.8908, lng: 151.2743 },
            createdAt: new Date().toISOString()
        };

        try {
            await addDocumentNonBlocking(collection(firestore, 'classDrops'), dropData);
            toast({
                title: "Drop Created! 🤙",
                description: `${newDrop.className} is now live on the Active feed.`,
            });
            setIsCreateDialogOpen(false);
            setNewDrop({
                className: '',
                venueName: '',
                spotsAvailable: 5,
                startTime: '',
                expiresAt: '',
                instructorHandle: '',
                classImageUrl: ''
            });
        } catch (error) {
            console.error("Drop creation failed:", error);
            toast({
                variant: "destructive",
                title: "Creation failed",
                description: "Something went wrong. Please try again.",
            });
        } finally {
            setIsSubmittingDrop(false);
        }
    };
    
    const liveDrops = useMemo(() => {
        if (!isClient || !classDrops) return [];
        // Filter based on God Mode mockDate
        return classDrops
            .filter(drop => new Date(drop.expiresAt).getTime() > mockDate.getTime())
            .map(drop => ({ ...drop, hasUserClaimed: claimedDrops.includes(drop.id) }))
            .sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime());
    }, [classDrops, isClient, claimedDrops, mockDate]);
    
    const favoriteDrops = useMemo(() => liveDrops.filter(drop => drop.isFavoriteVenue), [liveDrops]);
    
    const isLoading = !isClient || areDropsLoading || areVenuesLoading || areCreatorsLoading;

    if (!isClient) {
        return <ActivePageSkeleton />;
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-[#f2ece0] p-4 md:p-6 pb-32">
            <header className="mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#c4762a]/10">
                        <Dumbbell className="h-6 w-6 text-[#c4762a]" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter text-[#1a1208] uppercase italic">ACTIVE</h1>
                        <p className="text-[13px] font-bold text-[rgba(26,18,8,0.40)] uppercase tracking-widest">Live class drops · Bondi</p>
                    </div>
                </div>
            </header>
            
            {isLoading ? <ActivePageSkeleton /> : (
                <Tabs defaultValue="live" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-[rgba(26,18,8,0.06)] rounded-full p-1 h-12">
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
                                    const venueName = venuesBySlug[drop.venueId]?.name ?? drop.venueName;
                                    return <ClassDropCard key={drop.id} drop={drop} venueName={venueName} onClaim={handleClaimClick} />;
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-24 px-6 border-2 border-dashed border-black/[0.05] rounded-3xl">
                                <p className="text-sm font-bold text-[rgba(26,18,8,0.40)] uppercase tracking-widest">No matching drops</p>
                                <p className="text-xs text-[rgba(26,18,8,0.30)] mt-2">Favorite your go-to studios to see their last-minute spots here first.</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="live" className="mt-8">
                        {liveDrops.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {liveDrops.map(drop => {
                                    const venueName = venuesBySlug[drop.venueId]?.name ?? drop.venueName;
                                    return <ClassDropCard key={drop.id} drop={drop} venueName={venueName} onClaim={handleClaimClick} />;
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-24">
                                <p className="text-sm font-bold text-[rgba(26,18,8,0.40)] uppercase tracking-widest">All classes full</p>
                                <p className="text-xs text-[rgba(26,18,8,0.30)] mt-2">Check back soon for new drops from Bondi studios.</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            )}

            {/* Create Drop FAB */}
            <button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="fixed bottom-36 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#c4762a] text-white shadow-lg shadow-[#c4762a]/30 transition-transform active:scale-90 hover:bg-[#b06824] focus:outline-none"
                aria-label="Create new drop"
            >
                <Plus size={28} strokeWidth={3} />
            </button>
            
            {/* Create Drop Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-md bg-[#f2ece0] border-none rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tighter text-[#1a1208] uppercase italic">NEW CLASS DROP</DialogTitle>
                        <DialogDescription className="text-[rgba(26,18,8,0.50)] font-medium">Release last-minute spots to the community.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateDrop} className="space-y-5 py-4">
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-[#c4762a]">Class Name</Label>
                            <Input 
                                required
                                value={newDrop.className}
                                onChange={e => setNewDrop({...newDrop, className: e.target.value})}
                                placeholder="e.g. Reformer Fundamentals"
                                className="rounded-xl border-black/[0.08] bg-white h-12 text-sm font-bold text-[#1a1208]"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-[#c4762a]">Studio Name</Label>
                            <Input 
                                required
                                value={newDrop.venueName}
                                onChange={e => setNewDrop({...newDrop, venueName: e.target.value})}
                                placeholder="e.g. Fluidform Pilates"
                                className="rounded-xl border-black/[0.08] bg-white h-12 text-sm font-bold text-[#1a1208]"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#c4762a]">Spots</Label>
                                <Input 
                                    type="number"
                                    required
                                    value={newDrop.spotsAvailable}
                                    onChange={e => setNewDrop({...newDrop, spotsAvailable: Number(e.target.value)})}
                                    className="rounded-xl border-black/[0.08] bg-white h-12 text-sm font-bold text-[#1a1208]"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#c4762a]">Instructor @</Label>
                                <Input 
                                    value={newDrop.instructorHandle}
                                    onChange={e => setNewDrop({...newDrop, instructorHandle: e.target.value})}
                                    placeholder="shannon"
                                    className="rounded-xl border-black/[0.08] bg-white h-12 text-sm font-bold text-[#1a1208]"
                                />
                            </div>
                        </div>
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
                            <Label className="text-[10px] font-black uppercase tracking-widest text-[#c4762a]">Drop Expires</Label>
                            <Input 
                                type="datetime-local"
                                required
                                value={newDrop.expiresAt}
                                onChange={e => setNewDrop({...newDrop, expiresAt: e.target.value})}
                                className="rounded-xl border-black/[0.08] bg-white h-12 text-sm font-bold text-[#1a1208]"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-[#c4762a]">Image URL (Optional)</Label>
                            <Input 
                                value={newDrop.classImageUrl}
                                onChange={e => setNewDrop({...newDrop, classImageUrl: e.target.value})}
                                placeholder="https://..."
                                className="rounded-xl border-black/[0.08] bg-white h-12 text-sm font-bold text-[#1a1208]"
                            />
                        </div>
                        <DialogFooter className="pt-4">
                            <Button 
                                type="submit" 
                                disabled={isSubmittingDrop}
                                className="w-full h-14 bg-[#c4762a] hover:bg-[#b06824] text-white font-black text-lg rounded-2xl shadow-xl shadow-[#c4762a]/20"
                            >
                                {isSubmittingDrop ? <Loader2 className="animate-spin h-6 w-6" /> : "POST DROP 🤙"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            
            {confirmingDrop && (() => {
                const venueName = venuesBySlug[confirmingDrop.venueId]?.name ?? confirmingDrop.venueName;
                return (
                    <Dialog open={!!confirmingDrop} onOpenChange={() => setConfirmingDrop(null)}>
                        <DialogContent className="bg-[#f2ece0] border-none rounded-3xl shadow-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold text-[#1a1208]">Confirm Your Spot</DialogTitle>
                                <DialogDescription className="text-[rgba(26,18,8,0.60)]">
                                    You're claiming one of the final spots for <strong>{confirmingDrop.className}</strong> at {venueName}.
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
                 const venueName = venuesBySlug[successfulDrop.venueId]?.name ?? successfulDrop.venueName;
                 return (
                 <Dialog open={!!successfulDrop} onOpenChange={() => setSuccessfulDrop(null)}>
                    <DialogContent className="bg-[#f2ece0] border-none rounded-3xl shadow-2xl max-w-sm">
                        <div className="py-8 flex flex-col items-center text-center">
                            <div className="h-20 w-20 flex items-center justify-center rounded-full bg-[#c4762a]/10 mb-6">
                                <CheckCircle className="h-10 w-10 text-[#c4762a]" />
                            </div>
                            <h2 className="text-3xl font-black tracking-tighter text-[#1a1208]">YOU'RE IN</h2>
                            <p className="mt-3 text-sm text-[rgba(26,18,8,0.60)] leading-relaxed px-4">
                                Your spot for <strong>{successfulDrop.className}</strong> at {venueName} is secured. Show your confirmation upon arrival.
                            </p>
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

                         <DialogFooter>
                             <Button className="w-full h-14 bg-[#c4762a] hover:bg-[#b06824] text-white font-black text-lg rounded-2xl shadow-xl shadow-[#c4762a]/20" onClick={() => setSuccessfulDrop(null)}>
                                LET'S MOVE 🤙
                             </Button>
                         </DialogFooter>
                    </DialogContent>
                </Dialog>
                )
            })()}
        </div>
    );
}