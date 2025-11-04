'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { appData } from "@/lib/data";
import { Users, UserPlus, MapPin, PartyPopper, Coffee, Dumbbell, Waves, Plus } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Progress } from "../ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { SocialActivity } from "@/lib/data";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CreateActivityDialog } from "./CreateActivityDialog";

const ParticipantAvatars = ({ avatars }: { avatars: string[] }) => {
    return (
        <div className="flex -space-x-2">
            {avatars.slice(0, 3).map((avatar, index) => (
                <Avatar key={index} className="h-6 w-6 border-2 border-card">
                    <AvatarImage src={avatar} />
                    <AvatarFallback>{index}</AvatarFallback>
                </Avatar>
            ))}
        </div>
    );
};

const UrgencyBadge = ({ participants, maxParticipants }: { participants: number, maxParticipants: number }) => {
    const spotsLeft = maxParticipants - participants;
    if (spotsLeft === 1) {
        return <Badge variant="destructive" className="animate-pulse">1 Spot Left!</Badge>;
    }
    if (spotsLeft > 1 && spotsLeft / maxParticipants <= 0.25) {
        return <Badge variant="secondary" className="bg-amber-500/20 text-amber-500 border-amber-500/30">Almost Full</Badge>
    }
    return null;
}

export function SocialPageClient() {
    const [selectedActivity, setSelectedActivity] = useState<SocialActivity | null>(null);
    const [isJoinDialogOpen, setJoinDialogOpen] = useState(false);
    const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
    const [createActivityData, setCreateActivityData] = useState<{title: string; category: SocialActivity['category']} | null>(null);


    const handleAskToJoin = (activity: SocialActivity) => {
        setSelectedActivity(activity);
        setJoinDialogOpen(true);
    };

    const openCreateDialog = (title: string, category: SocialActivity['category']) => {
        setCreateActivityData({ title, category });
        setCreateDialogOpen(true);
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {appData.socialActivities.map(activity => {
                        const progress = (activity.participants / activity.maxParticipants) * 100;
                        
                        return (
                            <Card key={activity.id} className="flex flex-col p-6 bg-card shadow-lg hover:shadow-xl transition-shadow hover:-translate-y-1">
                                 <CardHeader className="p-0">
                                    <div className="flex items-center justify-between mb-3">
                                        <Badge 
                                            variant={'secondary'}
                                        >
                                            {activity.category}
                                        </Badge>
                                        <div className="text-sm font-semibold text-muted-foreground">{activity.time}</div>
                                    </div>
                                    <CardTitle>{activity.title}</CardTitle>
                                    <CardDescription className="mt-1 line-clamp-2 h-[40px]">{activity.description}</CardDescription>
                                 </CardHeader>
                                 <CardContent className="p-0 mt-4 flex-grow flex flex-col">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                        <MapPin className="h-4 w-4" />
                                        <span>{activity.location}</span>
                                    </div>

                                    <div className="flex-grow" />

                                    <div className="space-y-4 mt-auto">
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <ParticipantAvatars avatars={activity.participantAvatars} />
                                                <UrgencyBadge participants={activity.participants} maxParticipants={activity.maxParticipants} />
                                            </div>
                                            <Progress value={progress} className="h-2"/>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-xs font-medium text-muted-foreground">
                                                    {activity.participants}/{activity.maxParticipants} joined
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Link href={`/profile/${activity.creator.id}`} className='flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors'>
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={activity.creator.avatar} alt={activity.creator.name} />
                                                    <AvatarFallback>{activity.creator.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span>@{activity.creator.id}</span>
                                            </Link>
                                            <Button className="font-semibold" size="sm" onClick={() => handleAskToJoin(activity)}>
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
            </section>

            {selectedActivity && (
                 <Dialog open={isJoinDialogOpen} onOpenChange={setJoinDialogOpen}>
                    <DialogContent>
                        <DialogHeader className="items-center text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-2">
                                <PartyPopper className="h-6 w-6 text-green-600" />
                            </div>
                            <DialogTitle className="text-2xl">You're in!</DialogTitle>
                            <DialogDescription>
                                You're joining <strong>{selectedActivity.title}</strong>. You'll now be added to a temporary chat to coordinate with the group.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex-col gap-2">
                             <Link href={`/social/${selectedActivity.id}`}>
                                <Button className="w-full">
                                    Enter Chat
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
