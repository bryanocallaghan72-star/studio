'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, BedDouble, Users, Lock, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useInfluencedActions } from '@/hooks/useInfluencedActions';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

/**
 * Owner-only component that displays analytics and impact data for a creator.
 * Features real-time stats from Firestore and activity charts.
 */
export function CreatorInsights({ creatorId }: { creatorId: string }) {
  const { 
    loading, 
    totalStays, 
    totalActions, 
    weeklyActions, 
    chartData, 
    recentActions 
  } = useInfluencedActions(creatorId);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#c4762a]/20 border-t-[#c4762a]"></div>
        <p className="text-[11px] font-bold text-[#c4762a] uppercase tracking-widest">Calculating Impact...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Section A - Impact Header */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-bold tracking-[0.15em] text-[#c4762a] uppercase">
          Your Impact This Week
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-white border-none shadow-sm rounded-2xl p-4 flex flex-col justify-center min-h-[88px]">
            <span className="text-3xl font-black text-[#c4762a] leading-none">{weeklyActions}</span>
            <span className="text-[10px] text-[rgba(26,18,8,0.40)] mt-1 font-bold uppercase tracking-tight">claims this week</span>
          </Card>
          <Card className="bg-white border-none shadow-sm rounded-2xl p-4 flex flex-col justify-center min-h-[88px]">
            <span className="text-3xl font-black text-[#c4762a] leading-none">{totalActions}</span>
            <span className="text-[10px] text-[rgba(26,18,8,0.40)] mt-1 font-bold uppercase tracking-tight">lifetime impact</span>
          </Card>
          <Card className="bg-white border-none shadow-sm rounded-2xl p-4 flex flex-col justify-center min-h-[88px]">
            <span className="text-3xl font-black text-[#c4762a] leading-none">{totalStays}</span>
            <span className="text-[10px] text-[rgba(26,18,8,0.40)] mt-1 font-bold uppercase tracking-tight">stays booked</span>
          </Card>
        </div>
      </section>

      {/* Section B - Activity Chart */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-bold tracking-[0.15em] text-[#c4762a] uppercase">
          Activity · Last 7 Days
        </h3>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: 'rgba(26,18,8,0.40)', fontWeight: 600 }}
                interval="preserveStartEnd"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  borderRadius: '16px', 
                  border: '0.5px solid rgba(0,0,0,0.08)',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="claims" 
                stroke="#c4762a" 
                strokeWidth={2}
                fill="#c4762a" 
                fillOpacity={0.15} 
              />
              <Area 
                type="monotone" 
                dataKey="stays" 
                stroke="#1a1208" 
                strokeWidth={2}
                fill="#1a1208" 
                fillOpacity={0.08} 
              />
              <Area 
                type="monotone" 
                dataKey="social" 
                stroke="rgba(196,118,42,0.6)" 
                strokeWidth={2}
                fill="rgba(196,118,42,0.4)" 
                fillOpacity={0.2} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Section C - Recent Activity Feed */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-bold tracking-[0.15em] text-[#c4762a] uppercase">
          Recent Activity
        </h3>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-black/[0.03]">
          {recentActions.length > 0 ? recentActions.map((action, idx) => {
            const Icon = action.actionType === 'claimDeal' ? Ticket 
                       : action.actionType === 'bookStay' ? BedDouble 
                       : Users;
            const text = action.actionType === 'claimDeal' ? "Someone claimed via your post"
                       : action.actionType === 'bookStay' ? "Someone booked a stay you recommended"
                       : "Someone joined your social event";
            const color = action.actionType === 'bookStay' ? '#1a1208' : '#c4762a';

            return (
              <div key={action.actionId}>
                <div className="flex items-center justify-between p-4 transition-colors hover:bg-black/[0.01]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl" style={{ backgroundColor: `${color}10` }}>
                      <Icon size={16} style={{ color: color }} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-[#1a1208]">{text}</span>
                      <span className="text-[11px] text-[rgba(26,18,8,0.40)] font-medium">
                        {formatDistanceToNow(parseISO(action.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-[rgba(26,18,8,0.20)]" />
                </div>
                {idx < recentActions.length - 1 && <div className="h-[0.5px] w-full bg-[rgba(26,18,8,0.06)]" />}
              </div>
            );
          }) : (
            <div className="text-center py-12 px-6">
              <p className="text-sm font-medium text-[rgba(26,18,8,0.40)]">Your first claim will appear here.</p>
            </div>
          )}
        </div>
      </section>

      {/* Section D - Earnings Teaser */}
      <Card className="bg-white border-none shadow-sm rounded-2xl p-6 space-y-4">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-[#c4762a]/10">
            <Lock size={20} className="text-[#c4762a]" />
          </div>
        </div>
        <div className="text-center space-y-1">
          <h4 className="text-[#1a1208] font-bold text-lg">Earnings & Payouts</h4>
          <p className="text-[13px] text-[rgba(26,18,8,0.50)] leading-relaxed px-4">
            Connect Stripe to unlock your earnings dashboard and receive automatic payouts.
          </p>
        </div>
        <Button 
          className="w-full h-14 bg-[#c4762a] text-white hover:bg-[#b06824] rounded-2xl font-black text-lg shadow-lg shadow-[#c4762a]/15 transition-all active:scale-[0.98]"
          onClick={() => console.log('stripe-connect')}
        >
          Connect Stripe
        </Button>
      </Card>
    </motion.div>
  );
}
