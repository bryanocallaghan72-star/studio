# Google Places Data & Compliance Policy

**Status**: Active  
**Last Updated**: May 23, 2024

## 1. Core Principles
IYKYK leverages Google Places as a **Reference Layer**, not as a permanent source of truth. We must respect the Google Maps Platform Terms of Service regarding data persistence and attribution.

## 2. Permitted Data (Permanent)
The following fields can be stored indefinitely in Firestore:
- `placeId`: Always store this as the canonical anchor.
- **IYKYK Editorial Data**: Anything created by us or submitted directly by venue owners (Vibe Tags, Curated Descriptions, Perks, Internal Scores).

## 3. Restricted Data (Temporary Cache)
Data sourced from Google (Address, Phone, Website, Lat/Lng) must be stored in the `googleCache` block:
- **Refresh Cycle**: Must be refreshed every 30 days.
- **Metadata**: Every cache block must have `refreshedAt` and `expiresAt` timestamps.
- **Binary Data**: **NEVER** download Google-hosted photos to Firebase Storage. Use the `/api/place-photo` server-side proxy for display.

## 4. Prohibited Data
Do not persist the following Google-sourced fields in any form:
- `rating` / `totalRatings`
- `reviews`
- `openingHours` (Fetch live via Place ID on the client)
- `businessStatus` (Fetch live)

## 5. Attribution Requirements
- **Maps**: If the data is on an interactive Google Map, standard attribution is handled by the SDK.
- **UI Cards/Pages**: If Google-sourced data (Address, Phone, etc.) is shown outside of a map, the `GoogleAttribution` component **must** be rendered in that section.

## 6. Implementation Reference
- **Adapter**: `src/lib/venue-adapter.ts`
- **Helpers**: `src/lib/venue-source.ts`
- **Proxy**: `/api/place-photo`
