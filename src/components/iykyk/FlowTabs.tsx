
"use client";

import { useState, useEffect, memo } from 'react';
import { Moon, Sparkles, Sun } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { appData } from '@/lib/data';
import Link from 'next/link';
import { DEMO_VENUES } from '@/data/DemoVenues';

type Venue = typeof DEMO_VENUES[0];

const venueTypeToImageId: { [key: string]: string } = {
    'Cafe': 'coffee-1',
    'Dining': 'sushi-1',
    'Iconic': 'cocktail-101',
    'Wellness': 'my-day-3',
    'Social': 'nightlife-1',
    'Sunset': 'fitness-1',
    'Vibes': 'sunset-yoga',
    'default': 'night-1'
};

const VenueCard = memo(({ venue }: { venue: Venue }) => {
    const imageId = venueTypeToImageId[venue.category] || venueTypeToImageId.default;
    const image = PlaceHolderImages.find(img => img.id === imageId);

    return (
        <Link href={`/venue/${venue.id}`}>
            <Card className="overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
                {venue.image ? (
                     <div className="relative h-40 w-full">
                        <Image
                            src={venue.image}
                            alt={venue.name}
                            fill
                            className="object-cover"
                        />
                     </div>
                ) : (
                    <div className="relative h-40 w-full bg-secondary" />
                )}
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{venue.name}</CardTitle>
                        <Badge variant="outline" className="border-accent text-accent">{venue.category}</Badge>
                    </div>
                    <CardDescription>{venue.address}</CardDescription>
                </CardHeader>
            </Card>
        </Link>
    );
});
VenueCard.displayName = 'VenueCard';


const getVenuesForTime = (time: 'morning' | 'night' | 'late-night' | 'golden') => {
    switch (time) {
        case 'morning':
            return DEMO_VENUES.filter(p => ['Cafe', 'Wellness'].includes(p.category));
        case 'night':
             return DEMO_VENUES.filter(p => ['Social', 'Dining'].includes(p.category));
        case 'golden':
            return DEMO_VENUES.filter(p => ['Sunset', 'Iconic', 'Dining'].includes(p.category));
        case 'late-night':
            return DEMO_VENUES.filter(p => ['Social'].includes(p.category));
        default:
            return [];
    }
};

const getCurrentTimeCategory = (hour: number): 'morning' | 'night' | 'late-night' | 'golden' => {
    if (hour >= 5 && hour < 12) return 'morning'; 
    if (hour >= 12 && hour < 17) return 'golden';
    if (hour >= 17 && hour < 22) return 'night';
    return 'late-night'; 
};

const tabData = [
    { value: 'morning', label: 'Morning', icon: Sun, venues: getVenuesForTime('morning') },
    { value: 'golden', label: 'Golden Hour', icon: Sparkles, venues: getVenuesForTime('golden') },
    { value: 'night', label: 'Night', icon: Moon, venues: getVenuesForTime('night') },
    { value: 'late-night', label: 'Late Night', icon: Sparkles, venues: getVenuesForTime('late-night') },
];

export function FlowTabs() {
  const [activeTab, setActiveTab] = useState<'morning' | 'night' | 'late-night' | 'golden'>('morning');

  useEffect(() => {
    const currentHour = new Date().getHours();
    setActiveTab(getCurrentTimeCategory(currentHour));
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight mb-2">iykyk Flow</h2>
      <p className="text-muted-foreground mb-4">Time-of-day rhythm for what's good, right now.</p>
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-card border">
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
                    {tab.venues.map(venue => <VenueCard key={venue.id} venue={venue as Venue} />)}
                </div>
            </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
