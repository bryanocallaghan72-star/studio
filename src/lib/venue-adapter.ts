
import type { Venue } from '@/types/venue';

/**
 * Standardized coordinate shape used across the UI.
 */
export type StandardCoordinates = {
  latitude: number;
  longitude: number;
};

/**
 * Normalized Venue data structure for consistent UI consumption.
 */
export interface NormalizedVenue extends Venue {
  standardCoordinates: StandardCoordinates | null;
  displayAddress: string;
  displayCategory: string;
}

/**
 * A central utility to normalize venue data from various schema versions.
 * Supports legacy flat fields and new nested structures.
 */
export function normalizeVenue(venue: Venue | null | undefined): NormalizedVenue | null {
  if (!venue) return null;

  // 1. Extract Coordinates
  const latitude = venue.location?.latitude ?? venue.latitude;
  const longitude = venue.location?.longitude ?? venue.longitude;
  
  const hasValidCoords = typeof latitude === 'number' && typeof longitude === 'number';
  const standardCoordinates = hasValidCoords 
    ? { latitude: latitude as number, longitude: longitude as number } 
    : null;

  // 2. Extract Address
  const displayAddress = venue.location?.address ?? venue.address ?? 'Address not available';

  // 3. Extract Category
  const displayCategory = venue.details?.category ?? venue.category ?? 'Vibes';

  return {
    ...venue,
    standardCoordinates,
    displayAddress,
    displayCategory,
  };
}
