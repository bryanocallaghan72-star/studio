
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ticket } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { QRCodeDialog } from './QRCodeDialog';

const deals = [
    {
        title: "2-for-1 Cocktails",
        venue: "The Beachcomber Bar",
        description: "Enjoy two cocktails for the price of one, all week long.",
        imageId: "deal-1"
    },
    {
        title: "50% Off Sushi Platters",
        venue: "Sakura Sushi",
        description: "Half-price sushi platters every Tuesday and Wednesday.",
        imageId: "deal-2"
    },
    {
        title: "Free Coffee with Breakfast",
        venue: "Morning Glory Cafe",
        description: "Get a free coffee with any breakfast order before 10 AM on weekdays.",
        imageId: "coffee-1"
    }
];

export function Deals() {
    const [selectedDeal, setSelectedDeal] = useState<(typeof deals)[0] | null>(null);
    const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);

    const handleClaimDeal = (deal: (typeof deals)[0]) => {
        setSelectedDeal(deal);
        setIsQRDialogOpen(true);
    };

    return (
        <>
            <section>
                <div className="flex items-center gap-3 mb-4">
                     <Ticket className="h-8 w-8 text-accent" />
                     <h2 className="text-3xl font-bold tracking-tight">iykyk Deals</h2>
                </div>
                <p className="text-muted-foreground mb-4">Exclusive offers, perks, and creator-powered funnels.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
                    {deals.map(deal => {
                         const image = PlaceHolderImages.find(img => img.id === deal.imageId);
                         return (
                            <Card key={deal.title} className="group overflow-hidden relative transition-all hover:shadow-xl hover:-translate-y-1">
                                {image && (
                                    <>
                                    <Image
                                        src={image.imageUrl}
                                        alt={deal.description}
                                        width={600}
                                        height={400}
                                        className="object-cover w-full h-40 transition-transform group-hover:scale-105"
                                        data-ai-hint={image.imageHint}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    </>
                                )}
                                <div className="absolute bottom-0 left-0 p-4 w-full flex justify-between items-end">
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{deal.title}</h3>
                                        <p className="text-sm text-white/80">{deal.venue}</p>
                                    </div>
                                    <Button 
                                        variant="secondary"
                                        onClick={() => handleClaimDeal(deal)}
                                    >
                                        Claim
                                    </Button>
                                </div>
                                 <Badge className="absolute top-2 right-2 border-accent text-accent bg-background">DEAL</Badge>
                            </Card>
                         )
                    })}
                </div>
            </section>
             {selectedDeal && (
                <QRCodeDialog
                    isOpen={isQRDialogOpen}
                    onOpenChange={setIsQRDialogOpen}
                    deal={selectedDeal}
                />
            )}
        </>
    );
}
