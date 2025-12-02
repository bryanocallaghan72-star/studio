
"use client";

import { useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { appData } from "@/lib/data";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import { DEMO_VENUES } from "@/data/DemoVenues";

const { categories } = appData;
type Venue = typeof DEMO_VENUES[0];

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
  { elementType: "geometry", stylers: [{ color: "#212121" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#757575" }] },
  { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
  { featureType: "administrative.land_parcel", stylers: [{ visibility: "off" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#181818" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { featureType: "poi.park", elementType: "labels.text.stroke", stylers: [{ color: "#1b1b1b" }] },
  { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#2d2d2d" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#8a8a8a" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#373737" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3c3c3c" }] },
  { featureType: "road.highway.controlled_access", elementType: "geometry", stylers: [{ color: "#4e4e4e" }] },
  { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { featureType: "transit", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3d3d3d" }] },
];


export function IykykVibeMap() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('category') || 'All';
  
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const venues = useMemo(() => {
    if (activeTab === 'All') {
      return DEMO_VENUES;
    }
    const specificCategories: {[key: string]: string[]} = {
        "Brunch": ["Cafe & Matcha", "Viral Matcha", "Aesthetic Brunch"],
        "Nightlife": ["Social Dining", "Beachfront Bar", "Cocktail Bar", "Italo Disco Dining"],
        "Vibes": ["Beach Club Vibe", "Iconic View"],
        "Sushi": ["Sushi & Sake"],
    };

    const relevantCategories = specificCategories[activeTab] || [activeTab];
    return DEMO_VENUES.filter(venue => relevantCategories.includes(venue.category));
  }, [activeTab]);


  const handleTabChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category === 'All') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };
  
  const handleMarkerClick = (venueId: string) => {
    const venueSlug = venueId.replace('venue_', '');
    router.push(`/venue/${venueSlug}`);
  };

  const mapOptions = useMemo(() => ({
    disableDefaultUI: true,
    zoomControl: true,
    styles: mapStyles,
  }), []);

  if (loadError) {
    return <div className="text-destructive p-6">Error loading maps. Please check your API key and ensure the Maps JavaScript API is enabled in your Google Cloud project.</div>;
  }

  const demoCategories = {
    ...categories,
    "Cafe & Matcha": categories["Brunch"],
    "Viral Matcha": categories["Brunch"],
    "Aesthetic Brunch": categories["Brunch"],
    "Beach Club Vibe": categories["Vibes"],
    "Social Dining": categories["Nightlife"],
    "Iconic View": categories["Vibes"],
    "Beachfront Bar": categories["Nightlife"],
    "Sushi & Sake": categories["Sushi"],
    "Italo Disco Dining": categories["Nightlife"],
    "Cocktail Bar": categories["Cocktails"],
  };

  const mapFilterCategories = ["All", "Brunch", "Nightlife", "Sushi", "Vibes"];

  return (
    <section className="flex flex-col h-full relative">
        <div className="absolute top-0 left-0 right-0 z-10 p-4 md:p-6 space-y-4 bg-gradient-to-b from-background to-transparent">
            <p className="text-muted-foreground">
                Explore Bondi's landscape. Tap a pin for more info.
            </p>

            <div className="flex overflow-x-auto pb-2 scrollbar-hide -mx-2">
                {mapFilterCategories.map((categoryKey) => {
                    const category = categories[categoryKey as keyof typeof categories];
                    if (!category) return null;
                    const {icon: Icon, color, textColor} = category;

                    return (
                        <button
                            key={categoryKey}
                            onClick={() => handleTabChange(categoryKey)}
                            data-active={activeTab === categoryKey}
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
                            {categoryKey}
                        </button>
                    )
                })}
            </div>
        </div>

        <div className="flex-grow flex flex-col relative rounded-lg overflow-hidden">
            {!isLoaded ? (
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
                    const category = demoCategories[venue.category as keyof typeof demoCategories] || categories.Vibes;
                    const color = category ? category.color : '#FF7F50'; // default color
                    const pinSvg = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
                      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="${color}" /><circle cx="12" cy="10" r="3" fill="white" stroke="none"/></svg>`
                    )}`;
                    
                    const markerIcon: google.maps.Icon = {
                        url: pinSvg,
                        scaledSize: new window.google.maps.Size(32, 32),
                    };

                    return (
                      <MarkerF
                        key={venue.id}
                        position={{ lat: venue.lat, lng: venue.lng }}
                        title={venue.name}
                        onClick={() => handleMarkerClick(venue.id)}
                        icon={markerIcon}
                      />
                    );
                  })}
                </GoogleMap>
            )}
        </div>
    </section>
  );
}

    