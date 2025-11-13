'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from 'firebase/firestore';
import { Users, UserPlus, MapPin, Coffee, Dumbbell, Waves, Plus, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Progress } from "../ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CreateActivityDialog } from "./CreateActivityDialog";
import { Skeleton } from "@/components/ui/skeleton";

// Define a more specific type for the social activities fetched from Firestore
type SocialActivity = {
    id: string;
    title: string;
    description: string;
    time: string;
    locationText: string;
    hostId: string;
    hostUsername: string;
    currentParticipants: number;
    maxParticipants: number;
    category: 'Health & Fitness' | 'Vibes' | 'Brunch' | 'Sushi';
    // participantAvatars might be a subcollection, so we may need to fetch them separately
    // For now, let's assume they might not be on the main document
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
    const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
    const [createActivityData, setCreateActivityData] = useState<{title: string; category: SocialActivity['category']} | null>(null);

    const firestore = useFirestore();
    const socialsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'socials') : null, [firestore]);
    const { data: socialActivities, isLoading } = useCollection<SocialActivity>(socialsQuery);

    const handleAskToJoin = (activity: SocialActivity) => {
        setSelectedActivity(activity);
        setJoinDialogOpen(true);
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
        
        if (!socialActivities || socialActivities.length === 0) {
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
                {socialActivities.map(activity => {
                    const progress = (activity.currentParticipants / activity.maxParticipants) * 100;
                    
                    return (
                        <Card key={activity.id} className="flex flex-col p-6 bg-card shadow-lg hover:shadow-xl transition-shadow hover:-translate-y-1">
                             <CardHeader className="p-0">
                                <div className="flex items-center justify-between mb-3">
                                    <Badge 
                                        variant={'secondary'}
                                    >
                                        {activity.category}
                                    </Badge>
                                    <div className="text-sm font-semibold text-muted-foreground">{new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
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
                                        <Button className="font-semibold" size="sm" onClick={() => handleAskToJoin(activity)} disabled={activity.currentParticipants >= activity.maxParticipants}>
                                            <UserPlus className="mr-2 h-4 w-4" />
                                            Ask to Join
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
                    <DialogContent>
                        <DialogHeader className="items-center text-center">
                             <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                            <DialogTitle className="text-2xl">Ask to join?</DialogTitle>
                            <DialogDescription>
                                A request will be sent to the host, <strong>{selectedActivity.hostUsername}</strong>, to join the activity: <strong>{selectedActivity.title}</strong>.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex-col gap-2">
                             <Link href={`/social/${selectedActivity.id}`}>
                                <Button className="w-full">
                                    Send Join Request
                                </Button>
                            </Link>
                             <Button variant="outline" className="w-full" onClick={() => setJoinDialogOpen(false)}>Cancel</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {createActivityData && (
                <CreateActivityDialog
                    isOpen={isCreateDialogOpen}
                    onOpenChange={setCreateDialogOpen}
                    defaultTitle={createActivityData.title}
                    defaultCategory={createActivityData.category}
                />
            )}
        </>
    );
}
