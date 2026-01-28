
'use client';

import { useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { appData } from '@/lib/data';
import { HOT_ITEMS } from '@/data/seeds/drops';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Send, MoreVertical, X, Ticket, Building, ArrowLeft } from 'lucide-react';
import { CommentSheet, type Comment } from '@/components/iykyk/CommentSheet';
import { QRCodeDialog } from '@/components/iykyk/QRCodeDialog';
import { resolveVenueHref, findVenueByAnyId } from '@/lib/venueUtils';
import { useFirestore, useUser, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import { cn } from '@/lib/utils';

export default function SliceOfLifePostPage() {
    const params = useParams();
    const postId = params.postId as string;
    
    // 1. Find post and creator right away
    const post = appData.sliceOfLifePosts.find(p => p.id === postId);
    const creator = post ? appData.creators.find(c => c.id === post.creatorId) : null;

    // 2. Early exit if data is invalid. This prevents hooks from running with bad data.
    if (!post || !creator) {
        notFound();
    }

    // 3. All hooks are now safe to call below the validation gate.
    const firestore = useFirestore();
    const { user } = useUser();
    
    const deal = post.relatedDealId ? HOT_ITEMS.find(d => d.id === post.relatedDealId) : null;
    
    const venue = findVenueByAnyId(post.venueId);
    const venueHref = resolveVenueHref(venue);
    const attributedVenueHref = venueHref && post.creatorId ? `${venueHref}?creator=${post.creatorId}` : venueHref;

    const [isLiked, setIsLiked] = useState(false);
    const [isCommentSheetOpen, setIsCommentSheetOpen] = useState(false);
    const [isQRDialogOpen, setQRDialogOpen] = useState(false);
    const [localComments, setLocalComments] = useState<Comment[]>([]);
    const [commentCount, setCommentCount] = useState(post.commentsCount);

    const likeCount = isLiked ? post.likes + 1 : post.likes;

    // 4. Single, correct implementation of handlePostComment.
    const handlePostComment = (commentText: string) => {
        setLocalComments(prevComments => [...prevComments, { author: "You", text: commentText }]);
        setCommentCount(prevCount => prevCount + 1);
    };

    const handleClaim = () => {
        if (deal && venue) { // Ensure venue is found before claiming
            if (user && firestore && post.creatorId) {
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

    return (
        <>
            <div className="relative h-screen w-full snap-start flex-shrink-0 bg-black">
                <Image 
                    src={post.thumbnailUrl}
                    alt={post.title}
                    fill
                    className="object-cover opacity-50"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4">
                    <Link href="/feed" passHref>
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

                    <div className={cn("gap-3 grid", deal && attributedVenueHref ? "grid-cols-2" : "grid-cols-1")}>
                        {deal && (
                            <Button className="h-14 text-lg font-bold bg-primary text-primary-foreground" onClick={handleClaim} disabled={!user}>
                                <Ticket className="mr-2"/>
                                {user ? 'Claim Perk' : 'Sign in to Claim'}
                            </Button>
                        )}
                        
                        {attributedVenueHref && (
                            <Link href={attributedVenueHref}>
                                <Button variant="outline" className="w-full h-14 text-lg font-bold bg-white/10 border-white/30 text-white backdrop-blur-md hover:bg-white/20">
                                    <Building className="mr-2"/>
                                    View Venue
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                <div className="absolute bottom-40 right-4 flex flex-col items-center gap-5 text-white z-10 md:bottom-6">
                    <button className="flex flex-col items-center gap-1" onClick={() => setIsLiked(!isLiked)}>
                        <Heart className={`h-8 w-8 transition-all ${isLiked ? 'text-red-500 fill-current' : ''}`} />
                        <span className="text-xs font-semibold">{likeCount.toLocaleString()}</span>
                    </button>
                    <button className="flex flex-col items-center gap-1" onClick={() => setIsCommentSheetOpen(true)}>
                        <MessageCircle className="h-8 w-8" />
                        <span className="text-xs font-semibold">{commentCount.toLocaleString()}</span>
                    </button>
                    <button>
                        <Send className="h-8 w-8" />
                    </button>
                    <button>
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

