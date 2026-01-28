
/**
 * @fileoverview Defines the canonical type definitions for Venue-related data.
 * These types serve as a single source of truth for the shape of venue objects
 * throughout the application, independent of the data source (Firestore, local mock data, etc.).
 */

/**
 * A union type representing the possible pricing tiers for a venue.
 * 1 = $, 2 = $$, 3 = $$$, 4 = $$$$
 */
export type PriceTier = 1 | 2 | 3 | 4;

/**
 * A union type for the primary category of a venue.
 * This can be expanded as more categories are officially supported.
 */
export type VenueCategory =
  | 'Vibes'
  | 'Nightlife'
  | 'Brunch'
  | 'Sushi'
  | 'Restaurants'
  | 'Cocktails'
  | 'Health & Fitness'
  | 'Surf'
  | 'Retail'
  | 'Events';

/**
 * Represents the geographical location and address of a venue.
 */
export interface VenueLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

/**
 * Contains the descriptive and categorical details of a venue.
 * All fields are optional to allow for progressive enrichment of venue data.
 */
export interface VenueDetails {
  description?: string;
  category?: VenueCategory;
  subCategory?: string;
  priceTier?: PriceTier;
  openingHours?: string;
  vibeTags?: string[];
  currentVibe?: string;
}

/**
 * The core Venue entity, combining essential identifiers with optional
 * location and detail objects. This is the primary object representing a venue.
 */
export interface Venue {
  // Essential Identifiers
  id: string;   // Typically same as slug (Firestore doc ID)
  slug: string;
  name: string;

  // Canonical structured fields (preferred)
  location?: VenueLocation;
  details?: VenueDetails;

  // Legacy/compat convenience fields (avoid adding new usage)
  latitude?: number;
  longitude?: number;
  address?: string;
  category?: VenueCategory;
  description?: string;

  isSponsored?: boolean;
}
