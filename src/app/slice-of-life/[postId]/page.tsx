'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Send, MoreVertical, ArrowLeft, Ticket, Building, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { CommentSheet, type Comment } from '@/components/iykyk/CommentSheet';
import { QRCodeDialog } from '@/components/iykyk/QRCodeDialog';
import { resolveVenueHref, findVenueByAnyId } from '@/lib/venueUtils';
import { useFirestore, useUser, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { HOT_ITEMS } from '@/data/seeds/drops';
import { appData, type SliceOfLifePost } from '@/lib/data';
import { useSoundContext } from '@/context/SoundContext';

export default function SliceOfLifePostPage() {
    const params = useParams();
    // Safely read postId from params, accounting for null during SSR.
    const postId = params?.postId as string | undefined;
    
    const firestore = useFirestore();
    const { user } = useUser();
    const { playClick, playSuccess } = useSoundContext();
    
    // Find the post from the canonical mock data source.
    const post = useMemo(() => {
        if (!postId) return null;
        return (appData.sliceOfLifePosts as SliceOfLifePost[]).find(p => p.id === postId);
    }, [postId]);

    const [isLiked, setIsLiked] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [isCommentSheetOpen, setIsCommentSheetOpen] = useState(false);
    const [isQRDialogOpen, setQRDialogOpen] = useState(false);
    const [localComments, setLocalComments] = useState<Comment[]>([]);

    const commentCount = post ? post.commentsCount + localComments.length : 0;
    const likeCount = post ? (isLiked ? post.likes + 1 : post.likes) : 0;
    
    const { deal, venue, attributedVenueHref } = useMemo(() => {
        if (!post) return { deal: null, venue: null, attributedVenueHref: null };
        
        const deal = post.relatedDealId ? HOT_ITEMS.find(d => d.id === post.relatedDealId) : null;
        const venue = findVenueByAnyId(post.venueId);
        const venueHref = resolveVenueHref(post.venueId);
        const attributedHref = venueHref && post.creatorId ? `${venueHref}?creator=${post.creatorId}` : venueHref;
        
        return { deal, venue, attributedVenueHref: attributedHref };
    }, [post]);

    const handlePostComment = (commentText: string) => {
        setLocalComments(prevComments => [...prevComments, { author: "You", text: commentText }]);
    };

    const handleClaim = () => {
        playSuccess();
        if (deal && venue) {
            if (user && firestore && post?.creatorId) {
                const influenceRef = collection(firestore, 'users', post.creatorId, 'influencedActions');
                const influenceData = {
                    userId: user.uid,
                    actionType: 'claimDeal',
                    itemId: deal.id,
                    timestamp: new Date().toISOString(),
                };
                addDocumentNonBlocking(influenceRef, influenceData);
            }
            setQRDialogOpen(true);
        }
    }
    
    // Guard clause for SSR and invalid IDs
    if (!postId) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-black">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-black text-white p-4 text-center">
                <h2 className="text-2xl font-bold">Post Not Found</h2>
                <p className="mt-2 text-white/80">This slice of life may have been deleted or the link is incorrect.</p>
                <Link href="/feed" className="mt-6">
                    <Button variant="outline" className="bg-white/20 border-white/30 text-white backdrop-blur-md hover:bg-white/30">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Feed
                    </Button>
                </Link>
            </div>
        );
    }
    
    const creator = post.creator;

    return (
        <>
            <div className="relative h-screen w-full snap-start flex-shrink-0 bg-black">
                 {post.videoUrl ? (
                    <video
                        key={post.id}
                        src={post.videoUrl}
                        poster={post.thumbnailUrl}
                        autoPlay
                        loop
                        muted={isMuted}
                        playsInline
                        className="absolute top-0 left-0 h-full w-full object-cover"
                    />
                ) : (
                    post.thumbnailUrl && (
                        <Image
                            src={post.thumbnailUrl}
                            alt={post.title}
                            fill
                            className="object-cover opacity-60"
                            priority
                        />
                    )
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4">
                    <Link href="/feed">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                            <ArrowLeft />
                        </Button>
                    </Link>
                    <Link href="/discover">
                       <h1 className="text-2xl font-black tracking-tighter text-white">iykyk</h1>
                    </Link>
                    <div className="w-10" />
                </header>

                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-10">
                    <div className="space-y-3 mb-4">
                        <Badge variant="secondary" className="w-fit bg-white/20 border-white/30 text-white backdrop-blur-md">
                            {post.postType}
                        </Badge>
                        <h2 className="text-3xl font-bold tracking-tight">{post.title}</h2>
                        <Link href={`/profile/${creator.id}`} className="flex items-center gap-3 group">
                            <Avatar className="h-10 w-10 border-2 border-white/50 group-hover:border-white transition-colors">
                                <AvatarImage src={creator.avatar} />
                                <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-semibold group-hover:underline">@{creator.name}</span>
                        </Link>
                        <p className="text-white/80 text-base leading-relaxed line-clamp-3">
                            {post.description}
                        </p>
                    </div>

                    <div className={cn("gap-3 grid", post.postType === 'monetisable' && deal && attributedVenueHref ? "grid-cols-2" : "grid-cols-1")}>
                        {post.postType === 'monetisable' && deal && (
                            <Button className="h-14 text-lg font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/30" onClick={handleClaim} disabled={!user}>
                                <Ticket className="mr-2"/>
                                {user ? 'Claim Perk' : 'Sign in to Claim'}
                            </Button>
                        )}
                        
                        {attributedVenueHref ? (
                            <Link href={attributedVenueHref} onClick={playClick} className={cn(post.postType === 'discovery' && "col-span-2")}>
                                  <Button variant="outline" className="w-full h-14 text-lg font-bold bg-white/10 border-white/30 text-white backdrop-blur-md hover:bg-white/20">
                                      <Building className="mr-2"/>
                                      View Venue
                                  </Button>
                            </Link>
                        ) : (
                             <Button variant="outline" className="w-full h-14 text-lg font-bold bg-white/10 border-white/30 text-white backdrop-blur-md" disabled>
                                <Building className="mr-2"/>
                                Venue not live yet
                            </Button>
                        )}
                    </div>
                </div>

                <div className="absolute bottom-40 right-4 flex flex-col items-center gap-5 text-white z-10 md:bottom-6">
                    <button className="flex flex-col items-center gap-1" onClick={() => { playClick(); setIsLiked(!isLiked); }}>
                        <Heart className={`h-8 w-8 transition-all ${isLiked ? 'text-red-500 fill-current' : ''}`} />
                        <span className="text-xs font-semibold">{likeCount.toLocaleString()}</span>
                    </button>
                    <button className="flex flex-col items-center gap-1" onClick={() => { playClick(); setIsCommentSheetOpen(true); }}>
                        <MessageCircle className="h-8 w-8" />
                        <span className="text-xs font-semibold">{commentCount.toLocaleString()}</span>
                    </button>
                    <button className="flex flex-col items-center gap-1" onClick={() => { playClick(); setIsMuted(!isMuted); }}>
                         {isMuted ? <VolumeX className="h-8 w-8" /> : <Volume2 className="h-8 w-8" />}
                         <span className="text-xs font-semibold">{isMuted ? 'Mute' : 'Sound'}</span>
                    </button>
                    <button onClick={playClick}>
                        <Send className="h-8 w-8" />
                    </button>
                    <button onClick={playClick}>
                        <MoreVertical className="h-8 w-8" />
                    </button>
                </div>
            </div>
            
            <CommentSheet
                isOpen={isCommentSheetOpen}
                onOpenChange={setIsCommentSheetOpen}
                comments={localComments}
                commentCount={commentCount}
                onPostComment={handlePostComment}
            />

            {deal && venue && (
                <QRCodeDialog
                    isOpen={isQRDialogOpen}
                    onOpenChange={setQRDialogOpen}
                    deal={{...deal, venue: venue.name}}
                />
            )}
        </>
    );
}
