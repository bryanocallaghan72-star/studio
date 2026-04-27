'use client';

import { useMemo } from 'react';
import { collection, query } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase, WithId } from '@/firebase';
import { useUserLocation } from '@/hooks/useUserLocation';
import { normalizeVenue } from '@/lib/venue-adapter';

// This is the raw shape that might come from Firestore, supporting both schemas.
type FetchedVenue = WithId<{
  slug: string;
  name: string;
  // New nested structure
  location?: { latitude?: number; longitude?: number };
  details?: { category?: string };
  // Legacy flat structure
  latitude?: number;
  longitude?: number;
  category?: string;
  vibe?: string;
  isSponsored?: boolean;
}>;

// This is the clean, flat shape the rest of the UI expects.
export type ARVenue = {
  id: string;
  slug: string;
  name: string;
  latitude: number;
  longitude: number;
  category?: string;
  distanceMeters?: number;
  vibe?: string;
  isSponsor?: boolean;
};


// Helper: Haversine Formula for distance (The Math of Earth)
function getDistanceFromLatLonInM(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // Radius of the earth in meters
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export function useARVenues() {
  const firestore = useFirestore();
  const { coords: userCoords } = useUserLocation();

  // 1. The Raw Fetch
  const venuesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'venues'));
  }, [firestore]);

  const { data: rawVenues, isLoading, error } = useCollection<FetchedVenue>(venuesQuery);

  // 2. The Adapter & Sorting Logic
  const sortedVenues = useMemo(() => {
    if (!rawVenues) return [];

    // Map the raw data to ARVenue shape, using normalizeVenue for consistency
    const mappedVenues = rawVenues.map((venue) => {
      const normalized = normalizeVenue(venue as any);

      // --- VALIDATION ---
      // Ensure we have valid coordinates before proceeding.
      if (!normalized || !normalized.standardCoordinates) {
        return null;
      }

      const { latitude, longitude } = normalized.standardCoordinates;

      // --- DISTANCE CALCULATION ---
      const distanceMeters = userCoords
        ? Math.round(
            getDistanceFromLatLonInM(
              userCoords.latitude,
              userCoords.longitude,
              latitude,
              longitude
            )
          )
        : undefined;
      
      // --- RETURN CLEAN, FLAT SHAPE ---
      const arVenue: ARVenue = {
        id: venue.id,
        slug: venue.slug,
        name: venue.name,
        latitude,
        longitude,
        category: normalized.displayCategory,
        distanceMeters,
        vibe: venue.vibe,
        isSponsor: venue.isSponsored,
      };
      
      return arVenue;
    });

    // Filter out null values
    const processedVenues: ARVenue[] = mappedVenues.filter((v): v is ARVenue => v !== null);

    // --- SORTING ---
    // If we have user coordinates, sort by distance. Otherwise, maintain Firestore's order.
    if (userCoords) {
      return [...processedVenues].sort((a, b) => {
        const distA = a.distanceMeters ?? Infinity;
        const distB = b.distanceMeters ?? Infinity;
        return distA - distB;
      });
    }

    return processedVenues;

  }, [rawVenues, userCoords]);

  return { venues: sortedVenues, isLoading, error };
}
