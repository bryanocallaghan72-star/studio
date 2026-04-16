'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Heart, MessageCircle, MoreHorizontal, Check, Ticket, Play } from 'lucide-react';
import { ClaimModal } from '@/components/claim/ClaimModal';

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
  const [isClaimModalOpen, setClaimModalOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);

  const handleLikeToggle = () => {
    if (liked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
      className="w-full border-b border-black/[0.08] bg-[#f2ece0]"
    >
      {/* Visual Header Zone */}
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.caption}
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#c4762a]/20 to-[#f2ece0] flex items-center justify-center">
            <span className="text-4xl">🌊</span>
          </div>
        )}
        
        {/* Editorial Scrim Overlay */}
        <div 
          className="absolute inset-0 z-10" 
          style={{ 
            background: 'linear-gradient(to top, rgba(8,10,13,0.82) 0%, rgba(8,10,13,0.45) 30%, transparent 65%)' 
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
            href={post.venuePath || '/discover'}
            className="flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md transition-all active:scale-95"
          >
            <MapPin size={12} className="text-white/80" />
            {post.venue}
          </Link>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        {/* Row 1: Creator Info (Tappable) */}
        <div className="flex items-center justify-between">
          <Link href={`/profile/${post.creator}`} className="flex items-center gap-3 group transition-opacity active:opacity-70">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c4762a] text-[12px] font-bold text-white uppercase group-hover:ring-2 group-hover:ring-[#c4762a]/20">
              {post.creator.charAt(0)}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-[#1a1208] group-hover:underline">{post.creator}</span>
                {post.verified && (
                  <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#c4762a]">
                    <Check size={8} strokeWidth={4} className="text-white" />
                  </div>
                )}
              </div>
              <span className="text-[11px] text-[#1a1208]/45">{post.location}</span>
            </div>
          </Link>
          <button className="text-[#1a1208]/40 hover:text-[#1a1208]">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Row 2: Caption */}
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[#1a1208]">
          {post.caption}
        </p>

        {/* Comment Section (Toggleable) */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              {/* Comment input row */}
              <div className="flex items-center gap-3 mt-4">
                <div className="w-7 h-7 rounded-full bg-[#c4762a] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                  U
                </div>
                <input 
                  type="text" 
                  placeholder="Add a comment..."
                  className="bg-[rgba(26,18,8,0.04)] border border-black/[0.08] rounded-full px-4 py-2 text-sm flex-1 outline-none focus:outline-none"
                />
              </div>
              
              {/* Mock comments */}
              {(post as any).source !== 'user_created' && (
                <div className="mt-4 space-y-3 pb-2">
                  <div className="flex gap-2 items-start">
                    <div className="w-6 h-6 rounded-full bg-[rgba(26,18,8,0.10)] text-[#1a1208] text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      J
                    </div>
                    <div className="flex-1">
                      <span className="text-[#1a1208] font-semibold text-xs">@jay</span>
                      <span className="text-[rgba(26,18,8,0.70)] text-xs ml-1">This place is unreal every time 🔥</span>
                    </div>
                  </div>
                  <div className="flex gap-2 items-start">
                    <div className="w-6 h-6 rounded-full bg-[rgba(26,18,8,0.10)] text-[#1a1208] text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      M
                    </div>
                    <div className="flex-1">
                      <span className="text-[#1a1208] font-semibold text-xs">@maya</span>
                      <span className="text-[rgba(26,18,8,0.70)] text-xs ml-1">The omakase is next level, go</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Row 3: Actions */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLikeToggle}
              className={`flex items-center gap-1.5 text-[13px] font-medium transition-colors ${liked ? 'text-[#c4762a]' : 'text-[#1a1208]/50 hover:text-[#1a1208]'}`}
            >
              <Heart 
                size={18} 
                strokeWidth={2} 
                fill={liked ? "#c4762a" : "none"} 
                stroke={liked ? "#c4762a" : "currentColor"} 
              />
              {likeCount}
            </button>
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1.5 text-[13px] font-medium text-[#1a1208]/50 hover:text-[#1a1208] outline-none focus:outline-none focus:ring-0 focus:shadow-none"
              style={{ outline: 'none', boxShadow: 'none' }}
            >
              <MessageCircle size={18} strokeWidth={2} />
              {post.comments}
            </button>
          </div>

          {post.hasDrop && (
            <button 
              onClick={() => setClaimModalOpen(true)}
              className="flex items-center gap-1.5 rounded-full bg-[#c4762a] px-4 py-2 text-[12px] font-bold text-white shadow-md transition-all hover:bg-[#b06824] active:scale-95"
            >
              <Ticket size={14} strokeWidth={2.5} />
              {post.dropLabel}
            </button>
          )}
        </div>
      </div>

      {/* Claim Modal Instance */}
      <ClaimModal
        isOpen={isClaimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        venueName={post.venue}
        offerText={post.dropLabel || ''}
        creatorHandle={post.creator}
        source="feed"
      />
    </motion.div>
  );
}
