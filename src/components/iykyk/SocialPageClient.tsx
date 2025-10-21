
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { appData } from "@/lib/data";
import { Users, UserPlus, PlusCircle, MapPin, CheckCircle, PartyPopper } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Progress } from "../ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { SocialActivity } from "@/lib/data";

export function SocialPageClient() {
    const [selectedActivity, setSelectedActivity] = useState<SocialActivity | null>(null);
    const [isJoinDialogOpen, setJoinDialogOpen] = useState(false);

    const handleAskToJoin = (activity: SocialActivity) => {
        setSelectedActivity(activity);
        setJoinDialogOpen(true);
    };

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
                    <Button>
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Post an Activity
                    </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {appData.socialActivities.map(activity => {
                        const progress = (activity.participants / activity.maxParticipants) * 100;
                        
                        return (
                            <Card key={activity.id} className="flex flex-col p-6 bg-card shadow-lg hover:shadow-xl transition-shadow hover:-translate-y-1">
                                 <CardHeader className="p-0">
                                    <div className="flex items-center justify-between mb-3">
                                        <Badge variant="secondary">{activity.category}</Badge>
                                        <div className="text-sm font-semibold text-muted-foreground">{activity.time}</div>
                                    </div>
                                    <CardTitle>{activity.title}</CardTitle>
                                    <CardDescription className="mt-1">{activity.description}</CardDescription>
                                 </CardHeader>
                                 <CardContent className="p-0 mt-4 flex-grow flex flex-col">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                        <MapPin className="h-4 w-4" />
                                        <span>{activity.location}</span>
                                    </div>

                                    <div className="flex-grow" />

                                    <div className="space-y-3 mt-4">
                                         <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm font-medium text-muted-foreground">Participants</span>
                                                <span className="text-sm font-bold">{activity.participants}/{activity.maxParticipants}</span>
                                            </div>
                                            <Progress value={progress} className="h-2"/>
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
                                We've let @{selectedActivity.creator.id} know you're coming to{" "}
                                <strong>{selectedActivity.title}</strong>. Have fun!
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                             <Button variant="outline" className="w-full" onClick={() => setJoinDialogOpen(false)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}
