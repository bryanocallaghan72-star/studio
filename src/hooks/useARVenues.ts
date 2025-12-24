'use client';

import { useMemo } from 'react';
import { collection, query } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase, WithId } from '@/firebase';
import { useUserLocation } from '@/hooks/useUserLocation';

// Extended type including distance (calculated client-side)
export type ARVenue = WithId<{
  slug: string;
  name: string;
  latitude: number;
  longitude: number;
  category?: string;
  distanceMeters?: number; // <--- The new magic field
  vibe?: string;           // Useful for filtering
  isSponsor?: boolean;     // Useful for filtering
}>;

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
  const { coords: userCoords } = useUserLocation(); // <--- Plug in your location hook

  // 1. The Raw Fetch (Unchanged)
  const venuesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'venues'));
  }, [firestore]);

  const { data: rawVenues, isLoading, error } = useCollection<ARVenue>(venuesQuery);

  // 2. The Sorting Logic (New)
  // We process this client-side. For <500 venues, this is instantaneous (0ms).
  const sortedVenues = useMemo(() => {
    if (!rawVenues) return [];
    if (!userCoords) return rawVenues; // Return unsorted if no GPS

    return rawVenues
      .map((venue) => {
        // Calculate distance for every venue
        const dist = getDistanceFromLatLonInM(
          userCoords.latitude,
          userCoords.longitude,
          venue.latitude,
          venue.longitude
        );
        return { ...venue, distanceMeters: Math.round(dist) };
      })
      .sort((a, b) => {
        // Sort closest to furthest
        return (a.distanceMeters || Infinity) - (b.distanceMeters || Infinity);
      });

  }, [rawVenues, userCoords]);

  return { venues: sortedVenues, isLoading, error };
}
