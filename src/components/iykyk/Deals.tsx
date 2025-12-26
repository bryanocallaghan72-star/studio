
"use client";

import { useMemo, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ticket, Utensils, Droplet, ShoppingBag, Calendar, CalendarCheck2, Loader2 } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { QRCodeDialog } from './QRCodeDialog';
import { appData } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useVenues } from '@/hooks/useVenues';
import type { Venue } from '@/types/venue';
import { Skeleton } from '../ui/skeleton';

const { deals } = appData;

const categories = [
    { name: 'All', icon: Ticket },
    { name: 'Food & Drink', icon: Utensils },
    { name: 'Fitness', icon: Droplet },
    { name: 'Shopping', icon: ShoppingBag },
    { name: 'Mid-week', icon: Calendar },
    { name: 'Weekend', icon: CalendarCheck2 },
];


const DealCardSkeleton = () => (
  <Card className="group overflow-hidden relative bg-card">
    <Skeleton className="h-48 w-full" />
    <CardContent className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <Skeleton className="h-5 w-40 mb-2" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32 mt-2" />
        </div>
        <Skeleton className="h-9 w-20" />
      </div>
    </CardContent>
  </Card>
);

export function Deals() {
    const [selectedDeal, setSelectedDeal] = useState<(typeof deals)[0] | null>(null);
    const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All');

    const { venues, isLoading: areVenuesLoading, error } = useVenues();

    const venuesBySlug = useMemo(() => {
        if (!venues) return {};
        return venues.reduce((acc, venue) => {
            if (venue.slug) {
                acc[venue.slug] = venue;
            }
            return acc;
        }, {} as Record<string, Venue>);
    }, [venues]);


    const handleClaimDeal = (deal: (typeof deals)[0]) => {
        setSelectedDeal(deal);
        setIsQRDialogOpen(true);
    };

    const filteredDeals = deals.filter(deal => {
        if (activeCategory === 'All') return true;
        if (activeCategory === 'Mid-week') return deal.tags.includes('Mid-week');
        if (activeCategory === 'Weekend') return deal.tags.includes('Weekend');
        return deal.category === activeCategory;
    });

    return (
        <>
            <section>
                <div className="flex items-center gap-3 mb-4">
                     <Ticket className="h-8 w-8 text-accent" />
                     <h2 className="text-3xl font-bold tracking-tight">iykyk Deals</h2>
                </div>
                <p className="text-muted-foreground mb-6">Exclusive offers, perks, and creator-powered funnels.</p>

                <div className="flex overflow-x-auto pb-4 mb-6 scrollbar-hide -mx-4 px-4">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <Button
                                key={category.name}
                                variant={activeCategory === category.name ? 'default' : 'outline'}
                                onClick={() => setActiveCategory(category.name)}
                                className="flex-shrink-0 mr-2 shadow-sm"
                            >
                                <Icon className="mr-2 h-4 w-4" />
                                {category.name}
                            </Button>
                        )
                    })}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
                    {areVenuesLoading ? (
                      <>
                        <DealCardSkeleton />
                        <DealCardSkeleton />
                      </>
                    ) : (
                      filteredDeals.map(deal => {
                         const image = PlaceHolderImages.find(img => img.id === deal.imageId);
                         const venue = venuesBySlug[deal.venueSlug];
                         const venueName = venue?.name ?? 'A special place';

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
                                            <p className="text-sm text-muted-foreground">{venueName}</p>
                                            <p className="text-xs text-accent mt-2 font-semibold">{deal.validity}</p>
                                        </div>
                                        <Button 
                                            variant="secondary"
                                            onClick={() => handleClaimDeal({...deal, venue: venueName})}
                                        >
                                            Claim
                                        </Button>
                                    </div>
                                    <Badge className="absolute top-2 right-2 border-accent text-accent bg-background">DEAL</Badge>
                                </CardContent>
                            </Card>
                         )
                      })
                    )}
                </div>
                 {filteredDeals.length === 0 && !areVenuesLoading && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No deals available in this category right now.</p>
                    </div>
                )}
            </section>
             {selectedDeal && (
                <QRCodeDialog
                    isOpen={isQRDialogOpen}
                    onOpenChange={setIsQRDialogOpen}
                    deal={{...selectedDeal, venue: venuesBySlug[selectedDeal.venueSlug]?.name || 'A special place'}}
                />
            )}
        </>
    );
}
