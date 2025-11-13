
export type TimeBucket = 'morning' | 'day' | 'goldenHour' | 'night';
export type Vibe = 'active' | 'chill' | 'social';

export type SurpriseOption = {
  id: string;
  title: string;
  description: string;
  timeBuckets: TimeBucket[];  // when this idea makes sense
  vibe: Vibe;                 // active / chill / social
  locationHint?: string;      // short hint like "North Bondi", "Promenade"
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
];
