"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Shuffle } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { AnimatePresence, motion } from "framer-motion";

const initialActivities = [
    { id: 1, title: "Morning Surf", time: "9:00 AM", imageId: "my-day-1" },
    { id: 2, title: "Lunch at The Grassy Knoll", time: "1:00 PM", imageId: "my-day-2" },
    { id: 3, title: "Coastal Walk", time: "3:00 PM", imageId: "my-day-3" },
    { id: 4, title: "Dinner Drinks", time: "7:00 PM", imageId: "my-day-4" },
];

// Fisher-Yates shuffle algorithm
const shuffleArray = (array: any[]) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
};

export function MyDay() {
    const [activities, setActivities] = useState(initialActivities);

    const handleShuffle = () => {
        setActivities(prev => shuffleArray([...prev]));
    };
    
    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Calendar className="h-6 w-6 text-primary" />
                        <CardTitle>iykyk My Day</CardTitle>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleShuffle}>
                        <Shuffle className="h-5 w-5" />
                        <span className="sr-only">Shuffle</span>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Your curated daily itinerary. Shuffle it up!</p>
                <div className="space-y-4">
                    <AnimatePresence>
                    {activities.map(activity => {
                        const image = PlaceHolderImages.find(img => img.id === activity.imageId);
                        return (
                            <motion.div
                                key={activity.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-center gap-4 p-2 rounded-lg hover:bg-secondary"
                            >
                                {image && (
                                    <Image
                                        src={image.imageUrl}
                                        alt={image.description}
                                        width={48}
                                        height={48}
                                        className="rounded-md object-cover"
                                        data-ai-hint={image.imageHint}
                                    />
                                )}
                                <div className="flex-grow">
                                    <p className="font-semibold">{activity.title}</p>
                                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                    </AnimatePresence>
                </div>
            </CardContent>
        </Card>
    );
}
