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
  id: string; // The unique identifier (e.g., Firestore document ID, which is the slug)
  slug: string; // The URL-friendly identifier
  name: string;

  // Optional Nested Data Structures
  location?: VenueLocation;
  details?: VenueDetails;

  // Optional direct-access fields for convenience, may be deprecated later
  latitude?: number;
  longitude?: number;
  address?: string;
  category?: VenueCategory;
  description?: string;
  isSponsor?: boolean;
}
