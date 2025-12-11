
'use client';

import { useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { appData } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Send, MoreVertical, X, Ticket, Building, ArrowLeft } from 'lucide-react';
import { CommentSheet, type Comment } from '@/components/iykyk/CommentSheet';
import { QRCodeDialog } from '@/components/iykyk/QRCodeDialog';

export default function SliceOfLifePostPage() {
    const params = useParams();
    const postId = params.postId as string;

    const post = appData.sliceOfLifePosts.find(p => p.id === postId);
    const creator = post ? appData.creators.find(c => c.id === post.creatorId) : null;
    const deal = post?.relatedDealId ? appData.hotItems.find(d => d.id === post.relatedDealId) : null;
    
    const [isLiked, setIsLiked] = useState(false);
    const [isCommentSheetOpen, setIsCommentSheetOpen] = useState(false);
    const [isQRDialogOpen, setQRDialogOpen] = useState(false);
    
    // Mock comments state
    const [localComments, setLocalComments] = useState<Comment[]>([]);
    const [commentCount, setCommentCount] = useState(post?.commentsCount || 0);

    if (!post || !creator) {
        notFound();
    }

    const likeCount = isLiked ? post.likes + 1 : post.likes;

    const handlePostComment = (commentText: string) => {
        setLocalComments([...localComments, { author: "You", text: commentText }]);
        setCommentCount(prev => prev + 1);
    };

    const handleClaim = () => {
        if (deal) {
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
                
                {/* Header */}
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

                {/* UI Overlay */}
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

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        {deal && (
                            <Button className="h-14 text-lg font-bold bg-primary text-primary-foreground" onClick={handleClaim}>
                                <Ticket className="mr-2"/>
                                Claim Perk
                            </Button>
                        )}
                        <Link href={`/venue/${post.venueId}`}>
                            <Button variant="outline" className="w-full h-14 text-lg font-bold bg-white/10 border-white/30 text-white backdrop-blur-md hover:bg-white/20">
                                <Building className="mr-2"/>
                                View Venue
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Social Actions */}
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

            {deal && (
                <QRCodeDialog
                    isOpen={isQRDialogOpen}
                    onOpenChange={setQRDialogOpen}
                    deal={deal}
                />
            )}
        </>
    );
}
