
"use client";

import { useMemo, useEffect, useState, CSSProperties } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Loader2, Search, PlusCircle, Utensils, AlertTriangle, Beer, Dumbbell, Waves, Shirt, Sun, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";
import { GoogleMap, useJsApiLoader, MarkerF, Autocomplete } from "@react-google-maps/api";
import { resolveVenueHref } from "@/lib/venueUtils";
import { useCollection, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { collection, query, where, doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { WithId } from "@/firebase/firestore/use-collection";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  GOOGLE_MAPS_LOADER_ID,
  GOOGLE_MAPS_LIBRARIES,
  GOOGLE_MAPS_REGION,
  GOOGLE_MAPS_LANGUAGE,
  isValidGoogleMapsKey,
} from "@/lib/googleMaps";
import { CATEGORIES } from "@/config/categories";
import type { Venue } from '@/types/venue';
import { venueToMapPin, type MapPinData } from "@/adapters/venueToMapPin";
import { useMapTheme, type MapPhase } from "@/hooks/useMapTheme";
import { useDemoTime } from "@/context/DemoTimeContext";

// Map container style
const containerStyle = {
  width: '100%',
  height: '100%',
};

// Bondi Beach coordinates
const defaultCenter = {
  lat: -33.891,
  lng: 151.276
};

export function IykykVibeMap() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { currentPhase } = useDemoTime();
  
  // Safely access search parameters, accounting for null during SSR in Next.js 15
  const activeTab = searchParams?.get('category') || 'All';
  const venueSlug = searchParams?.get('venue');
  
  const [center, setCenter] = useState(defaultCenter);
  const [zoom, setZoom] = useState(venueSlug ? 17 : 15);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [currentOrigin, setCurrentOrigin] = useState("");

  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  
  const mapStyles = useMapTheme(currentPhase as MapPhase);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentOrigin(window.location.origin);
    }
  }, []);

  const venuesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    const venuesCollection = collection(firestore, 'venues');

    if (venueSlug) {
      return query(venuesCollection, where('slug', '==', venueSlug));
    }
    
    return venuesCollection;
  }, [firestore, venueSlug]);

  const { data: venues, isLoading: isVenuesLoading } = useCollection<WithId<Venue>>(venuesQuery);
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const isKeyValid = isValidGoogleMapsKey(googleMapsApiKey);

  const mapPins = useMemo(() => {
    if (!venues) return [];
    
    return venues
      .map(venueToMapPin)
      .filter((pin): pin is MapPinData => pin !== null)
      .filter(pin => {
        if (activeTab === 'All' || venueSlug) return true;

        const categoryMap: { [key: string]: string[] } = {
            Brunch: ["Brunch", "Cafe & Matcha", "Viral Matcha", "Aesthetic Brunch"],
            Nightlife: ["Nightlife", "Social Dining", "Beachfront Bar", "Cocktail Bar", "Italo Disco Dining"],
            Vibes: ["Vibes", "Beach Club Vibe", "Iconic View"],
            Sushi: ["Sushi", "Sushi & Sake"],
        };

        const relevantCategories = categoryMap[activeTab] || [activeTab];
        return relevantCategories.includes(pin.category);
      });
  }, [venues, activeTab, venueSlug]);


  const { isLoaded, loadError } = useJsApiLoader({
    id: GOOGLE_MAPS_LOADER_ID,
    googleMapsApiKey: isKeyValid ? googleMapsApiKey : "",
    libraries: GOOGLE_MAPS_LIBRARIES,
    region: GOOGLE_MAPS_REGION,
    language: GOOGLE_MAPS_LANGUAGE,
  });

  useEffect(() => {
    if (venueSlug && mapPins.length === 1) {
      const pin = mapPins[0];
      setCenter({ lat: pin.latitude, lng: pin.longitude });
      setZoom(17);
    } else if (!venueSlug) {
      setCenter(defaultCenter);
      setZoom(15);
    }
  }, [mapPins, venueSlug]);


  const handleTabChange = (category: string) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (category === 'All') {
        params.delete('category');
    } else {
        params.set('category', category);
    }
    params.delete('venue'); 
    setSelectedPlace(null);
    setSearchValue("");
    router.replace(`${pathname}?${params.toString()}`);
  };
  
  const handleMarkerClick = (pin: MapPinData) => {
    const href = resolveVenueHref(pin.slug);
    if (href) {
      router.push(href);
    }
  };

  const handlePlaceSelect = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
       if (place.geometry && place.geometry.location) {
        setSelectedPlace(place);
        const newCenter = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setCenter(newCenter);
        setZoom(17);
        setSearchValue(place.name || "");
      }
    }
  };

  const handleAddVenue = async () => {
    if (!selectedPlace || !firestore || isSaving || !user) return;

    setIsSaving(true);

    const { place_id, name, formatted_address, vicinity } = selectedPlace;
    const location = selectedPlace.geometry?.location;

    if (!place_id || !name || !location) {
        setIsSaving(false);
        return;
    }
    
    const slugBase = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const short = place_id.slice(-6).toLowerCase();
    const slug = `${slugBase}-${short}`;

    const venueRef = doc(firestore, "venues", slug);

    try {
        const venueDoc = await getDoc(venueRef);
        const isNew = !venueDoc.exists();
        
        const venueData = {
            slug: slug,
            placeId: place_id,
            name: name,
            location: {
                address: formatted_address || vicinity || 'Address not available',
                latitude: location.lat(),
                longitude: location.lng(),
            },
            details: {
                category: "Vibes",
                description: "",
            },
            updatedAt: serverTimestamp(),
            ...(isNew && { createdAt: serverTimestamp() }),
        };

        await setDoc(venueRef, venueData, { merge: true });
        router.push(`/venue/${slug}`);

    } catch (error) {
        console.error("Error saving venue:", error);
    } finally {
        setIsSaving(false);
    }
  };


  const mapOptions = useMemo(() => ({
    disableDefaultUI: true,
    zoomControl: true,
    styles: mapStyles,
  }), [mapStyles]);

  if (loadError) {
    return (
      <div className="p-10 text-center flex flex-col items-center justify-center h-full space-y-4 bg-destructive/5 rounded-2xl border border-destructive/10 m-4">
        <div className="bg-destructive/10 p-4 rounded-full text-destructive">
          <AlertTriangle className="h-10 w-10" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Map Load Error</h3>
        <p className="text-muted-foreground max-w-md text-sm">
          The Google Maps API failed to load. This is often due to <strong>Referrer Restrictions</strong> on your API key in the Cloud Console.
        </p>
        <div className="bg-card p-3 rounded-lg border border-border text-xs font-mono break-all select-all text-card-foreground">
          {currentOrigin}
        </div>
        <p className="text-xs text-muted-foreground">
          Ensure the domain above is authorized in your <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Google Cloud Console</a>.
        </p>
      </div>
    );
  }
  
  if (!isKeyValid) {
    return (
      <div className="p-10 text-center flex flex-col items-center justify-center h-full space-y-4">
        <div className="bg-destructive/10 p-4 rounded-full">
          <Utensils className="h-10 w-10 text-destructive" />
        </div>
        <h3 className="text-xl font-bold">Google Maps API Key Missing</h3>
        <p className="text-muted-foreground max-w-xs">
          Please set a valid <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> in your environment variables to view the vibe map.
        </p>
      </div>
    );
  }

  const categoryData = {
    ...CATEGORIES,
    "Sushi": { icon: Utensils, color: '#2dd4bf', textColor: '#0f172a' },
    "Restaurants": { icon: Utensils, color: '#c4762a', textColor: '#ffffff' },
    "Cocktails": { icon: Beer, color: '#8b5cf6', textColor: '#ffffff' },
    "Health & Fitness": { icon: Dumbbell, color: '#ec4899', textColor: '#ffffff' },
    "Surf": { icon: Waves, color: '#38bdf8', textColor: '#ffffff' },
    "Retail": { icon: Shirt, color: '#f43f5e', textColor: '#ffffff' },
    "Cafe & Matcha": { icon: Coffee, color: '#f59e0b', textColor: '#ffffff' },
    "Viral Matcha": { icon: Coffee, color: '#84cc16', textColor: '#ffffff' },
    "Aesthetic Brunch": { icon: Coffee, color: '#f59e0b', textColor: '#ffffff' },
    "Beach Club Vibe": { icon: Sun, color: '#fbbf24', textColor: '#0f172a' },
    "Social Dining": { icon: Utensils, color: '#c4762a', textColor: '#ffffff' },
    "Iconic View": { icon: Sun, color: '#fbbf24', textColor: '#0f172a' },
    "Beachfront Bar": { icon: Beer, color: '#38bdf8', textColor: '#ffffff' },
    "Sushi & Sake": { icon: Utensils, color: '#2dd4bf', textColor: '#0f172a' },
    "Italo Disco Dining": { icon: Utensils, color: '#d946ef', textColor: '#ffffff' },
    "Cocktail Bar": { icon: Beer, color: '#8b5cf6', textColor: '#ffffff' },
  }

  const mapFilterCategories = ["All", "Brunch", "Nightlife", "Sushi", "Vibes"];

  const getButtonText = () => {
      if (isSaving || isUserLoading) return "Loading...";
      if (!user) return "Sign in to add";
      return "Add to iykyk Map";
  }

  return (
    <section className="flex flex-col h-full relative">
        <div className="absolute top-0 left-0 right-0 z-10 p-4 md:p-6 space-y-4 bg-gradient-to-b from-background to-transparent">
            {isLoaded && (
              <Autocomplete
                onLoad={(ac) => setAutocomplete(ac)}
                onPlaceChanged={handlePlaceSelect}
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"/>
                  <Input 
                    type="text"
                    placeholder="Search for a venue..."
                    className="w-full pl-10 pr-4 py-2 bg-background/80 backdrop-blur-sm"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </div>
              </Autocomplete>
            )}

            {selectedPlace && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-background/80 backdrop-blur-sm shadow-md">
                    <p className="text-sm font-medium text-foreground ml-2">Add '{selectedPlace.name}'?</p>
                    <Button onClick={handleAddVenue} disabled={isSaving || isUserLoading || !user}>
                        {(isSaving || isUserLoading) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                        {getButtonText()}
                    </Button>
                </div>
            )}

            <div className="flex overflow-x-auto pb-2 scrollbar-hide -mx-2">
                {mapFilterCategories.map((categoryKey) => {
                    const category = categoryData[categoryKey as keyof typeof categoryData];
                    if (!category) return null;
                    const {icon: Icon} = category;

                    return (
                        <button
                            key={categoryKey}
                            onClick={() => handleTabChange(categoryKey)}
                            className={cn(
                                "flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-full mx-1 transition-all duration-300 inline-flex items-center shadow-sm outline-none focus:outline-none focus:ring-0",
                                activeTab === categoryKey 
                                    ? "bg-[#c4762a] text-white" 
                                    : "bg-[rgba(26,18,8,0.06)] text-[rgba(26,18,8,0.50)] hover:bg-[rgba(26,18,8,0.1)]"
                            )}
                        >
                            <Icon className="mr-2 h-4 w-4" />
                            {categoryKey}
                        </button>
                    )
                })}
            </div>
        </div>

        <div className="flex-grow flex flex-col relative rounded-lg overflow-hidden mt-32 md:mt-40">
            {(!isLoaded || isVenuesLoading) ? (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={zoom}
                    options={mapOptions}
                >
                  {mapPins && mapPins.map(pin => {
                    const category = categoryData[pin.category as keyof typeof categoryData] || categoryData.Vibes;
                    const color = category ? category.color : '#FF7F50';
                    const pinSvg = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
                      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="${color}" /><circle cx="12" cy="10" r="3" fill="white" stroke="none"/></svg>`
                    )}`;
                    
                    const markerIcon: google.maps.Icon = {
                        url: pinSvg,
                        scaledSize: new window.google.maps.Size(32, 32),
                    };

                    return (
                      <MarkerF
                        key={pin.id}
                        position={{ lat: pin.latitude, lng: pin.longitude }}
                        title={pin.name}
                        onClick={() => handleMarkerClick(pin)}
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
