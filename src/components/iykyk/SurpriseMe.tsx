
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Gift } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { motion } from 'framer-motion';

const surprises = [
    {
        title: "Hidden Laneway Art",
        description: "You've stumbled upon a secret alley filled with stunning street art. Perfect for your next photo op!",
        imageId: "surprise-1",
        venue: "Graffiti Lane"
    },
    {
        title: "Secret Rooftop Garden",
        description: "An urban oasis above the city. Enjoy a moment of peace and quiet with amazing views.",
        imageId: "my-day-2",
        venue: "The Sky Garden"
    },
    {
        title: "Spontaneous Gelato Tasting",
        description: "Surprise! A local gelateria is offering free samples of their new, exotic flavor for the next hour.",
        imageId: "deal-2",
        venue: "Gelato Gusto"
    },
    {
        title: "Craft Cocktail Discovery",
        description: "You've found a hidden bar known for its unique, handcrafted cocktails. Cheers to the unexpected!",
        imageId: "nightlife-1",
        venue: "The Alchemist's Nook"
    },
    {
        title: "Tapas for Two",
        description: "A cozy tapas bar has a table just for you. Enjoy a selection of small plates and big flavors.",
        imageId: "my-day-3",
        venue: "El Rincon Escondido"
    },
    {
        title: "Surprise Wellness Session",
        description: "A local studio is offering a drop-in spot for a meditation and sound bath session. Time to relax and recharge.",
        imageId: "fitness-1",
        venue: "Zenith Wellness"
    },
    {
        title: "Omakase Sushi Special",
        description: "A top sushi chef has an unlisted Omakase special available for the next hour. A true taste of Japan awaits.",
        imageId: "sushi-1",
        venue: "Sakura Sushi"
    },
];

export function SurpriseMe() {
    const [surprise, setSurprise] = useState(surprises[0]);
    const [isSpinning, setIsSpinning] = useState(false);
    const [open, setOpen] = useState(false);

    const handleSurprise = () => {
        setIsSpinning(true);
        setOpen(true);
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * surprises.length);
            setSurprise(surprises[randomIndex]);
            setIsSpinning(false);
        }, 1500);
    };

    const image = PlaceHolderImages.find(img => img.id === surprise.imageId);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 mt-4" onClick={handleSurprise}>
                    <Gift className="mr-2 h-5 w-5" />
                    Surprise Me
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Gift className="h-6 w-6 text-primary" />
                        Surprise!
                    </DialogTitle>
                    <DialogDescription>
                        You've unlocked a hidden gem.
                    </DialogDescription>
                </DialogHeader>
                <div className="relative h-64 overflow-hidden rounded-lg">
                    {isSpinning ? (
                        <motion.div
                            className="flex h-full items-center justify-center bg-secondary"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                            <Gift className="h-16 w-16 animate-pulse text-primary" />
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                            <Card className="border-none">
                                <CardContent className="p-0">
                                    {image && (
                                        <div className="relative h-48 w-full">
                                            <Image
                                                src={image.imageUrl}
                                                alt={image.description}
                                                fill
                                                className="object-cover rounded-t-lg"
                                                data-ai-hint={image.imageHint}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <h3 className="text-xl font-bold">{surprise.title}</h3>
                                        <p className="text-sm text-muted-foreground mt-1">{surprise.venue}</p>
                                        <p className="mt-2 text-sm">{surprise.description}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
