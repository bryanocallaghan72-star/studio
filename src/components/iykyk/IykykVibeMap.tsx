
"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Map, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { appData } from "@/lib/data";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";

const { categories } = appData;
type Venue = typeof appData.map.pins[0] & { id: string, latitude: number, longitude: number };

// Map container style
const containerStyle = {
  width: '100%',
  height: '100%',
};

// Bondi Beach coordinates
const center = {
  lat: -33.891,
  lng: 151.276
};

// Custom map styles to match the app theme
const mapStyles = [
  // Add custom map styles here if desired, for now using default
];


export function IykykVibeMap() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('category') || 'All';
  const firestore = useFirestore();
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const venuesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    const baseQuery = collection(firestore, 'venues');
    if (activeTab === 'All') {
      return baseQuery;
    }
    return query(baseQuery, where('type', '==', activeTab));
  }, [firestore, activeTab]);

  const { data: venues, isLoading: isLoadingVenues } = useCollection<Venue>(venuesQuery);

  const handleTabChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category === 'All') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };
  
  const handleMarkerClick = (slug: string) => {
    router.push(`/venue/${slug}`);
  };

  const mapOptions = useMemo(() => ({
    disableDefaultUI: true,
    zoomControl: true,
    styles: mapStyles,
  }), []);


  return (
    <section className="flex flex-col h-[calc(100vh-10rem)]">
        <div className="flex items-center gap-3 mb-4 p-4 md:p-6 pb-0">
            <Map className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold tracking-tight">iykyk Vibe</h2>
        </div>
        <p className="text-muted-foreground mb-4 p-4 md:p-6 pt-2">
            Explore Bondi's landscape. Tap a pin for more info.
        </p>

        <div className="flex overflow-x-auto pb-4 px-4 md:px-6 scrollbar-hide">
            {Object.entries(categories).map(([category, {icon: Icon, color, textColor}]) => (
                <button
                    key={category}
                    onClick={() => handleTabChange(category)}
                    data-active={activeTab === category}
                    className={cn(
                        "flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-full mx-1 transition-all duration-300 inline-flex items-center shadow-sm",
                        "bg-card text-foreground hover:bg-secondary",
                        "data-[active=true]:bg-[--active-bg] data-[active=true]:text-[--active-text]"
                    )}
                    style={{
                        "--active-bg": color,
                        "--active-text": textColor,
                    } as React.CSSProperties}
                >
                    <Icon className="mr-2 h-4 w-4" />
                    {category}
                </button>
            ))}
        </div>

        <div className="flex-grow flex flex-col relative mt-2 rounded-lg border overflow-hidden mx-4 md:mx-6">
            {!isLoaded || isLoadingVenues ? (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={15}
                    options={mapOptions}
                >
                  {venues && venues.map(venue => {
                    const category = categories[venue.type as keyof typeof categories];
                    const color = category ? category.color : '#FF7F50'; // default color
                    const pinSvg = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
                      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="${color}" /><circle cx="12" cy="10" r="3" fill="white" stroke="none"/></svg>`
                    )}`;
                    
                    return (
                      <MarkerF
                        key={venue.id}
                        position={{ lat: venue.latitude, lng: venue.longitude }}
                        title={venue.name}
                        onClick={() => handleMarkerClick(venue.slug)}
                        icon={{
                          url: pinSvg,
                          scaledSize: new window.google.maps.Size(32, 32),
                        }}
                      />
                    );
                  })}
                </GoogleMap>
            )}
        </div>
    </section>
  );
}
