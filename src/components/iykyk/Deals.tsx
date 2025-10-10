
"use client";

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ticket } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { QRCodeDialog } from './QRCodeDialog';

const deals = [
    {
        id: 'deal-1',
        title: "2-for-1 Cocktails",
        venue: "The Beachcomber Bar",
        description: "Enjoy two cocktails for the price of one, all week long.",
        imageId: "community-sushi",
        validity: "All week long"
    },
    {
        id: 'deal-2',
        title: "50% Off Sushi Platters",
        venue: "Sakura Sushi",
        description: "Half-price sushi platters every Tuesday and Wednesday.",
        imageId: "sushi-1",
        validity: "Tues & Weds only"
    },
    {
        id: 'deal-3',
        title: "Free Coffee with Breakfast",
        venue: "Morning Glory Cafe",
        description: "Get a free coffee with any breakfast order before 10 AM on weekdays.",
        imageId: "morning-2",
        validity: "Weekdays before 10 AM"
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
                            <Card key={deal.id} className="group overflow-hidden relative transition-all hover:shadow-xl hover:-translate-y-1 bg-card">
                                <div className="relative h-48 w-full">
                                    {image ? (
                                        <>
                                            <Image
                                                src={image.imageUrl}
                                                alt={deal.description}
                                                fill
                                                className="object-cover w-full h-full transition-transform group-hover:scale-105"
                                                data-ai-hint={image.imageHint}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        </>
                                    ) : (
                                        <div className="bg-secondary h-full w-full"/>
                                    )}
                                </div>
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-bold">{deal.title}</h3>
                                            <p className="text-sm text-muted-foreground">{deal.venue}</p>
                                            <p className="text-xs text-accent mt-2 font-semibold">{deal.validity}</p>
                                        </div>
                                        <Button 
                                            variant="secondary"
                                            onClick={() => handleClaimDeal(deal)}
                                        >
                                            Claim
                                        </Button>
                                    </div>
                                    <Badge className="absolute top-2 right-2 border-accent text-accent bg-background">DEAL</Badge>
                                </CardContent>
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
