'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { format, subDays, startOfDay, isAfter, parseISO } from 'date-fns';

export type ActionType = 'claimDeal' | 'bookStay' | 'joinSocial';

export interface InfluencedAction {
  actionId: string;
  actionType: ActionType;
  itemId: string;
  timestamp: string;
  userId: string;
}

/**
 * Hook to subscribe to a creator's influenced actions and calculate real-time stats.
 * 
 * @param creatorId The UID of the creator profile being viewed.
 */
export function useInfluencedActions(creatorId: string) {
  const [loading, setLoading] = useState(true);
  const [actions, setActions] = useState<InfluencedAction[]>([]);
  const firestore = useFirestore();

  useEffect(() => {
    if (!firestore || !creatorId) return;

    // Listen to the private influencedActions subcollection
    const colRef = collection(firestore, 'users', creatorId, 'influencedActions');
    const q = query(colRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        actionId: doc.id,
      })) as InfluencedAction[];
      
      setActions(data);
      setLoading(false);
    }, (error) => {
      // Security rules will block this for non-owners, which is expected.
      console.warn("Analytics access restricted or unavailable:", error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [firestore, creatorId]);

  const stats = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = startOfDay(subDays(now, 6));

    // Basic aggregations
    const totalClaims = actions.filter(a => a.actionType === 'claimDeal').length;
    const totalStays = actions.filter(a => a.actionType === 'bookStay').length;
    const totalSocial = actions.filter(a => a.actionType === 'joinSocial').length;
    const totalActions = actions.length;

    // Last 7 days aggregation
    const weeklyActionsList = actions.filter(a => {
        try {
            return isAfter(parseISO(a.timestamp), sevenDaysAgo);
        } catch (e) {
            return false;
        }
    });
    const weeklyActions = weeklyActionsList.length;

    // Prepare 7-day chart data
    const chartDays = Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(now, 6 - i);
      return {
        date,
        day: format(date, 'EEE'),
        claims: 0,
        stays: 0,
        social: 0,
      };
    });

    actions.forEach(action => {
      try {
          const actionDate = parseISO(action.timestamp);
          const dateStr = format(actionDate, 'yyyy-MM-dd');
          const entry = chartDays.find(d => format(d.date, 'yyyy-MM-dd') === dateStr);
          
          if (entry) {
            if (action.actionType === 'claimDeal') entry.claims++;
            if (action.actionType === 'bookStay') entry.stays++;
            if (action.actionType === 'joinSocial') entry.social++;
          }
      } catch (e) {
          // Skip invalid timestamps
      }
    });

    return {
      totalClaims,
      totalStays,
      totalSocial,
      totalActions,
      weeklyActions,
      chartData: chartDays.map(({ day, claims, stays, social }) => ({ day, claims, stays, social })),
      recentActions: actions.slice(0, 5),
    };
  }, [actions]);

  return {
    loading,
    ...stats
  };
}
