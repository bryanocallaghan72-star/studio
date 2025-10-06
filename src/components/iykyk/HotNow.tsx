
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const hotItems = [
    {
        title: "Happy Hour Finale",
        description: "50% off all cocktails at The Beachcomber Bar. The perfect way to kick off the night!",
        imageId: "deal-1",
        endsIn: 30 * 60 * 1000, // 30 minutes
    },
    {
        title: "Flash Sale: 20% Off",
        description: "A local boutique is clearing out their new season arrivals. Ends at 9 PM tonight.",
        imageId: "my-day-4",
        endsIn: 2 * 60 * 60 * 1000, // 2 hours
    },
    {
        title: "End of Day Cleanse",
        description: "2-for-1 on all cold-pressed juices at The Juice Bar. Last hour of trading!",
        imageId: "morning-2",
        endsIn: 1 * 60 * 60 * 1000, // 1 hour
    },
    {
        title: "Live Set Just Started!",
        description: "First drink on us for the next 90 mins at The Bucket List. Don't miss out!",
        imageId: "hot-1",
        endsIn: 90 * 60 * 1000, // 90 minutes
    }
];

const Countdown = ({ endsIn }: { endsIn: number }) => {
    const [timeLeft, setTimeLeft] = useState(endsIn);

    useEffect(() => {
        // Only run on the client
        if (typeof window === 'undefined') return;

        if (timeLeft <= 0) return;

        const intervalId = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1000);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timeLeft]);
    
    // Avoid rendering the countdown on the server to prevent hydration mismatch
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);


    if (!isClient) {
        return <span className="font-mono text-sm font-semibold text-primary">Loading...</span>;
    }

    if (timeLeft <= 0) {
        return <span className="font-mono text-sm font-bold text-destructive">ENDED</span>;
    }

    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    return (
        <span className="font-mono text-sm font-semibold text-primary">
            {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
    );
};


export function HotNow() {
    return (
        <section>
            <div className="flex items-center gap-3 mb-4">
                <Flame className="h-8 w-8 text-destructive animate-pulse" />
                <h2 className="text-3xl font-bold tracking-tight">iykyk Fire</h2>
            </div>
            <p className="text-muted-foreground mb-4">What’s hot right now. Catch it before it's gone!</p>
            <div className="grid grid-cols-1 gap-6">
                {hotItems.map(item => {
                    const image = PlaceHolderImages.find(img => img.id === item.imageId);
                    return (
                        <Card key={item.title} className="group grid grid-cols-1 md:grid-cols-3 overflow-hidden transition-all hover:shadow-lg">
                            {image && (
                                <div className="relative h-48 md:h-full w-full">
                                    <Image
                                        src={image.imageUrl}
                                        alt={image.description}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                        data-ai-hint={image.imageHint}
                                    />
                                </div>
                            )}
                            <div className="md:col-span-2">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle>{item.title}</CardTitle>
                                        <Badge variant="destructive" className="flex items-center gap-2">
                                            <Flame className="h-4 w-4" />
                                            <span>HOT</span>
                                        </Badge>
                                    </div>
                                    <CardDescription>{item.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
                                        <p className="text-sm font-medium text-destructive">Ends in:</p>
                                        <Countdown endsIn={item.endsIn} />
                                    </div>
                                </CardContent>
                            </div>
                        </Card>
                    )
                })}
            </div>
        </section>
    );
}
