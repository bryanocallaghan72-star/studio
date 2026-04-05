'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Heart, MessageCircle, MoreHorizontal, Check, Ticket, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FeedPost {
  id: string;
  creator: string;
  verified: boolean;
  location: string;
  image: string;
  caption: string;
  venue: string;
  venuePath: string;
  likes: number;
  comments: number;
  phase: string;
  hasDrop: boolean;
  dropLabel?: string;
  isReel?: boolean;
}

interface FeedCardProps {
  post: FeedPost;
  index: number;
}

export function FeedCard({ post, index }: FeedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
      className="w-full border-b border-black/[0.08] bg-[#f2ece0]"
    >
      {/* Visual Header Zone */}
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <Image
          src={post.image}
          alt={post.caption}
          fill
          unoptimized
          className="object-cover"
        />
        
        {/* Editorial Scrim Overlay */}
        <div 
          className="absolute inset-0 z-10" 
          style={{ 
            background: 'linear-gradient(to top, rgba(8,10,13,0.96) 0%, rgba(8,10,13,0.75) 35%, transparent 100%)' 
          }} 
        />

        {/* Content Badges on Image */}
        <div className="absolute bottom-4 left-4 z-20 flex flex-col items-start gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#c4762a] px-2 py-0.5 text-[10px] font-bold tracking-widest text-white uppercase shadow-lg">
              {post.phase}
            </span>
            {post.isReel && (
              <span className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold tracking-widest text-white backdrop-blur-md">
                <Play size={10} fill="currentColor" /> REEL
              </span>
            )}
          </div>
          
          <Link 
            href={post.venuePath}
            className="flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md transition-all active:scale-95"
          >
            <MapPin size={12} className="text-white/80" />
            {post.venue}
          </Link>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        {/* Row 1: Creator Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c4762a] text-[12px] font-bold text-white uppercase">
              {post.creator.charAt(0)}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-[#1a1208]">{post.creator}</span>
                {post.verified && (
                  <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#c4762a]">
                    <Check size={8} strokeWidth={4} className="text-white" />
                  </div>
                )}
              </div>
              <span className="text-[11px] text-[#1a1208]/45">{post.location}</span>
            </div>
          </div>
          <button className="text-[#1a1208]/40 hover:text-[#1a1208]">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Row 2: Caption */}
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[#1a1208]">
          {post.caption}
        </p>

        {/* Row 3: Actions */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#1a1208]/50">
              <Heart size={18} strokeWidth={2} />
              {post.likes}
            </div>
            <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#1a1208]/50">
              <MessageCircle size={18} strokeWidth={2} />
              {post.comments}
            </div>
          </div>

          {post.hasDrop && (
            <button className="flex items-center gap-1.5 rounded-full bg-[#c4762a] px-4 py-2 text-[12px] font-bold text-white shadow-md transition-all hover:bg-[#b06824] active:scale-95">
              <Ticket size={14} strokeWidth={2.5} />
              {post.dropLabel}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
