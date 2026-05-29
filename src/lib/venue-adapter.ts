
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
  displayPhone: string | null;
  displayWebsite: string | null;
  attributionRequired: boolean;
}

/**
 * A central utility to normalize venue data from various schema versions.
 * Supports legacy flat fields, nested fields, and the new googleCache reference layer.
 * 
 * @param {any} venue - The raw venue object from Firestore.
 * @returns {NormalizedVenue | null} A normalized object for UI components.
 */
export function normalizeVenue(venue: any | null | undefined): NormalizedVenue | null {
  if (!venue) return null;

  // 1. Extract Title/Name
  // Preference: iykyk editorial title -> googleCache cached name -> legacy top-level name
  const displayName = venue.iykyk?.title ?? venue.googleCache?.displayName ?? venue.name ?? 'Unknown Venue';

  // 2. Extract Coordinates
  // Preference: googleCache location -> legacy location object -> legacy flat lat/lng
  const lat = venue.googleCache?.location?.lat ?? venue.location?.latitude ?? venue.latitude;
  const lng = venue.googleCache?.location?.lng ?? venue.location?.longitude ?? venue.longitude;
  
  const hasValidCoords = typeof lat === 'number' && typeof lng === 'number';
  const standardCoordinates = hasValidCoords 
    ? { latitude: lat as number, longitude: lng as number } 
    : null;

  // 3. Extract Address
  // Preference: googleCache address -> legacy location address -> legacy top-level address
  const displayAddress = venue.googleCache?.formattedAddress ?? venue.location?.address ?? venue.address ?? 'Address not available';

  // 4. Extract Category
  // Preference: iykyk editorial category -> legacy details category -> legacy top-level category
  const displayCategory = venue.iykyk?.category ?? venue.details?.category ?? venue.category ?? 'Vibes';

  // 5. Extract Phone & Website
  const displayPhone = venue.googleCache?.phone ?? venue.phone ?? null;
  const displayWebsite = venue.googleCache?.website ?? venue.website ?? null;

  // 6. Attribution flag
  // Compliance: If any data is being served from the googleCache, we must show attribution.
  const attributionRequired = !!venue.googleCache;

  return {
    ...venue,
    name: displayName,
    standardCoordinates,
    displayAddress,
    displayCategory,
    displayPhone,
    displayWebsite,
    attributionRequired,
  };
}
