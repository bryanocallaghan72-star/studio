'use client';

import { useState, useEffect, memo, useMemo } from 'react';
import { Moon, Sparkles, Sun, MapPin, Coffee, Utensils, Beer, Waves } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';
import { useVenues } from '@/hooks/useVenues';
import type { Venue } from '@/types/venue';
import { useDemoTime } from "@/context/DemoTimeContext";

const isStrictlyOpen = (venue: any, mockDate: Date): boolean => {
    if (!venue?.openingHours?.periods || venue.openingHours.periods.length === 0) return true;

    const now = mockDate;
    const currentDay = now.getDay();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const periods = venue.openingHours.periods;

    const isAlwaysOpen = periods.length === 1 && 
        periods[0].open.day === 0 && 
        periods[0].open.time === "0000" && 
        (!periods[0].close || (periods[0].close.day === 0 && periods[0].close.time === "0000"));

    if (isAlwaysOpen) return true;

    const activePeriod = periods.find((p: any) => {
        const openDay = p.open.day;
        const openTime = parseInt(p.open.time);
        const closeDay = p.close?.day ?? openDay;
        const closeTime = p.close ? parseInt(p.close.time) : 2359;

        if (openDay === closeDay) {
            return currentDay === openDay && currentTime >= openTime && currentTime < closeTime;
        } else {
            if (currentDay === openDay) return currentTime >= openTime;
            if (currentDay === (openDay + 1) % 7) return currentTime < closeTime;
        }
        return false;
    });

    return !!activePeriod;
};

const VenueCard = memo(({ venue }: { venue: any }) => {
    const getPhotoUrl = (photoRef: string) => {
        if (!photoRef) return null;
        if (photoRef.startsWith('http')) return photoRef;
        return `/api/place-photo?ref=${encodeURIComponent(photoRef)}`;
    };

    const imageUrl = getPhotoUrl(venue.photos?.[0]) || 
        "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&auto=format&fit=crop";

    return (
        <Link href={`/venue/${venue.slug}`}>
            <Card className="group relative h-64 overflow-hidden rounded-2xl border border-black/[0.08] shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                 <div className="absolute inset-0">
                    <img
                        src={imageUrl}
                        alt={venue.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div 
                        className="absolute inset-0" 
                        style={{ background: 'linear-gradient(to top, rgba(8,10,13,0.85) 0%, rgba(8,10,13,0.4) 35%, transparent 60%)' }} 
                    />
                 </div>
                
                <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                    <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                            <h3 className="text-lg font-bold leading-tight">{venue.name}</h3>
                            <p className="text-xs text-white/60 line-clamp-1 flex items-center gap-1">
                                <MapPin size={10} />
                                {venue.location?.address}
                            </p>
                        </div>
                        {(venue.category || venue.details?.category) && (
                            <Badge 
                                className="bg-white/20 text-white text-[10px] font-bold backdrop-blur-md border-none uppercase tracking-wider rounded-full px-2 py-0.5"
                            >
                                {venue.category || venue.details?.category}
                            </Badge>
                        )}
                    </div>
                </div>
            </Card>
        </Link>
    );
});
VenueCard.displayName = 'VenueCard';


const isOpenDuringPhase = (venue: any, phaseStart: number, phaseEnd: number) => {
  if (!venue?.openingHours?.periods?.length) return true;
  
  const periods = venue.openingHours.periods;
  return periods.some((p: any) => {
    const openHour = parseInt(p.open.time.substring(0, 2));
    const closeHour = p.close ? parseInt(p.close.time.substring(0, 2)) : 23;
    // venue overlaps with phase window
    return openHour < phaseEnd && closeHour > phaseStart;
  });
};

const getVenuesForTime = (time: 'morning' | 'day' | 'golden' | 'night', allVenues: Venue[]) => {
    switch(time) {
        case 'morning': return allVenues.filter(v => isOpenDuringPhase(v, 5, 12));
        case 'day':     return allVenues.filter(v => isOpenDuringPhase(v, 12, 17));
        case 'golden':  return allVenues.filter(v => isOpenDuringPhase(v, 17, 21));
        case 'night':   return allVenues.filter(v => isOpenDuringPhase(v, 21, 24));
        default:        return allVenues;
    }
};

const getCurrentTimeCategory = (hour: number): 'morning' | 'day' | 'golden' | 'night' => {
    if (hour >= 5 && hour < 10) return 'morning'; 
    if (hour >= 10 && hour < 17) return 'day';
    if (hour >= 17 && hour < 21) return 'golden';
    return 'night'; 
};

type SubCategory = 'All' | 'Brunch' | 'Food' | 'Drinks' | 'Nightlife' | 'Vibes' | 'Active';

const SUBCATEGORY_MAP: { [key: string]: SubCategory[] } = {
    morning: ['All', 'Brunch', 'Active'],
    day:     ['All', 'Brunch', 'Food', 'Vibes', 'Active'],
    golden:  ['All', 'Food', 'Drinks', 'Vibes'],
    night:    ['All', 'Drinks', 'Nightlife'],
};

const CATEGORY_ALIASES: { [key: string]: SubCategory } = {
    "Brunch": "Brunch",
    "Aesthetic Brunch": "Brunch",
    "Cafe & Matcha": "Brunch",
    "Viral Matcha": "Brunch",
    "Restaurants": "Food",
    "Sushi": "Food",
    "Sushi & Sake": "Food",
    "Social Dining": "Food",
    "Cocktails": "Drinks",
    "Cocktail Bar": "Drinks",
    "Beachfront Bar": "Drinks",
    "Nightlife": "Nightlife",
    "Italo Disco Dining": "Nightlife",
    "Vibes": "Vibes",
    "Beach Club Vibe": "Vibes",
    "Iconic View": "Vibes",
    "Health & Fitness": "Active",
    "Surf": "Active",
};

const SUBCATEGORY_ICONS: Record<SubCategory, React.ElementType> = {
    All: Sparkles,
    Brunch: Coffee,
    Food: Utensils,
    Drinks: Beer,
    Nightlife: Moon,
    Vibes: Sun,
    Active: Waves,
};

export function FlowTabsSkeleton() {
    return (
        <div className="flex flex-col bg-transparent p-4 md:p-6 min-h-screen">
            <h2 className="text-3xl font-black tracking-tighter italic uppercase mb-2" style={{ color: 'var(--phase-text)' }}>FLOW</h2>
            <p className="text-[13px] font-bold uppercase tracking-widest mb-6" style={{ color: 'var(--phase-text)', opacity: 0.4 }}>Bondi's rhythm · right now</p>
            <div className="grid grid-cols-4 gap-2 rounded-full bg-[rgba(128,128,128,0.15)] p-1 h-12">
                <Skeleton className="h-full w-full rounded-full" />
                <Skeleton className="h-full w-full rounded-full" />
                <Skeleton className="h-full w-full rounded-full" />
                <Skeleton className="h-full w-full rounded-full" />
            </div>
             <div className="mt-6 mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
                <Skeleton className="h-9 w-24 rounded-full" />
                <Skeleton className="h-9 w-24 rounded-full" />
             </div>
             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-64 w-full rounded-2xl" />
                <Skeleton className="h-64 w-full rounded-2xl" />
                <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
        </div>
    )
}

export function FlowTabs() {
  const [activeTab, setActiveTab] = useState<'morning' | 'day' | 'golden' | 'night'>('morning');
  const [activeSubCategory, setActiveSubCategory] = useState<SubCategory>('All');
  const { venues, isLoading, error } = useVenues();
  const { mockDate } = useDemoTime();
  
  useEffect(() => {
    const currentHour = mockDate.getHours();
    const newActiveTab = getCurrentTimeCategory(currentHour);
    setActiveTab(newActiveTab);
    setActiveSubCategory('All'); 
  }, [mockDate]);

  const tabData = useMemo(() => {
    if (!venues) return [];
    return [
        { value: 'morning' as const, label: 'Morning', icon: Sun, venues: getVenuesForTime('morning', venues) },
        { value: 'day' as const, label: 'Day', icon: Sparkles, venues: getVenuesForTime('day', venues) },
        { value: 'golden' as const, label: 'Golden', icon: Sparkles, venues: getVenuesForTime('golden', venues) },
        { value: 'night' as const, label: 'Night', icon: Moon, venues: getVenuesForTime('night', venues) },
      ]
  }, [venues]);

  const handleTabChange = (value: string) => {
      const newTab = value as 'morning' | 'day' | 'golden' | 'night';
      setActiveTab(newTab);
      setActiveSubCategory('All');
  };
  
  const filteredVenues = useMemo(() => {
    const venuesForTime = tabData.find(t => t.value === activeTab)?.venues || [];
    
    // Strict real-time "Open Now" filter
    const openVenues = venuesForTime.filter(v => isStrictlyOpen(v, mockDate));

    if (activeSubCategory === 'All') {
        return openVenues;
    }
    return openVenues.filter(venue => {
        const category = venue.category || venue.details?.category;
        if (!category) return false;
        
        const mappedCategory = CATEGORY_ALIASES[category] || category;
        return mappedCategory === activeSubCategory;
    });
  }, [activeTab, activeSubCategory, tabData, mockDate]);

  const availableSubcategories = SUBCATEGORY_MAP[activeTab];

  if (isLoading || !venues) {
    return <FlowTabsSkeleton />;
  }
  
  if (error) {
    return <div className="text-destructive p-6">Error loading venues.</div>;
  }

  return (
    <div className="flex flex-col bg-transparent p-4 md:p-6 min-h-screen pb-32">
      <header className="mb-6">
        <h2 className="text-3xl font-black tracking-tighter italic uppercase mb-1" style={{ color: 'var(--phase-text)' }}>FLOW</h2>
        <p className="text-[13px] font-bold uppercase tracking-widest leading-none" style={{ color: 'var(--phase-text)', opacity: 0.4 }}>Bondi's rhythm · right now</p>
      </header>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-4 w-full bg-[rgba(128,128,128,0.15)] rounded-full p-1 h-12 border-none">
          {tabData.map(tab => {
            const isActive = activeTab === tab.value;
            return (
              <TabsTrigger 
                  key={tab.value} 
                  value={tab.value}
                  className="rounded-full text-[12px] font-bold transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-[#1a1208] data-[state=active]:shadow-sm data-[state=active]:border-[0.5px] data-[state=active]:border-black/5 outline-none focus:outline-none focus:ring-0 focus-visible:ring-0"
                  style={isActive ? {} : { color: 'var(--phase-text)', opacity: 0.4 }}
              >
                  <tab.icon className="mr-1.5 h-3.5 w-3.5"/>
                  {tab.label}
              </TabsTrigger>
            )
          })}
        </TabsList>

        <div className="mt-6 mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
            {availableSubcategories.map(subCategory => {
                const Icon = SUBCATEGORY_ICONS[subCategory];
                const isActive = activeSubCategory === subCategory;
                return (
                    <button 
                        key={subCategory}
                        onClick={() => setActiveSubCategory(subCategory)}
                        className={cn(
                            "flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-bold transition-all duration-200 outline-none focus:outline-none focus:ring-0",
                            isActive 
                                ? "text-white shadow-md shadow-[#c4762a]/10" 
                                : "bg-[rgba(128,128,128,0.15)] hover:bg-[rgba(128,128,128,0.25)]"
                        )}
                        style={isActive 
                            ? { backgroundColor: 'var(--phase-accent)' } 
                            : { color: 'var(--phase-text)', opacity: 0.7 }}
                    >
                        <Icon className="h-3.5 w-3.5" />
                        {subCategory}
                    </button>
                )
            })}
        </div>

        <TabsContent value={activeTab} forceMount className="mt-0">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredVenues.map(venue => <VenueCard key={venue.id} venue={venue} />)}
            </div>
             {filteredVenues.length === 0 && (
                <div className="text-center py-24 px-6 border-2 border-dashed border-black/[0.05] rounded-3xl">
                    <p className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--phase-text)', opacity: 0.4 }}>Nothing open right now. Check back soon.</p>
                    <p className="text-xs mt-2" style={{ color: 'var(--phase-text)', opacity: 0.3 }}>Try another time of day or clear your filters.</p>
                </div>
            )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
