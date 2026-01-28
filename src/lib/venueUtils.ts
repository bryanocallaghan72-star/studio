// src/lib/venueUtils.ts
import { SEED_VENUES } from '@/data/seeds/venues';
import type { Venue } from '@/types/venue';

// A generic object shape for a venue, adaptable for Firestore data.
export type VenueLike = {
  id: string; // The Firestore document ID
  slug: string; // The URL-friendly slug
  name: string;
  [key: string]: any;
};

/**
 * Finds a venue from the canonical seed data by its slug or name.
 * @param {string | null | undefined} identifier - The slug or name of the venue.
 * @returns {Venue | null} The found venue object, or null if not found.
 */
export function findVenueByAnyId(identifier?: string | null): Venue | null {
  if (!identifier) return null;

  const id = identifier.trim().toLowerCase();

  // Find a venue where the slug or name matches the identifier.
  const venue = SEED_VENUES.find(
    (v) => v.slug.toLowerCase() === id || v.name.toLowerCase() === id
  );
  
  return venue || null;
}


/**
 * Given any venue data object or identifier, return a valid href.
 * The venue slug is the document ID in Firestore.
 */
export function resolveVenueHref(venueOrIdentifier: VenueLike | string | null): string | null {
  if (!venueOrIdentifier) return null;

  // If we just get the slug/name string, find the venue first.
  if (typeof venueOrIdentifier === 'string') {
    const foundVenue = findVenueByAnyId(venueOrIdentifier);
    return foundVenue ? `/venue/${foundVenue.slug}` : null;
  }

  // If we get the whole venue object, use its slug.
  if (venueOrIdentifier.slug) {
    return `/venue/${venueOrIdentifier.slug}`;
  }
  
  return null;
}
