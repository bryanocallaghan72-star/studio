
'use client';

import { useState, useEffect, memo, useMemo } from 'react';
import { Moon, Sparkles, Sun, MapPin, Coffee, Utensils, Beer, Waves } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { DEMO_VENUES } from '@/data/DemoVenues';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type Venue = typeof DEMO_VENUES[0];

const VenueCard = memo(({ venue }: { venue: Venue }) => {
    const router = useRouter();

    const handleMapClick = (e: React.MouseEvent) => {
        e.stopPropagation(); 
        e.preventDefault(); 

        const categoryMap: { [key: string]: string } = {
            "Cafe & Matcha": "Brunch",
            "Viral Matcha": "Brunch",
            "Aesthetic Brunch": "Brunch",
            "Social Dining": "Nightlife",
            "Beach Club Vibe": "Vibes",
            "Iconic View": "Vibes",
            "Beachfront Bar": "Nightlife",
            "Sushi & Sake": "Sushi",
            "Italo Disco Dining": "Nightlife",
            "Cocktail Bar": "Nightlife",
        };
        const mapCategory = categoryMap[venue.category] || 'All';

        router.push(`/map?category=${mapCategory}`);
    };
    
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
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <CardTitle className="text-lg">{venue.name}</CardTitle>
                            <CardDescription>{venue.address}</CardDescription>
                        </div>
                        <button onClick={handleMapClick} className="p-2 rounded-full hover:bg-secondary transition-colors flex-shrink-0">
                            <MapPin className="h-5 w-5 text-muted-foreground" />
                        </button>
                    </div>
                     <div className="flex pt-2">
                        <Badge variant="outline" className="border-accent text-accent">{venue.category}</Badge>
                    </div>
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

type SubCategory = 'All' | 'Brunch' | 'Sushi' | 'Nightlife' | 'Vibes' | 'Cocktails';

const SUBCATEGORY_MAP: { [key: string]: SubCategory[] } = {
    morning: ['All', 'Brunch'],
    day: ['All', 'Brunch', 'Sushi', 'Vibes'],
    golden: ['All', 'Sushi', 'Nightlife', 'Vibes', 'Cocktails'],
    dusk: ['All', 'Sushi', 'Nightlife', 'Cocktails'],
};

const CATEGORY_ALIASES: { [key: string]: SubCategory } = {
    "Cafe & Matcha": "Brunch",
    "Viral Matcha": "Brunch",
    "Aesthetic Brunch": "Brunch",
    "Social Dining": "Nightlife",
    "Beach Club Vibe": "Vibes",
    "Iconic View": "Vibes",
    "Beachfront Bar": "Nightlife",
    "Sushi & Sake": "Sushi",
    "Italo Disco Dining": "Nightlife",
    "Cocktail Bar": "Cocktails",
};

const SUBCATEGORY_ICONS: Record<SubCategory, React.ElementType> = {
    All: Sparkles,
    Brunch: Coffee,
    Sushi: Utensils,
    Nightlife: Beer,
    Vibes: Sun,
    Cocktails: Waves, // Re-using for cocktails for now
};

export function FlowTabs() {
  const [activeTab, setActiveTab] = useState<'morning' | 'day' | 'golden' | 'dusk'>('morning');
  const [activeSubCategory, setActiveSubCategory] = useState<SubCategory>('All');

  useEffect(() => {
    const currentHour = new Date().getHours();
    const newActiveTab = getCurrentTimeCategory(currentHour);
    setActiveTab(newActiveTab);
    setActiveSubCategory('All'); // Reset sub-category when time tab changes
  }, []);

  const tabData = useMemo(() => [
    { value: 'morning' as const, label: 'Morning', icon: Sun, venues: getVenuesForTime('morning') },
    { value: 'day' as const, label: 'Day', icon: Sparkles, venues: getVenuesForTime('day') },
    { value: 'golden' as const, label: 'Golden Hour', icon: Sparkles, venues: getVenuesForTime('golden') },
    { value: 'dusk' as const, label: 'Night', icon: Moon, venues: getVenuesForTime('dusk') },
  ], []);

  const handleTabChange = (value: string) => {
      const newTab = value as 'morning' | 'day' | 'golden' | 'dusk';
      setActiveTab(newTab);
      setActiveSubCategory('All'); // Reset subcategory on main tab change
  };
  
  const filteredVenues = useMemo(() => {
    const venuesForTime = tabData.find(t => t.value === activeTab)?.venues || [];
    if (activeSubCategory === 'All') {
        return venuesForTime;
    }
    return venuesForTime.filter(venue => {
        const mappedCategory = CATEGORY_ALIASES[venue.category] || venue.category;
        return mappedCategory === activeSubCategory;
    });
  }, [activeTab, activeSubCategory, tabData]);

  const availableSubcategories = SUBCATEGORY_MAP[activeTab];

  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight mb-2">iykyk Flow</h2>
      <p className="text-muted-foreground mb-4">Time-of-day rhythm for what's good, right now.</p>
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-card border">
          {tabData.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>
                <tab.icon className="mr-2 h-5 w-5"/>
                {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-4 mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {availableSubcategories.map(subCategory => {
                const Icon = SUBCATEGORY_ICONS[subCategory];
                return (
                    <Button 
                        key={subCategory}
                        variant={activeSubCategory === subCategory ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveSubCategory(subCategory)}
                        className="flex-shrink-0"
                    >
                        <Icon className="mr-2 h-4 w-4" />
                        {subCategory}
                    </Button>
                )
            })}
        </div>

        <TabsContent value={activeTab} forceMount>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredVenues.map(venue => <VenueCard key={venue.id} venue={venue as Venue} />)}
            </div>
             {filteredVenues.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No venues match this vibe right now.
                </div>
            )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
