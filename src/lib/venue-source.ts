/**
 * @fileOverview Helpers for determining venue data origin and freshness.
 */

import type { Venue } from '@/types/venue';

export const GOOGLE_CACHE_MAX_AGE_DAYS = 30;

/**
 * Checks if the Google Cache for a venue is expired or needs refresh.
 */
export function isGoogleCacheExpired(venue: Venue | null | undefined): boolean {
  if (!venue?.googleCache?.expiresAt) return true;
  
  const expiresAt = venue.googleCache.expiresAt.toDate 
    ? venue.googleCache.expiresAt.toDate() 
    : new Date(venue.googleCache.expiresAt);

  return expiresAt < new Date();
}

/**
 * Checks if the Google Cache will expire within the next 7 days.
 */
export function isGoogleCacheExpiringSoon(venue: Venue | null | undefined): boolean {
  if (!venue?.googleCache?.expiresAt) return false;
  
  const expiresAt = venue.googleCache.expiresAt.toDate 
    ? venue.googleCache.expiresAt.toDate() 
    : new Date(venue.googleCache.expiresAt);
    
  const threshold = new Date();
  threshold.setDate(threshold.getDate() + 7);

  return expiresAt < threshold && expiresAt > new Date();
}

/**
 * Returns the primary source of the displayed information.
 */
export function getVenueDisplaySource(venue: Venue | null | undefined): 'iykyk' | 'google' | 'legacy' {
  if (!venue) return 'legacy';
  if (venue.iykyk?.title || venue.iykyk?.category) return 'iykyk';
  if (venue.googleCache) return 'google';
  return 'legacy';
}

/**
 * Determines if Google attribution is required for the current venue state.
 */
export function requiresGoogleAttribution(venue: Venue | null | undefined): boolean {
  if (!venue) return false;
  return !!(venue.googleCache || venue.placeId);
}
