import { Sparkles, Coffee, Utensils, Beer, Dumbbell, Sun, Calendar, Zap, Waves, Shirt, Gift, UserPlus, Star } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

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
    venueId?: string;
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
  postType: "monetisable" | "discovery";
  likes: number;
  commentsCount: number;
  createdAt: string;
  creator: {
    id: string;
    name: string;
    avatar: string;
  }
}

export interface ItineraryOption {
  id: string;
  title: string;
  description: string;
  request: any;
  mockItinerary: any[];
  curatedMessage: string;
}

export interface AppData {
  feedItems: FeedItem[];
  sliceOfLifePosts: SliceOfLifePost[];
  reelsData: Reel[];
  quests: unknown[];
  rewards: unknown[];
  socialActivities: SocialActivity[];
  styleItems: unknown[];
  creators: {
    id: string;
    name: string;
    bio: string;
    avatar: string;
    x: string;
    y: string;
    activity: { name: string; uv: number }[];
  }[];
  categories: Record<string, CategoryMeta>;
  communities: Community[];
  mockMessages: MockMessage[];
  surprises: unknown[];
  mapMyDayOptions: ItineraryOption[];
  map: {
    pins: {
      id: number;
      name: string;
      slug: string;
      type: string;
      description: string;
      x: string;
      y: string;
      latitude: number;
      longitude: number;
      openingHours: string;
      vibeTags: string[];
      currentVibe: string;
    }[];
  };
  groupEventsOptions: ItineraryOption[];
}
export type CategoryMeta = {
  icon: LucideIcon;
  color: string;
  textColor: string;
};
export type MockMessage = {
  id: number;
  author: string;
  avatar: string;
  text: string;
};
export type PhotoFeedItem = {
  id: string;
  type: 'photo';
  createdAt: string;
  imageId: string;
  description: string;
  venue?: string;
  creator: {
    id: string;
    name: string;
    avatar: string;
  };
  likes: number;
  comments: number;
  commentData: { author: string; text: string }[];
};

export type StoryFeedItem = SliceOfLifePost & {
  type: 'story';
};

export type FeedItem = PhotoFeedItem | StoryFeedItem;

export interface Reel {
  id: string;
  imageId: string;
  description: string;
  videoUrl?: string;
  likes: number;
  comments: number;
  commentData?: { author: string; text: string }[];
  creator: {
    id: string;
    name: string;
    avatar: string;
  };
}

// Raw data for different content types
const rawPhotoPosts: Omit<PhotoFeedItem, 'type'>[] = [
  {
      id: "7",
      creator: { id: "emma", name: "emma", avatar: "https://github.com/emma.png" },
      description: "Finding my balance and flow at this beautiful studio. The perfect space to reset mind and body. 🧘‍♀️ #pilates #bondiwellness #iykykactive",
      imageId: "pilates-1",
      likes: 834,
      comments: 72,
      commentData: [],
      createdAt: "2024-07-26T14:00:00Z"
  },
  {
      id: "6",
      creator: { id: "alice", name: "alice", avatar: "https://github.com/alice.png" },
      description: "Obsessed with the new collection at Tuchuzy. The perfect spot for finding designer gems. ✨ #iykykstyle #bondifashion",
      imageId: "style-1",
      likes: 621,
      comments: 68,
      commentData: [],
      createdAt: "2024-07-22T12:00:00Z"
  },
  {
      id: "1",
      creator: { id: "jay", name: "jay", avatar: "https://github.com/jay.png" },
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
      id: "2",
      creator: { id: "alice", name: "alice", avatar: "https://github.com/alice.png" },
      description: "Sunset vibes and perfect cocktails. My kind of Tuesday.",
      imageId: "community-sushi",
      likes: 482,
      comments: 51,
      commentData: [],
      createdAt: "2024-07-21T18:00:00Z"
  },
];

const rawReelPosts: Reel[] = [
    {
      id: "1",
      creator: { id: "jay", name: "jay", avatar: "https://github.com/jay.png" },
      description: "Can't get enough of this place #sushi #bondi",
      imageId: "sushi-1",
      videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
      likes: 12500,
      comments: 789,
      commentData: [
        { author: "alice", text: "I need to go back!" },
        { author: "lucas", text: "So good!" },
      ]
    },
    {
        id: "2",
        creator: { id: "alice", name: "alice", avatar: "https://github.com/alice.png" },
        description: "Perfect cocktails for a perfect night",
        imageId: "community-sushi",
        videoUrl: "https://test-videos.co.uk/vids/elephantsdream/mp4/h264/720/Elephants_Dream_720_10s_1MB.mp4",
        likes: 8300,
        comments: 452,
        commentData: []
    },
    {
      id: "3",
      creator: { id: "emma", name: "emma", avatar: "https://github.com/emma.png" },
      description: "Finding my balance at Balance Moves Pilates & Barre Studio. Such an amazing space! #pilates #bondiwellness",
      imageId: "pilates-1",
      videoUrl: "https://cdn.pixelbin.io/v2/throbbing-poetry-5e04c5/original/pexels-gloria-g-2127732-3840x2160-30fps.mp4",
      likes: 9800,
      comments: 620,
      commentData: []
  },
];

const rawSliceOfLifePosts: Omit<SliceOfLifePost, 'creator' | 'postType'>[] = [
    {
      id: "sol-1",
      creatorId: "shannon",
      title: "My first week in Bondi",
      description: "Just landed from Ireland and I'm already in love with this place. The sunrise swims are something else. It feels like a new beginning, you know? A bit scary, but mostly exciting. Here's to making it work.",
      videoUrl: "https://cdn.pixelbin.io/v2/throbbing-poetry-5e04c5/original/pexels_videos_2759484__2160p_.mp4",
      thumbnailUrl: "https://images.pexels.com/videos/2759484/pexels-photo-2759484.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      duration: 45,
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
      likes: 4100,
      commentsCount: 312,
      createdAt: "2024-07-23T18:00:00Z",
      venueId: "raw-bar",
      relatedDealId: "hot-4",
      sourcePlatform: "instagram"
    },
    {
      id: "sol-5",
      creatorId: "shannon",
      title: "Golden Hour at Promenade",
      description: "There's nothing like watching the sky turn orange over Bondi from the Promenade. The perfect end to any day. It's my little moment of therapy.",
      videoUrl: "https://cdn.pixelbin.io/v2/throbbing-poetry-5e04c5/original/pexels-taryn-elliott-7876874__2160p_.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1571762283944-580798150a58?q=80&w=1000&auto=format&fit=crop",
      duration: 28,
      likes: 2800,
      commentsCount: 150,
      createdAt: "2024-07-24T17:30:00Z",
      venueId: "the-bucket-list",
      relatedDealId: null,
      sourcePlatform: "tiktok"
    },
    {
      id: "sol-6",
      creatorId: "lucas",
      title: "Morning Buzz at Glory Days",
      description: "The coffee here just hits different. The perfect start before a busy day. If you're looking for that classic Bondi cafe vibe, this is it.",
      videoUrl: "https://cdn.pixelbin.io/v2/throbbing-poetry-5e04c5/original/pexels-gloria-g-2127732-3840x2160-30fps.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000&auto=format&fit=crop",
      duration: 18,
      likes: 1900,
      commentsCount: 110,
      createdAt: "2024-07-24T09:00:00Z",
      venueId: "the-bucket-list",
      relatedDealId: null,
      sourcePlatform: "instagram"
    },
    {
      id: "sol-7",
      creatorId: "emma",
      title: "Fueling up at Upbeat",
      description: "Found my new favorite lunch spot! Upbeat Bondi has the most incredible, healthy bowls that taste as good as they look. The perfect post-workout fuel to keep you going. So fresh and delicious!",
      videoUrl: "https://cdn.pixelbin.io/v2/throbbing-poetry-5e04c5/original/pexels-gloria-g-2127732-3840x2160-30fps.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop",
      duration: 19,
      likes: 1500,
      commentsCount: 75,
      createdAt: "2024-07-26T13:00:00Z",
      venueId: "upbeat-bondi",
      relatedDealId: null,
      sourcePlatform: "instagram"
    },
    {
      id: "sol-8",
      creatorId: "alice",
      title: "Salty's is the Vibe",
      description: "Finally checked out Salty's and it did not disappoint. The energy is electric, the music is on point, and the beachfront view is unbeatable. Perfect spot for a fun night out with the crew. 🤙",
      videoUrl: "https://cdn.pixelbin.io/v2/throbbing-poetry-5e04c5/original/pexels-kampus-production-8569201__2160p_.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format&fit=crop",
      duration: 35,
      likes: 2900,
      commentsCount: 180,
      createdAt: "2024-07-25T21:00:00Z",
      venueId: "saltys-bondi-beach",
      relatedDealId: null,
      sourcePlatform: "tiktok"
    },
    {
      id: "sol-9",
      creatorId: "emma",
      title: "My Daily Ritual at Kissed Earth",
      description: "Starting my day with a nourishing smoothie from Kissed Earth. It's more than just a cafe, it's a whole wellness vibe. The perfect community-focused space to reset.",
      videoUrl: "https://cdn.pixelbin.io/v2/throbbing-poetry-5e04c5/original/pexels-gloria-g-2127732-3840x2160-30fps.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?q=80&w=2070&auto=format&fit=crop",
      duration: 22,
      likes: 1800,
      commentsCount: 95,
      createdAt: "2024-07-25T09:00:00Z",
      venueId: "kissed-earth",
      relatedDealId: null,
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
      id: 'emma',
      name: 'Emma',
      bio: 'Wellness advocate and smoothie enthusiast. Finding the beauty in balance here in Bondi.',
      avatar: 'https://github.com/emma.png',
      x: '55%',
      y: '65%',
      activity: [{ name: 'Mon', uv: 310 }, { name: 'Tue', uv: 340 }, { name: 'Wed', uv: 380 }, { name: 'Thu', uv: 410 }, { name: 'Fri', uv: 450 }, { name: 'Sat', uv: 500 }, { name: 'Sun', uv: 470 }]
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

const enrichedSliceOfLifePosts = rawSliceOfLifePosts
  .map(post => {
    const creator = creators.find(c => c.id === post.creatorId);
    if (!creator) {
      console.warn(`Creator with id '${post.creatorId}' not found for Slice of Life post '${post.id}'. Skipping post.`);
      return null;
    }

    // Add postType based on the presence of a related deal ID
    const postType = post.relatedDealId ? 'monetisable' : 'discovery';
    
    return { ...post, creator, postType };
  })
  .filter((post): post is SliceOfLifePost => post !== null); // Type guard to filter out nulls and satisfy TypeScript

const unifiedFeedItems: FeedItem[] = [
  ...rawPhotoPosts.map(p => ({ ...p, type: 'photo' as const })),
  ...enrichedSliceOfLifePosts.map(p => ({ ...p, type: 'story' as const })),
].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());


export const appData: AppData = {
  feedItems: unifiedFeedItems,
  sliceOfLifePosts: enrichedSliceOfLifePosts,
  reelsData: rawReelPosts,
  quests: [
    { id: 'quest-photo', venueId: 'bondi-beach', title: 'Bondi Photo Quest', venue: 'Bondi Beach' },
    { id: 'quest-foodie', venueId: 'tottis', title: 'Foodie Challenge', venue: 'Totti\'s' },
  ],
  rewards: [
      { id: 'reward-coffee', venueId: 'the-depot', title: 'Free Coffee Reward', venue: 'The Depot' },
      { id: 'reward-merch', venueId: 'hotel-ravesis', title: 'Exclusive Merch', venue: 'Hotel Ravesis' },
  ],
  socialActivities: [
    {
        id: 'social-1',
        title: 'Sunrise Yoga Sesh',
        description: 'Starting the day with good vibes and a great stretch. All levels welcome, just bring a mat and some water!',
        time: '7:00 AM',
        location: 'Grassy Knoll, North Bondi',
        venueId: 'bondi-beach',
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
        venueId: 'bondi-beach',
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
        venueId: 'the-depot',
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
        venueId: 'raw-bar',
        creator: { id: 'alice', name: 'Alice', avatar: 'https://github.com/alice.png' },
        participants: 1,
        maxParticipants: 2,
        category: 'Sushi',
        participantAvatars: [],
    },
  ] as SocialActivity[],
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
        { time: '17:00', name: 'Bondi to Bronte Coastal Walk', venueId: 'bondi-to-bronte-coastal-walk', notes: 'Golden hour walk.' },
        { time: '18:00', name: 'Hotel Ravesis', venueId: 'hotel-ravesis', notes: 'Enjoy a 2-for-1 Patrón Margarita deal.' },
        { time: '19:30', name: 'La Piadina', venueId: 'la-piadina', notes: 'Casual and delicious Italian street food.' }
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
        { time: '18:30', name: 'The Corner House', venueId: 'the-corner-house', notes: 'Booked in for a cheeky cocktail.' },
        { time: '19:30', name: 'Totti\'s', venueId: 'tottis', notes: 'Reservation for dinner and some delicious Italian food.' },
        { time: '21:00', name: 'Bondi Icebergs', venueId: 'bondi-icebergs', notes: 'Finish the night with some wicked cocktails.' }
      ],
      curatedMessage: 'All good, you\'re booked in for a cheeky cocktail at The Corner House, then jump over to Totti\'s for some delicious Italian food. Finish the night at Icebergs with some wicked cocktails. You\'ve Got This!'
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
        { time: '18:30', name: 'Lulu', venueId: 'lulu', notes: 'Trivia & tapas at the local.' },
        { time: '20:00', name: 'Hotel Ravesis', venueId: 'hotel-ravesis', notes: 'Rooftop cocktails - mingle hour.' },
        { time: '22:00', name: 'The Bucket List', venueId: 'the-bucket-list', notes: 'Dancing & good energy!' }
      ],
      curatedMessage: 'Get ready to mingle! You\'re all set for trivia and tapas at Lulu, then hit the rooftop at Ravesis for cocktails. Finish the night dancing at The Bucket List. Have fun!'
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
        { time: '08:00', name: 'Fluidform Pilates', venueId: 'fluidform-pilates', notes: 'Sunrise yoga at the Pavilion.' },
        { time: '09:30', name: 'Harry\'s Bondi', venueId: 'harrys-bondi', notes: 'Acai bowl & green juice.' },
        { time: '11:00', name: 'Bondi Icebergs', venueId: 'bondi-icebergs', notes: 'Cold plunge & reset.' }
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
        { time: '18:00', name: 'Totti\'s', venueId: 'tottis', notes: 'Reservation for an amazing meal.' },
        { time: '19:30', name: 'Hotel Ravesis', venueId: 'hotel-ravesis', notes: 'Rooftop drinks with an ocean view.' },
        { time: '21:00', name: 'Bondi Icebergs', venueId: 'bondi-icebergs', notes: 'Sunset walk and cocktails at the pool.' }
      ],
      curatedMessage: 'All good, you\'re booked in for a cheeky cocktail at The Corner House, then jump over to Totti\'s for some delicious Italian food. Finish the night at Icebergs with some wicked cocktails. You\'ve Got This!'
    },
    {
      id: 'mmd5',
      title: 'Girls\' Night Out - Bondi',
      description: 'Margaritas & shared tapas',
       request: {
        vibe: 'A fun and energetic girls\' night out. We want to start with margaritas and shared tapas, move to a stylish rooftop bar for cocktails, and end the night dancing at a place with great energy and music.',
        pace: 4,
        budget: 3,
        travelMode: 'uber',
      },
      mockItinerary: [
        { time: '18:00', name: 'Lulu', venueId: 'lulu', notes: 'Margaritas and shared tapas.' },
        { time: '20:00', name: 'Hotel Ravesis', venueId: 'hotel-ravesis', notes: 'Skyline cocktails on the rooftop.' },
        { time: '22:00', name: 'The Bucket List', venueId: 'the-bucket-list', notes: 'Dancing & good energy.' }
      ],
      curatedMessage: 'Your girls\' night out is all set! Start with margaritas at Lulu, then hit the rooftop at Ravesis for cocktails. Finish the night dancing at The Bucket List. Have a blast!'
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
        { time: '12:00', name: 'Bills', venueId: 'bills', notes: 'Ricotta hotcakes & spritz.' },
        { time: '13:30', name: 'Tuchuzy', venueId: 'tuchuzy', notes: 'Window shopping & try-ons.' },
        { time: '15:00', name: 'Sean\'s', venueId: 'seans', notes: 'Champagne & oysters.' }
      ],
      curatedMessage: 'Lunch plans are sorted! You\'re all set for ricotta hotcakes and spritz at Bills, then head over to Tuchuzy for a window shop. Finish your afternoon with champagne and oysters at Sean\'s. Enjoy!'
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
        { time: '13:30', name: 'Raw Bar', venueId: 'raw-bar', notes: 'Healthy and fresh lunch.' },
        { time: '14:30', name: 'La Piadina', venueId: 'la-piadina', notes: 'A quick Italian sandwich.' }
      ],
      curatedMessage: 'Your quick lunch is sorted! Head to Raw Bar for a fresh meal, or grab a quick sandwich at La Piadina. Enjoy!'
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
        { time: '07:00', name: 'Bondi Beach', venueId: 'bondi-beach', notes: 'PT Session at the outdoor gym.' },
        { time: '09:00', name: 'Porch and Parlour', venueId: 'porch-and-parlour', notes: 'Protein-packed breakfast bowl.' },
        { time: '14:00', name: 'Lets Go Surfing', venueId: 'lets-go-surfing', notes: 'Afternoon surf lesson.' }
      ],
      curatedMessage: 'Your fitness day is locked in! Smash a PT session at the outdoor gym, refuel with a protein bowl from Porch and Parlour, and then catch some waves with a surf lesson. Go get \'em!'
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
  },
  groupEventsOptions: [
    {
        id: 'ge1',
        title: 'Work Christmas Party',
        description: 'Plan a memorable end-of-year celebration for your team.',
        request: {
            vibe: 'A sophisticated yet fun Christmas party for a corporate team. Good food, great drinks, and a lively atmosphere are a must.',
            pace: 3,
            budget: 4,
            travelMode: 'uber',
        },
        mockItinerary: [
            { time: '18:00', name: 'Chiswick', venueId: 'chiswick', notes: 'Welcome drinks and canapés in the garden.' },
            { time: '19:30', name: 'North Bondi Fish', venueId: 'north-bondi-fish', notes: 'Main course with a seafood focus and ocean views.' },
            { time: '21:30', name: 'The Corner House', venueId: 'the-corner-house', notes: 'After-dinner cocktails to continue the celebration.' }
        ],
        curatedMessage: 'Your work Christmas party is set to be a hit! Start with garden drinks at Chiswick, enjoy a seafood feast at North Bondi Fish, and finish with cocktails at The Corner House. Cheers!'
    },
    {
        id: 'ge2',
        title: 'Hens Night',
        description: 'Create an unforgettable night for the bride-to-be.',
        request: {
            vibe: 'A glamorous and fun Hens night. Start with a stylish dinner, move to a chic bar for cocktails, and end with dancing.',
            pace: 4,
            budget: 4,
            travelMode: 'uber',
        },
        mockItinerary: [
            { time: '19:00', name: 'Sean\'s', venueId: 'seans', notes: 'Elegant dinner to start the night.' },
            { time: '21:00', name: 'Hotel Ravesis', venueId: 'hotel-ravesis', notes: 'Rooftop cocktails and sunset views.' },
            { time: '23:00', name: 'The Bucket List', venueId: 'the-bucket-list', notes: 'Beachside dancing until late.' }
        ],
        curatedMessage: 'The perfect Hens night awaits! Enjoy an elegant dinner at Sean\'s, followed by rooftop cocktails at Hotel Ravesis, and dance the night away at The Bucket List. It\'s going to be a night to remember!'
    }
  ]
};