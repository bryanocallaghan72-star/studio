'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Heart, MessageCircle, MoreHorizontal, Check, Ticket, Play, Trash2 } from 'lucide-react';
import { ClaimModal } from '@/components/claim/ClaimModal';
import { useUser, useFirestore } from '@/firebase';
import { doc, increment, addDoc, collection, query, orderBy, getDocs, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

export interface FeedPost {
  id: string;
  creatorId: string;
  creator: string;
  creatorAvatar?: string;
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
  source?: string;
  isLiked?: boolean; // Propagated from batched page-level check
}

interface FeedCardProps {
  post: FeedPost;
  index: number;
}

export function FeedCard({ post, index }: FeedCardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isClaimModalOpen, setClaimModalOpen] = useState(false);
  
  // Initialize liked state from the batched prop
  const [liked, setLiked] = useState(post.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [localComments, setLocalComments] = useState<{ text: string; authorName: string }[]>([]);

  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const isOwner = Boolean(user && !isUserLoading && post.creatorId && user.uid === post.creatorId);

  // Sync state if the batched data arrives after initial render
  useEffect(() => {
    if (post.isLiked !== undefined) {
      setLiked(post.isLiked);
    }
  }, [post.isLiked]);

  // Individual fetch is REMOVED to prevent network congestion. 
  // Liked state is now provided by the parent Feed page via collectionGroup query.

  useEffect(() => {
    if (showComments && firestore && post.id && localComments.length === 0) {
      const q = query(
        collection(firestore, 'posts', post.id, 'comments'), 
        orderBy('createdAt', 'asc')
      );
      
      getDocs(q).then((snapshot) => {
        const fetched = snapshot.docs.map(doc => ({
          text: doc.data().text,
          authorName: doc.data().authorName
        }));
        setLocalComments(fetched);
      }).catch(err => console.error("Error fetching comments:", err));
    }
  }, [showComments, firestore, post.id, localComments.length]);

  const handleLikeToggle = async () => {
    if (!user) {
      toast({
        title: "Sign in to like",
        description: "Join the inner circle to engage with the Bondi community.",
        action: (
          <ToastAction altText="Sign In" onClick={() => router.push('/auth')}>
            Sign In
          </ToastAction>
        ),
      });
      return;
    }

    if (!firestore || !post.id) return;

    const newLiked = !liked;
    const likeRef = doc(firestore, 'posts', post.id, 'likes', user.uid);
    const postRef = doc(firestore, 'posts', post.id);

    const originalLiked = liked;
    const originalCount = likeCount;

    setLiked(newLiked);
    setLikeCount(prev => newLiked ? prev + 1 : prev - 1);

    try {
      if (newLiked) {
        // We write the UID into the doc for collectionGroup query optimization
        await setDoc(likeRef, { likedAt: new Date(), uid: user.uid }, { merge: true });
        await updateDoc(postRef, { likes: increment(1) });
      } else {
        await deleteDoc(likeRef);
        await updateDoc(postRef, { likes: increment(-1) });
      }
    } catch (err) {
      console.error("Like operation failed:", err);
      setLiked(originalLiked);
      setLikeCount(originalCount);
      toast({
        variant: "destructive",
        title: "Couldn't like that post. Try again.",
      });
    }
  };

  const handleCommentSubmit = async () => {
    if (!user) {
      toast({
        title: "Sign in to comment",
        description: "Your voice matters! Sign in to join the conversation.",
        action: (
          <ToastAction altText="Sign In" onClick={() => router.push('/auth')}>
            Sign In
          </ToastAction>
        ),
      });
      return;
    }

    if (!firestore || !commentText.trim() || !post.id) return;

    const authorName = user.displayName ?? user.email?.split('@')[0] ?? 'Bondi Local';
    const postRef = doc(firestore, 'posts', post.id);
    const commentsRef = collection(firestore, 'posts', post.id, 'comments');

    const commentData = {
      text: commentText,
      authorId: user.uid,
      authorName: authorName,
      createdAt: new Date(),
    };

    const prevComments = [...localComments];
    const prevText = commentText;

    setLocalComments(prev => [...prev, { text: commentText, authorName }]);
    setCommentText('');

    try {
      await addDoc(commentsRef, commentData);
      await updateDoc(postRef, { comments: increment(1) });
    } catch (err) {
      console.error("Error posting comment:", err);
      setLocalComments(prevComments);
      setCommentText(prevText);
      toast({
        variant: "destructive",
        title: "Couldn't post comment. Try again.",
      });
    }
  };

  const handleDeletePost = async () => {
    if (!firestore || !post.id) return;
    const postRef = doc(firestore, 'posts', post.id);
    
    try {
      setIsMenuOpen(false);
      await deleteDoc(postRef);
      toast({
        title: "Post deleted",
      });
    } catch (err) {
      console.error("Delete failed:", err);
      toast({
        variant: "destructive",
        title: "Couldn't delete post. Try again.",
      });
    }
  };

  const userInitial = (user?.displayName || user?.email || 'U').charAt(0).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
      className="w-full border-b border-black/[0.08] bg-transparent"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[rgba(128,128,128,0.1)]">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.caption}
            fill
            className="object-cover"
            priority={index < 2}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#c4762a]/20 to-transparent flex items-center justify-center">
            <span className="text-4xl">🌊</span>
          </div>
        )}
        
        <div 
          className="absolute inset-0 z-10" 
          style={{ 
            background: 'linear-gradient(to top, rgba(8,10,13,0.82) 0%, rgba(8,10,13,0.45) 30%, transparent 65%)' 
          }} 
        />

        <div className="absolute bottom-4 left-4 z-20 flex flex-col items-start gap-2">
          <div className="flex items-center gap-2">
            <span 
              className="rounded-full px-2 py-0.5 text-[10px] font-bold tracking-widest text-white uppercase shadow-lg"
              style={{ backgroundColor: 'var(--phase-accent)' }}
            >
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

      <div className="p-4">
        <div className="flex items-center justify-between">
          <Link href={`/profile/${post.creatorId}`} className="flex items-center gap-3 group transition-opacity active:opacity-70">
            <div 
              className="relative flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold text-white uppercase group-hover:ring-2 group-hover:ring-[#c4762a]/20 overflow-hidden"
              style={{ backgroundColor: 'var(--phase-accent)' }}
            >
              {post.creatorAvatar ? (
                <Image 
                  src={post.creatorAvatar} 
                  alt={post.creator} 
                  fill 
                  className="object-cover"
                />
              ) : (
                post.creator.charAt(0)
              )}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold group-hover:underline" style={{ color: 'var(--phase-text)' }}>{post.creator}</span>
                {post.verified && (
                  <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full" style={{ backgroundColor: 'var(--phase-accent)' }}>
                    <Check size={8} strokeWidth={4} className="text-white" />
                  </div>
                )}
              </div>
              <span className="text-[11px]" style={{ color: 'var(--phase-text)', opacity: 0.45 }}>{post.location}</span>
            </div>
          </Link>
          
          {isOwner && (
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 -mr-2"
                style={{ color: 'var(--phase-text)', opacity: 0.40 }}
              >
                <MoreHorizontal size={20} />
              </button>
              
              <AnimatePresence>
                {isMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-20" 
                      onClick={() => setIsMenuOpen(false)} 
                    />
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 top-full mt-1 w-36 rounded-xl bg-white p-1 shadow-xl border border-black/[0.06] z-30 overflow-hidden"
                    >
                      <button 
                        onClick={handleDeletePost}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-[11px] font-bold text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} />
                        Delete Post
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed" style={{ color: 'var(--phase-text)' }}>
          {post.caption}
        </p>

        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-3 mt-4">
                <div 
                  className="w-7 h-7 rounded-full text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'var(--phase-accent)' }}
                >
                  {userInitial}
                </div>
                <input 
                  type="text" 
                  placeholder="Add a comment..."
                  className="bg-[rgba(128,128,128,0.04)] border border-black/[0.08] rounded-full px-4 py-2 text-sm flex-1 outline-none focus:outline-none"
                  style={{ color: 'var(--phase-text)' }}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
                />
              </div>
              
              <div className="mt-4 space-y-3 pb-2">
                {localComments.map((c, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <div 
                      className="w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'color-mix(in srgb, var(--phase-accent) 15%, transparent)', color: 'var(--phase-accent)' }}
                    >
                      {c.authorName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-xs" style={{ color: 'var(--phase-text)' }}>@{c.authorName}</span>
                      <span className="text-xs ml-1" style={{ color: 'var(--phase-text)', opacity: 0.70 }}>{c.text}</span>
                    </div>
                  </div>
                ))}
                
                {(post as any).source === 'editorial' && (
                  <>
                    <div className="flex gap-2 items-start">
                      <div 
                        className="w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center flex-shrink-0" 
                        style={{ backgroundColor: 'color-mix(in srgb, var(--phase-text) 10%, transparent)', color: 'var(--phase-text)' }}
                      >
                        J
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-xs" style={{ color: 'var(--phase-text)' }}>@jay</span>
                        <span className="text-xs ml-1" style={{ color: 'var(--phase-text)', opacity: 0.70 }}>This place is unreal every time 🔥</span>
                      </div>
                    </div>
                    <div className="flex gap-2 items-start">
                      <div 
                        className="w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center flex-shrink-0" 
                        style={{ backgroundColor: 'color-mix(in srgb, var(--phase-text) 10%, transparent)', color: 'var(--phase-text)' }}
                      >
                        M
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-xs" style={{ color: 'var(--phase-text)' }}>@maya</span>
                        <span className="text-xs ml-1" style={{ color: 'var(--phase-text)', opacity: 0.70 }}>The omakase is next level, go</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLikeToggle}
              className="flex items-center gap-1.5 text-[13px] font-medium transition-colors"
              style={!liked ? { color: 'var(--phase-text)', opacity: 0.50 } : { color: 'var(--phase-accent)' }}
            >
              <Heart 
                size={18} 
                strokeWidth={2} 
                fill={liked ? "currentColor" : "none"} 
                stroke="currentColor" 
              />
              {likeCount}
            </button>
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1.5 text-[13px] font-medium outline-none focus:outline-none"
              style={{ outline: 'none', boxShadow: 'none', color: 'var(--phase-text)', opacity: 0.50 }}
            >
              <MessageCircle size={18} strokeWidth={2} />
              {post.comments}
            </button>
          </div>

          {post.hasDrop && (
            <button 
              onClick={() => setClaimModalOpen(true)}
              className="flex items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: 'var(--phase-accent)' }}
            >
              <Ticket size={14} strokeWidth={2.5} />
              {post.dropLabel}
            </button>
          )}
        </div>
      </div>

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
