
/**
 * @fileOverview Contextual venue scoring and ranking engine for iykyk.
 * Calculates relevance scores (0-100) based on time, weather, mood, and location.
 */

export type ScoringContext = {
  phase: 'morning' | 'afternoon' | 'evening' | 'night';
  weather: 'sunny' | 'cloudy' | 'rainy' | 'windy';
  mood?: string | null;
  distanceMeters?: number;
};

export type ScoredVenue = {
  id: string;
  slug: string;
  name: string;
  score: number;
  vibeTags?: string[];
  seating?: string;
  cuisine?: string;
  distanceMeters?: number;
};

const SOCIAL_TAGS = ['social', 'buzzing', 'lively', 'groups', 'group energy', 'late night'];
const CHILL_TAGS = ['relaxed', 'quiet', 'intimate', 'cosy', 'hidden gem', 'local favourite', 'neighbourhood spot'];
const OUTDOOR_TAGS = ['beachside', 'alfresco', 'ocean views', 'sunny', 'outdoor dining', 'post-surf', 'sunset ritual'];
const FOOD_TAGS = ['brunch', 'coffee', 'cocktails', 'wine bar', 'date night'];

/**
 * Mood Buckets for mapping high-level filters to sets of related tags.
 */
const MOOD_BUCKETS: Record<string, string[]> = {
  'social': SOCIAL_TAGS,
  'chill': CHILL_TAGS,
  'cosy': CHILL_TAGS,
  'outdoor': OUTDOOR_TAGS,
  'food': FOOD_TAGS,
  'local favourite': ['local favourite', 'post-surf', 'community', 'group energy', 'neighbourhood gem'],
  'sunset ritual':   ['sunset ritual', 'cocktails', 'date night', 'lively', 'wine', 'wine bar'],
  'buzzing':         ['buzzing', 'social', 'lively', 'group energy', 'high voltage', 'post-surf'],
  'hidden gem':      ['hidden gem', 'neighbourhood gem', 'intimate'],
  'morning reset':   ['morning reset', 'wellness', 'pilates', 'yoga', 'barre', 'coffee', 'healthy eats', 'smoothies', 'grab-and-go'],
  'date night':      ['date night', 'cocktails', 'hidden gem', 'intimate', 'wine', 'wine bar', 'modern dining', 'sunset ritual'],
};

/**
 * Calculates a contextual relevance score for a venue.
 * Range: 0 - 100
 */
export function scoreVenue(venue: Partial<ScoredVenue>, context: ScoringContext): number {
  let score = 0;
  const tags = (venue.vibeTags || []).map(t => t.toLowerCase());
  const seating = (venue.seating || '').toLowerCase();
  const currentMood = (context.mood || '').toLowerCase();

  // 1. phaseMatch (0–30)
  if (context.phase === 'morning') {
    if (tags.some(t => t.includes('brunch') || t.includes('coffee'))) {
      score += 30;
    }
  } else if (context.phase === 'afternoon') {
    if (tags.some(t => ['beachside', 'alfresco', 'outdoor dining'].includes(t))) {
      score += 25;
      if (context.weather === 'sunny') score += 5;
    }
  } else if (context.phase === 'evening') {
    if (tags.some(t => ['cocktails', 'date night', 'sunset ritual'].includes(t))) {
      score += 30;
    }
  } else if (context.phase === 'night') {
    if (tags.some(t => SOCIAL_TAGS.includes(t))) {
      score += 30;
    }
  }

  // 2. weatherMatch (0–20)
  if (context.weather === 'sunny') {
    if (seating === 'outdoor' || seating === 'both' || tags.some(t => OUTDOOR_TAGS.includes(t))) {
      score += 20;
    } else if (seating === 'indoor') {
      score += 5;
    }
  } else if (context.weather === 'rainy' || context.weather === 'windy') {
    if (seating === 'indoor' || seating === 'both') {
      score += 20;
    } else if (seating === 'outdoor') {
      score += 5;
    }
  } else if (context.weather === 'cloudy') {
    score += 10;
  }

  // 3. moodMatch (0–15)
  if (!context.mood) {
    score += 8; // Neutral boost
  } else {
    const bucket = MOOD_BUCKETS[currentMood];
    if (bucket) {
      const overlap = tags.filter(t => bucket.includes(t)).length;
      if (overlap >= 1) {
        score += overlap >= 2 ? 15 : 8;
      }
    } else if (tags.includes(currentMood)) {
      score += 15;
    }
  }

  // 4. proximityScore (0–10)
  const dist = venue.distanceMeters ?? context.distanceMeters;
  if (dist !== undefined) {
    if (dist < 200) score += 10;
    else if (dist < 500) score += 7;
    else if (dist < 1000) score += 4;
    else score += 1;
  } else {
    score += 5; // Neutral for unknown distance
  }

  // 5. liveHeat (0–15) - Placeholder for real-time trending signals
  score += 8;

  // 6. activePerkBoost (0–10) - Placeholder for live deals
  score += 5;

  return Math.min(100, score);
}

/**
 * Scores and sorts a list of venues by their relevance to the current context.
 */
export function rankVenues(venues: ScoredVenue[], context: ScoringContext): ScoredVenue[] {
  return venues
    .map(v => ({ ...v, score: scoreVenue(v, context) }))
    .sort((a, b) => b.score - a.score);
}
