'use client';

import { useMemo } from 'react';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { type FeedItem, type PhotoFeedItem, appData } from '@/lib/data';

/**
 * @fileOverview Hook to fetch and unify social content from Firestore.
 * - Prioritizes live 'sliceOfLifePosts' from Firestore.
 * - Integrates mock photo content as a fallback/mix until the global posts collection is live.
 * - Normalizes creator data into the shape expected by Feed components.
 */
export function useFeed() {
  const firestore = useFirestore();

  // 1. Fetch live Slice of Life stories from Firestore
  const storiesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'sliceOfLifePosts'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
  }, [firestore]);

  const { data: liveStories, isLoading: storiesLoading, error } = useCollection<any>(storiesQuery);

  // 2. Combine and Normalize Feed Data
  const feedItems = useMemo(() => {
    // Transform Firestore documents into the typed StoryFeedItem shape
    const normalizedStories = (liveStories || []).map(s => {
      // Ensure creator object exists even if Firestore doc uses flat fields (creatorName/creatorAvatarUrl)
      const creator = s.creator || {
        id: s.creatorId || 'anonymous',
        name: s.creatorName || 'Bondi Creator',
        avatar: s.creatorAvatarUrl || `https://api.dicebear.com/8.x/lorelei/svg?seed=${s.creatorId || 'default'}`,
      };

      return {
        ...s,
        type: 'story' as const,
        creator,
        postType: s.postType || (s.relatedDealId ? 'monetisable' : 'discovery'),
        likes: s.likes ?? 0,
        commentsCount: s.commentsCount ?? 0,
        createdAt: s.createdAt || new Date().toISOString(),
      };
    });

    // Currently photos are still provided via mock data in lib/data
    const mockPhotos = appData.feedItems.filter(item => item.type === 'photo') as PhotoFeedItem[];

    // Unify all sources
    const combined = [...normalizedStories, ...mockPhotos];
    
    // Sort combined feed by chronological order
    return combined.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });
  }, [liveStories]);

  return {
    feedItems,
    isLoading: storiesLoading,
    error,
    count: feedItems.length
  };
}
