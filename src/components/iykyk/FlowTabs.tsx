
"use client";

import { useState, useEffect } from 'react';
import { Moon, Sparkles, Sun } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { appData } from '@/lib/data';
import Link from 'next/link';

type Venue = typeof appData.map.pins[0];

const venueTypeToImageId: { [key: string]: string } = {
    'Brunch': 'coffee-1',
    'Sushi': 'sushi-1',
    'Cocktails': 'cocktail-1',
    'Restaurants': 'my-day-3',
    'Nightlife': 'nightlife-1',
    'Health & Fitness': 'fitness-1',
    'Vibes': 'sunset-yoga',
    'default': 'night-1'
};

const VenueCard = ({ venue }: { venue: Venue }) => {
    const imageId = venueTypeToImageId[venue.type] || venueTypeToImageId.default;
    const image = PlaceHolderImages.find(img => img.id === imageId);

    return (
        <Link href={`/venue/${venue.slug}`}>
            <Card className="overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
                {image ? (
                     <div className="relative h-40 w-full">
                        <Image
                            src={image.imageUrl}
                            alt={venue.description}
                            fill
                            className="object-cover"
                            data-ai-hint={image.imageHint}
                        />
                     </div>
                ) : (
                    <div className="relative h-40 w-full bg-secondary" />
                )}
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{venue.name}</CardTitle>
                        <Badge variant="outline" className="border-accent text-accent">{venue.type}</Badge>
                    </div>
                    <CardDescription>{venue.description}</CardDescription>
                </CardHeader>
            </Card>
        </Link>
    );
};

const getVenuesForTime = (time: 'morning' | 'night' | 'late-night') => {
    switch (time) {
        case 'morning':
            return appData.map.pins.filter(p => ['Brunch', 'Health & Fitness'].includes(p.type));
        case 'night':
            return appData.map.pins.filter(p => ['Restaurants', 'Sushi', 'Cocktails'].includes(p.type));
        case 'late-night':
            return appData.map.pins.filter(p => ['Nightlife', 'Cocktails'].includes(p.type));
        default:
            return [];
    }
};

const getCurrentTimeCategory = (hour: number): 'morning' | 'night' | 'late-night' => {
    if (hour >= 5 && hour < 17) return 'morning'; // 5 AM to 5 PM
    if (hour >= 17 && hour < 22) return 'night'; // 5 PM to 10 PM
    return 'late-night'; // 10 PM to 5 AM
};

const tabData = [
    { value: 'morning', label: 'Morning', icon: Sun, venues: getVenuesForTime('morning') },
    { value: 'night', label: 'Night', icon: Moon, venues: getVenuesForTime('night') },
    { value: 'late-night', label: 'Late Night', icon: Sparkles, venues: getVenuesForTime('late-night') },
];

export function FlowTabs() {
  const [activeTab, setActiveTab] = useState<'morning' | 'night' | 'late-night'>('morning');

  useEffect(() => {
    const currentHour = new Date().getHours();
    setActiveTab(getCurrentTimeCategory(currentHour));
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight mb-2">iykyk Flow</h2>
      <p className="text-muted-foreground mb-4">Time-of-day rhythm for what's good, right now.</p>
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-card border">
          {tabData.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>
                <tab.icon className="mr-2 h-5 w-5"/>
                {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabData.map(tab => (
            <TabsContent key={tab.value} value={tab.value}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {tab.venues.map(venue => <VenueCard key={venue.id} venue={venue} />)}
                </div>
            </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
