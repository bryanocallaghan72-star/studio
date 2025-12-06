
import { Sun, Waves, Leaf, Flame, Users, Wind, Sparkles, type LucideIcon } from 'lucide-react';

export type CardEnergyType = 'water' | 'fire' | 'earth' | 'air' | 'social' | 'calm';

export interface AlignmentCardData {
  id: string;
  type: CardEnergyType;
  title: string;
  description: string;
  ritual: string;
  icon: LucideIcon;
  color: string;
}

export const alignmentCards: AlignmentCardData[] = [
  // Water
  {
    id: 'water-1',
    type: 'water',
    title: 'Today flows like water',
    description: 'Embrace fluidity and let go of resistance. The ocean is calling you to reset.',
    ritual: 'Go for a swim at Icebergs or just dip your feet in the ocean at North Bondi.',
    icon: Waves,
    color: 'sky'
  },
  {
    id: 'water-2',
    type: 'water',
    title: 'Deep currents of thought',
    description: 'Your intuition is high. Find a quiet spot by the water to reflect and listen.',
    ritual: 'Walk to the quiet south end of the beach and watch the waves.',
    icon: Waves,
    color: 'sky'
  },
  // Fire
  {
    id: 'fire-1',
    type: 'fire',
    title: 'A spark of creative energy',
    description: 'Your energy is bright and powerful today. It\'s a good day to start something new.',
    ritual: 'Grab a strong coffee from The Depot and brainstorm a new project.',
    icon: Flame,
    color: 'rose'
  },
  {
    id: 'fire-2',
    type: 'fire',
    title: 'The warmth of the sun',
    description: 'Soak in the light. You\'re meant to be seen and share your warmth today.',
    ritual: 'Find a sunny spot on the grassy knoll and just enjoy the sunshine for 10 minutes.',
    icon: Sun,
    color: 'amber'
  },
  // Earth
  {
    id: 'earth-1',
    type: 'earth',
    title: 'Grounded and stable',
    description: 'Connect with the physical world. Feel the support beneath your feet.',
    ritual: 'Take your shoes off and walk barefoot on the sand or grass.',
    icon: Leaf,
    color: 'emerald'
  },
  {
    id: 'earth-2',
    type: 'earth',
    title: 'Nourish your foundations',
    description: 'Today is about nourishing your body and soul with something wholesome.',
    ritual: 'Treat yourself to a healthy, delicious meal from a local spot like Porch and Parlour.',
    icon: Leaf,
    color: 'emerald'
  },
  // Air
  {
    id: 'air-1',
    type: 'air',
    title: 'A day for fresh perspectives',
    description: 'Your mind is clear and open. Seek out new ideas and conversations.',
    ritual: 'Walk a different route than you normally would. Notice something new.',
    icon: Wind,
    color: 'slate'
  },
  {
    id: 'air-2',
    type: 'air',
    title: 'Breathe it out',
    description: 'Intellectual energy is high, but don\'t forget to breathe. Clear your head.',
    ritual: 'Find a bench with a view and take 10 deep, conscious breaths.',
    icon: Wind,
    color: 'slate'
  },
  // Social
  {
    id: 'social-1',
    type: 'social',
    title: 'Fast social energy is all around',
    description: 'Expect a chance encounter or a serendipitous conversation. Be open to connecting.',
    ritual: 'Smile at a stranger or strike up a small chat while waiting for your coffee.',
    icon: Users,
    color: 'indigo'
  },
  {
    id: 'social-2',
    type: 'social',
    title: 'Time to reconnect',
    description: 'Today is perfect for reaching out and strengthening a bond with a friend.',
    ritual: 'Send a message to a friend you haven\'t spoken to in a while and suggest a walk.',
    icon: Users,
    color: 'indigo'
  },
  // Calm
  {
    id: 'calm-1',
    type: 'calm',
    title: 'Embrace the stillness',
    description: 'The world is loud, but you can find a pocket of peace. Seek out quiet moments.',
    ritual: 'Try a 5-minute meditation using a simple app or just by focusing on your breath.',
    icon: Sparkles,
    color: 'purple'
  },
  {
    id: 'calm-2',
    type: 'calm',
    title: 'A moment of gentle observation',
    description: 'Slow down and simply notice the world around you without judgment.',
    ritual: 'Find a comfortable spot and just people-watch for 15 minutes. No phone.',
    icon: Sparkles,
    color: 'purple'
  },
];
