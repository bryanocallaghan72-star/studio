'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { collection, query, where, orderBy, limit, Timestamp, doc, updateDoc, increment, serverTimestamp, addDoc } from 'firebase/firestore';
import { Users, UserPlus, MapPin, Coffee, Dumbbell, Waves, Plus, Loader2, Check } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Progress } from "../ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CreateActivityDialog } from "./CreateActivityDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

// Define a more specific type for the social activities fetched from Firestore
type SocialActivity = {
    id: string;
    title: string;
    description: string;
    startAt: Timestamp;
    endAt?: Timestamp;
    venueSlug?: string;
    locationText: string;
    geo?: { lat: number; lng: number };
    hostId: string;
    hostUsername: string;
    currentParticipants: number;
    maxParticipants: number;
    category: 'Health & Fitness' | 'Vibes' | 'Brunch' | 'Sushi';
};

const ParticipantAvatars = ({ count }: { count: number }) => {
    // This component can be enhanced later to fetch actual participant avatars
    const placeholders = Array.from({ length: Math.min(count, 3) });
    return (
        <div className="flex -space-x-2">
            {placeholders.map((_, index) => (
                <Avatar key={index} className="h-6 w-6 border-2 border-card">
                    <AvatarFallback>{index + 1}</AvatarFallback>
                </Avatar>
            ))}
        </div>
    );
};

const UrgencyBadge = ({ participants, maxParticipants }: { participants: number, maxParticipants: number }) => {
    const spotsLeft = maxParticipants - participants;
    if (spotsLeft <= 0) {
        return <Badge variant="destructive">Full</Badge>;
    }
    if (spotsLeft === 1) {
        return <Badge variant="destructive" className="animate-pulse">1 Spot Left!</Badge>;
    }
    if (spotsLeft > 1 && spotsLeft / maxParticipants <= 0.25) {
        return <Badge variant="secondary" className="bg-amber-500/20 text-amber-500 border-amber-500/30">Almost Full</Badge>
    }
    return null;
}

const ActivityCardSkeleton = () => (
    <Card className="flex flex-col p-6 bg-card shadow-lg">
        <CardHeader className="p-0">
            <div className="flex items-center justify-between mb-3">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-10 w-full mt-1" />
        </CardHeader>
        <CardContent className="p-0 mt-4 flex-grow flex flex-col">
            <Skeleton className="h-5 w-1/2 mb-4" />
            <div className="flex-grow" />
            <div className="space-y-4 mt-auto">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                </div>
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-9 w-28" />
                </div>
            </div>
        </CardContent>
    </Card>
);


export function SocialPageClient() {
    const [selectedActivity, setSelectedActivity] = useState<SocialActivity | null>(null);
    const [isJoinDialogOpen, setJoinDialogOpen] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [requestedActivities, setRequestedActivities] = useState<string[]>([]);
    const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
    const [createActivityData, setCreateActivityData] = useState<{title: string; category: SocialActivity['category']} | null>(null);

    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();

    const socialsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        // Fetch activities starting in the last 30 minutes, ordered by start time.
        const nowMinusGrace = new Date(Date.now() - 30 * 60 * 1000);
        return query(
            collection(firestore, 'socials'),
            where('startAt', '>=', nowMinusGrace),
            orderBy('startAt', 'asc'),
            limit(50)
        );
    }, [firestore]);

    const { data: socialActivities, isLoading } = useCollection<SocialActivity>(socialsQuery);

    const handleAskToJoin = (activity: SocialActivity) => {
        if (!user) {
            toast({
                title: "Sign in required",
                description: "Join the inner circle to connect with others.",
            });
            return;
        }
        setSelectedActivity(activity);
        setJoinDialogOpen(true);
    };

    const handleConfirmJoin = async () => {
        if (!user || !firestore || !selectedActivity) return;

        setIsJoining(true);

        try {
            const activityId = selectedActivity.id;
            const participantsRef = collection(firestore, 'socials', activityId, 'participants');
            const parentDocRef = doc(firestore, 'socials', activityId);

            // 1. Add participation record
            await addDoc(participantsRef, {
                userId: user.uid,
                displayName: user.displayName || user.email?.split('@')[0] || 'Bondi Local',
                joinedAt: serverTimestamp(),
                status: 'pending'
            });

            // 2. Increment participant count
            await updateDoc(parentDocRef, {
                currentParticipants: increment(1)
            });

            setRequestedActivities(prev => [...prev, activityId]);
            setJoinDialogOpen(false);
            
            toast({
                title: "Request Sent! 🤙",
                description: `You've asked to join ${selectedActivity.title}.`,
            });
        } catch (error: any) {
            console.error("Join request failed:", error);
            toast({
                variant: "destructive",
                title: "Request failed",
                description: "Something went wrong. Please try again.",
            });
        } finally {
            setIsJoining(false);
            setSelectedActivity(null);
        }
    };

    const openCreateDialog = (title: string, category: SocialActivity['category']) => {
        setCreateActivityData({ title, category });
        setCreateDialogOpen(true);
    }
    
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ActivityCardSkeleton />
                    <ActivityCardSkeleton />
                    <ActivityCardSkeleton />
                </div>
            );
        }
        
        const now = new Date();
        const activeActivities = socialActivities?.filter(activity => {
            const endDate = activity.endAt?.toDate() ?? new Date(activity.startAt.toDate().getTime() + 2 * 60 * 60 * 1000); // Default 2h duration
            return endDate > now;
        }) ?? [];


        if (activeActivities.length === 0) {
            return (
                <div className="text-center py-20">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No Activities Yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Be the first to post a new social activity!</p>
                </div>
            );
        }

        return (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeActivities.map(activity => {
                    const progress = (activity.currentParticipants / activity.maxParticipants) * 100;
                    // Safely format the timestamp
                    const startTime = activity.startAt ? activity.startAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...';
                    const isRequested = requestedActivities.includes(activity.id);
                    const isFull = activity.currentParticipants >= activity.maxParticipants;

                    return (
                        <Card key={activity.id} className="flex flex-col p-6 bg-card shadow-lg hover:shadow-xl transition-shadow hover:-translate-y-1">
                             <CardHeader className="p-0">
                                <div className="flex items-center justify-between mb-3">
                                    <Badge 
                                        variant={'secondary'}
                                    >
                                        {activity.category}
                                    </Badge>
                                    <div className="text-sm font-semibold text-muted-foreground">{startTime}</div>
                                </div>
                                <CardTitle>{activity.title}</CardTitle>
                                <CardDescription className="mt-1 line-clamp-2 h-[40px]">{activity.description}</CardDescription>
                             </CardHeader>
                             <CardContent className="p-0 mt-4 flex-grow flex flex-col">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                    <MapPin className="h-4 w-4" />
                                    <span>{activity.locationText}</span>
                                </div>

                                <div className="flex-grow" />

                                <div className="space-y-4 mt-auto">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <ParticipantAvatars count={activity.currentParticipants} />
                                            <UrgencyBadge participants={activity.currentParticipants} maxParticipants={activity.maxParticipants} />
                                        </div>
                                        <Progress value={progress} className="h-2"/>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-xs font-medium text-muted-foreground">
                                                {activity.currentParticipants}/{activity.maxParticipants} joined
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <Link href={`/profile/${activity.hostId}`} className='flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors'>
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${activity.hostUsername}`} alt={activity.hostUsername} />
                                                <AvatarFallback>{activity.hostUsername?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span>@{activity.hostUsername}</span>
                                        </Link>
                                        <Button 
                                            className="font-semibold" 
                                            size="sm" 
                                            onClick={() => handleAskToJoin(activity)} 
                                            disabled={isFull || isRequested}
                                        >
                                            {isRequested ? (
                                                <>
                                                    <Check className="mr-2 h-4 w-4" />
                                                    Requested
                                                </>
                                            ) : (
                                                <>
                                                    <UserPlus className="mr-2 h-4 w-4" />
                                                    Ask to Join
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>

                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        );
    }

    return (
        <>
            <section>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">iykyk Social</h2>
                        <p className="text-muted-foreground mt-1">
                            Join a vibe, or start one yourself.
                        </p>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-5 w-5" />
                                Post Activity
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => openCreateDialog('Coffee at...', 'Brunch')}>
                                <Coffee className="mr-2" />
                                Coffee Meetup
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openCreateDialog('Morning Workout', 'Health & Fitness')}>
                                <Dumbbell className="mr-2" />
                                Workout Session
                            </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => openCreateDialog('Beach Day', 'Vibes')}>
                                <Waves className="mr-2" />
                                Beach Plan
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                {renderContent()}
            </section>

            {selectedActivity && (
                 <Dialog open={isJoinDialogOpen} onOpenChange={setJoinDialogOpen}>
                    <DialogContent className="max-w-md bg-[#f2ece0] border-none rounded-3xl shadow-2xl">
                        <DialogHeader className="items-center text-center">
                             <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#c4762a]/10 mb-2">
                                <Users className="h-6 w-6 text-[#c4762a]" />
                            </div>
                            <DialogTitle className="text-2xl font-bold text-[#1a1208]">Ask to join?</DialogTitle>
                            <DialogDescription className="text-[rgba(26,18,8,0.60)]">
                                A request will be sent to the host, <strong>{selectedActivity.hostUsername}</strong>, to join the activity: <strong>{selectedActivity.title}</strong>.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex-col gap-2 mt-4">
                             <Button 
                                className="w-full h-14 rounded-2xl bg-[#c4762a] text-lg font-bold text-white shadow-lg shadow-[#c4762a]/20 hover:bg-[#b06824]"
                                onClick={handleConfirmJoin}
                                disabled={isJoining}
                             >
                                {isJoining ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                                Send Join Request
                             </Button>
                             <Button variant="ghost" className="w-full text-[rgba(26,18,8,0.40)] font-bold" onClick={() => setJoinDialogOpen(false)}>Cancel</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {createActivityData && (
                <CreateActivityDialog
                    isOpen={isCreateDialogOpen}
                    onOpenChange={setCreateDialogOpen}
                    defaultTitle={createActivityData.title}
                    defaultCategory={createActivityData.category as any}
                />
            )}
        </>
    );
}
