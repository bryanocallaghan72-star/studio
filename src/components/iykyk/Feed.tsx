
"use client";

import { useState, memo } from "react";
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  MessageCircle,
  MoreVertical,
  Send,
  BookHeart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CommentSheet, type Comment } from "./CommentSheet";
import { appData } from "@/lib/data";
import Image from "next/image";
import { DEMO_VENUES } from "@/data/DemoVenues";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const formatLikes = (likes: number) => {
    if (likes >= 1000) {
        return (likes / 1000).toFixed(1) + 'k';
    }
    return likes.toString();
}

// Individual Post Components for each type

const PhotoPost = memo(({ item, priority }: { item: any, priority?: boolean }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isCommentSheetOpen, setIsCommentSheetOpen] = useState(false);
  
  const [localComments, setLocalComments] = useState<Comment[]>(item.commentData || []);
  const [commentCount, setCommentCount] = useState(item.comments || 0);

  const likeCount = isLiked ? item.likes + 1 : item.likes;
  const creator = appData.creators.find(c => c.id === item.creator.id);
  const image = PlaceHolderImages.find(img => img.id === item.imageId);

  const handlePostComment = (commentText: string) => {
    setLocalComments([...localComments, { author: "You", text: commentText }]);
    setCommentCount(prev => prev + 1);
  };

  return (
    <>
      <Card className="w-full max-w-lg mx-auto rounded-none border-x-0 border-t-0 sm:rounded-lg sm:border">
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-3">
            {creator ? (
              <Link href={`/profile/${creator.id}`} className="flex items-center gap-3 group">
                <Avatar>
                  <AvatarImage src={creator.avatar} alt={creator.name} />
                  <AvatarFallback>{creator.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm group-hover:underline">{creator.name}</p>
                  <p className="text-xs text-muted-foreground">{item.venue}</p>
                </div>
              </Link>
            ) : null}
            <button><MoreVertical className="h-5 w-5" /></button>
          </div>
          
          {image && (
            <div className="relative aspect-square w-full">
              <Image 
                src={image.imageUrl} 
                alt={item.venue || 'Feed post'}
                fill
                className="object-cover"
                priority={priority} 
              />
            </div>
          )}

          <div className="p-3 space-y-2">
            <div className="flex items-center justify-start gap-4">
                <button className="flex items-center gap-2 hover:text-primary" onClick={() => setIsLiked(!isLiked)}>
                  <Heart className={`h-6 w-6 transition-all ${isLiked ? "text-red-500 fill-current" : ""}`} />
                </button>
                <button className="flex items-center gap-2 hover:text-primary" onClick={() => setIsCommentSheetOpen(true)}>
                  <MessageCircle className="h-6 w-6" />
                </button>
                <button className="hover:text-primary"><Send className="h-6 w-6" /></button>
            </div>
            <p className="text-sm font-semibold">{likeCount.toLocaleString()} likes</p>
             <p className="text-sm">
              <span className="font-semibold">{creator?.name || item.creator.name}</span>
              <span className="ml-1">{item.description}</span>
            </p>
            {commentCount > 0 && (
                <button className="text-sm text-muted-foreground" onClick={() => setIsCommentSheetOpen(true)}>
                    View all {commentCount} comments
                </button>
            )}
          </div>
        </CardContent>
      </Card>
      <CommentSheet
        isOpen={isCommentSheetOpen}
        onOpenChange={setIsCommentSheetOpen}
        comments={localComments}
        commentCount={commentCount}
        onPostComment={handlePostComment}
      />
    </>
  );
});
PhotoPost.displayName = 'PhotoPost';


const ReelPost = memo(({ item, priority }: { item: any, priority?: boolean }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isCommentSheetOpen, setIsCommentSheetOpen] = useState(false);
    const likeCount = isLiked ? item.likes + 1 : item.likes;
    const image = PlaceHolderImages.find(img => img.id === item.imageId);

    return (
    <>
      <Card className="w-full max-w-lg mx-auto rounded-none border-x-0 border-t-0 sm:rounded-lg sm:border overflow-hidden">
        <div className="relative aspect-[9/16] w-full">
            <video 
                src={item.videoUrl}
                poster={image?.imageUrl}
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4 text-white w-full z-10">
                <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-10 w-10 border-2 border-white">
                        <AvatarImage src={item.creator.avatar} />
                        <AvatarFallback>{item.creator.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="font-semibold">{item.creator.name}</p>
                </div>
                <p className="text-sm">{item.description}</p>
            </div>
             <div className="absolute bottom-4 right-2 flex flex-col items-center gap-5 text-white z-10">
                <button className="flex flex-col items-center" onClick={() => setIsLiked(!isLiked)}>
                    <Heart className={`h-8 w-8 transition-all ${ isLiked ? "text-red-500 fill-current" : ""}`} />
                    <span className="text-xs font-semibold">{formatLikes(likeCount)}</span>
                </button>
                <button className="flex flex-col items-center" onClick={() => setIsCommentSheetOpen(true)}>
                    <MessageCircle className="h-8 w-8"/>
                    <span className="text-xs font-semibold">{item.comments}</span>
                </button>
                <button><Send className="h-8 w-8"/></button>
            </div>
        </div>
      </Card>
      <CommentSheet 
        isOpen={isCommentSheetOpen}
        onOpenChange={setIsCommentSheetOpen}
        comments={item.commentData}
        commentCount={item.comments}
        onPostComment={() => {}}
    />
    </>
    )
});
ReelPost.displayName = 'ReelPost';

const StoryPost = memo(({ item, priority }: { item: any, priority?: boolean }) => {
    const [isLiked, setIsLiked] = useState(false);
    const likeCount = isLiked ? item.likes + 1 : item.likes;

    return (
       <Card className="w-full max-w-lg mx-auto rounded-none border-x-0 border-t-0 sm:rounded-lg sm:border overflow-hidden">
          <div className="relative aspect-[9/16] w-full bg-black">
              <Image 
                  src={item.thumbnailUrl}
                  alt={item.title}
                  fill
                  className="object-cover opacity-60"
                  priority={priority}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/50" />
              
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-10">
                  <div className="space-y-3">
                      <Badge variant="secondary" className="w-fit bg-white/20 border-white/30 text-white backdrop-blur-md">
                          <BookHeart className="h-4 w-4 mr-2"/>
                          {item.postType}
                      </Badge>
                      <h2 className="text-3xl font-bold tracking-tight">{item.title}</h2>
                      <div className="flex items-center gap-3">
                          {item.creator && (
                              <Link href={`/profile/${item.creator.id}`} className="flex items-center gap-3 group">
                                  <Avatar className="h-10 w-10 border-2 border-white/50 group-hover:border-white transition-colors">
                                      <AvatarImage src={item.creator.avatar} />
                                      <AvatarFallback>{item.creator.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <span className="font-semibold group-hover:underline">@{item.creator.name}</span>
                              </Link>
                          )}
                      </div>
                      <p className="text-white/80 text-base leading-relaxed line-clamp-3">
                          {item.description}
                      </p>
                  </div>
              </div>

               <div className="absolute bottom-6 right-6 flex flex-col items-center gap-6 text-white z-10">
                  <button className="flex flex-col items-center gap-1" onClick={() => setIsLiked(!isLiked)}>
                      <Heart className={`h-8 w-8 transition-all ${isLiked ? 'text-red-500 fill-current' : ''}`} />
                      <span className="text-xs font-semibold">{item.likes}</span>
                  </button>
                  <button className="flex flex-col items-center gap-1">
                      <MessageCircle className="h-8 w-8" />
                      <span className="text-xs font-semibold">{item.commentsCount}</span>
                  </button>
                  <button><Send className="h-8 w-8" /></button>
              </div>
          </div>
       </Card>
    );
});
StoryPost.displayName = 'StoryPost';


export function Feed() {
  return (
    <div className="flex flex-col w-full space-y-4">
      {appData.feedItems.map((item, index) => {
        if (item.type === 'photo') {
            return <PhotoPost key={item.id} item={item} priority={index < 2} />
        }
        if (item.type === 'reel') {
            return <ReelPost key={item.id} item={item} priority={index < 2} />
        }
        if (item.type === 'story') {
             return <StoryPost key={item.id} item={item} priority={index < 2} />
        }
        return null;
      })}
    </div>
  );
}
