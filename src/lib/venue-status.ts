/**
 * @fileOverview Central utility for venue status logic (Open Now, Closing Soon, etc.)
 * Supports real-time and "God Mode" mock dates.
 */

/**
 * Checks if a venue is open.
 * NOTE: Google Places opening hours are no longer cached in Firestore for compliance.
 * Status is derived from iykyk-owned 'forceOpen' flag or returns null (unknown).
 * 
 * @param venue - The venue object from Firestore.
 * @param now - The reference date (defaults to real-time, can be overriden for God Mode).
 * @returns boolean if status is certain, null if status is unknown (missing hours).
 */
export function isVenueOpen(venue: any, now: Date = new Date()): boolean | null {
  try {
    // Authoritative override for 24/7 landmarks or manual overrides
    if (venue.forceOpen === true) return true;

    // We no longer persist Google openingHours in Firestore to comply with 
    // Google Maps Platform Terms of Service. Status must be fetched live 
    // from the Google Places API on the client.
    return null;
  } catch (err) {
    console.warn("Venue status check failed for venue:", venue?.name, err);
    return null;
  }
}
