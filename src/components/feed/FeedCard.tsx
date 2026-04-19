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
      className="w-full border-b border-black/[0.08] bg-[#f2ece0]"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.caption}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#c4762a]/20 to-[#f2ece0] flex items-center justify-center">
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

      <div className="p-4">
        <div className="flex items-center justify-between">
          <Link href={`/profile/${post.creatorId}`} className="flex items-center gap-3 group transition-opacity active:opacity-70">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#c4762a] text-[12px] font-bold text-white uppercase group-hover:ring-2 group-hover:ring-[#c4762a]/20 overflow-hidden">
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
          
          {isOwner && (
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-[#1a1208]/40 hover:text-[#1a1208] p-2 -mr-2"
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

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[#1a1208]">
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
                <div className="w-7 h-7 rounded-full bg-[#c4762a] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                  {userInitial}
                </div>
                <input 
                  type="text" 
                  placeholder="Add a comment..."
                  className="bg-[rgba(26,18,8,0.04)] border border-black/[0.08] rounded-full px-4 py-2 text-sm flex-1 outline-none focus:outline-none"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
                />
              </div>
              
              <div className="mt-4 space-y-3 pb-2">
                {localComments.map((c, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <div className="w-6 h-6 rounded-full bg-[#c4762a]/10 text-[#c4762a] text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      {c.authorName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <span className="text-[#1a1208] font-semibold text-xs">@{c.authorName}</span>
                      <span className="text-[rgba(26,18,8,0.70)] text-xs ml-1">{c.text}</span>
                    </div>
                  </div>
                ))}
                
                {(post as any).source === 'editorial' && (
                  <>
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
              className="flex items-center gap-1.5 text-[13px] font-medium text-[#1a1208]/50 hover:text-[#1a1208] outline-none focus:outline-none"
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
