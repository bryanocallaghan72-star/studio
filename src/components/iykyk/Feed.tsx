
"use client";

import { useState } from "react";
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
import { PlaceHolderImages } from "@/lib/placeholder-images";


const Post = ({ item }: { item: (typeof appData.feedItems)[0] }) => {
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

  const image = PlaceHolderImages.find(img => img.id === item.imageId);

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
                src={image.imageUrl} 
                alt={item.venue}
                fill
                className="object-cover"
                data-ai-hint={image.imageHint}
                priority={item.id < 3} 
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
};

export function Feed() {
  return (
    <div className="flex flex-col w-full space-y-4">
      {appData.feedItems.map((item) => (
        <Post key={item.id} item={item} />
      ))}
    </div>
  );
}
