'use client';

import { useState, useEffect, memo, useMemo } from 'react';
import { Moon, Sparkles, Sun, MapPin, Coffee, Utensils, Beer, Waves } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '../ui/skeleton';
import { useVenues } from '@/hooks/useVenues';
import type { Venue } from '@/types/venue';
import { useSoundContext } from '@/context/SoundContext';
import { useDemoTime } from "@/context/DemoTimeContext";


const VenueCard = memo(({ venue, mockDate }: { venue: any, mockDate: Date }) => {
    const { playClick } = useSoundContext();

    const openingStatus = useMemo(() => {
        if (!venue?.openingHours?.periods || venue.openingHours.periods.length === 0) return null;

        const now = mockDate;
        const currentDay = now.getDay();
        const currentTime = now.getHours() * 100 + now.getMinutes();
        const periods = venue.openingHours.periods;

        // Check for 24/7
        const isAlwaysOpen = periods.length === 1 && 
            periods[0].open.day === 0 && 
            periods[0].open.time === "0000" && 
            (!periods[0].close || (periods[0].close.day === 0 && periods[0].close.time === "0000"));

        if (isAlwaysOpen) return { isOpen: true };

        // Check if currently open
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

        if (activePeriod) return { isOpen: true };

        // Find next opening for label
        const nextOpening = [...periods]
            .map((p: any) => ({
                ...p,
                absOpen: p.open.day * 1440 + parseInt(p.open.time.substring(0, 2)) * 60 + parseInt(p.open.time.substring(2))
            }))
            .sort((a: any, b: any) => a.absOpen - b.absOpen);

        const absNow = currentDay * 1440 + now.getHours() * 60 + now.getMinutes();
        let next = nextOpening.find((p: any) => p.absOpen > absNow);
        if (!next) next = nextOpening[0];

        const formatTimeStr = (t: string) => {
            const h = parseInt(t.substring(0, 2));
            const m = t.substring(2);
            const suffix = h >= 12 ? 'PM' : 'AM';
            const hour12 = h % 12 || 12;
            return `${hour12}:${m} ${suffix}`;
        };

        return { 
            isOpen: false, 
            nextTime: formatTimeStr(next.open.day === currentDay ? next.open.time : next.open.time) 
        };
    }, [venue, mockDate]);

    const isClosed = openingStatus && !openingStatus.isOpen;
    
    const getCategoryPhoto = (venue: any): string => {
      const cat = venue.details?.category || venue.category || '';
      if (cat.includes('Brunch') || cat.includes('Cafe')) 
        return 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop';
      if (cat.includes('Sushi') || cat.includes('Japanese'))
        return 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&auto=format&fit=crop';
      if (cat.includes('Nightlife') || cat.includes('Cocktail') || cat.includes('Bar'))
        return 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&auto=format&fit=crop';
      if (cat.includes('Pilates') || cat.includes('Yoga') || cat.includes('Active'))
        return 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop';
      if (cat.includes('Beach') || cat.includes('Walk') || cat.includes('Coastal'))
        return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop';
      // Default Bondi vibes
      return 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&auto=format&fit=crop';
    };

    const imageUrl = getCategoryPhoto(venue);

    return (
        <Link href={`/venue/${venue.slug}`} onClick={playClick}>
            <Card className={cn(
                "group relative h-64 overflow-hidden rounded-2xl border border-black/[0.08] shadow-sm transition-all hover:shadow-xl hover:-translate-y-1",
                isClosed && "opacity-50"
            )}>
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
                        {isClosed ? (
                            <Badge 
                                className="bg-red-500 text-white text-[10px] font-black border-none uppercase tracking-wider rounded-full px-2 py-0.5"
                            >
                                Opens at {openingStatus.nextTime}
                            </Badge>
                        ) : venue.details?.category && (
                            <Badge 
                                className="bg-white/20 text-white text-[10px] font-bold backdrop-blur-md border-none uppercase tracking-wider rounded-full px-2 py-0.5"
                            >
                                {venue.details.category}
                            </Badge>
                        )}
                    </div>
                </div>
            </Card>
        </Link>
    );
});
VenueCard.displayName = 'VenueCard';


const getVenuesForTime = (time: 'morning' | 'day' | 'golden' | 'dusk', allVenues: Venue[]) => {
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
    
    return allVenues.filter(p => {
        const category = p.details?.category;
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
        <div className="flex flex-col bg-transparent p-4 md:p-6 min-h-screen">
            <h2 className="text-3xl font-black tracking-tighter text-[#1a1208] italic uppercase mb-2">FLOW</h2>
            <p className="text-[13px] font-bold text-[rgba(26,18,8,0.40)] uppercase tracking-widest mb-6">Bondi's rhythm · right now</p>
            <div className="grid grid-cols-4 gap-2 rounded-full bg-[rgba(26,18,8,0.06)] p-1 h-12">
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
  const [activeTab, setActiveTab] = useState<'morning' | 'day' | 'golden' | 'dusk'>('morning');
  const [activeSubCategory, setActiveSubCategory] = useState<SubCategory>('All');
  const { venues, isLoading, error } = useVenues();
  const { mockDate } = useDemoTime();
  
  useEffect(() => {
    // Determine the active tab based on the canonical God Mode time
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
    return <div className="text-destructive p-6">Error loading venues.</div>;
  }

  return (
    <div className="flex flex-col bg-transparent p-4 md:p-6 min-h-screen pb-32">
      <header className="mb-6">
        <h2 className="text-3xl font-black tracking-tighter text-[#1a1208] italic uppercase mb-1">FLOW</h2>
        <p className="text-[13px] font-bold text-[rgba(26,18,8,0.40)] uppercase tracking-widest leading-none">Bondi's rhythm · right now</p>
      </header>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-[rgba(26,18,8,0.06)] rounded-full p-1 h-12 border-none">
          {tabData.map(tab => (
            <TabsTrigger 
                key={tab.value} 
                value={tab.value}
                className="rounded-full text-[12px] font-bold transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-[#1a1208] data-[state=active]:shadow-sm data-[state=active]:border-[0.5px] data-[state=active]:border-black/5 text-[rgba(26,18,8,0.40)] outline-none focus:outline-none focus:ring-0 focus-visible:ring-0"
            >
                <tab.icon className="mr-1.5 h-3.5 w-3.5"/>
                {tab.label}
            </TabsTrigger>
          ))}
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
                                ? "bg-[#c4762a] text-white shadow-md shadow-[#c4762a]/10" 
                                : "bg-[rgba(26,18,8,0.06)] text-[rgba(26,18,8,0.50)] hover:bg-[rgba(26,18,8,0.1)]"
                        )}
                    >
                        <Icon className="h-3.5 w-3.5" />
                        {subCategory}
                    </button>
                )
            })}
        </div>

        <TabsContent value={activeTab} forceMount className="mt-0">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredVenues.map(venue => <VenueCard key={venue.id} venue={venue} mockDate={mockDate} />)}
            </div>
             {filteredVenues.length === 0 && (
                <div className="text-center py-24 px-6 border-2 border-dashed border-black/[0.05] rounded-3xl">
                    <p className="text-sm font-bold text-[rgba(26,18,8,0.40)] uppercase tracking-widest">Quiet in this phase</p>
                    <p className="text-xs text-[rgba(26,18,8,0.30)] mt-2">Try another time of day or clear your filters.</p>
                </div>
            )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
