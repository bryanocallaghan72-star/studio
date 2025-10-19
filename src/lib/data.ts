
import { Sparkles, Coffee, Utensils, Beer, Dumbbell, Sun, Calendar, Zap, Waves, Shirt, Gift } from 'lucide-react';

export type Community = {
  id: string;
  name: string;
  description: string;
  category: keyof typeof appData.categories;
  members: number;
  channels: string[];
};

export const appData = {
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
        id: 'deal-aperol',
        title: "2-for-1 Aperol Spritz",
        venue: "Hotel Ravesis",
        description: "Enjoy two Aperol Spritz cocktails for the price of one. The perfect sunset drink!",
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
        venue: "LULU",
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
  reelsData: [
    {
      id: 1,
      creator: {
        name: "jay",
        avatar: "https://github.com/jay.png",
      },
      description: "Can't get enough of this place #sushi #bondi",
      imageId: "sushi-1",
      videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
      likes: 12500,
      comments: 789,
      commentData: []
    },
    {
        id: 2,
        creator: {
            name: "alice",
            avatar: "https://github.com/alice.png",
        },
        description: "Perfect cocktails for a perfect night",
        imageId: "community-sushi",
        videoUrl: "https://test-videos.co.uk/vids/elephantsdream/mp4/h264/720/Elephants_Dream_720_10s_1MB.mp4",
        likes: 8300,
        comments: 452,
        commentData: []
    },
    {
      id: 3,
      creator: {
        name: "SunsetChaser",
        avatar: "https://github.com/sunset.png",
      },
      description: "Bondi, you have my heart ❤️",
      imageId: "morning-1",
      videoUrl: "https://test-videos.co.uk/vids/sintel/mp4/h264/720/Sintel_720_10s_1MB.mp4",
      likes: 15200,
      comments: 876,
      commentData: []
    },
    {
      id: 4,
      creator: {
          name: "SunsetChaser",
          avatar: "https://github.com/sunset.png",
      },
      description: "Summertime heats with deep house beats",
      imageId: "bondi-sunset",
      videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
      likes: 21300,
      comments: 952,
      commentData: []
    },
    {
        id: 5,
        creator: {
            name: "shannon",
            avatar: "https://github.com/shannon.png",
        },
        description: "Breakfast of champions!",
        imageId: "ricotta-hotcakes",
        videoUrl: "https://test-videos.co.uk/vids/elephantsdream/mp4/h264/70/Elephants_Dream_720_10s_1MB.mp4",
        likes: 9800,
        comments: 633,
        commentData: []
    }
  ],
  feedItems: [
    {
      id: 6,
      type: "photo",
      creator: { id: "alice", name: "alice", avatar: "https://github.com/alice.png" },
      venue: "Tuchuzy",
      description: "Obsessed with the new collection at Tuchuzy. The perfect spot for finding designer gems. ✨ #iykykstyle #bondifashion",
      imageId: "style-1",
      likes: 621,
      comments: 68,
      commentData: []
    },
    {
      id: 7,
      type: "photo",
      creator: { id: "lucas", name: "lucas", avatar: "https://github.com/lucas.png" },
      venue: "Venroy",
      description: "Living in this new set from Venroy. The ultimate in Bondi leisurewear. 🌊 #venroy #bondi #localbrand",
      imageId: "style-2",
      likes: 734,
      comments: 72,
      commentData: []
    },
    {
      id: 8,
      type: "photo",
      creator: { id: "shannon", name: "shannon", avatar: "https://github.com/shannon.png" },
      venue: "Aquabumps",
      description: "Getting lost in the waves at the Aquabumps gallery. Eugene's work is just breathtaking. 📷 #art #wavephotography",
      imageId: "waves-1",
      likes: 412,
      comments: 45,
      commentData: []
    },
    {
      id: 9,
      type: "photo",
      creator: { id: "jay", name: "jay", avatar: "https://github.com/jay.png" },
      venue: "Bondi Markets",
      description: "Sunday well spent digging for treasure at Bondi Markets. Scored some amazing vintage finds! #bondimarkets #supportlocal",
      imageId: "markets-1",
      likes: 550,
      comments: 59,
      commentData: []
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
      ]
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
      commentData: []
    },
    {
      id: 3,
      type: "photo",
      creator: { id: "shannon", name: "shannon", avatar: "https://github.com/shannon.png" },
      venue: "The Depot",
      description: "Found the best cure for a rainy day in Bondi... coffee and lots of it!",
      imageId: "coffee-1",
      likes: 198,
      comments: 22,
      commentData: []
    },
    {
      id: 4,
      type: "photo",
      creator: { id: "lucas", name: "lucas", avatar: "https://github.com/lucas.png" },
      venue: "Bondi Beach",
      description: "Another beautiful start to the day! 🧘‍♀️",
      imageId: "morning-1",
      likes: 501,
      comments: 67,
      commentData: []
    },
    {
      id: 5,
      type: "photo",
      creator: { id: "foodiegal", name: "foodiegal", avatar: "https://github.com/foodie.png" },
      venue: "Bondi Beach",
      description: "wow sunset Yoga",
      imageId: "sunset-yoga",
      likes: 1204,
      comments: 132,
      commentData: []
    }
  ],
  creators: [
    {
      id: 'shannon',
      name: 'Shannon',
      bio: 'Just an Irish girl who\'s new to Bondi. Show me the best spots for a pint and a good chat!',
      avatar: 'https://github.com/shannon.png',
      x: '30%',
      y: '40%',
    },
    {
      id: 'alice',
      name: 'Alice',
      bio: 'French DJ spinning tunes across Bondi. Find me where the beat drops and the cocktails flow.',
      avatar: 'https://github.com/alice.png',
      x: '70%',
      y: '60%',
    },
    {
      id: 'lucas',
      name: 'Lucas',
      bio: 'Upcoming DJ and barman from a hospo family. I know the best-kept secrets of Bondi\'s nightlife.',
      avatar: 'https://github.com/lucas.png',
      x: '80%',
      y: '20%',
    },
    {
      id: 'jay',
      name: 'Jay',
      bio: 'Korean foodie on a mission to find the most authentic and delicious eats in town.',
      avatar: 'https://github.com/jay.png',
      x: '45%',
      y: '75%',
    },
    {
      id: 'kevin',
      name: 'Kevin',
      bio: 'I just really, really love bananas. And anything made with them. Send me your best banana bread recipes.',
      avatar: 'https://github.com/kevin.png',
      x: '15%',
      y: '60%',
    },
    {
      id: 'bondicreator',
      name: 'bondicreator',
      bio: 'I make content about Bondi.',
      avatar: 'https://github.com/shadcn.png',
       x: '50%',
      y: '50%',
    },
    {
      id: 'foodiegal',
      name: 'foodiegal',
      bio: 'I love food!',
      avatar: 'https://github.com/foodie.png',
      x: '25%',
      y: '25%',
    }
  ],
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
      id: 'mmd-aperol',
      title: 'The Aperol Spritz Sunset',
      description: 'Sponsored by Aperol',
      request: {
        vibe: 'Aperol Spritz Sunset Vibe: Start with a scenic walk, then find the perfect spot to enjoy a refreshing Aperol Spritz as the sun goes down. End with a casual dinner.',
        pace: 2,
        budget: 3,
        travelMode: 'walking',
      },
      mockItinerary: [
        { time: '17:00', name: 'Bondi to Bronte Coastal Walk', notes: 'Golden hour walk.' },
        { time: '18:00', name: 'Hotel Ravesis', notes: 'Enjoy a 2-for-1 Aperol Spritz deal.' },
        { time: '19:30', name: 'La Piadina', notes: 'Casual and delicious Italian street food.' }
      ],
      curatedMessage: 'Your Aperol Spritz Sunset is ready! Take a golden hour stroll along the coast, then head to Hotel Ravesis for your 2-for-1 Aperol Spritz. Finish with some amazing Italian food at La Piadina. Enjoy the sunset!'
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
        { time: '20:00', name: 'Ravesis', notes: 'Rooftop cocktails - mingle hour.' },
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
        { time: '19:30', name: 'Ravesis', notes: 'Rooftop drinks with an ocean view.' },
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
        { time: '20:00', name: 'Ravesis', notes: 'Skyline cocktails on the rooftop.' },
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
  groupEventsOptions: [
    {
      id: 'ge1',
      title: 'Birthday Brunch',
      description: 'A boozy brunch for big groups. ~20 pax',
      request: {
        vibe: 'A boozy birthday brunch for a large group of about 20 people. Start with a great brunch spot, then an activity like a cocktail masterclass, and end with celebratory rooftop drinks.',
        pace: 3,
        budget: 4,
        travelMode: 'walking',
      },
      mockItinerary: [
        { time: '11:00', name: 'Harry\'s Bondi', notes: 'Ricotta hotcakes for everyone.' },
        { time: '13:00', name: 'The Rum Diary Bar', notes: 'Cocktail masterclass for the crew.' },
        { time: '15:00', name: 'Ravesis', notes: 'Rooftop drinks to finish the day.' }
      ],
      curatedMessage: 'Your birthday brunch is set! Start with hotcakes at Harry\'s, then a cocktail masterclass at The Rum Diary Bar, and finish with rooftop drinks at Ravesis. Happy birthday!'
    },
    {
      id: 'ge2',
      title: 'Staff Party',
      description: 'Team building and celebrations. ~30 pax, $2500 budget.',
      request: {
        vibe: 'A staff party for about 30 people with a budget of around $2500. We need a nice dinner to start, followed by a place with live music and a great atmosphere, and a final spot for a nightcap.',
        pace: 3,
        budget: 5,
        travelMode: 'uber',
      },
      mockItinerary: [
        { time: '18:00', name: 'Chiswick', notes: 'Dinner reservation for the whole team.' },
        { time: '20:30', name: 'Bondi Vibes Bar', notes: 'Live music and great vibes.' },
        { time: '22:00', name: 'The Bucket List', notes: 'Nightcap on the beach.' }
      ],
      curatedMessage: 'Your staff party is on! Start with an elegant dinner at Chiswick, then head to Bondi Vibes Bar for some live music, and finish the night with a nightcap at The Bucket List. Time to celebrate!'
    },
    {
      id: 'ge3',
      title: 'Baby Shower',
      description: 'Bites and mocktails by the beach.',
      request: {
        vibe: 'A classy and relaxed baby shower by the beach. Looking for a place with light bites and nice mocktails, a spot for coffee and cake, and a picturesque location for photos.',
        pace: 1,
        budget: 3,
        travelMode: 'walking',
      },
      mockItinerary: [
        { time: '12:00', name: 'North Bondi Fish', notes: 'Light lunch with a stunning view.' },
        { time: '14:00', name: 'Speedo\'s Cafe', notes: 'Coffee and cake to celebrate.' },
        { time: '16:00', name: 'Bondi Icebergs', notes: 'Photo op by the pool.' }
      ],
      curatedMessage: 'Your baby shower is all set! Start with a light lunch at North Bondi Fish, then coffee and cake at Speedo\'s Cafe, and finish with a photo op at Bondi Icebergs. Congratulations!'
    },
  ],
  map: {
    pins: [
      { id: 1, name: "Bondi Icebergs", slug: "bondi-icebergs", type: "Vibes", description: "Iconic ocean views and fine dining.", x: "25%", y: "85%", openingHours: "6am - 6:30pm", vibeTags: ["Iconic", "Views", "Swim"], currentVibe: "Buzzing" },
      { id: 2, name: "Hotel Ravesis", slug: "hotel-ravesis", type: "Nightlife", description: "Stylish beachfront bar and restaurant.", x: "48%", y: "45%", openingHours: "12pm - 12am", vibeTags: ["Stylish", "Rooftop", "Cocktails"], currentVibe: "Packed" },
      { id: 3, name: "The Depot", slug: "the-depot", type: "Brunch", description: "Popular spot for brunch and coffee.", x: "56%", y: "75%", openingHours: "7am - 3pm", vibeTags: ["Casual", "Local Fav", "Coffee"], currentVibe: "Chill" },
      { id: 4, name: "Bondi Beach", slug: "bondi-beach", type: "Vibes", description: "World-famous beach with golden sands and surf.", x: "45%", y: "15%", openingHours: "24/7", vibeTags: ["Beach", "Surf", "Sun"], currentVibe: "Buzzing" },
      { id: 5, name: "Raw Bar", slug: "raw-bar", type: "Sushi", description: "Authentic Japanese sushi and sashimi.", x: "35%", y: "55%", openingHours: "12pm - 10pm", vibeTags: ["Authentic", "Sushi", "Fresh"], currentVibe: "Buzzing" },
      { id: 6, name: "Speedo's Cafe", slug: "speedos-cafe", type: "Brunch", description: "Insta-famous colorful brunch dishes.", x: "69%", y: "30%", openingHours: "7am - 4pm", vibeTags: ["Instagrammable", "Healthy", "Brunch"], currentVibe: "Packed" },
      { id: 7, name: "Totti's", slug: "tottis", type: "Restaurants", description: "Vibrant Italian restaurant with a leafy courtyard.", x: "74%", y: "85%", openingHours: "12pm - 11pm", vibeTags: ["Italian", "Courtyard", "Group Friendly"], currentVibe: "Packed" },
      { id: 8, name: "Bondi Trattoria", slug: "bondi-trattoria", type: "Restaurants", description: "Classic Italian dishes with a sea view.", x: "17%", y: "60%", openingHours: "5pm - 10pm", vibeTags: ["Classic", "Italian", "Sea View"], currentVibe: "Chill" },
      { id: 9, name: "The Corner House", slug: "the-corner-house", type: "Cocktails", description: "Cozy bar with a great cocktail list.", x: "65%", y: "50%", openingHours: "4pm - 12am", vibeTags: ["Cozy", "Cocktails", "Local"], currentVibe: "Buzzing" },
      { id: 10, name: "Harry's Bondi", slug: "harrys-bondi", type: "Brunch", description: "Classic brunch fare with a modern twist.", x: "13%", y: "45%", openingHours: "7am - 3pm", vibeTags: ["Brunch", "Modern", "Coffee"], currentVibe: "Buzzing" },
      { id: 11, name: "LULU", slug: "lulu-pan-asian", type: "Restaurants", description: "Modern Pan-Asian cuisine in a chic setting.", x: "43%", y: "70%", openingHours: "5pm - 11pm", vibeTags: ["Pan-Asian", "Chic", "Dinner"], currentVibe: "Buzzing" },
      { id: 12, name: "RND Izakaya", slug: "rnd-izakaya", type: "Sushi", description: "Japanese pub food and creative cocktails.", x: "9%", y: "75%", openingHours: "5pm - 12am", vibeTags: ["Izakaya", "Japanese", "Fun"], currentVibe: "Packed" },
      { id: 13, name: "Luca and Luca", slug: "luca-and-luca-gelato", type: "Brunch", description: "Artisanal gelato with unique flavors.", x: "61%", y: "25%", openingHours: "11am - 10pm", vibeTags: ["Gelato", "Dessert", "Sweet"], currentVibe: "Chill" },
      { id: 14, name: "Volume One", slug: "volume-one", type: "Cocktails", description: "Hidden gem for craft cocktails.", x: "48%", y: "90%", openingHours: "6pm - 1am", vibeTags: ["Hidden", "Craft", "Intimate"], currentVibe: "Chill" },
      { id: 15, "name": "Bills", "slug": "bills", "type": "Brunch", "description": "Famous for ricotta hotcakes and scrambled eggs.", "x": "40%", "y": "80%", openingHours: "7:30am - 3pm", vibeTags: ["Iconic", "Brunch", "Hotcakes"], currentVibe: "Packed" },
      { id: 16, "name": "Sean's", "slug": "seans", "type": "Restaurants", "description": "Farm-to-table dining with ocean views.", "x": "78%", "y": "15%", openingHours: "6pm - 10pm", vibeTags: ["Farm-to-Table", "Fine Dining", "Views"], currentVibe: "Buzzing" },
      { id: 17, "name": "La Piadina", "slug": "la-piadina", "type": "Restaurants", "description": "Authentic Italian flatbread sandwiches.", "x": "52%", "y": "40%", openingHours: "11am - 9pm", vibeTags: ["Quick", "Italian", "Lunch"], currentVibe: "Chill" },
      { id: 18, "name": "The Bucket List", "slug": "the-bucket-list", "type": "Nightlife", "description": "Casual beachside bar with a lively atmosphere.", "x": "30%", "y": "30%", openingHours: "12pm - 12am", vibeTags: ["Beachy", "Casual", "Lively"], currentVibe: "Packed" },
      { id: 19, "name": "Porch and Parlour", "slug": "porch-and-parlour", "type": "Brunch", "description": "Bohemian-style cafe with healthy options.", "x": "83%", "y": "55%", openingHours: "6:30am - 3pm", vibeTags: ["Bohemian", "Healthy", "Coffee"], currentVibe: "Buzzing" },
      { id: 20, "name": "Anatomy", "slug": "anatomy", "type": "Health & Fitness", "description": "Boutique fitness studio offering various classes.", "x": "4%", "y": "55%", openingHours: "6am - 8pm", vibeTags: ["Fitness", "Classes", "Modern"], currentVibe: "Chill" },
      { id: 21, "name": "Acai Brothers", "slug": "acai-brothers", "type": "Health & Fitness", "description": "Superfood bar specializing in acai bowls.", "x": "78%", "y": "65%", openingHours: "7am - 5pm", vibeTags: ["Acai", "Healthy", "Quick"], currentVibe: "Buzzing" },
      { id: 22, name: "The Rum Diary Bar", slug: "the-rum-diary-bar", type: "Cocktails", description: "Caribbean-themed bar with a wide rum selection.", x: "4%", y: "85%", openingHours: "5pm - 12am", vibeTags: ["Rum", "Themed", "Cozy"], currentVibe: "Chill" },
      { id: 23, name: "Lulu", slug: "lulu", type: "Restaurants", description: "Modern Pan-Asian cuisine in a chic setting.", x: "43%", y: "70%", openingHours: "5pm - 11pm", vibeTags: ["Pan-Asian", "Chic", "Dinner"], currentVibe: "Packed" },
      { id: 24, name: "Ravesis", slug: "ravesis", type: "Nightlife", description: "Stylish beachfront bar and restaurant.", x: "48%", y: "30%", openingHours: "12pm - 12am", vibeTags: ["Stylish", "Rooftop", "Cocktails"], currentVibe: "Packed" },
      { id: 25, name: "Bondi Vibes Bar", slug: "bondi-vibes-bar", type: "Nightlife", description: "Live music and good vibes.", x: "35%", y: "20%", openingHours: "7pm - 2am", vibeTags: ["Live Music", "Vibrant", "Dancing"], currentVibe: "Packed" },
      { id: 26, name: "Fluidform Pilates", slug: "fluidform-pilates", type: "Health & Fitness", description: "Boutique pilates studio.", x: "9%", y: "55%", openingHours: "6am - 7pm", vibeTags: ["Pilates", "Wellness", "Modern"], currentVibe: "Chill" },
      { id: 27, name: "Sushi-e", slug: "sushi-e", type: "Sushi", description: "High-end sushi experience.", x: "30%", "y": "65%", openingHours: "6pm - 11pm", vibeTags: ["Omakase", "Fine Dining", "Authentic"], currentVibe: "Buzzing" },
      { id: 28, name: "Beach Burrito Company", slug: "beach-burrito-company", type: "Restaurants", description: "Casual Mexican food and frozen margaritas.", x: "56%", y: "55%", openingHours: "12pm - 10pm", vibeTags: ["Mexican", "Casual", "Margaritas"], currentVibe: "Packed" },
      { id: 29, name: "Chiswick", slug: "chiswick", type: "Restaurants", description: "Collective dining with a seasonal menu.", x: "69%", y: "85%", openingHours: "12pm - 10pm", vibeTags: ["Seasonal", "Elegant", "Garden"], currentVibe: "Buzzing" },
      { id: 30, name: "North Bondi Fish", slug: "north-bondi-fish", type: "Restaurants", description: "Fresh seafood in a relaxed setting.", x: "78%", y: "40%", openingHours: "12pm - 10pm", vibeTags: ["Seafood", "Beachfront", "Relaxed"], currentVibe: "Buzzing" },
      { id: 31, name: "Lets Go Surfing", slug: "lets-go-surfing", type: "Surf", description: "Learn to surf with the best in Bondi.", x: "65%", y: "10%", openingHours: "7am - 5pm", vibeTags: ["Surfing", "Lessons", "Beginner Friendly"], currentVibe: "Buzzing" },
      { id: 32, name: "Bondi Beach Outdoor Gym", slug: "bondi-beach-outdoor-gym", type: "Health & Fitness", description: "Iconic outdoor gym on the beach.", x: "20%", y: "20%", openingHours: "24/7", vibeTags: ["Fitness", "Outdoor", "Gym"], currentVibe: "Buzzing" },
      { id: 33, name: "Tuchuzy", slug: "tuchuzy", type: "Retail", description: "Iconic Bondi boutique with curated designer collections.", x: "55%", y: "65%", openingHours: "10am - 6pm", vibeTags: ["Designer", "Boutique", "Fashion"], currentVibe: "Chill" },
      { id: 34, name: "Venroy", slug: "venroy", type: "Retail", description: "Leisurewear for a global nomadic life. Born in Bondi.", x: "62%", y: "60%", openingHours: "10am - 6pm", vibeTags: ["Leisurewear", "Local", "Minimalist"], currentVibe: "Chill" },
      { id: 35, name: "Aquabumps", slug: "aquabumps", type: "Retail", description: "Gallery showcasing incredible surf and ocean photography.", x: "68%", y: "75%", openingHours: "10am - 5pm", vibeTags: ["Art", "Photography", "Ocean"], currentVibe: "Chill" },
      { id: 36, name: "Bondi Markets", slug: "bondi-markets", type: "Retail", description: "Sunday markets for unique finds from local designers.", x: "25%", y: "10%", openingHours: "10am - 4pm (Sun)", vibeTags: ["Market", "Local", "Unique"], currentVibe: "Buzzing" },
      { id: 37, name: "Bondi to Bronte Coastal Walk", slug: "bondi-to-bronte-coastal-walk", type: "Vibes", description: "One of the most scenic coastal walks in the world.", x: "10%", y: "95%", openingHours: "24/7", vibeTags: ["Walk", "Scenic", "Nature"], currentVibe: "Chill" },
    ]
  }
};
    

    
    

    











    

    

    




    

    