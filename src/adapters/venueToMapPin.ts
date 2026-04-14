
// src/adapters/venueToMapPin.ts

import type { Venue } from '@/types/venue';

/**
 * The shape of the data expected by the IykykVibeMap component for rendering.
 */
export type MapPinData = {
  id: string;
  slug: string;
  name: string;
  latitude: number;
  longitude: number;
  category: string;
  address: string;
  vibeTags?: string[];
};
  

/**
 * A pure function that adapts a canonical Venue object into the flat
 * structure required for a map pin. It's designed to be "tolerant"
 * and can read from both the new nested `location`/`details` fields and
 * legacy flat fields.
 *
 * @param {Venue} venue - The canonical Venue object from Firestore.
 * @returns {MapPinData | null} A flat object for the map pin, or null if the venue has invalid coordinates.
 */
export function venueToMapPin(venue: Venue): MapPinData | null {
  const latitude = venue.location?.latitude ?? venue.latitude;
  const longitude = venue.location?.longitude ?? venue.longitude;
  const category = venue.details?.category ?? venue.category ?? 'Vibes';
  const address = venue.location?.address ?? venue.address ?? '';
  const vibeTags = venue.details?.vibeTags ?? venue.vibeTags ?? [];

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return null;
  }

  return {
    id: venue.id,
    slug: venue.slug,
    name: venue.name,
    latitude,
    longitude,
    category,
    address,
    vibeTags,
  };
}
