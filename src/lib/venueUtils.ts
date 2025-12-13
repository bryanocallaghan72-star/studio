// src/lib/venueUtils.ts
import { DEMO_VENUES } from '@/data/DemoVenues'; // This can be removed once all data is in Firestore

// A generic object shape for a venue, adaptable for Firestore data.
export type VenueLike = {
  id: string; // The Firestore document ID
  slug: string; // The URL-friendly slug
  [key: string]: any;
};

// This function can be deprecated or adapted once all data sources are from Firestore.
// For now, it's kept for any remaining mock data dependencies.
export function findVenueByAnyId(rawVenueId?: string | null) {
  if (!rawVenueId) return null;

  const id = rawVenueId.trim();

  // The find from DEMO_VENUES is a fallback. In a fully live app, this would be a Firestore query.
  return (
    DEMO_VENUES.find((v) => {
      // In mock data, the slug is the venue ID (e.g., "raw-bar")
      return v.slug === id;
    }) || null
  );
}

/**
 * Given any venue data object from Firestore, return a valid href.
 * The venue slug is the document ID in Firestore.
 */
export function resolveVenueHref(venue: VenueLike | string | null): string | null {
  if (!venue) return null;

  // If we just get the slug string, use it directly.
  if (typeof venue === 'string') {
    return `/venue/${venue}`;
  }

  // If we get the whole venue object, use its slug.
  if (venue.slug) {
    return `/venue/${venue.slug}`;
  }
  
  return null;
}

    