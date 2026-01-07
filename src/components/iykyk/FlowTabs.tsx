
'use client';

import { useState, useEffect, memo, useMemo } from 'react';
import { Moon, Sparkles, Sun, MapPin, Coffee, Utensils, Beer, Waves } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '../ui/skeleton';
import { useVenues } from '@/hooks/useVenues';
import type { Venue } from '@/types/venue';


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
        const mapCategory = venue.details?.category ? (categoryMap[venue.details.category] || 'All') : 'All';

        router.push(`/map?category=${mapCategory}`);
    };
    
    // Safely access properties. Fallback for image to avoid crashes.
    const imageUrl = venue.details?.category === 'Brunch' 
      ? "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop"
      : "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop";

    return (
        <Link href={`/venue/${venue.slug}`}>
            <Card className="overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
                 <div className="relative h-40 w-full">
                    <Image
                        src={imageUrl}
                        alt={venue.name}
                        fill
                        className="object-cover"
                    />
                 </div>
                <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <CardTitle className="text-lg">{venue.name}</CardTitle>
                            {/* Safely access nested address */}
                            <CardDescription>{venue.location?.address}</CardDescription>
                        </div>
                        <button onClick={handleMapClick} className="p-2 rounded-full hover:bg-secondary transition-colors flex-shrink-0">
                            <MapPin className="h-5 w-5 text-muted-foreground" />
                        </button>
                    </div>
                     <div className="flex pt-2">
                        {/* Safely access nested category */}
                        {venue.details?.category && <Badge variant="outline" className="border-accent text-accent">{venue.details.category}</Badge>}
                    </div>
                </CardHeader>
            </Card>
        </Link>
    );
});
VenueCard.displayName = 'VenueCard';


const getVenuesForTime = (time: 'morning' | 'day' | 'golden' | 'dusk', allVenues: Venue[]) => {
    // This logic will be enhanced in a future step. For now, we just filter by some basic category.
    const morningCats = ['Brunch', 'Cafe & Matcha', 'Viral Matcha', 'Aesthetic Brunch'];
    const dayCats = ['Brunch', 'Sushi', 'Vibes', 'Beach Club Vibe', 'Iconic View'];
    const goldenCats = ['Sushi', 'Nightlife', 'Vibes', 'Cocktail Bar', 'Social Dining', 'Beachfront Bar'];
    const duskCats = ['Sushi', 'Nightlife', 'Cocktail Bar', 'Italo Disco Dining', 'Sushi & Sake'];

    let relevantCategories: string[] = [];
    switch(time) {
        case 'morning': relevantCategories = morningCats; break;
        case 'day': relevantCategories = dayCats; break;
        case 'golden': relevantCategories = goldenCats; break;
        case 'dusk': relevantCategories = duskCats; break;
    }
    
    // Filter safely using the canonical `details.category` field
    return allVenues.filter(p => {
        const category = p.details?.category; // Use optional chaining
        return category && relevantCategories.includes(category);
    });
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
    Cocktails: Waves,
};

export function FlowTabsSkeleton() {
    return (
        <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">iykyk Flow</h2>
            <p className="text-muted-foreground mb-4">Time-of-day rhythm for what's good, right now.</p>
            <div className="grid grid-cols-4 gap-2 rounded-lg bg-card border p-1">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
             <div className="mt-4 mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
             </div>
             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-64 w-full rounded-lg" />
            </div>
        </div>
    )
}

export function FlowTabs() {
  const [activeTab, setActiveTab] = useState<'morning' | 'day' | 'golden' | 'dusk'>('morning');
  const [activeSubCategory, setActiveSubCategory] = useState<SubCategory>('All');
  const { venues, isLoading, error } = useVenues();
  
  useEffect(() => {
    // isClient check is implicitly handled by useEffect.
    const currentHour = new Date().getHours();
    const newActiveTab = getCurrentTimeCategory(currentHour);
    setActiveTab(newActiveTab);
    setActiveSubCategory('All'); 
  }, []);

  const tabData = useMemo(() => {
    if (!venues) return [];
    return [
        { value: 'morning' as const, label: 'Morning', icon: Sun, venues: getVenuesForTime('morning', venues) },
        { value: 'day' as const, label: 'Day', icon: Sparkles, venues: getVenuesForTime('day', venues) },
        { value: 'golden' as const, label: 'Golden Hour', icon: Sparkles, venues: getVenuesForTime('golden', venues) },
        { value: 'dusk' as const, label: 'Night', icon: Moon, venues: getVenuesForTime('dusk', venues) },
      ]
  }, [venues]);

  const handleTabChange = (value: string) => {
      const newTab = value as 'morning' | 'day' | 'golden' | 'dusk';
      setActiveTab(newTab);
      setActiveSubCategory('All');
  };
  
  const filteredVenues = useMemo(() => {
    const venuesForTime = tabData.find(t => t.value === activeTab)?.venues || [];
    if (activeSubCategory === 'All') {
        return venuesForTime;
    }
    return venuesForTime.filter(venue => {
        // Filter safely using canonical details field and optional chaining
        const category = venue.details?.category;
        if (!category) return false;
        
        const mappedCategory = CATEGORY_ALIASES[category] || category;
        return mappedCategory === activeSubCategory;
    });
  }, [activeTab, activeSubCategory, tabData]);

  const availableSubcategories = SUBCATEGORY_MAP[activeTab];

  if (isLoading || !venues) {
    return <FlowTabsSkeleton />;
  }
  
  if (error) {
    return <div className="text-destructive">Error loading venues.</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight mb-2">iykyk Flow</h2>
      <p className="text-muted-foreground mb-4">Time-of-day rhythm for what's good, right now.</p>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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
                {filteredVenues.map(venue => <VenueCard key={venue.id} venue={venue} />)}
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
