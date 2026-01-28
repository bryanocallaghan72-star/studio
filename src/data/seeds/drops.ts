/**
 * @fileoverview
 * This file is the Heartbeat of the Digital Twin.
 *
 * If venues.ts is the Map (the physical buildings), then drops.ts is the
 * Pulse (what is happening inside them right now).
 *
 * It powers the "Economy", "Health & Activity", and "Time" layers of the app,
 * transforming it from a static directory into a live marketplace.
 */

// A helper function to create ISO strings for expiration times relative to now.
const hoursFromNow = (h: number) => new Date(Date.now() + h * 60 * 60 * 1000).toISOString();

// --- TYPE DEFINITIONS ---

export interface TableDrop {
  id: string;
  venueId: string;
  venueName: string;
  venueImageUrl: string;
  tableLabel?: string;
  partySize: number;
  startTime: string;
  endTime: string;
  expiresAt: string;
  priceToClaimCents: number;
  currency: string;
  creatorPickHandle?: string;
  isFavoriteVenue?: boolean;
  location: {
    lat: number;
    lng: number;
  };
}

export interface ClassDrop {
  id: string;
  venueId: string;
  venueName: string;
  className: string;
  classImageUrl: string;
  spotsAvailable: number;
  startTime: string;
  expiresAt: string;
  instructorHandle?: string;
  isFavoriteVenue?: boolean;
  location: {
    lat: number;
    lng: number;
  };
}

export interface StyleDrop {
  id: string;
  venueName: string;
  venueImageUrl: string;
  title: string;
  description: string;
  expiresAt: string;
  priceToClaimCents: number;
  currency: string;
  creatorPickHandle?: string;
  slug: string;
  venueId?: string;
}

export interface HotItem {
  id: string;
  title: string;
  venue: string;
  venueId: string;
  description: string;
  imageId: string;
  expiresAt: string;
  claims: number;
  creatorId?: string;
}

export interface Deal {
  id: string;
  title: string;
  venueSlug: string;
  description: string;
  imageId: string;
  validity: string;
  category: string;
  tags?: string[];
}

export interface Stay {
    id: string;
    title: string;
    description: string;
    pricePerNight: number;
    rating: number;
    imageId: string;
    creatorId: string;
    endsIn: number;
}

export interface ARDrop {
    id: string;
    title: string;
    venue: string;
    venueId: string;
    description: string;
    imageId: string;
    isSponsored: boolean;
}


// --- SEED DATA ---

export const TABLE_DROPS: TableDrop[] = [
    {
      id: 'drop-tottis-1',
      venueId: 'tottis',
      venueName: "Totti's",
      venueImageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop',
      tableLabel: 'Courtyard Spot',
      partySize: 2,
      startTime: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
      expiresAt: hoursFromNow(0.25), // Expires in 15 mins
      priceToClaimCents: 1000,
      currency: 'AUD',
      creatorPickHandle: 'lucas',
      isFavoriteVenue: true,
      location: { lat: -33.895, lng: 151.268 },
    },
    {
      id: 'drop-rawbar-1',
      venueId: 'raw-bar',
      venueName: 'Raw Bar',
      venueImageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=1948&auto=format&fit=crop',
      tableLabel: 'Window Seat',
      partySize: 2,
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      expiresAt: hoursFromNow(0.5), // Expires in 30 mins
      priceToClaimCents: 0,
      currency: 'AUD',
      creatorPickHandle: 'jay',
      isFavoriteVenue: true,
      location: { lat: -33.8895, lng: 151.274 },
    },
    {
      id: 'drop-ravesis-1',
      venueId: 'hotel-ravesis',
      venueName: 'Hotel Ravesis',
      venueImageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format&fit=crop',
      tableLabel: 'Balcony View',
      partySize: 4,
      startTime: new Date(Date.now() + 0.5 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 2.5 * 60 * 60 * 1000).toISOString(),
      expiresAt: hoursFromNow(0.08), // Expires in ~5 mins
      priceToClaimCents: 500,
      currency: 'AUD',
      isFavoriteVenue: false,
      location: { lat: -33.8913, lng: 151.276 },
    },
    {
        id: 'drop-lulu-1',
        venueId: 'lulu',
        venueName: 'Lulu',
        venueImageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop',
        partySize: 2,
        startTime: new Date(Date.now() + 1.5 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 3.5 * 60 * 60 * 1000).toISOString(),
        expiresAt: hoursFromNow(0.75), // Expires in 45 mins
        priceToClaimCents: 0,
        currency: 'AUD',
        isFavoriteVenue: true,
        location: { lat: -33.8935, lng: 151.27 },
      },
];

export const CLASS_DROPS: ClassDrop[] = [
    {
      id: 'class-ff-1',
      venueId: 'fluidform-pilates',
      venueName: "Fluidform Pilates",
      className: "Reformer Fundamentals",
      classImageUrl: 'https://images.unsplash.com/photo-1571942674917-263a2a911765?q=80&w=2070&auto=format&fit=crop',
      spotsAvailable: 2,
      startTime: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
      expiresAt: hoursFromNow(0.25),
      instructorHandle: 'shannon',
      isFavoriteVenue: true,
      location: { lat: -33.892, lng: 151.272 },
    },
    {
      id: 'class-lgs-1',
      venueId: 'lets-go-surfing',
      venueName: 'Lets Go Surfing',
      className: "Beginner's Surf Lesson",
      classImageUrl: 'https://images.unsplash.com/photo-1582693529341-3cf9472e3895?q=80&w=2070&auto=format&fit=crop',
      spotsAvailable: 3,
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      expiresAt: hoursFromNow(0.75),
      isFavoriteVenue: true,
      location: { lat: -33.886, lng: 151.277 },
    },
    {
      id: 'class-bml-1',
      venueId: 'bodymindlife-bondi',
      venueName: 'BodyMindLife',
      className: 'Vinyasa Flow',
      classImageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120&auto=format&fit=crop',
      spotsAvailable: 3,
      startTime: new Date(Date.now() + 1.5 * 60 * 60 * 1000).toISOString(),
      expiresAt: hoursFromNow(0.5),
      instructorHandle: 'shannon',
      isFavoriteVenue: true,
      location: { lat: -33.894, lng: 151.268 },
    },
    {
      id: 'class-vixen-1',
      venueId: 'bondi-vixen',
      venueName: 'Bondi Vixen',
      className: 'Twerk & Tone',
      classImageUrl: 'https://images.unsplash.com/photo-1522844426677-4c7760256251?q=80&w=2070&auto=format&fit=crop',
      spotsAvailable: 5,
      startTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
      expiresAt: hoursFromNow(1),
      instructorHandle: 'alice',
      isFavoriteVenue: false,
      location: { lat: -33.890, lng: 151.277 },
    },
    {
      id: 'class-ff-2',
      venueId: 'fluidform-pilates',
      venueName: 'Fluidform Pilates',
      className: 'Advanced Reformer',
      classImageUrl: 'https://images.unsplash.com/photo-1599494548485-2c8a34a860f4?q=80&w=2070&auto=format&fit=crop',
      spotsAvailable: 1,
      startTime: new Date(Date.now() + 2.5 * 60 * 60 * 1000).toISOString(),
      expiresAt: hoursFromNow(0.2),
      instructorHandle: 'emma',
      isFavoriteVenue: true,
      location: { lat: -33.892, lng: 151.272 },
    }
];

export const STYLE_DROPS: StyleDrop[] = [
    {
      id: 'style-drop-1',
      venueName: 'Tuchuzy',
      venueId: 'tuchuzy',
      venueImageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop',
      title: 'Private Access: Sample Sale',
      description: 'Get first look at the Tuchuzy sample sale before it opens to the public. Limited spots.',
      expiresAt: hoursFromNow(2),
      priceToClaimCents: 1000,
      currency: 'AUD',
      creatorPickHandle: 'alice',
      slug: 'tuchuzy',
    },
    {
      id: 'style-drop-2',
      venueName: 'Venroy',
      venueId: 'venroy',
      venueImageUrl: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=2500&auto=format&fit=crop',
      title: '25% Off New Season Linen',
      description: 'Exclusive discount on the latest collection of Venroy\'s signature linen wear.',
      expiresAt: hoursFromNow(4),
      priceToClaimCents: 0,
      currency: 'AUD',
      creatorPickHandle: 'lucas',
      slug: 'venroy',
    },
    {
      id: 'style-drop-3',
      venueName: 'Aquabumps',
      venueId: 'aquabumps',
      venueImageUrl: 'https://images.unsplash.com/photo-1534279435138-3e414156d05f?q=80&w=2070&auto=format&fit=crop',
      title: 'Signed Mini-Print',
      description: 'Claim a free, signed mini-print from photographer Eugene Tan. Today only.',
      expiresAt: hoursFromNow(8),
      priceToClaimCents: 0,
      currency: 'AUD',
      creatorPickHandle: 'shannon',
      slug: 'aquabumps',
    },
];

export const HOT_ITEMS: HotItem[] = [
    {
        id: 'hot-1',
        title: "Last Minute Spot",
        venue: "Fluidform Pilates",
        venueId: "fluidform-pilates",
        description: "25% off the 5pm Reformer class.",
        imageId: "fitness-1",
        expiresAt: hoursFromNow(0.5),
        claims: 12,
    },
    {
        id: 'hot-2',
        title: "$10 Spicy Margs",
        venue: "Lulu",
        venueId: "lulu",
        description: "Spice up your night with our signature spicy margaritas.",
        imageId: "community-sushi",
        creatorId: "lucas",
        expiresAt: hoursFromNow(2),
        claims: 27,
    },
    {
      id: 'hot-3',
      title: "2 for 1 Cocktails",
      venue: "Raw Bar",
      venueId: "raw-bar",
      description: "Enjoy our signature cocktails. Buy one, get one free!",
      imageId: "community-sushi",
      expiresAt: hoursFromNow(1),
      claims: 41,
    },
    {
      id: 'hot-4',
      title: "2-for-1 Crispy Salmon Rolls",
      venue: "Raw Bar",
      venueId: "raw-bar",
      description: "Enjoy our signature crispy salmon rolls. Buy one, get one free!",
      imageId: "sushi-1",
      expiresAt: hoursFromNow(1),
      claims: 19,
    }
];

export const DEALS: Deal[] = [
    {
        id: 'deal-patron',
        title: "2-for-1 Patrón Margaritas",
        venueSlug: "hotel-ravesis",
        description: "Enjoy two Patrón Margaritas for the price of one. The perfect sunset drink!",
        imageId: "cocktail-101",
        validity: "Fri & Sat Sunset",
        category: "Food & Drink",
        tags: ["Weekend", "Sponsored"]
    },
    {
        id: 'deal-2',
        title: "50% Off Sushi Platters",
        venueSlug: "raw-bar",
        description: "Half-price sushi platters every Tuesday and Wednesday.",
        imageId: "sushi-1",
        validity: "Tues & Weds only",
        category: "Food & Drink",
        tags: ["Mid-week"]
    },
    {
        id: 'deal-3',
        title: "Free Coffee with Breakfast",
        venueSlug: "harrys-bondi",
        description: "Get a free coffee with any breakfast order before 10 AM on weekdays.",
        imageId: "coffee-1",
        validity: "Weekdays before 10 AM",
        category: "Food & Drink",
        tags: ["Mid-week"]
    },
    {
        id: 'deal-4',
        title: "Free Reformer Class",
        venueSlug: "fluidform-pilates",
        description: "First time at Fluidform? Your first class is on us!",
        imageId: "fitness-1",
        validity: "New members only",
        category: "Fitness",
        tags: ["Mid-week", "Weekend"]
    },
    {
        id: 'deal-5',
        title: "20% Off Storewide",
        venueSlug: "tuchuzy",
        description: "Get 20% off all new season arrivals this weekend only.",
        imageId: "style-1",
        validity: "This weekend only",
        category: "Shopping",
        tags: ["Weekend"]
    }
];

export const STAYS: Stay[] = [
    {
        id: 'stay-1',
        title: "The Beachfront Penthouse",
        description: "Luxury penthouse with panoramic ocean views.",
        pricePerNight: 750,
        rating: 4.9,
        imageId: "stay-2",
        creatorId: "alice",
        endsIn: 8 * 60 * 60 * 1000, // 8 hours
    },
    {
        id: 'stay-2',
        title: "The Garden Oasis",
        description: "Chic apartment with a stunning private garden.",
        pricePerNight: 450,
        rating: 4.8,
        imageId: "stay-3",
        creatorId: "lucas",
        endsIn: 4 * 60 * 60 * 1000, // 4 hours
    },
     {
        id: 'stay-3',
        title: "The Cozy Studio",
        description: "A cozy and stylish studio apartment in the heart of Bondi.",
        pricePerNight: 250,
        rating: 4.7,
        imageId: "stay-4",
        creatorId: "jay",
        endsIn: 2 * 60 * 60 * 1000, // 2 hours
    },
    {
        id: 'stay-4',
        title: "Modern Beachside Apartment",
        description: "Bright, modern living room in a beachside apartment with ocean views.",
        pricePerNight: 600,
        rating: 4.9,
        imageId: "stay-1",
        creatorId: "shannon",
        endsIn: 6 * 60 * 60 * 1000, // 6 hours
    }
];

export const AR_DROPS: ARDrop[] = [
    {
        id: 'drop-1',
        title: "Free Iced Latte",
        venue: "The Depot",
        venueId: "the-depot",
        description: "Your daily pick-me-up is on us. Show this in AR mode to redeem.",
        imageId: "coffee-1",
        isSponsored: true,
    },
    {
        id: 'drop-2',
        title: "Priority Entry",
        venue: "Hotel Ravesis",
        venueId: "hotel-ravesis",
        description: "Skip the line tonight. Unlock this reward by visiting the venue in AR mode.",
        imageId: "cocktail-101",
        isSponsored: false,
    },
     {
        id: 'drop-3',
        title: "Free Surf Wax",
        venue: "Lets Go Surfing",
        venueId: "lets-go-surfing",
        description: "Grab a free block of surf wax for your next session. Only on iykyk.",
        imageId: "surf-lesson",
        isSponsored: true,
    }
];
