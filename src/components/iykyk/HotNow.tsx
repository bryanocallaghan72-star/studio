"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const hotItems = [
    {
        title: "Pop-Up Art Gallery",
        description: "An exclusive, one-day-only exhibition from a famed street artist. The queue is already around the block!",
        imageId: "hot-2",
        endsIn: 3 * 60 * 60 * 1000, // 3 hours
    },
    {
        title: "Bondi Beach Festival",
        description: "Live music, food stalls, and sunset vibes. The main act starts soon, don't miss out!",
        imageId: "hot-1",
        endsIn: 5 * 60 * 60 * 1000, // 5 hours
    }
];

const Countdown = ({ endsIn }: { endsIn: number }) => {
    const [timeLeft, setTimeLeft] = useState(endsIn);

    useEffect(() => {
        if (timeLeft <= 0) return;

        const intervalId = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1000);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timeLeft]);

    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);
    
    if (timeLeft <= 0) {
        return <span className="font-mono text-sm font-bold text-destructive">ENDED</span>;
    }

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
