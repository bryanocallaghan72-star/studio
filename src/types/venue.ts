/**
 * @fileOverview Formalized Venue type definition for the iykyk platform.
 * Supports the "Google Reference + iykyk Editorial" architecture.
 */

export interface Venue {
  id: string;
  slug: string;
  
  // The canonical reference to Google Places
  placeId?: string;

  // IYKYK-Owned Editorial Layer (Permanent)
  iykyk?: {
    title?: string;
    category?: string;
    vibeTags?: string[];
    curatedDescription?: string;
    perks?: string[];
    claimConfig?: any;
  };

  // Google Reference Cache (Temporary/Volatile - max 30 days)
  googleCache?: {
    displayName?: string;
    formattedAddress?: string;
    location?: {
      lat: number;
      lng: number;
    };
    phone?: string;
    website?: string;
    googleMapsUri?: string;
    refreshedAt?: any; // Firestore Timestamp
    expiresAt?: any;   // Firestore Timestamp
    attributionRequired?: boolean;
  };

  // Metadata for tracking and compliance
  sourceMeta?: {
    createdVia?: string;
    googleFieldsStored?: string[];
    manuallyVerified?: boolean;
  };

  // Legacy Fields (Supported by adapter for backward compatibility)
  name?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  category?: string;
  vibeTags?: string[];
  description?: string;
  photos?: string[];
  photoReference?: string;
  phone?: string;
  website?: string;
  priceLevel?: number | null;
  businessStatus?: string;
  forceOpen?: boolean;

  // new nested legacy fields
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };

  details?: {
    category?: string;
    description?: string;
    vibeTags?: string[];
    currentVibe?: string;
  };
}
