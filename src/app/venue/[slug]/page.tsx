'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
  MapPin,
  Share2,
  Bookmark,
  Loader2,
  Building,
  AlertTriangle,
  ArrowLeft,
  Navigation,
  Save,
  Phone,
  ExternalLink,
} from 'lucide-react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';

import { useDoc, useFirestore, useMemoFirebase, setDocumentNonBlocking, useUser } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { WithId } from '@/firebase/firestore/use-collection';
import { Skeleton } from '@/components/ui/skeleton';
import {
  GOOGLE_MAPS_LOADER_ID,
  GOOGLE_MAPS_LIBRARIES,
  GOOGLE_MAPS_REGION,
  GOOGLE_MAPS_LANGUAGE,
  isValidGoogleMapsKey,
} from "@/lib/googleMaps";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { logVaultEvent } from '@/lib/vault/logVaultEvent';
import { trackVenueView } from '@/lib/vault/trackVenueView';
import { useDemoTime } from '@/context/DemoTimeContext';
import { cn } from '@/lib/utils';

// Updated Venue type for this page supporting both flat and nested schemas
type Venue = WithId<{
  name: string;
  ownerId?: string;
  address?: string;
  category: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  location?: {
    latitude?: number;
    longitude?: number;
    address?: string;
  };
  details?: {
    category?: string;
    description?: string;
  };
  subCategory?: string;
  vibeTags?: string[];
  priceTier?: '$' | '$$' | '$$$' | '$$$$';
  priceLevel?: number;
  phone?: string;
  website?: string;
  businessStatus?: string;
  photoReference?: string;
  photos?: string[];
  openingHours?: {
    periods: {
      open: { day: number; time: string };
      close?: { day: number; time: string };
    }[];
    weekdayText: string[];
  };
}>;

// Map container style
const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '1rem', // Match card border radius
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: [
    { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
    { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
    {
      featureType: 'administrative.land_parcel',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#bdbdbd' }],
    },
    { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
    { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
    { featureType: 'road.arterial', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#dadada' }] },
    { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
    { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
    { featureType: 'transit.line', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
    { featureType: 'transit.station', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9c9c9' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
  ],
};


function VenuePageSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <Skeleton className="h-8 w-1/2" />
      <div className="space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-5 w-1/4" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
       <Skeleton className="h-64 w-full rounded-2xl" />
    </div>
  )
}

function VenueNotFound() {
    return (
        <Card className="m-4 md:m-6 text-center">
            <CardHeader>
                <AlertTriangle className="mx-auto h-12 w-12 text-amber-500" />
                <CardTitle className="mt-4">Venue Not Found</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    This venue hasn't been fully published on iykyk yet, or the link may be incorrect.
                </p>
                <Button asChild className="mt-6">
                    <Link href="/map">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to the Map
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}


export default function VenuePage() {
  const params = useParams();
  const slug = params?.slug as string | undefined;
  const { toast } = useToast();
  const { mockDate } = useDemoTime();

  const firestore = useFirestore();
  const { user } = useUser();
  const venueDocRef = useMemoFirebase(() => {
    if (!firestore || !slug) return null;
    return doc(firestore, 'venues', slug);
  }, [firestore, slug]);

  const { data: venue, isLoading: isVenueLoading } = useDoc<Venue>(venueDocRef);

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  // State for the edit form
  const [subCategory, setSubCategory] = useState('');
  const [vibeTags, setVibeTags] = useState('');
  const [priceTier, setPriceTier] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [currentOrigin, setCurrentOrigin] = useState("");

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const isKeyValid = isValidGoogleMapsKey(googleMapsApiKey);

  // ownership logic
  const isOwner = Boolean(user?.uid && venue?.ownerId === user.uid);
  const isUnclaimed = !venue?.ownerId;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    const photoRef = venue?.photos?.[0] || venue?.photoReference;
    if (photoRef) {
      const url = photoRef.startsWith('http') 
        ? photoRef 
        : `/api/place-photo?ref=${encodeURIComponent(photoRef)}`;
      setPhotoUrl(url);
    } else {
      setPhotoUrl(null);
    }
  }, [venue]);


  useEffect(() => {
    if (venue) {
      setSubCategory(venue.subCategory || '');
      setVibeTags(venue.vibeTags?.join(', ') || '');
      setPriceTier(venue.priceTier);
    }
  }, [venue]);

  useEffect(() => {
    if (venue && user && slug) {
        trackVenueView({ uid: user.uid, venueId: slug, venueName: venue.name, imageUrl: photoUrl });
        logVaultEvent(user.uid, { type: "VENUE_VIEWED", entityType: "venue", entityId: slug, title: venue.name, subtitle: venue.category, imageUrl: photoUrl, meta: { source: "VenuePage" } });
    }
  }, [venue, user, slug, photoUrl]);

  const { isLoaded, loadError } = useJsApiLoader({
    id: GOOGLE_MAPS_LOADER_ID,
    googleMapsApiKey: isKeyValid ? googleMapsApiKey : "",
    libraries: GOOGLE_MAPS_LIBRARIES,
    region: GOOGLE_MAPS_REGION,
    language: GOOGLE_MAPS_LANGUAGE,
  });

  const openingStatus = useMemo(() => {
    if (!venue?.openingHours?.periods || venue.openingHours.periods.length === 0) return null;

    const now = mockDate;
    const currentDay = now.getDay();
    const currentTime = now.getHours() * 100 + now.getMinutes();

    const periods = venue.openingHours.periods;

    const isAlwaysOpen = periods.length === 1 && 
      periods[0].open.day === 0 && 
      periods[0].open.time === "0000" && 
      (!periods[0].close || (periods[0].close.day === 0 && periods[0].close.time === "0000"));

    if (isAlwaysOpen) {
      return {
        isOpen: true,
        label: "Open now · 24 hours",
        todayHours: venue.openingHours.weekdayText?.[(currentDay + 6) % 7]
      };
    }

    const formatTimeStr = (t: string) => {
      const h = parseInt(t.substring(0, 2));
      const m = t.substring(2);
      const suffix = h >= 12 ? 'PM' : 'AM';
      const hour12 = h % 12 || 12;
      return `${hour12}:${m} ${suffix}`;
    };

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const activePeriod = periods.find(p => {
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

    if (activePeriod) {
      const closeTimeStr = activePeriod.close ? formatTimeStr(activePeriod.close.time) : 'late';
      return {
        isOpen: true,
        label: `Open now · Closes at ${closeTimeStr}`,
        todayHours: venue.openingHours.weekdayText?.[(currentDay + 6) % 7]
      };
    }

    const nextOpening = [...periods]
      .map(p => ({
        ...p,
        absOpen: p.open.day * 1440 + parseInt(p.open.time.substring(0, 2)) * 60 + parseInt(p.open.time.substring(2))
      }))
      .sort((a, b) => a.absOpen - b.absOpen);

    const absNow = currentDay * 1440 + now.getHours() * 60 + now.getMinutes();
    let next = nextOpening.find(p => p.absOpen > absNow);
    if (!next) next = nextOpening[0];

    const openDay = next.open.day === currentDay ? 'today' : (next.open.day === (currentDay + 1) % 7 ? 'tomorrow' : days[next.open.day]);
    const openTimeStr = formatTimeStr(next.open.time);

    return {
      isOpen: false,
      label: `Closed · Opens ${openDay} at ${openTimeStr}`,
      todayHours: venue.openingHours.weekdayText?.[(currentDay + 6) % 7]
    };
  }, [venue, mockDate]);

  const handleShare = () => {
    const venueUrl = window.location.href;
    navigator.clipboard.writeText(venueUrl).then(() => {
      toast({
        title: "Link Copied!",
        description: "The link to this venue has been copied to your clipboard.",
      });
    });
  };

  const handleGetDirections = () => {
    if (venue) {
      const lat = venue.location?.latitude ?? venue.latitude;
      const lng = venue.location?.longitude ?? venue.longitude;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };
  
  const handleStubSave = () => {
     toast({
        title: "Coming Soon!",
        description: "The ability to save your favorite venues is on its way.",
      });
  }

  const handleEnrichmentSave = () => {
    if (!venueDocRef || !user) return;
    setIsSaving(true);
    
    const tagsArray = vibeTags.split(',').map(tag => tag.trim()).filter(Boolean);

    const dataToSave = {
      subCategory: subCategory,
      vibeTags: tagsArray,
      priceTier: priceTier,
      updatedAt: serverTimestamp(),
    };
    
    setDocumentNonBlocking(venueDocRef, dataToSave, { merge: true });

    setTimeout(() => {
        setIsSaving(false);
        toast({
            title: "Venue Updated",
            description: `${venue?.name} has been updated with new details.`,
        });
    }, 500);
  };

  const getPriceSymbols = (level?: number) => {
    if (level === undefined || level === null) return null;
    if (level === 0) return 'Free';
    return '$'.repeat(level);
  };

  const getDomain = (url?: string) => {
    if (!url) return null;
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return url;
    }
  };

  // Prevent crash during pre-render
  if (isVenueLoading || !slug) {
    return <VenuePageSkeleton />;
  }

  if (!venue) {
    return <VenueNotFound />;
  }

  const lat = venue.location?.latitude ?? venue.latitude;
  const lng = venue.location?.longitude ?? venue.longitude;
  const center = { lat: lat ?? 0, lng: lng ?? 0 };

  return (
    <div className="space-y-6 bg-transparent min-h-screen pb-32">
      <Card className="overflow-hidden -mx-4 -mt-6 md:-mx-6 md:-mt-6 rounded-none md:rounded-b-3xl shadow-lg border-none">
          <div 
            className="relative h-64 w-full"
            style={{ background: 'linear-gradient(135deg, #1a1208 0%, #3d2a10 50%, #c4762a 100%)' }}
          >
              {photoUrl ? (
                  <img
                      src={photoUrl}
                      alt={venue.name}
                      className="absolute inset-0 h-full w-full object-cover"
                  />
              ) : (
                  <div className="flex items-center justify-center h-full bg-transparent">
                      <Building className="h-16 w-16 text-white/20" />
                  </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 md:p-6">
                  <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur-md border-none">{venue.category}</Badge>
                  <h1 className="text-4xl font-bold tracking-tight mt-2 text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{venue.name}</h1>
              </div>
          </div>
      </Card>
      
      <div className='p-4 md:p-0 space-y-6 max-w-lg mx-auto'>
        <div className="flex items-center gap-4 text-[rgba(26,18,8,0.50)]">
            <p className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="h-4 w-4" />
                {venue.location?.address ?? venue.address ?? ''}
            </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
            {venue.priceTier && (
              <Badge variant="outline" className="text-sm font-bold border-black/10 text-[#1a1208]">{venue.priceTier}</Badge>
            )}
            {venue.subCategory && (
              <Badge variant="outline" className="text-xs font-semibold border-black/10 text-[#1a1208]">{venue.subCategory}</Badge>
            )}
            {venue.vibeTags && venue.vibeTags.map(tag => (
              <Badge key={tag} variant="secondary" className="bg-black/5 text-[rgba(26,18,8,0.60)] border-none">{tag}</Badge>
            ))}
        </div>

        {venue.description && <p className="text-[#1a1208]/80 text-lg leading-relaxed">{venue.description}</p>}

        <div className="space-y-4">
          {openingStatus && (
            <div className="space-y-1 animate-in fade-in duration-500">
              <div className="flex items-center gap-2 text-sm font-bold">
                <div className={cn("h-2 w-2 rounded-full", openingStatus.isOpen ? "bg-green-500" : "bg-red-400")} />
                <span className={openingStatus.isOpen ? "text-green-600" : "text-red-400"}>
                  {openingStatus.label}
                </span>
              </div>
              {openingStatus.todayHours && (
                <p className="text-[12px] text-[rgba(26,18,8,0.40)] font-medium">
                  Today: {openingStatus.todayHours.split(': ')[1] || openingStatus.todayHours}
                </p>
              )}
            </div>
          )}

          <div className="space-y-3 pt-2 border-t border-black/[0.04]">
            <div className="flex flex-wrap items-center gap-3">
              {venue.priceLevel !== undefined && (
                <Badge variant="secondary" className="bg-black/5 text-[#1a1208] font-bold h-7 px-3 rounded-full">
                  {getPriceSymbols(venue.priceLevel)}
                </Badge>
              )}
              {venue.businessStatus && venue.businessStatus !== 'OPERATIONAL' && (
                <Badge variant="destructive" className="bg-red-500 text-white font-bold h-7 px-3 rounded-full">
                  Permanently closed
                </Badge>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {venue.phone && (
                <a 
                  href={`tel:${venue.phone}`}
                  className="flex items-center gap-2.5 text-[13px] font-medium text-[rgba(26,18,8,0.50)] hover:text-[#1a1208] transition-colors w-fit"
                >
                  <Phone size={14} strokeWidth={2.5} />
                  {venue.phone}
                </a>
              )}
              {venue.website && (
                <a 
                  href={venue.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-[13px] font-bold text-[#c4762a] hover:opacity-80 transition-opacity w-fit"
                >
                  <ExternalLink size={14} strokeWidth={2.5} />
                  {getDomain(venue.website)}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button 
            onClick={handleGetDirections} 
            size="lg" 
            className="bg-[#c4762a] hover:bg-[#b06824] text-white font-bold rounded-2xl h-14 shadow-lg shadow-[#c4762a]/20"
          >
            <Navigation className="mr-2" />
            Get Directions
          </Button>
          <Button 
            onClick={handleShare} 
            variant="outline" 
            size="lg"
            className="bg-white border-black/[0.08] text-[#1a1208] font-bold rounded-2xl h-14 shadow-sm"
          >
            <Share2 className="mr-2" />
            Share
          </Button>
          <Button 
            onClick={handleStubSave} 
            variant="outline" 
            size="lg"
            className="bg-white border-black/[0.08] text-[#1a1208] font-bold rounded-2xl h-14 shadow-sm"
          >
            <Bookmark className="mr-2" />
            Save
          </Button>
        </div>

        {isUnclaimed && (
          <div className="text-center">
            <button className="text-sm font-medium text-[#c4762a] hover:underline transition-all">
              Own this venue? Claim it →
            </button>
          </div>
        )}

        {isOwner && (
          <Card className="overflow-hidden bg-white border-black/[0.08] rounded-[24px] shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#1a1208] font-bold">Edit Venue Details</CardTitle>
              <CardDescription className="text-[rgba(26,18,8,0.50)]">Add more specific details to help others discover this venue.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="subCategory" className="text-[#1a1208] font-medium text-sm">Sub-category</Label>
                        <Input 
                          id="subCategory" 
                          value={subCategory} 
                          onChange={e => setSubCategory(e.target.value)} 
                          placeholder="e.g., Cocktail Bar, Pilates Studio" 
                          className="bg-[#f2ece0] border-black/[0.08] text-[#1a1208] placeholder:text-[rgba(26,18,8,0.30)] rounded-xl"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="priceTier" className="text-[#1a1208] font-medium text-sm">Price Tier</Label>
                        <Select value={priceTier} onValueChange={setPriceTier}>
                            <SelectTrigger id="priceTier" className="bg-[#f2ece0] border-black/[0.08] text-[#1a1208] rounded-xl">
                                <SelectValue placeholder="Select price tier" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-black/[0.08]">
                                <SelectItem value="$">$ (Inexpensive)</SelectItem>
                                <SelectItem value="$$">$$ (Moderate)</SelectItem>
                                <SelectItem value="$$$">$$$ (Pricey)</SelectItem>
                                <SelectItem value="$$$$">$$$$ (Very Expensive)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="vibeTags" className="text-[#1a1208] font-medium text-sm">Vibe Tags (comma-separated)</Label>
                    <Input 
                      id="vibeTags" 
                      value={vibeTags} 
                      onChange={e => setVibeTags(e.target.value)} 
                      placeholder="e.g., Casual, Rooftop, Live Music" 
                      className="bg-[#f2ece0] border-black/[0.08] text-[#1a1208] placeholder:text-[rgba(26,18,8,0.30)] rounded-xl"
                    />
                </div>
                <Button 
                  onClick={handleEnrichmentSave} 
                  disabled={isSaving || !user}
                  className="w-full h-12 bg-[#c4762a] hover:bg-[#b06824] text-white font-bold rounded-xl mt-2"
                >
                    {isSaving ? <Loader2 className="mr-2 animate-spin" /> : <Save className="mr-2" />}
                    {isSaving ? "Saving..." : user ? "Save Details" : "Sign in to Save"}
                </Button>
            </CardContent>
          </Card>
        )}


        <Card className="h-64 overflow-hidden rounded-[24px] border-black/[0.08] shadow-sm bg-white">
          {loadError && (
            <div className="p-6 text-center flex flex-col items-center justify-center h-full space-y-2">
              <AlertTriangle className="h-8 w-8 text-destructive opacity-50" />
              <p className="text-xs font-bold text-foreground uppercase tracking-widest">Map Load Error</p>
              <p className="text-[10px] text-muted-foreground max-w-[200px]">
                Please authorize this domain in your Google Cloud Console:
              </p>
              <code className="text-[9px] bg-muted px-2 py-1 rounded break-all">{currentOrigin}</code>
            </div>
          )}
          {!isKeyValid && !loadError ? (
            <div className="flex items-center justify-center h-full bg-black/5 p-4 text-center">
              <p className="text-sm text-[rgba(26,18,8,0.40)] font-medium">Google Maps key missing. Please set <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>.</p>
            </div>
          ) : isLoaded && !loadError ? (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={16}
              options={mapOptions}
            >
              <MarkerF position={center} />
            </GoogleMap>
          ) : !loadError && (
            <div className="flex items-center justify-center h-full bg-black/5">
                  <Loader2 className="h-8 w-8 animate-spin text-[rgba(26,18,8,0.20)]" />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
