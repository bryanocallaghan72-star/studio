
"use client";

import { useState, useTransition } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Loader2 } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { motion } from 'framer-motion';
import { generateSurprise } from '@/app/actions';
import type { Surprise } from '@/ai/schemas';
import { useToast } from '@/hooks/use-toast';

export function SurpriseMe() {
    const [surprise, setSurprise] = useState<Surprise | null>(null);
    const [isPending, startTransition] = useTransition();
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    const handleSurpriseClick = () => {
        setOpen(true);
        // Clear previous surprise immediately
        setSurprise(null);
        startTransition(async () => {
            const result = await generateSurprise();
            if (result.error) {
                toast({
                    variant: "destructive",
                    title: result.error.title,
                    description: result.error.message,
                });
                setOpen(false); // Close dialog on error
            } else if (result.success) {
                setSurprise(result.success);
            }
        });
    };

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            // Delay resetting surprise to allow for exit animation
            setTimeout(() => {
                setSurprise(null);
            }, 300);
        }
    };
    
    // Find a fallback image based on the AI-generated hint
    const getImageForSurprise = () => {
        if (!surprise?.imageHint) return PlaceHolderImages.find(i => i.id === 'bondi-sunset') || PlaceHolderImages[0];
        const hint = surprise.imageHint.toLowerCase();
        
        // Prioritize specific hints
        if (hint.includes('sushi')) return PlaceHolderImages.find(i => i.id === 'sushi-1');
        if (hint.includes('cocktail') || hint.includes('bar')) return PlaceHolderImages.find(i => i.id === 'cocktail-101');
        if (hint.includes('coffee') || hint.includes('cafe')) return PlaceHolderImages.find(i => i.id === 'coffee-1');
        if (hint.includes('beach') || hint.includes('walk')) return PlaceHolderImages.find(i => i.id === 'coastal-walk');
        if (hint.includes('yoga') || hint.includes('fitness') || hint.includes('pilates')) return PlaceHolderImages.find(i => i.id === 'fitness-1');
        
        // Fallback to a generic nice image
        return PlaceHolderImages.find(i => i.id === 'bondi-sunset') || PlaceHolderImages[0];
    };

    const image = getImageForSurprise();

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button 
                    variant="secondary" 
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 mt-4" 
                    onClick={handleSurpriseClick}
                    disabled={isPending}
                >
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
                        {isPending ? "Thinking of something amazing..." : "You've unlocked a hidden gem."}
                    </DialogDescription>
                </DialogHeader>
                <div className="relative h-64 overflow-hidden rounded-lg">
                    {isPending ? (
                        <motion.div
                            className="flex h-full items-center justify-center bg-secondary"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { delay: 0.2 } }}
                        >
                            <Gift className="h-16 w-16 animate-pulse text-primary" />
                        </motion.div>
                    ) : surprise && (
                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                            <Card className="border-none">
                                <CardContent className="p-0">
                                    {image ? (
                                        <div className="relative h-48 w-full">
                                            <Image
                                                src={image.imageUrl}
                                                alt={surprise.title}
                                                fill
                                                className="object-cover rounded-t-lg"
                                                data-ai-hint={surprise.imageHint}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                        </div>
                                    ) : (
                                        <div className="relative h-48 w-full bg-secondary rounded-t-lg" />
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
