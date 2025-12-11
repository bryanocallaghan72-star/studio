// src/lib/venueUtils.ts
import { DEMO_VENUES } from '@/data/DemoVenues';

export function findVenueByAnyId(rawVenueId?: string | null) {
  if (!rawVenueId) return null;

  const id = rawVenueId.trim();

  return (
    DEMO_VENUES.find((v) => {
      const numericFromId = String(v.id).replace(/^venue_/, '');

      return (
        v.id === id ||
        numericFromId === id ||
        v.slug === id ||
        `/venue/${numericFromId}` === id ||
        `/venue/${v.slug}` === id ||
        `venue/${v.slug}` === id
      );
    }) || null
  );
}

/**
 * Given any venueId-like string from a Slice of Life post,
 * return a valid href pointing to the real venue page.
 */
export function resolveVenueHref(rawVenueId?: string | null): string | null {
  const venue = findVenueByAnyId(rawVenueId);
  if (!venue) return null;

  const numericId = String(venue.id).replace(/^venue_/, '');
  return `/venue/${numericId}`;
}
