
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Waves, Calendar } from "lucide-react";
import Image from "next/image";
import Link from 'next/link';
import { DEMO_VENUES } from "@/data/DemoVenues";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const activeVenues = DEMO_VENUES.filter(
    venue => venue.category === 'Health & Fitness' || venue.category === 'Surf'
);

const getImageForVenue = (venueCategory: string) => {
    if (venueCategory === 'Health & Fitness') {
        return PlaceHolderImages.find(img => img.id === 'pilates-1');
    }
    if (venueCategory === 'Surf') {
        return PlaceHolderImages.find(img => img.id === 'surf-lesson');
    }
    return PlaceHolderImages.find(img => img.id === 'fitness-1');
};

export function ActivePage() {
    return (
        <section>
            <div className="flex items-center gap-3 mb-4">
                <Dumbbell className="h-8 w-8 text-pink-500" />
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">iykyk Active</h2>
                    <p className="text-muted-foreground">Your guide to wellness and movement in Bondi.</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                {activeVenues.map(venue => {
                    const image = getImageForVenue(venue.category);
                    const Icon = venue.category === 'Surf' ? Waves : Dumbbell;

                    return (
                        <Card key={venue.id} className="group relative flex flex-col overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 rounded-2xl aspect-[9/10]">
                             {image && (
                                <>
                                    <Image
                                        src={image.imageUrl}
                                        alt={venue.name}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                        data-ai-hint={image.imageHint}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                </>
                            )}
                             <CardContent className="relative flex flex-col justify-end h-full p-6 text-white">
                                <div>
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-white/20 backdrop-blur-sm">
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold leading-tight">{venue.name}</h3>
                                    <p className="text-white/90 mt-1 line-clamp-2">{venue.address}</p>
                                </div>
                                <div className='flex items-center justify-end mt-6'>
                                    <Link href={`/venue/${venue.id.replace('venue_', '')}`}>
                                        <Button className="font-bold bg-white text-black hover:bg-gray-200">
                                            <Calendar className="mr-2 h-5 w-5"/>
                                            Book a Class
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </section>
    );
}
