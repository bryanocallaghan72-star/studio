'use client';

import React from 'react';
import { Bell } from 'lucide-react';
import { FeedCard, type FeedPost } from '@/components/feed/FeedCard';

const MOCK_POSTS: FeedPost[] = [
  {
    id: '1',
    creator: 'alice',
    verified: true,
    location: 'Bondi Beach',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80',
    caption: 'The salmon roll at Toko is unreal right now. Non-negotiable Tuesday move. 🍣',
    venue: 'Toko Bondi',
    venuePath: '/discover/toko-bondi',
    likes: 482,
    comments: 34,
    phase: 'GOLDEN',
    hasDrop: true,
    dropLabel: 'Claim 15% off tonight',
    isReel: false,
  },
  {
    id: '2',
    creator: 'jay',
    verified: false,
    location: 'Bondi',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    caption: 'Golden hour from the Icebergs terrace. This city never misses. 🌅',
    venue: 'Icebergs Dining Room',
    venuePath: '/discover/icebergs',
    likes: 1204,
    comments: 89,
    phase: 'GOLDEN',
    isReel: true,
    hasDrop: false,
  },
  {
    id: '3',
    creator: 'maya',
    verified: true,
    location: 'Bondi',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
    caption: 'Morning ritual. Every single day. The flat white here is the standard. ☕',
    venue: 'Three Blue Ducks',
    venuePath: '/discover/three-blue-ducks',
    likes: 621,
    comments: 68,
    phase: 'DAY',
    hasDrop: true,
    dropLabel: 'Claim free pastry with coffee',
    isReel: false,
  },
  {
    id: '4',
    creator: 'bondi_local',
    verified: true,
    location: 'Bondi Beach',
    image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80',
    caption: '3m swell this morning. Worth every early alarm. 🌊',
    venue: 'North Bondi',
    venuePath: '/discover/north-bondi',
    likes: 3891,
    comments: 201,
    phase: 'DAWN',
    isReel: true,
    hasDrop: false,
  },
];

export default function FeedPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f2ece0]">
      {/* Sticky Premium Header */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-black/[0.06] bg-[#f2ece0]/95 px-4 backdrop-blur-md">
        <h1 className="text-xl font-extrabold tracking-tighter text-[#1a1208]">
          IYKYK
        </h1>
        <div className="flex items-center gap-4">
          <button className="text-[#1a1208]/60 transition-colors hover:text-[#1a1208]">
            <Bell size={22} strokeWidth={1.8} />
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c4762a] text-[12px] font-bold text-white shadow-sm">
            B
          </div>
        </div>
      </header>

      {/* Main Feed Scroll Zone */}
      <main className="flex-1 pb-[100px]">
        <div className="flex flex-col">
          {MOCK_POSTS.map((post, index) => (
            <FeedCard key={post.id} post={post} index={index} />
          ))}
        </div>
      </main>
    </div>
  );
}
