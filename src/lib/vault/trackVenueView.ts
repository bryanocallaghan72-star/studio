'use client';

interface VenueViewPayload {
    uid: string;
    venueId: string;
    venueName: string;
    imageUrl: string | null;
}

// This is a placeholder function.
// In a real application, this would interact with a backend or analytics service.
export function trackVenueView(payload: VenueViewPayload) {
  console.log("Venue view tracked:", payload);
}
