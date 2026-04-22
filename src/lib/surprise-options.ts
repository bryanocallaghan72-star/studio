export type TimeBucket = 'morning' | 'day' | 'goldenHour' | 'night';
export type Vibe = 'active' | 'chill' | 'social';

export type SurpriseOption = {
  id: string;
  title: string;
  description: string;
  timeBuckets: TimeBucket[]; // when this idea makes sense
  vibe: Vibe; // active / chill / social
  locationHint?: string; // short hint like "North Bondi", "Promenade"
};

// 🎯 Core curated Bondi lifestyle options
export const surpriseOptions: SurpriseOption[] = [
  // =====================
  // ACTIVE VIBES
  // =====================
  {
    id: 'cliff-walk-to-bronte',
    title: 'Cliff Walk to Bronte',
    description:
      'Start at Bondi, follow the coastal path, and soak up the ocean views. Pace doesn’t matter, breathing does.',
    timeBuckets: ['morning', 'day', 'goldenHour'],
    vibe: 'active',
    locationHint: 'Bondi to Bronte Coastal Walk',
  },
  {
    id: 'north-bondi-dip',
    title: 'North Bondi Dip',
    description:
      'Quick swim at North Bondi. In, out, refreshed. No overthinking allowed.',
    timeBuckets: ['morning', 'day'],
    vibe: 'active',
    locationHint: 'North Bondi flags',
  },
  {
    id: 'soft-sand-burner',
    title: 'Soft Sand Burner',
    description:
      'Short burst: 60 seconds jog on soft sand, 30 seconds walk. Repeat twice, then call it a win.',
    timeBuckets: ['morning', 'day'],
    vibe: 'active',
    locationHint: 'Middle stretch of Bondi Beach',
  },
  {
    id: 'promenade-jog',
    title: 'The Bondi Promenade Jog',
    description:
      'Light jog along the promenade. No ego, no pace tracking, just movement.',
    timeBuckets: ['morning', 'day'],
    vibe: 'active',
    locationHint: 'Bondi promenade',
  },
  {
    id: 'hill-walk',
    title: 'Bondi Hill Walk',
    description:
      'Pick the nearest hill, walk up a bit faster than usual, then stroll back down and enjoy the view.',
    timeBuckets: ['day', 'goldenHour'],
    vibe: 'active',
    locationHint: 'Any nearby hill or incline',
  },
  {
    id: 'micro-yoga-flow',
    title: 'Micro Yoga Flow',
    description:
      'Find a patch of grass, do a mini flow: 5 breaths in down dog, 5 in child’s pose. Instant reset.',
    timeBuckets: ['morning', 'day', 'goldenHour'],
    vibe: 'active',
    locationHint: 'Grassy patch overlooking the ocean',
  },
  {
    id: 'stair-sprints-ben-buckler',
    title: 'Stair Sprints at Ben Buckler',
    description:
      'Find the steep stairs at the northern tip of Bondi leading down to the rocks. Short, sharp, and worth it.',
    timeBuckets: ['morning', 'day'],
    vibe: 'active',
    locationHint: 'Ben Buckler, North Bondi',
  },
  {
    id: 'outdoor-gym-north-bondi',
    title: 'North Bondi Outdoor Gym',
    description:
      'Pull-up bars and rings with a view. Train next to locals who actually live here.',
    timeBuckets: ['morning', 'day'],
    vibe: 'active',
    locationHint: 'North Bondi outdoor gym',
  },
  {
    id: 'rock-pool-resistance',
    title: 'Rock Pool Resistance Swim',
    description:
      'Walk past Icebergs to the natural rock pools and do some resistance swimming in the open water.',
    timeBuckets: ['morning', 'day'],
    vibe: 'active',
    locationHint: 'Rock pools past Icebergs',
  },
  {
    id: 'beach-volleyball-pickup',
    title: 'Beach Volleyball Pickup',
    description:
      'Nets are often set up at the southern end. Hang around a game long enough and you will get an invite.',
    timeBuckets: ['day', 'goldenHour'],
    vibe: 'active',
    locationHint: 'South Bondi beach',
  },
  {
    id: 'night-coastal-walk',
    title: 'Night Coastal Walk',
    description:
      'Do the Bondi to Bronte walk after dark. The path empties out and the sound of the ocean gets serious.',
    timeBuckets: ['night'],
    vibe: 'active',
    locationHint: 'Bondi to Bronte coastal path',
  },

  // =====================
  // CHILL VIBES
  // =====================
  {
    id: 'barefoot-sand-stroll',
    title: 'Barefoot Sand Stroll',
    description:
      'Shoes off. Walk the shoreline and let the cold water hit your ankles.',
    timeBuckets: ['morning', 'day', 'goldenHour'],
    vibe: 'chill',
    locationHint: 'Waterline along Bondi Beach',
  },
  {
    id: 'ocean-gaze',
    title: 'Ocean Gaze Reset',
    description:
      'Sit on the wall or steps and watch the waves for 5 minutes. That’s the whole assignment.',
    timeBuckets: ['morning', 'day', 'goldenHour', 'night'],
    vibe: 'chill',
    locationHint: 'Bondi wall or beach steps',
  },
  {
    id: 'people-watching',
    title: 'People-Watching Mode',
    description:
      'Find a bench and just watch Bondi move around you. No scrolling, just observing.',
    timeBuckets: ['day', 'goldenHour'],
    vibe: 'chill',
    locationHint: 'Any bench along the promenade',
  },
  {
    id: 'hand-in-sand',
    title: 'Hand in the Sand',
    description:
      'Press your hand slowly into the sand and feel every grain. Tiny grounding ritual.',
    timeBuckets: ['day', 'goldenHour'],
    vibe: 'chill',
    locationHint: 'Anywhere on the sand',
  },
  {
    id: 'one-song-walk',
    title: 'One Song Walk',
    description:
      'Put on one song and walk until it ends. Don’t touch your phone until the track is over.',
    timeBuckets: ['morning', 'day', 'goldenHour'],
    vibe: 'chill',
    locationHint: 'Promenade or footpath near the beach',
  },
  {
    id: 'night-sand-reset',
    title: 'Night Sand Reset',
    description:
      'Walk down to the sand, sit for a few minutes, and listen to the waves in the dark.',
    timeBuckets: ['night'],
    vibe: 'chill',
    locationHint: 'Middle of Bondi Beach',
  },
  {
    id: 'thomas-hogan-reserve',
    title: 'Thomas Hogan Reserve',
    description:
      'A hidden park on Hill Street — lush, green, and feels miles from the beach noise.',
    timeBuckets: ['day', 'goldenHour'],
    vibe: 'chill',
    locationHint: 'Hill Street, Bondi',
  },
  {
    id: 'flat-rock-sunset',
    title: 'Flat Rock at North Bondi',
    description:
      'Go past the wading pool to the rocks and find a flat one to lie on. Best free seat for sunset in Bondi.',
    timeBuckets: ['goldenHour'],
    vibe: 'chill',
    locationHint: 'North Bondi rocks',
  },
  {
    id: 'gertrude-and-alice',
    title: 'Get Lost at Gertrude & Alice',
    description:
      'Bondi\'s favourite bookstore-cafe. Floor-to-ceiling shelves and no one will rush you.',
    timeBuckets: ['morning', 'day'],
    vibe: 'chill',
    locationHint: 'Hall Street, Bondi',
  },
  {
    id: 'mackenzies-bay',
    title: 'Mackenzies Bay',
    description:
      'A disappearing beach between Bondi and Tamarama. Sometimes rocks, sometimes a perfect sandy cove. Always quiet.',
    timeBuckets: ['morning', 'day', 'goldenHour'],
    vibe: 'chill',
    locationHint: 'Between Bondi and Tamarama',
  },
  {
    id: 'cliff-meditation',
    title: 'Cliff Edge Meditation',
    description:
      'Walk past the golf course to the Diggers memorial. Find a bench, face the open ocean, and do nothing for 10 minutes.',
    timeBuckets: ['goldenHour', 'night'],
    vibe: 'chill',
    locationHint: 'Diggers memorial, North Bondi',
  },
  {
    id: 'bondi-story-room',
    title: 'Bondi Story Room',
    description:
      'Inside the Pavilion — a quiet digital exhibition on the area\'s history. Air-conditioned and underrated.',
    timeBuckets: ['day'],
    vibe: 'chill',
    locationHint: 'Bondi Pavilion',
  },

  // =====================
  // SOCIAL / DATE VIBES
  // =====================
  {
    id: 'beach-style-bingo',
    title: 'Beach Style Bingo',
    description:
      'Play a mini game: spot someone barefoot, someone in linen, a hat you’d borrow, a dream surfboard, and a dog that looks like it runs Bondi.',
    timeBuckets: ['day', 'goldenHour'],
    vibe: 'social',
    locationHint: 'Promenade or grassy hill above the beach',
  },
  {
    id: 'walk-and-talk',
    title: 'Walk & Talk Loop',
    description:
      'Grab a friend and walk one slow loop along the promenade. No heavy agenda, just chat.',
    timeBuckets: ['day', 'goldenHour', 'night'],
    vibe: 'social',
    locationHint: 'Bondi promenade',
  },
  {
    id: 'sunset-watch-duo',
    title: 'Sunset Watch Duo',
    description:
      'Find a spot facing the horizon and watch the sky change colours together until the sun drops.',
    timeBuckets: ['goldenHour'],
    vibe: 'social',
    locationHint: 'Anywhere with a clear view of the horizon',
  },
  {
    id: 'pick-their-route',
    title: 'Pick Their Route',
    description:
      'Let your friend or date choose the direction and just follow their lead for 10 minutes.',
    timeBuckets: ['day', 'goldenHour', 'night'],
    vibe: 'social',
    locationHint: 'Any starting point around Bondi',
  },
  {
    id: 'bondi-banter',
    title: 'Bondi Banter Break',
    description:
      'Find a wall, rail, or step, sit side by side and talk about the best and worst thing from your week.',
    timeBuckets: ['day', 'goldenHour', 'night'],
    vibe: 'social',
    locationHint: 'Low wall or steps near the beach',
  },
  {
    id: 'secret-wish-to-the-ocean',
    title: 'Secret Wish to the Ocean',
    description:
      'Walk to the water’s edge, make a silent wish, and let a wave steal it away.',
    timeBuckets: ['goldenHour', 'night'],
    vibe: 'social',
    locationHint: 'Water’s edge at Bondi Beach',
  },
  {
    id: 'north-bondi-rsl',
    title: 'North Bondi RSL Terrace',
    description:
      'Best-priced beer with a million-dollar view. Where locals go to avoid the scenester crowds.',
    timeBuckets: ['goldenHour', 'night'],
    vibe: 'social',
    locationHint: 'North Bondi RSL',
  },
  {
    id: 'icebergs-bistro',
    title: 'Icebergs Bistro (Not the Restaurant)',
    description:
      'Downstairs from the famous dining room. Loud, social, and where the actual club members hang out.',
    timeBuckets: ['day', 'goldenHour', 'night'],
    vibe: 'social',
    locationHint: '1 Notts Ave, Bondi',
  },
  {
    id: 'bowlo-sundays',
    title: 'Barefoot Bowls at the Bowlo',
    description:
      'Walk up the hill to Bondi Bowling Club. Barefoot bowls is the ultimate social icebreaker.',
    timeBuckets: ['day', 'goldenHour'],
    vibe: 'social',
    locationHint: 'Bondi Bowling Club',
  },
  {
    id: 'wine-vinyl-rocker',
    title: 'Wine & Vinyl at Rocker',
    description:
      'North Bondi bar with good music and a communal area. Perfect for a solo afternoon drink that turns into an evening.',
    timeBuckets: ['goldenHour', 'night'],
    vibe: 'social',
    locationHint: 'North Bondi',
  },
  {
    id: 'sunday-farmers-market',
    title: 'Sunday Farmers Market',
    description:
      'Bondi Public School on Sundays. Get a coffee, stand at a communal table, and you\'ll be chatting with a local in five minutes.',
    timeBuckets: ['morning', 'day'],
    vibe: 'social',
    locationHint: 'Bondi Public School',
  },
  {
    id: 'bondi-public-bar',
    title: 'Bondi Public Bar',
    description:
      'High energy, unpretentious, easy to walk into solo and leave with friends. A Bondi classic.',
    timeBuckets: ['goldenHour', 'night'],
    vibe: 'social',
    locationHint: 'Campbell Parade, Bondi',
  },
];
