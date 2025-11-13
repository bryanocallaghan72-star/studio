
export type BingoItem = {
  id: string;
  label: string;
};

export type BingoPack = {
  id: string;
  title: string;
  description: string;
  items: BingoItem[];
  difficulty: string;
  vibe: string;
  bestTime: string;
};

export const bingoPacks: BingoPack[] = [
  {
    id: 'bondi-beach-style',
    title: 'Bondi Beach Style Bingo',
    description: 'A micro-game to play while you walk the promenade.',
    items: [
      { id: 'barefoot', label: 'Someone barefoot' },
      { id: 'linen', label: 'Someone in linen' },
      { id: 'hat', label: 'A hat you’d instantly borrow' },
      { id: 'surfboard', label: 'A surfboard you wish you owned' },
      { id: 'dog', label: 'A dog that looks like it runs Bondi' },
    ],
    difficulty: '2/10',
    vibe: 'Fun • Observant • Social',
    bestTime: 'Afternoon / Golden Hour',
  },
  {
    id: 'matcha-ultra-bondi',
    title: 'Matcha Bingo (Ultra-Bondi Edition)',
    description: 'A tribute to the unofficial sport of Bondi.',
    items: [
      { id: 'combo', label: 'Matcha + Activewear Combo' },
      { id: 'photo-1', label: 'Matcha being photographed before the first sip' },
      { id: 'photo-2', label: 'Matcha being photographed before the first sip (again)' },
      { id: 'photo-3', label: 'Matcha being photographed before the first sip (third time)' },
      { id: 'pastry', label: 'Matcha + Pastry Combo' },
    ],
    difficulty: '1/10',
    vibe: 'Clean Girl • Aesthetic • Bondi Wellness Meme',
    bestTime: 'Mid-Morning',
  },
];

export const getBingoPack = (id: string): BingoPack | undefined => {
  return bingoPacks.find((pack) => pack.id === id);
};

export const defaultBingoPack = bingoPacks[0];
