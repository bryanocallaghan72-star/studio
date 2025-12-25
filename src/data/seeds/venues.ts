/**
 * @fileoverview Baseline seed data for all venues in the application.
 * This data should be considered the canonical source for venue identity, location,
 * and primary category. It is used to populate the Firestore 'venues' collection.
 *
 * It uses the strict `Venue` type definition.
 */

import type { Venue } from '@/types/venue';

export const SEED_VENUES: Venue[] = [
  {
    id: 'bondi-icebergs',
    slug: 'bondi-icebergs',
    name: 'Bondi Icebergs',
    location: {
      latitude: -33.8953,
      longitude: 151.274,
    },
    details: {
      category: 'Vibes',
    },
  },
  {
    id: 'hotel-ravesis',
    slug: 'hotel-ravesis',
    name: 'Hotel Ravesis',
    location: {
      latitude: -33.8913,
      longitude: 151.276,
    },
    details: {
      category: 'Nightlife',
    },
  },
  {
    id: 'the-depot',
    slug: 'the-depot',
    name: 'The Depot',
    location: {
      latitude: -33.8943,
      longitude: 151.27,
    },
    details: {
      category: 'Brunch',
    },
  },
  {
    id: 'raw-bar',
    slug: 'raw-bar',
    name: 'Raw Bar',
    location: {
      latitude: -33.8895,
      longitude: 151.274,
    },
    details: {
      category: 'Sushi',
    },
  },
  {
    id: 'speedos-cafe',
    slug: 'speedos-cafe',
    name: "Speedo's Cafe",
    location: {
      latitude: -33.8888,
      longitude: 151.277,
    },
    details: {
      category: 'Brunch',
    },
  },
  {
    id: 'tottis',
    slug: 'tottis',
    name: "Totti's",
    location: {
      latitude: -33.895,
      longitude: 151.268,
    },
    details: {
      category: 'Restaurants',
    },
  },
  {
    id: 'the-corner-house',
    slug: 'the-corner-house',
    name: 'The Corner House',
    location: {
      latitude: -33.892,
      longitude: 151.271,
    },
    details: {
      category: 'Cocktails',
    },
  },
  {
    id: 'harrys-bondi',
    slug: 'harrys-bondi',
    name: "Harry's Bondi",
    location: {
      latitude: -33.889,
      longitude: 151.276,
    },
    details: {
      category: 'Brunch',
    },
  },
  {
    id: 'lulu',
    slug: 'lulu',
    name: 'Lulu',
    location: {
      latitude: -33.8935,
      longitude: 151.27,
    },
    details: {
      category: 'Restaurants',
    },
  },
  {
    id: 'bills',
    slug: 'bills',
    name: 'Bills',
    location: {
      latitude: -33.891,
      longitude: 151.27,
    },
    details: {
      category: 'Brunch',
    },
  },
  {
    id: 'seans',
    slug: 'seans',
    name: "Sean's",
    location: {
      latitude: -33.887,
      longitude: 151.278,
    },
    details: {
      category: 'Restaurants',
    },
  },
  {
    id: 'la-piadina',
    slug: 'la-piadina',
    name: 'La Piadina',
    location: {
      latitude: -33.89,
      longitude: 151.273,
    },
    details: {
      category: 'Restaurants',
    },
  },
  {
    id: 'the-bucket-list',
    slug: 'the-bucket-list',
    name: 'The Bucket List',
    location: {
      latitude: -33.89,
      longitude: 151.277,
    },
    details: {
      category: 'Nightlife',
    },
  },
  {
    id: 'porch-and-parlour',
    slug: 'porch-and-parlour',
    name: 'Porch and Parlour',
    location: {
      latitude: -33.888,
      longitude: 151.276,
    },
    details: {
      category: 'Brunch',
    },
  },
  {
    id: 'fluidform-pilates',
    slug: 'fluidform-pilates',
    name: 'Fluidform Pilates',
    location: {
      latitude: -33.892,
      longitude: 151.272,
    },
    details: {
      category: 'Health & Fitness',
    },
  },
  {
    id: 'chiswick',
    slug: 'chiswick',
    name: 'Chiswick',
    location: {
      latitude: -33.896,
      longitude: 151.266,
    },
    details: {
      category: 'Restaurants',
    },
  },
  {
    id: 'north-bondi-fish',
    slug: 'north-bondi-fish',
    name: 'North Bondi Fish',
    location: {
      latitude: -33.887,
      longitude: 151.277,
    },
    details: {
      category: 'Restaurants',
    },
  },
  {
    id: 'lets-go-surfing',
    slug: 'lets-go-surfing',
    name: 'Lets Go Surfing',
    location: {
      latitude: -33.886,
      longitude: 151.277,
    },
    details: {
      category: 'Surf',
    },
  },
  {
    id: 'tuchuzy',
    slug: 'tuchuzy',
    name: 'Tuchuzy',
    location: {
      latitude: -33.893,
      longitude: 151.271,
    },
    details: {
      category: 'Retail',
    },
  },
  {
    id: 'venroy',
    slug: 'venroy',
    name: 'Venroy',
    location: {
      latitude: -33.892,
      longitude: 151.273,
    },
    details: {
      category: 'Retail',
    },
  },
  {
    id: 'aquabumps',
    slug: 'aquabumps',
    name: 'Aquabumps',
    location: {
      latitude: -33.894,
      longitude: 151.268,
    },
    details: {
      category: 'Retail',
    },
  },
  {
    id: 'bondi-markets',
    slug: 'bondi-markets',
    name: 'Bondi Markets',
    location: {
      latitude: -33.89,
      longitude: 151.275,
    },
    details: {
      category: 'Retail',
    },
  },
  {
    id: 'bondi-to-bronte-coastal-walk',
    slug: 'bondi-to-bronte-coastal-walk',
    name: 'Bondi to Bronte Coastal Walk',
    location: {
      latitude: -33.903,
      longitude: 151.276,
    },
    details: {
      category: 'Vibes',
    },
  },
  {
    id: 'bondi-beach',
    slug: 'bondi-beach',
    name: 'Bondi Beach',
    location: {
      latitude: -33.8917,
      longitude: 151.277,
    },
    details: {
      category: 'Vibes',
    },
  },
];

export const SEED_VENUES_BY_SLUG = Object.fromEntries(
  SEED_VENUES.map(v => [v.slug, v])
) satisfies Record<string, Venue>;
