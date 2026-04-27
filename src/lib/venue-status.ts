/**
 * @fileOverview Central utility for venue status logic (Open Now, Closing Soon, etc.)
 * Supports real-time and "God Mode" mock dates.
 */

/**
 * Checks if a venue is open based on its periods data.
 * @param venue - The venue object from Firestore.
 * @param now - The reference date (defaults to real-time, can be overriden for God Mode).
 */
export function isVenueOpen(venue: any, now: Date = new Date()): boolean {
  try {
    // Force open bypass for landmarks (e.g. Bondi Beach)
    if (venue.forceOpen === true) return true;

    const periods = venue.openingHours?.periods;
    // Fallback to true if no data exists - don't hide venues we aren't sure about
    if (!periods || !Array.isArray(periods) || periods.length === 0) return true;

    const day = now.getDay();
    const currentTime = now.getHours() * 100 + now.getMinutes();

    // Special case for 24/7 venues
    const isAlwaysOpen = periods.length === 1 && 
      periods[0]?.open &&
      periods[0].open.day === 0 && 
      periods[0].open.time === "0000" && 
      (!periods[0].close || (periods[0].close.day === 0 && periods[0].close.time === "0000"));

    if (isAlwaysOpen) return true;

    return periods.some((p: any) => {
      if (!p?.open) return false;
      
      const openDay = p.open.day;
      const openTime = parseInt(p.open.time);
      const closeDay = p.close?.day ?? openDay;
      const closeTime = p.close ? parseInt(p.close.time) : 2359;

      // Check if currently within this specific open period
      if (openDay === closeDay) {
        return day === openDay && currentTime >= openTime && currentTime < closeTime;
      } else {
        // Period spans across midnight (e.g. 9pm - 2am)
        if (day === openDay) return currentTime >= openTime;
        if (day === (openDay + 1) % 7) return currentTime < closeTime;
      }
      return false;
    });
  } catch (err) {
    console.warn("Venue status check failed for venue:", venue?.name, err);
    return true; // Fallback to open on error
  }
}
