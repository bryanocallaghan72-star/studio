
import { Sparkles, Coffee, Utensils, Beer, Dumbbell, Sun, Calendar, Zap, Waves, Shirt, Gift, UserPlus, Star } from 'lucide-react';
import { collection, writeBatch, getDocs, doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

export type Community = {
  id: string;
  name: string;
  description: string;
  category: keyof typeof appData.categories;
  members: number;
  channels: string[];
};

export type SocialActivity = {
    id: string;
    title: string;
    description: string;
    time: string;
    location: string;
    creator: {
        id: string;
        name: string;
        avatar: string;
    };
    participants: number;
    maxParticipants: number;
    category: 'Health & Fitness' | 'Vibes' | 'Brunch' | 'Sushi';
    participantAvatars: string[];
};

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
  creatorAvatarUrl?: string;
  isFavoriteVenue?: boolean;
  hasUserClaimed?: boolean;
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
  hasUserClaimed?: boolean;
  location: {
    lat: number;
    lng: number;
  };
}

export interface StyleDrop {
  id: string;
  venueName: string; // Boutique or brand name
  venueImageUrl: string;
  title: string;
  description: string;
  expiresAt: string;
  priceToClaimCents: number;
  currency: string;
  creatorPickHandle?: string;
  hasUserClaimed?: boolean;
  slug: string;
}

export interface SliceOfLifePost {
  id: string; // This is the postId
  creatorId: string;
  venueId: string; // The slug for the venue
  relatedDealId?: string | null;
  sourcePlatform?: 'tiktok' | 'instagram';
  serialCode?: string; // Optional unique code for the post
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  postType: string;
  likes: number;
  commentsCount: number;
  createdAt: string;
  creator: {
    id: string;
    name: string;
    avatar: string;
  }
}


// MVP Seeding Function
export const seedVenuesToFirestore = async (firestore: any) => {
    if (!firestore) {
        console.error("Firestore instance is not available. Seeding cannot proceed.");
        return { success: false, message: 'Firestore not initialized.' };
    }
    const venuesCollection = collection(firestore, 'venues');
    
    try {
        const snapshot = await getDocs(venuesCollection);
        if (!snapshot.empty) {
            console.log('Venues collection already exists. Seeding skipped.');
            return { success: true, message: 'Seeding skipped, venues already exist.' };
        }

        const batch = writeBatch(firestore);
        appData.map.pins.forEach(venue => {
            const docRef = doc(venuesCollection, venue.slug);
            batch.set(docRef, venue);
        });

        await batch.commit();
        console.log('Successfully seeded venues to Firestore.');
        return { success: true, message: 'Successfully seeded venues to Firestore.' };
    } catch (error) {
        console.error('Error seeding venues:', error);
        return { success: false, message: 'Error seeding venues.' };
    }
}

// Raw data for different content types
const rawPhotoPosts = [
  {
      id: 6,
      type: "photo",
      creator: { id: "alice", name: "alice", avatar: "https://github.com/alice.png" },
      venue: "Tuchuzy",
      description: "Obsessed with the new collection at Tuchuzy. The perfect spot for finding designer gems. ✨ #iykykstyle #bondifashion",
      imageId: "style-1",
      likes: 621,
      comments: 68,
      commentData: [],
      createdAt: "2024-07-22T12:00:00Z"
  },
  {
      id: 1,
      type: "photo",
      creator: { id: "jay", name: "jay", avatar: "https://github.com/jay.png" },
      venue: "Raw Bar",
      description: "Finally found the best sushi in Bondi. That crispy salmon roll is a game changer. 🍣",
      imageId: "sushi-1",
      likes: 245,
      comments: 34,
      commentData: [
        { author: "alice", text: "Omg looks amazing!" },
        { author: "lucas", text: "You have to try their spicy tuna next time." },
      ],
      createdAt: "2024-07-22T11:00:00Z"
  },
  {
      id: 2,
      type: "photo",
      creator: { id: "alice", name: "alice", avatar: "https://github.com/alice.png" },
      venue: "Hotel Ravesis",
      description: "Sunset vibes and perfect cocktails. My kind of Tuesday.",
      imageId: "community-sushi",
      likes: 482,
      comments: 51,
      commentData: [],
      createdAt: "2024-07-21T18:00:00Z"
  },
];

const rawReelPosts = [
    {
      id: 1,
      creator: { name: "jay", avatar: "https://github.com/jay.png" },
      description: "Can't get enough of this place #sushi #bondi",
      imageId: "sushi-1",
      videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
      likes: 12500,
      comments: 789,
      commentData: [],
      createdAt: "2024-07-22T10:00:00Z"
    },
    {
        id: 2,
        creator: { name: "alice", avatar: "https://github.com/alice.png" },
        description: "Perfect cocktails for a perfect night",
        imageId: "community-sushi",
        videoUrl: "https://test-videos.co.uk/vids/elephantsdream/mp4/h264/720/Elephants_Dream_720_10s_1MB.mp4",
        likes: 8300,
        comments: 452,
        commentData: [],
        createdAt: "2024-07-21T19:00:00Z"
    },
];

const rawSliceOfLifePosts: Omit<SliceOfLifePost, 'creator'>[] = [
    {
      id: "sol-1",
      creatorId: "shannon",
      title: "My first week in Bondi",
      description: "Just landed from Ireland and I'm already in love with this place. The sunrise swims are something else. It feels like a new beginning, you know? A bit scary, but mostly exciting. Here's to making it work.",
      videoUrl: "https://cdn.pixelbin.io/v2/throbbing-poetry-5e04c5/original/pexels_videos_2759484__2160p_.mp4",
      thumbnailUrl: "https://images.pexels.com/videos/2759484/pexels-photo-2759484.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      duration: 45,
      postType: "Short Diary",
      likes: 1200,
      commentsCount: 88,
      createdAt: "2024-07-21T08:00:00Z",
      venueId: "bondi-icebergs",
      relatedDealId: null,
    },
    {
      id: "sol-2",
      creatorId: "lucas",
      title: "The art of a perfect cocktail",
      description: "People think it's just mixing drinks, but it's about the story. Each ingredient, each movement... it's a performance. This is my 'Map Day Story' from behind the bar at The Corner House, where I get to create a little bit of magic for people.",
      videoUrl: "https://cdn.pixelbin.io/v2/throbbing-poetry-5e04c5/original/pexels-kampus-production-8569201__2160p_.mp4",
      thumbnailUrl: "https://images.pexels.com/videos/8569201/pexels-photo-8569201.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      duration: 112,
      postType: "Deep Cut",
      likes: 3400,
      commentsCount: 230,
      createdAt: "2024-07-20T19:30:00Z",
      venueId: "the-corner-house",
      relatedDealId: "hot-2",
    },
     {
      id: "sol-3",
      creatorId: "jay",
      title: "The Ultimate Crispy Salmon Roll",
      description: "I've tried sushi all over Bondi, and this is it. The perfect balance of crispy, fresh, and savory. This is a must-try. You can get 2-for-1 with the iykyk app.",
      videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=1948&auto=format&fit=crop",
      duration: 25,
      postType: "Local Spotlight",
      likes: 5600,
      commentsCount: 450,
      createdAt: "2024-07-22T12:00:00Z",
      venueId: "raw-bar",
      relatedDealId: "hot-4",
    },
    {
      id: "sol-4",
      creatorId: "alice",
      title: "Best Sushi Ever!",
      description: "Seriously, Raw Bar has the best sushi in Bondi. The vibe is immaculate and the fish is always so fresh. This is my go-to spot for a reason. You can claim a 2-for-1 deal on their crispy salmon rolls through the app right now!",
      videoUrl: "https://cdn.pixelbin.io/v2/throbbing-poetry-5e04c5/original/production_id_4763985__2160p_.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1000&auto=format&fit=crop",
      duration: 32,
      postType: "Creator's Confession",
      likes: 4100,
      commentsCount: 312,
      createdAt: "2024-07-23T18:00:00Z",
      venueId: "raw-bar",
      relatedDealId: "hot-4",
      sourcePlatform: "instagram"
    }
];

const creators = [
    {
      id: 'shannon',
      name: 'Shannon',
      bio: 'Just an Irish girl who\'s new to Bondi. Show me the best spots for a pint and a good chat!',
      avatar: 'https://github.com/shannon.png',
      x: '30%',
      y: '40%',
      activity: [{ name: 'Mon', uv: 200 }, { name: 'Tue', uv: 350 }, { name: 'Wed', uv: 300 }, { name: 'Thu', uv: 480 }, { name: 'Fri', uv: 500 }, { name: 'Sat', uv: 400 }, { name: 'Sun', uv: 600 }]
    },
    {
      id: 'alice',
      name: 'Alice',
      bio: 'French DJ spinning tunes across Bondi. Find me where the beat drops and the cocktails flow.',
      avatar: 'https://github.com/alice.png',
      x: '70%',
      y: '60%',
      activity: [{ name: 'Mon', uv: 500 }, { name: 'Tue', uv: 450 }, { name: 'Wed', uv: 600 }, { name: 'Thu', uv: 550 }, { name: 'Fri', uv: 700 }, { name: 'Sat', uv: 800 }, { name: 'Sun', uv: 750 }]
    },
    {
      id: 'lucas',
      name: 'Lucas',
      bio: 'Upcoming DJ and barman from a hospo family. I know the best-kept secrets of Bondi\'s nightlife.',
      avatar: 'https://github.com/lucas.png',
      x: '80%',
      y: '20%',
      activity: [{ name: 'Mon', uv: 400 }, { name: 'Tue', uv: 420 }, { name: 'Wed', uv: 500 }, { name: 'Thu', uv: 450 }, { name: 'Fri', uv: 600 }, { name: 'Sat', uv: 700 }, { name: 'Sun', uv: 650 }]
    },
    {
      id: 'jay',
      name: 'Jay',
      bio: 'Korean foodie on a mission to find the most authentic and delicious eats in town.',
      avatar: 'https://github.com/jay.png',
      x: '45%',
      y: '75%',
      activity: [{ name: 'Mon', uv: 300 }, { name: 'Tue', uv: 320 }, { name: 'Wed', uv: 350 }, { name: 'Thu', uv: 400 }, { name: 'Fri', uv: 450 }, { name: 'Sat', uv: 500 }, { name: 'Sun', uv: 480 }]
    },
    {
      id: 'kevin',
      name: 'Kevin',
      bio: 'I just really, really love bananas. And anything made with them. Send me your best banana bread recipes.',
      avatar: 'https://github.com/kevin.png',
      x: '15%',
      y: '60%',
      activity: [{ name: 'Mon', uv: 100 }, { name: 'Tue', uv: 120 }, { name: 'Wed', uv: 110 }, { name: 'Thu', uv: 150 }, { name: 'Fri', uv: 180 }, { name: 'Sat', uv: 200 }, { name: 'Sun', uv: 190 }]
    },
    {
      id: 'bondicreator',
      name: 'bondicreator',
      bio: 'I make content about Bondi.',
      avatar: 'https://github.com/shadcn.png',
       x: '50%',
      y: '50%',
      activity: [{ name: 'Mon', uv: 250 }, { name: 'Tue', uv: 280 }, { name: 'Wed', uv: 300 }, { name: 'Thu', uv: 320 }, { name: 'Fri', 'uv': 350 }, { name: 'Sat', uv: 400 }, { name: 'Sun', uv: 380 }]
    },
    {
      id: 'foodiegal',
      name: 'foodiegal',
      bio: 'I love food!',
      avatar: 'https://github.com/foodie.png',
      x: '25%',
      y: '25%',
      activity: [{ name: 'Mon', uv: 280 }, { name: 'Tue', uv: 300 }, { name: 'Wed', uv: 320 }, { name: 'Thu', uv: 350 }, { name: 'Fri', uv: 380 }, { name: 'Sat', uv: 420 }, { name: 'Sun', uv: 400 }]
    }
  ];

const enrichedSliceOfLifePosts = rawSliceOfLifePosts.map(post => {
    const creator = creators.find(c => c.id === post.creatorId);
    if (!creator) throw new Error(`Creator not found for post ${post.id}`);
    return { ...post, creator };
}) as SliceOfLifePost[];

const unifiedFeedItems = [
  ...rawPhotoPosts.map(p => ({ ...p, type: 'photo' as const })),
  ...enrichedSliceOfLifePosts.map(p => ({ ...p, type: 'story' as const })),
].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());


export const appData = {
  feedItems: unifiedFeedItems,
  sliceOfLifePosts: enrichedSliceOfLifePosts,
  styleDrops: [
    {
      id: 'style-drop-1',
      venueName: 'Tuchuzy',
      venueImageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop',
      title: 'Private Access: Sample Sale',
      description: 'Get first look at the Tuchuzy sample sale before it opens to the public. Limited spots.',
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      priceToClaimCents: 1000,
      currency: 'AUD',
      creatorPickHandle: 'alice',
      slug: 'tuchuzy',
    },
    {
      id: 'style-drop-2',
      venueName: 'Venroy',
      venueImageUrl: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=2500&auto=format&fit=crop',
      title: '25% Off New Season Linen',
      description: 'Exclusive discount on the latest collection of Venroy\'s signature linen wear.',
      expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      priceToClaimCents: 0,
      currency: 'AUD',
      creatorPickHandle: 'lucas',
      slug: 'venroy',
    },
    {
      id: 'style-drop-3',
      venueName: 'Aquabumps',
      venueImageUrl: 'https://images.unsplash.com/photo-1534279435138-3e414156d05f?q=80&w=2070&auto=format&fit=crop',
      title: 'Signed Mini-Print',
      description: 'Claim a free, signed mini-print from photographer Eugene Tan. Today only.',
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      priceToClaimCents: 0,
      currency: 'AUD',
      creatorPickHandle: 'shannon',
      slug: 'aquabumps',
    },
  ] as StyleDrop[],
  classDrops: [
    {
      id: 'class-ff-1',
      venueId: 'fluidform-pilates',
      venueName: "Fluidform Pilates",
      className: "Reformer Fundamentals",
      classImageUrl: 'https://images.unsplash.com/photo-1571942674917-263a2a911765?q=80&w=2070&auto=format&fit=crop',
      spotsAvailable: 2,
      startTime: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
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
      expiresAt: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
      isFavoriteVenue: true,
      location: { lat: -33.886, lng: 151.277 },
    },
    {
      id: 'class-yoga-1',
      venueId: 'yoga-by-the-sea',
      venueName: 'Yoga by the Sea',
      className: "Sunrise Vinyasa Flow",
      classImageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120&auto=format&fit=crop',
      spotsAvailable: 1,
      startTime: new Date(Date.now() + 0.5 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      instructorHandle: 'alice',
      isFavoriteVenue: false,
      location: { lat: -33.89, lng: 151.278 },
    },
  ] as ClassDrop[],
  tableDrops: [
    {
      id: 'drop-tottis-1',
      venueId: 'tottis',
      venueName: "Totti's",
      venueImageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop',
      tableLabel: 'Courtyard Spot',
      partySize: 2,
      startTime: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
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
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
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
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
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
        expiresAt: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
        priceToClaimCents: 0,
        currency: 'AUD',
        isFavoriteVenue: true,
        location: { lat: -33.8935, lng: 151.27 },
      },
  ] as TableDrop[],
  quests: [
    { id: 'quest-photo', venue: 'Bondi Beach', slug: 'bondi-beach', title: 'Bondi Photo Quest' },
    { id: 'quest-foodie', venue: 'Totti\'s', slug: 'tottis', title: 'Foodie Challenge' },
  ],
  rewards: [
      { id: 'reward-coffee', venue: 'The Depot', slug: 'the-depot', title: 'Free Coffee Reward' },
      { id: 'reward-merch', venue: 'Hotel Ravesis', slug: 'hotel-ravesis', title: 'Exclusive Merch' },
  ],
  socialActivities: [
    {
        id: 'social-1',
        title: 'Sunrise Yoga Sesh',
        description: 'Starting the day with good vibes and a great stretch. All levels welcome, just bring a mat and some water!',
        time: '7:00 AM',
        location: 'Grassy Knoll, North Bondi',
        creator: { id: 'lucas', name: 'Lucas', avatar: 'https://github.com/lucas.png' },
        participants: 8,
        maxParticipants: 10,
        category: 'Health & Fitness',
        participantAvatars: ['https://github.com/alice.png', 'https://github.com/jay.png', 'https://github.com/shannon.png', 'https://github.com/kevin.png'],
    },
    {
        id: 'social-2',
        title: 'Spikeball at 4pm',
        description: 'Need 3 more players for some friendly but competitive spikeball this arvo. Let\'s get a game going!',
        time: '4:00 PM',
        location: 'Middle of Bondi Beach',
        creator: { id: 'jay', name: 'Jay', avatar: 'https://github.com/jay.png' },
        participants: 1,
        maxParticipants: 4,
        category: 'Vibes',
        participantAvatars: [],
    },
    {
        id: 'social-3',
        title: 'Afternoon Coffee Run',
        description: 'Heading to The Depot for a coffee break. Anyone wanna join and chat about nothing in particular?',
        time: '2:30 PM',
        location: 'The Depot',
        creator: { id: 'shannon', name: 'Shannon', avatar: 'https://github.com/shannon.png' },
        participants: 2,
        maxParticipants: 4,
        category: 'Brunch',
        participantAvatars: ['https://github.com/kevin.png'],
    },
    {
        id: 'social-4',
        title: 'Seeking Sushi Partner',
        description: 'Craving some fresh sushi from Raw Bar for dinner tonight but don\'t wanna go alone. Join me!',
        time: '7:30 PM',
        location: 'Raw Bar',
        creator: { id: 'alice', name: 'Alice', avatar: 'https://github.com/alice.png' },
        participants: 1,
        maxParticipants: 2,
        category: 'Sushi',
        participantAvatars: [],
    },
  ] as SocialActivity[],
  arDrops: [
    {
        id: 'drop-1',
        title: "Free Iced Latte",
        venue: "The Depot",
        description: "Your daily pick-me-up is on us. Show this in AR mode to redeem.",
        imageId: "coffee-1",
        isSponsored: true,
    },
    {
        id: 'drop-2',
        title: "Priority Entry",
        venue: "Hotel Ravesis",
        description: "Skip the line tonight. Unlock this reward by visiting the venue in AR mode.",
        imageId: "cocktail-101",
        isSponsored: false,
    },
     {
        id: 'drop-3',
        title: "Free Surf Wax",
        venue: "Lets Go Surfing",
        description: "Grab a free block of surf wax for your next session. Only on iykyk.",
        imageId: "surf-lesson",
        isSponsored: true,
    }
  ],
  styleItems: [
    {
      id: 'style-1',
      title: 'Tuchuzy',
      description: 'Iconic Bondi boutique with curated designer collections.',
      imageId: 'style-1',
      category: 'Boutique',
      creatorId: 'alice',
      slug: 'tuchuzy'
    },
    {
      id: 'style-2',
      title: 'Venroy',
      description: 'Leisurewear for a global nomadic life. Born in Bondi.',
      imageId: 'style-2',
      category: 'Local Brand',
      creatorId: 'lucas',
      slug: 'venroy'
    },
    {
      id: 'style-3',
      title: 'Aquabumps',
      description: 'Gallery showcasing incredible surf and ocean photography.',
      imageId: 'waves-1',
      category: 'Art & Design',
      creatorId: 'shannon',
      slug: 'aquabumps'
    },
    {
      id: 'style-4',
      title: 'Bondi Markets',
      description: 'Sunday markets for unique finds from local designers.',
      imageId: 'markets-1',
      category: 'Market',
      slug: 'bondi-markets',
    }
  ],
  stays: [
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
  ],
  deals: [
    {
        id: 'deal-patron',
        title: "2-for-1 Patrón Margaritas",
        venue: "Hotel Ravesis",
        description: "Enjoy two Patrón Margaritas for the price of one. The perfect sunset drink!",
        imageId: "cocktail-101",
        validity: "Fri & Sat Sunset",
        category: "Food & Drink",
        tags: ["Weekend", "Sponsored"]
    },
    {
        id: 'deal-2',
        title: "50% Off Sushi Platters",
        venue: "Raw Bar",
        description: "Half-price sushi platters every Tuesday and Wednesday.",
        imageId: "sushi-1",
        validity: "Tues & Weds only",
        category: "Food & Drink",
        tags: ["Mid-week"]
    },
    {
        id: 'deal-3',
        title: "Free Coffee with Breakfast",
        venue: "Harry's Bondi",
        description: "Get a free coffee with any breakfast order before 10 AM on weekdays.",
        imageId: "coffee-1",
        validity: "Weekdays before 10 AM",
        category: "Food & Drink",
        tags: ["Mid-week"]
    },
    {
        id: 'deal-4',
        title: "Free Reformer Class",
        venue: "Fluidform Pilates",
        description: "First time at Fluidform? Your first class is on us!",
        imageId: "fitness-1",
        validity: "New members only",
        category: "Fitness",
        tags: ["Mid-week", "Weekend"]
    },
    {
        id: 'deal-5',
        title: "20% Off Storewide",
        venue: "Tuchuzy",
        description: "Get 20% off all new season arrivals this weekend only.",
        imageId: "style-1",
        validity: "This weekend only",
        category: "Shopping",
        tags: ["Weekend"]
    }
  ],
  hotItems: [
    {
        id: 'hot-1',
        title: "Last Minute Spot",
        venue: "Fluidform Pilates",
        description: "25% off the 5pm Reformer class.",
        imageId: "fitness-1",
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        claims: 12,
    },
    {
        id: 'hot-2',
        title: "$10 Spicy Margs",
        venue: "Lulu",
        description: "Spice up your night with our signature spicy margaritas.",
        imageId: "community-sushi",
        creatorId: "lucas",
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        claims: 27,
    },
    {
      id: 'hot-3',
      title: "2 for 1 Cocktails",
      venue: "Raw Bar",
      description: "Enjoy our signature cocktails. Buy one, get one free!",
      imageId: "community-sushi",
      expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
      claims: 41,
    },
    {
      id: 'hot-4',
      title: "2-for-1 Crispy Salmon Rolls",
      venue: "Raw Bar",
      description: "Enjoy our signature crispy salmon rolls. Buy one, get one free!",
      imageId: "sushi-1",
      expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
      claims: 19,
    }
  ],
  creators: creators,
  categories: {
    "All": { icon: Sparkles, color: '#f8fafc', textColor: '#0f172a' },
    "Drops": { icon: Gift, color: '#a78bfa', textColor: '#ffffff' },
    "Brunch": { icon: Coffee, color: '#f59e0b', textColor: '#ffffff' },
    "Lunch": { icon: Utensils, color: '#14b8a6', textColor: '#ffffff' },
    "Restaurants": { icon: Utensils, color: '#3b82f6', textColor: '#ffffff' },
    "Nightlife": { icon: Beer, color: '#8b5cf6', textColor: '#ffffff' },
    "Health & Fitness": { icon: Dumbbell, color: '#ec4899', textColor: '#ffffff' },
    "Surf": { icon: Waves, color: '#38bdf8', textColor: '#ffffff' },
    "Vibes": { icon: Sun, color: '#fbbf24', textColor: '#0f172a' },
    "Sushi": { icon: Utensils, color: '#2dd4bf', textColor: '#0f172a' },
    "Cocktails": { icon: Beer, color: '#d946ef', textColor: '#ffffff' },
    "Retail": { icon: Shirt, color: '#f43f5e', textColor: '#ffffff' },
    "Events": { icon: Calendar, color: '#fb7185', textColor: '#ffffff' },
    "Flash": { icon: Zap, color: '#6366f1', textColor: '#ffffff' },
  },
  communities: [
    { id: 'brunch-club', name: 'Bondi Brunch Club', description: 'For the mimosa lovers and avo toast aficionados.', category: 'Brunch', members: 128, channels: ['general', 'tips', 'meetups'] },
    { id: 'lunch-crew', name: 'Bondi Lunch Crew', description: 'Find the best midday bites and deals.', category: 'Lunch', members: 84, channels: ['general', 'deals', 'recommendations'] },
    { id: 'restaurant-connoisseurs', name: 'Bondi Restaurant Connoisseurs', description: 'A space for dinner plans and date night discussions.', category: 'Restaurants', members: 231, channels: ['general', 'date-night', 'new-openings'] },
    { id: 'nightlife-lovers', name: 'Bondi Nightlife', description: 'Discovering the hottest bars, clubs, and late-night spots.', category: 'Nightlife', members: 450, channels: ['general', 'djs-and-music', 'events', 'meetups'] },
    { id: 'health-fitness-crew', name: 'Bondi Health & Fitness Crew', description: 'Running clubs, yoga classes, and gym tips.', category: 'Health & Fitness', members: 192, channels: ['general', 'running-club', 'yoga', 'gym-buddies'] },
    { id: 'vibes-sunsets', name: 'Bondi Vibes & Sunsets', description: 'Chasing good music, chill atmospheres, and the perfect photo.', category: 'Vibes', members: 312, channels: ['general', 'photo-sharing', 'best-spots'] },
    { id: 'sushi-society', name: 'Bondi Sushi Society', description: 'For the love of fresh fish and perfectly rolled maki.', category: 'Sushi', members: 156, channels: ['general', 'recommendations', 'omakase-deals'] },
    { id: 'cocktail-club', name: 'Bondi Cocktail Club', description: 'From classic martinis to new tiki drinks.', category: 'Cocktails', members: 289, channels: ['general', 'recipes', 'hidden-bars'] },
    { id: 'retail-style', name: 'Bondi Retail & Style', description: 'For the shopaholics and local boutique supporters.', category: 'Retail', members: 76, channels: ['general', 'new-arrivals', 'sales-and-deals'] },
    { id: 'events-culture', name: 'Bondi Events & Culture', description: 'Stay in the know about all local happenings.', category: 'Events', members: 500, channels: ['general', 'markets', 'festivals', 'live-music'] },
  ] as Community[],
  mockMessages: [
    { id: 1, author: 'Jay', avatar: 'https://github.com/jay.png', text: 'Just tried the new omakase at Raw Bar. Unbelievable! #tips' },
    { id: 2, author: 'Alice', avatar: 'https://github.com/alice.png', text: 'Anyone heading to Ravesis tonight? I\'m DJing from 10pm! #events' },
    { id: 3, author: 'You', avatar: 'https://github.com/you.png', text: 'Sounds awesome! What\'s the vibe like there on a Thursday?' },
    { id: 4, author: 'Shannon', avatar: 'https://github.com/shannon.png', text: 'Ravesis is always a good time! A bit boujee but the music is great.' },
    { id: 5, author: 'Lucas', avatar: 'https://github.com/lucas.png', text: 'I\'m working at The Corner House tonight, come say hi if you\'re around! Quieter vibe but great cocktails. #meetups' },
  ],
  surprises: [
    {
        title: "Bondi to Bronte Cliff Walk",
        description: "Time for a breathtaking walk. The ocean is calling!",
        imageId: "coastal-walk",
        venue: "Bondi Cliffs"
    },
    {
        title: "Swim at North Bondi",
        description: "The waves are perfect for a refreshing dip. Go for it!",
        imageId: "icebergs-pool",
        venue: "North Bondi Beach"
    },
    {
        title: "BBQ at Tamarama Park",
        description: "Grab some snags! The public BBQs are free. Time for a classic Aussie arvo.",
        imageId: "bondi-sunset",
        venue: "Tamarama Park"
    },
    {
        title: "Spontaneous Gelato Tasting",
        description: "Surprise! A local gelateria is offering free samples of their new, exotic flavor for the next hour.",
        imageId: "morning-2",
        venue: "Gelato Gusto"
    },
    {
        title: "Craft Cocktail Discovery",
        description: "You've found a hidden bar known for its unique, handcrafted cocktails. Cheers to the unexpected!",
        imageId: "community-sushi",
        venue: "The Alchemist's Nook"
    },
    {
        title: "Tapas for Two",
        description: "A cozy tapas bar has a table just for you. Enjoy a selection of small plates and big flavors.",
        imageId: "sushi-1",
        venue: "El Rincon Escondido"
    },
    {
        title: "Surprise Wellness Session",
        description: "A local studio is offering a drop-in spot for a meditation and sound bath session. Time to relax and recharge.",
        imageId: "fitness-1",
        venue: "Zenith Wellness"
    },
    {
        title: "Omakase Sushi Special",
        description: "A top sushi chef has an unlisted Omakase special available for the next hour. A true taste of Japan awaits.",
        imageId: "sushi-1",
        venue: "Sakura Sushi"
    }
  ],
  mapMyDayOptions: [
    {
      id: 'mmd-patron',
      title: 'The Patrón Margarita Sunset',
      description: 'Sponsored by Patrón',
      request: {
        vibe: 'A Patrón Margarita Sunset Vibe: Start with a scenic walk, then find the perfect spot to enjoy a refreshing Patrón Margarita as the sun goes down. End with a casual dinner.',
        pace: 2,
        budget: 3,
        travelMode: 'walking',
      },
      mockItinerary: [
        { time: '17:00', name: 'Bondi to Bronte Coastal Walk', notes: 'Golden hour walk.' },
        { time: '18:00', name: 'Hotel Ravesis', notes: 'Enjoy a 2-for-1 Patrón Margarita deal.' },
        { time: '19:30', name: 'La Piadina', notes: 'Casual and delicious Italian street food.' }
      ],
      curatedMessage: 'Your Patrón Margarita Sunset is ready! Take a golden hour stroll along the coast, then head to Hotel Ravesis for your 2-for-1 Patrón Margarita. Finish with some amazing Italian food at La Piadina. Enjoy the sunset!'
    },
    {
      id: 'mmd1',
      title: 'Tinder Date - Bondi',
      description: 'Casual cocktails to break the ice',
      request: {
        vibe: 'A casual but impressive Tinder date in Bondi. Start with unique cocktails, followed by a trendy dinner spot that\'s not too formal, and end with a place with great views for a nightcap.',
        pace: 3,
        budget: 4,
        travelMode: 'walking',
      },
      mockItinerary: [
        { time: '18:30', name: 'The Rum Diary Bar', notes: 'Booked in for a cheeky cocktail.' },
        { time: '19:30', name: 'Totti\'s', notes: 'Reservation for dinner and some delicious Italian food.' },
        { time: '21:00', name: 'Bondi Icebergs', notes: 'Finish the night with some wicked cocktails.' }
      ],
      curatedMessage: 'All good, you\'re booked in for a cheeky cocktail at The Rum Diary Bar, then jump over to Totti\'s for some delicious Italian food. Finish the night at Icebergs with some wicked cocktails. You\'ve Got This!'
    },
    {
      id: 'mmd2',
      title: 'Single & Ready to Mingle - Bondi',
      description: 'Easy icebreakers over small plates',
      request: {
        vibe: 'A fun, high-energy night for a single person in Bondi looking to meet people. Think busy, social venues with opportunities to chat with new people. Start with a lively trivia or tapas bar, move to a rooftop for cocktails, and end at a place with dancing.',
        pace: 4,
        budget: 3,
        travelMode: 'walking',
      },
      mockItinerary: [
        { time: '18:30', name: 'Lulu', notes: 'Trivia & tapas at the local.' },
        { time: '20:00', name: 'Hotel Ravesis', notes: 'Rooftop cocktails - mingle hour.' },
        { time: '22:00', name: 'Bondi Vibes Bar', notes: 'Dancing & good energy!' }
      ],
      curatedMessage: 'Get ready to mingle! You\'re all set for trivia and tapas at Lulu, then hit the rooftop at Ravesis for some cocktails. Finish the night dancing at Bondi Vibes Bar. Have fun!'
    },
    {
      id: 'mmd3',
      title: 'Wellness Saturday - Bondi',
      description: 'Stretch with an ocean view',
      request: {
        vibe: 'The ultimate wellness and self-care day in Bondi. Start with a morning exercise class with ocean views, followed by a healthy and delicious breakfast (think acai bowls and green juice), and finish with a refreshing and resetting activity like a cold plunge.',
        pace: 2,
        budget: 3,
        travelMode: 'walking',
      },
      mockItinerary: [
        { time: '08:00', name: 'Fluidform Pilates', notes: 'Sunrise yoga at the Pavilion.' },
        { time: '09:30', name: 'Harry\'s Bondi', notes: 'Acai bowl & green juice.' },
        { time: '11:00', name: 'Bondi Icebergs', notes: 'Cold plunge & reset.' }
      ],
      curatedMessage: 'Your wellness day is all planned! Start with sunrise yoga at Fluidform Pilates, grab a healthy bite at Harry\'s, then finish with a refreshing cold plunge at Icebergs. A perfect reset!'
    },
    {
      id: 'mmd4',
      title: 'Date Night - Bondi',
      description: 'Cliffop glow & photo spots',
      request: {
        vibe: 'A classic, romantic date night in Bondi. I want a fantastic meal at a popular spot, followed by rooftop drinks with an amazing ocean view for sunset, and a final stop for a scenic walk and cocktails.',
        pace: 3,
        budget: 4,
        travelMode: 'walking',
      },
      mockItinerary: [
        { time: '18:00', name: 'Totti\'s', notes: 'Reservation for an amazing meal.' },
        { time: '19:30', name: 'Hotel Ravesis', notes: 'Rooftop drinks with an ocean view.' },
        { time: '21:00', name: 'Bondi Icebergs', notes: 'Sunset walk and cocktails at the pool.' }
      ],
      curatedMessage: 'All good, you\'re booked in for a cheeky cocktail at Rum Diaries, then jump over to Totti\'s for some delicious Italian food. Finish the night at Icebergs with some wicked cocktails. You\'ve Got This!'
    },
    {
      id: 'mmd5',
      title: 'Girls\' Night Out - Bondi',
      description: 'Margaritas & shared tapas',
       request: {
        vibe: 'A fun and energetic girls\' night out. We want to start with margaritas and shared tapas, move to a stylish rooftop bar for more cocktails, and end the night dancing at a place with great energy and music.',
        pace: 4,
        budget: 3,
        travelMode: 'uber',
      },
      mockItinerary: [
        { time: '18:00', name: 'Lulu', notes: 'Margaritas and shared tapas.' },
        { time: '20:00', name: 'Hotel Ravesis', notes: 'Skyline cocktails on the rooftop.' },
        { time: '22:00', name: 'Bondi Vibes Bar', notes: 'Dancing & good energy.' }
      ],
      curatedMessage: 'Your girls\' night out is all set! Start with margaritas at Lulu, then hit the rooftop at Ravesis for cocktails. Finish the night dancing at Bondi Vibes Bar. Have a blast!'
    },
    {
      id: 'mmd6',
      title: 'Ladies\' Lunch - Bondi',
      description: 'Window shop & try-ons',
      request: {
        vibe: 'A chic and leisurely ladies\' lunch in Bondi. Start with a delicious brunch with spritzes, followed by some window shopping, and finish with champagne and oysters at a sophisticated spot.',
        pace: 2,
        budget: 4,
        travelMode: 'walking',
      },
      mockItinerary: [
        { time: '12:00', name: 'Raw Bar', notes: 'Ricotta hotcakes & spritz.' },
        { time: '13:30', name: 'Totti\'s', notes: 'Window shopping & try-ons.' },
        { time: '15:00', name: 'Sushi-e', notes: 'Champagne & oysters.' }
      ],
      curatedMessage: 'Lunch plans are sorted! You\'re all set for ricotta hotcakes and spritz at Raw Bar, then head over to Totti\'s for a window shop. Finish your afternoon with champagne and oysters at Sushi-e. Enjoy!'
    },
    {
      id: 'mmd7',
      title: 'Quick Bondi Lunch',
      description: 'Grab a healthy and delicious bite on your break.',
      request: {
        vibe: 'A quick, healthy, and delicious lunch in Bondi for someone on a work break. Two options: one very healthy and fresh, one a bit more of a treat but still fast.',
        pace: 5,
        budget: 2,
        travelMode: 'walking',
      },
      mockItinerary: [
        { time: '13:30', name: 'Raw Bar', notes: 'Healthy and fresh lunch.' },
        { time: '14:30', name: 'Beach Burrito Company', notes: 'A quick taco.' }
      ],
      curatedMessage: 'Your quick lunch is sorted! Head to Raw Bar for a fresh meal, or grab a quick taco at Beach Burrito Company. Enjoy!'
    },
    {
      id: 'mmd8',
      title: 'Bondi Fitness Focus',
      description: 'Train hard, eat well, and hit the waves.',
      request: {
        vibe: 'An intense and rewarding fitness day in Bondi. Start with a personal training session at the iconic outdoor gym, refuel with a healthy and protein-packed lunch, and then hit the waves for an afternoon surf session.',
        pace: 4,
        budget: 3,
        travelMode: 'walking',
      },
      mockItinerary: [
        { time: '07:00', name: 'Bondi Beach Outdoor Gym', notes: 'PT Session with a view.' },
        { time: '09:00', name: 'Acai Brothers', notes: 'Protein-packed acai bowl.' },
        { time: '14:00', name: 'Lets Go Surfing', notes: 'Afternoon surf lesson.' }
      ],
      curatedMessage: 'Your fitness day is locked in! Smash a PT session at the outdoor gym, refuel with a protein bowl from Acai Brothers, and then catch some waves with a surf lesson. Go get \'em!'
    },
  ],
  map: {
    pins: [
      { id: 1, name: "Bondi Icebergs", slug: "bondi-icebergs", type: "Vibes", description: "Iconic ocean views and fine dining.", x: "80%", y: "85%", latitude: -33.8953, longitude: 151.274, openingHours: "6am - 6:30pm", vibeTags: ["Iconic", "Views", "Swim"], currentVibe: "Buzzing" },
      { id: 2, name: "Hotel Ravesis", slug: "hotel-ravesis", type: "Nightlife", description: "Stylish beachfront bar and restaurant.", x: "48%", y: "45%", latitude: -33.8913, longitude: 151.276, openingHours: "12pm - 12am", vibeTags: ["Stylish", "Rooftop", "Cocktails"], currentVibe: "Packed" },
      { id: 3, name: "The Depot", slug: "the-depot", type: "Brunch", description: "Popular spot for brunch and coffee.", x: "15%", y: "75%", latitude: -33.8943, longitude: 151.270, openingHours: "7am - 3pm", vibeTags: ["Casual", "Local Fav", "Coffee"], currentVibe: "Chill" },
      { id: 5, name: "Raw Bar", slug: "raw-bar", type: "Sushi", description: "Authentic Japanese sushi and sashimi.", x: "25%", y: "55%", latitude: -33.8895, longitude: 151.274, openingHours: "12pm - 10pm", vibeTags: ["Authentic", "Sushi", "Fresh"], currentVibe: "Buzzing" },
      { id: 6, name: "Speedo's Cafe", slug: "speedos-cafe", type: "Brunch", description: "Insta-famous colorful brunch dishes.", x: "55%", y: "30%", latitude: -33.8888, longitude: 151.277, openingHours: "7am - 4pm", vibeTags: ["Instagrammable", "Healthy", "Brunch"], currentVibe: "Packed" },
      { id: 7, name: "Totti's", slug: "tottis", type: "Restaurants", description: "Vibrant Italian restaurant with a leafy courtyard.", x: "10%", y: "85%", latitude: -33.895, longitude: 151.268, openingHours: "12pm - 11pm", vibeTags: ["Italian", "Courtyard", "Group Friendly"], currentVibe: "Packed" },
      { id: 9, name: "The Corner House", slug: "the-corner-house", type: "Cocktails", description: "Cozy bar with a great cocktail list.", x: "35%", y: "50%", latitude: -33.892, longitude: 151.271, openingHours: "4pm - 12am", vibeTags: ["Cozy", "Cocktails", "Local"], currentVibe: "Buzzing" },
      { id: 10, name: "Harry's Bondi", slug: "harrys-bondi", type: "Brunch", description: "Classic brunch fare with a modern twist.", x: "65%", y: "45%", latitude: -33.889, longitude: 151.276, openingHours: "7am - 3pm", vibeTags: ["Brunch", "Modern", "Coffee"], currentVibe: "Buzzing" },
      { id: 11, name: "Lulu", slug: "lulu", type: "Restaurants", description: "Modern Pan-Asian cuisine in a chic setting.", x: "20%", y: "70%", latitude: -33.8935, longitude: 151.27, openingHours: "5pm - 11pm", vibeTags: ["Pan-Asian", "Chic", "Dinner"], currentVibe: "Buzzing" },
      { id: 15, name: "Bills", slug: "bills", type: "Brunch", description: "Famous for ricotta hotcakes and scrambled eggs.", x: "15%", y: "80%", latitude: -33.891, longitude: 151.27, openingHours: "7:30am - 3pm", vibeTags: ["Iconic", "Brunch", "Hotcakes"], currentVibe: "Packed" },
      { id: 16, name: "Sean's", slug: "seans", type: "Restaurants", description: "Farm-to-table dining with ocean views.", x: "60%", y: "15%", latitude: -33.887, longitude: 151.278, openingHours: "6pm - 10pm", vibeTags: ["Farm-to-Table", "Fine Dining", "Views"], currentVibe: "Buzzing" },
      { id: 17, name: "La Piadina", slug: "la-piadina", type: "Restaurants", description: "Authentic Italian flatbread sandwiches.", x: "50%", y: "40%", latitude: -33.890, longitude: 151.273, openingHours: "11am - 9pm", vibeTags: ["Quick", "Italian", "Lunch"], currentVibe: "Chill" },
      { id: 18, name: "The Bucket List", slug: "the-bucket-list", type: "Nightlife", description: "Casual beachside bar with a lively atmosphere.", x: "75%", y: "30%", latitude: -33.890, longitude: 151.277, openingHours: "12pm - 12am", vibeTags: ["Beachy", "Casual", "Lively"], currentVibe: "Packed" },
      { id: 19, name: "Porch and Parlour", slug: "porch-and-parlour", type: "Brunch", description: "Bohemian-style cafe with healthy options.", x: "50%", y: "55%", latitude: -33.888, longitude: 151.276, openingHours: "6:30am - 3pm", vibeTags: ["Bohemian", "Healthy", "Coffee"], currentVibe: "Buzzing" },
      { id: 26, name: "Fluidform Pilates", slug: "fluidform-pilates", type: "Health & Fitness", description: "Boutique pilates studio.", x: "25%", y: "55%", latitude: -33.892, longitude: 151.272, openingHours: "6am - 7pm", vibeTags: ["Pilates", "Wellness", "Modern"], currentVibe: "Chill" },
      { id: 29, name: "Chiswick", slug: "chiswick", type: "Restaurants", description: "Elegant garden-to-plate dining experience.", x: "5%", y: "85%", latitude: -33.896, longitude: 151.266, openingHours: "12pm - 10pm", vibeTags: ["Seasonal", "Elegant", "Garden"], currentVibe: "Buzzing" },
      { id: 30, name: "North Bondi Fish", slug: "north-bondi-fish", type: "Restaurants", description: "Fresh seafood in a relaxed setting.", x: "55%", y: "40%", latitude: -33.887, longitude: 151.277, openingHours: "12pm - 10pm", vibeTags: ["Seafood", "Beachfront", "Relaxed"], currentVibe: "Buzzing" },
      { id: 31, name: "Lets Go Surfing", slug: "lets-go-surfing", type: "Surf", description: "Learn to surf with the best in Bondi.", x: "70%", y: "10%", latitude: -33.886, longitude: 151.277, openingHours: "7am - 5pm", vibeTags: ["Surfing", "Lessons", "Beginner Friendly"], currentVibe: "Buzzing" },
      { id: 33, name: "Tuchuzy", slug: "tuchuzy", type: "Retail", description: "Iconic Bondi boutique with curated designer collections.", x: "20%", y: "65%", latitude: -33.893, longitude: 151.271, openingHours: "10am - 6pm", vibeTags: ["Designer", "Boutique", "Fashion"], currentVibe: "Chill" },
      { id: 34, name: "Venroy", slug: "venroy", type: "Retail", description: "Leisurewear for a global nomadic life. Born in Bondi.", x: "30%", y: "60%", latitude: -33.892, longitude: 151.273, openingHours: "10am - 6pm", vibeTags: ["Leisurewear", "Local", "Minimalist"], currentVibe: "Chill" },
      { id: 35, name: "Aquabumps", slug: "aquabumps", type: "Retail", description: "Gallery showcasing incredible surf and ocean photography.", x: "5%", y: "75%", latitude: -33.894, longitude: 151.268, openingHours: "10am - 5pm", vibeTags: ["Art", "Photography", "Ocean"], currentVibe: "Chill" },
      { id: 36, name: "Bondi Markets", slug: "bondi-markets", type: "Retail", description: "Sunday markets for unique finds from local designers.", x: "70%", y: "10%", latitude: -33.890, longitude: 151.275, openingHours: "10am - 4pm (Sun)", vibeTags: ["Market", "Local", "Unique"], currentVibe: "Buzzing" },
      { id: 37, name: "Bondi to Bronte Coastal Walk", slug: "bondi-to-bronte-coastal-walk", type: "Vibes", description: "One of the most scenic coastal walks in the world.", x: "85%", y: "95%", latitude: -33.903, longitude: 151.276, openingHours: "24/7", vibeTags: ["Walk", "Scenic", "Nature"], currentVibe: "Chill" },
      { id: 4, name: "Bondi Beach", slug: "bondi-beach", type: "Vibes", description: "World-famous beach with golden sands and surf.", x: "80%", y: "30%", latitude: -33.8917, longitude: 151.277, openingHours: "24/7", vibeTags: ["Beach", "Surf", "Sun"], currentVibe: "Buzzing" }
    ]
  }
};
    
