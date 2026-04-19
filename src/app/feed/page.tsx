'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Bell, Plus, Loader2 } from 'lucide-react';
import { FeedCard, type FeedPost } from '@/components/feed/FeedCard';
import { CreatePostSheet } from '@/components/feed/CreatePostSheet';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, orderBy, query, limit, collectionGroup, where, getDocs, documentId } from 'firebase/firestore';

const MOCK_POSTS: FeedPost[] = [
  {
    id: '1',
    creatorId: 'mock-alice',
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
    creatorId: 'mock-jay',
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
    creatorId: 'mock-maya',
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
    creatorId: 'mock-bondi-local',
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

const FeedSkeleton = () => (
  <div className="flex flex-col">
    {[1, 2, 3].map((i) => (
      <div key={i} className="w-full border-b border-black/[0.08] bg-[#f2ece0] pb-8 space-y-4">
        <div className="aspect-[4/5] w-full bg-[#e8e0d0] animate-pulse" />
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#e8e0d0] animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-[#e8e0d0] animate-pulse" />
              <div className="h-3 w-20 rounded bg-[#e8e0d0] animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-[#e8e0d0] animate-pulse" />
            <div className="h-3 w-4/5 rounded bg-[#e8e0d0] animate-pulse" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default function FeedPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const postsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
  }, [firestore]);

  const { data: livePostsRaw, isLoading } = useCollection<any>(postsQuery);

  /**
   * BATCHED LIKE CHECK: Perform one query for all user likes instead of N queries.
   */
  useEffect(() => {
    if (!firestore || !user || !livePostsRaw || livePostsRaw.length === 0) return;

    const fetchUserLikes = async () => {
      try {
        const q = query(collectionGroup(firestore, 'likes'), where(documentId(), '==', user.uid));
        const snapshot = await getDocs(q);
        const ids = new Set<string>();
        
        snapshot.forEach((doc) => {
          const postId = doc.ref.parent.parent?.id;
          if (postId) ids.add(postId);
        });
        
        setLikedPostIds(ids);
      } catch (err) {
        console.warn("Batch like check failed. Reverting to default states.", err);
      }
    };

    fetchUserLikes();
  }, [firestore, user, livePostsRaw]);

  const transformedLivePosts = useMemo(() => {
    return (livePostsRaw || []).map((doc) => ({
      id: doc.id,
      creatorId: doc.creatorId ?? 'anonymous',
      creator: doc.creatorName || (doc.creatorEmail ? doc.creatorEmail.split('@')[0] : 'anonymous'),
      creatorAvatar: doc.creatorAvatar || '',
      verified: false,
      location: doc.location || 'Bondi',
      image: doc.imageUrl || '',
      caption: doc.caption || '',
      venue: doc.venueName || '',
      venuePath: '',
      likes: doc.likes ?? 0,
      comments: doc.comments ?? 0,
      phase: 'DAY',
      hasDrop: false,
      isReel: false,
    }));
  }, [livePostsRaw]);

  const allPosts = useMemo(() => {
    const liveWithLikes: FeedPost[] = transformedLivePosts.map((post) => ({
      ...post,
      isLiked: likedPostIds.has(post.id),
    }));

    const showMockPosts = liveWithLikes.length < 5;
    return showMockPosts ? [...liveWithLikes, ...MOCK_POSTS] : liveWithLikes;
  }, [transformedLivePosts, likedPostIds]);

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
            {user?.email?.charAt(0).toUpperCase() || 'B'}
          </div>
        </div>
      </header>

      {/* Main Feed Scroll Zone */}
      <main className="flex-1 pb-[100px]">
        {isUserLoading || isLoading ? (
          <FeedSkeleton />
        ) : (
          <div className="flex flex-col">
            {allPosts.map((post, index) => (
              <FeedCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}
      </main>

      {/* Floating Create Button */}
      <button 
        onClick={() => setIsCreateOpen(true)}
        className="fixed bottom-36 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#c4762a] text-white shadow-lg shadow-[#c4762a]/30 transition-transform active:scale-90 hover:bg-[#b06824] focus:outline-none"
        aria-label="Create new post"
      >
        <Plus size={28} strokeWidth={3} />
      </button>

      {/* Create Post Sheet Overlay */}
      <CreatePostSheet 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
      />
    </div>
  );
}
