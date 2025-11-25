
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
} from "lucide-react";
import { CommentSheet, type Comment } from "./CommentSheet";
import { appData } from "@/lib/data";
import Image from "next/image";
import { DEMO_VENUES } from "@/data/DemoVenues";

// Generate feed items from the new demo venues data
const feedItems = DEMO_VENUES.map((venue, index) => {
    // Assign a creator cyclically
    const creator = appData.creators[index % appData.creators.length];
    return {
        id: venue.id,
        type: "photo",
        creator: { id: creator.id, name: creator.name, avatar: creator.avatar },
        venue: venue.name,
        description: `Checked in at ${venue.name}. The vibe is ${venue.vibe}! ${venue.category} is a must-try.`,
        // Find a suitable image, fallback to a default
        image: venue.image || "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=1948&auto=format&fit=crop",
        likes: Math.floor(Math.random() * 500) + 50,
        comments: Math.floor(Math.random() * 50) + 5,
        commentData: []
    }
});


const Post = memo(({ item, priority }: { item: (typeof feedItems)[0], priority?: boolean }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isCommentSheetOpen, setIsCommentSheetOpen] = useState(false);
  
  const [localComments, setLocalComments] = useState<Comment[]>(item.commentData);
  const [commentCount, setCommentCount] = useState(item.comments);

  const likeCount = isLiked ? item.likes + 1 : item.likes;
  const creator = appData.creators.find(c => c.id === item.creator.id);


  const handlePostComment = (commentText: string) => {
    setLocalComments([...localComments, { author: "You", text: commentText }]);
    setCommentCount(prev => prev + 1);
  };

  const image = item.image;

  return (
    <>
      <Card className="w-full max-w-lg mx-auto rounded-none border-x-0 border-t-0 sm:rounded-lg sm:border">
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-3">
            {creator ? (
              <Link href={`/profile/${creator.id}`} className="flex items-center gap-3 group">
                <Avatar>
                  <AvatarImage src={creator.avatar} alt={creator.name} />
                  <AvatarFallback>
                    {creator.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm group-hover:underline">{creator.name}</p>
                  <p className="text-xs text-muted-foreground">{item.venue}</p>
                </div>
              </Link>
            ) : (
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={item.creator.avatar} alt={item.creator.name} />
                        <AvatarFallback>
                            {item.creator.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                     <div>
                        <p className="font-semibold text-sm">{item.creator.name}</p>
                        <p className="text-xs text-muted-foreground">{item.venue}</p>
                    </div>
                </div>
            )}
            <button>
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
          
          {image && (
            <div className="relative aspect-square w-full">
              <Image 
                src={image} 
                alt={item.venue}
                fill
                className="object-cover"
                priority={priority} 
              />
            </div>
          )}

          <div className="p-3 space-y-2">
            <div className="flex items-center justify-start gap-4">
                <button
                  className="flex items-center gap-2 hover:text-primary"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart
                    className={`h-6 w-6 transition-all ${
                      isLiked ? "text-red-500 fill-current" : ""
                    }`}
                  />
                </button>
                <button 
                  className="flex items-center gap-2 hover:text-primary"
                  onClick={() => setIsCommentSheetOpen(true)}
                >
                  <MessageCircle className="h-6 w-6" />
                </button>
                <button className="hover:text-primary">
                  <Send className="h-6 w-6" />
                </button>
            </div>
            <p className="text-sm font-semibold">
                {likeCount.toLocaleString()} likes
            </p>
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

Post.displayName = 'Post';

export function Feed() {
  return (
    <div className="flex flex-col w-full space-y-4">
      {feedItems.map((item, index) => (
        <Post key={item.id} item={item} priority={index < 2} />
      ))}
    </div>
  );
}
