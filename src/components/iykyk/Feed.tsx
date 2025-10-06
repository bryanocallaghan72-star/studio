
"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import {
  Heart,
  MessageCircle,
  MoreVertical,
  PlayCircle,
  Send,
} from "lucide-react";
import Image from "next/image";
import { CommentSheet, type Comment } from "./CommentSheet";
import { appData } from "@/lib/data";


const Post = ({ item }: { item: (typeof appData.feedItems)[0] }) => {
  const image = PlaceHolderImages.find((img) => img.id === item.imageId);
  const [isLiked, setIsLiked] = useState(false);
  const [isCommentSheetOpen, setIsCommentSheetOpen] = useState(false);
  
  const [localComments, setLocalComments] = useState<Comment[]>(item.commentData);
  const [commentCount, setCommentCount] = useState(item.comments);

  const likeCount = isLiked ? item.likes + 1 : item.likes;

  const handlePostComment = (commentText: string) => {
    setLocalComments([...localComments, { author: "You", text: commentText }]);
    setCommentCount(prev => prev + 1);
  };

  return (
    <>
      <Card className="w-full max-w-lg mx-auto rounded-none border-x-0 border-t-0 sm:rounded-lg sm:border">
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-3">
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
            <button>
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>

          <div className="relative w-full aspect-square bg-secondary">
            {image && (
              <Image
                src={image.imageUrl}
                alt={image.description}
                fill
                className="object-cover"
                data-ai-hint={image.imageHint}
              />
            )}
            {item.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <PlayCircle className="h-16 w-16 text-white/80" />
              </div>
            )}
          </div>
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
