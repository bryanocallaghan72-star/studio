'use client';

import { useState, useMemo, useEffect } from 'react';
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
} from 'lucide-react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { WithId } from '@/firebase/firestore/use-collection';
import { Skeleton } from '@/components/ui/skeleton';

// Simplified Venue type for this page
type Venue = WithId<{
  name: string;
  address: string;
  category: string;
  description?: string;
  latitude: number;
  longitude: number;
}>;

const libraries: 'places'[] = ['places'];

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
  const slug = params.slug as string;
  const { toast } = useToast();

  const firestore = useFirestore();
  const venueDocRef = useMemoFirebase(() => {
    if (!firestore || !slug) return null;
    return doc(firestore, 'venues', slug);
  }, [firestore, slug]);

  const { data: venue, isLoading: isVenueLoading } = useDoc<Venue>(venueDocRef);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script-venue',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

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
      const url = `https://www.google.com/maps/dir/?api=1&destination=${venue.latitude},${venue.longitude}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };
  
  const handleSave = () => {
     toast({
        title: "Coming Soon!",
        description: "The ability to save your favorite venues is on its way.",
      });
  }

  if (isVenueLoading) {
    return <VenuePageSkeleton />;
  }

  if (!venue) {
    return <VenueNotFound />;
  }

  const center = { lat: venue.latitude, lng: venue.longitude };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <header>
        <Badge variant="secondary">{venue.category}</Badge>
        <h1 className="text-4xl font-bold tracking-tight mt-2">{venue.name}</h1>
        <p className="text-muted-foreground mt-2 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {venue.address}
        </p>
      </header>

      {venue.description && <p className="text-foreground/80 text-lg">{venue.description}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Button onClick={handleGetDirections} size="lg">
          <Navigation className="mr-2" />
          Get Directions
        </Button>
        <Button onClick={handleShare} variant="outline" size="lg">
          <Share2 className="mr-2" />
          Share
        </Button>
        <Button onClick={handleSave} variant="outline" size="lg">
          <Bookmark className="mr-2" />
          Save
        </Button>
      </div>

      <Card className="h-64 overflow-hidden">
        {loadError && <div>Map cannot be loaded right now.</div>}
        {isLoaded && !loadError ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={16}
            options={mapOptions}
          >
            <MarkerF position={center} />
          </GoogleMap>
        ) : (
           <div className="flex items-center justify-center h-full bg-muted">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
           </div>
        )}
      </Card>
    </div>
  );
}
