
"use client";

import { useState, useEffect, memo } from 'react';
import { Moon, Sparkles, Sun } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { DEMO_VENUES } from '@/data/DemoVenues';

type Venue = typeof DEMO_VENUES[0];

const VenueCard = memo(({ venue }: { venue: Venue }) => {
    
    return (
        <Link href={`/venue/${venue.id.replace('venue_', '')}`}>
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


const getVenuesForTime = (time: 'morning' | 'day' | 'golden' | 'dusk') => {
    return DEMO_VENUES.filter(p => p.vibe === time);
};

const getCurrentTimeCategory = (hour: number): 'morning' | 'day' | 'golden' | 'dusk' => {
    if (hour >= 5 && hour < 12) return 'morning'; 
    if (hour >= 12 && hour < 17) return 'day';
    if (hour >= 17 && hour < 20) return 'golden';
    return 'dusk'; 
};

const tabData = [
    { value: 'morning', label: 'Morning', icon: Sun, venues: getVenuesForTime('morning') },
    { value: 'day', label: 'Day', icon: Sparkles, venues: getVenuesForTime('day') },
    { value: 'golden', label: 'Golden Hour', icon: Sparkles, venues: getVenuesForTime('golden') },
    { value: 'dusk', label: 'Night', icon: Moon, venues: getVenuesForTime('dusk') },
];

export function FlowTabs() {
  const [activeTab, setActiveTab] = useState<'morning' | 'day' | 'golden' | 'dusk'>('morning');

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
                 {tab.venues.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        No venues match this time of day.
                    </div>
                )}
            </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
