
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
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const feedItems = [
  {
    id: 1,
    type: "photo",
    creator: {
      name: "BondiCreator1",
      avatar: "https://github.com/shadcn.png",
    },
    venue: "The Beachcomber Bar",
    imageId: "deal-1",
    likes: 124,
    comments: 12,
  },
  {
    id: 2,
    type: "video",
    creator: {
      name: "SurferDude",
      avatar: "https://github.com/surferdude.png",
    },
    venue: "Bondi Beach",
    imageId: "my-day-1",
    likes: 345,
    comments: 45,
  },
  {
    id: 3,
    type: "photo",
    creator: {
      name: "FoodieGal",
      avatar: "https://github.com/foodie.png",
    },
    venue: "Sakura Sushi",
    imageId: "deal-2",
    likes: 210,
    comments: 33,
  },
  {
    id: 4,
    type: "photo",
    creator: {
      name: "SunriseYoga",
      avatar: "https://github.com/yoga.png",
    },
    venue: "Bondi Beach",
    imageId: "morning-1",
    likes: 501,
    comments: 67,
  },
];

const Post = ({ item }: { item: (typeof feedItems)[0] }) => {
  const image = PlaceHolderImages.find((img) => img.id === item.imageId);
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState("");

  return (
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="flex items-center gap-2 hover:text-primary"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart
                  className={`h-6 w-6 transition-all ${
                    isLiked ? "text-red-500 fill-current" : ""
                  }`}
                />
                <span className="text-sm font-semibold">
                  {isLiked ? item.likes + 1 : item.likes}
                </span>
              </button>
              <button className="flex items-center gap-2 hover:text-primary">
                <MessageCircle className="h-6 w-6" />
                <span className="text-sm font-semibold">{item.comments}</span>
              </button>
              <button className="hover:text-primary">
                <Send className="h-6 w-6" />
              </button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            View all {item.comments} comments
          </p>
          <div className="flex items-center gap-2 pt-2">
            <Avatar className="h-6 w-6">
                <AvatarImage src="https://github.com/user.png" />
                <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <Input 
                placeholder="Add a comment..." 
                className="h-8 text-xs bg-transparent border-0 border-b rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
             {comment && <Button variant="ghost" size="sm" className="text-xs text-primary">Post</Button>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function Feed() {
  return (
    <div className="flex flex-col w-full space-y-4">
      {feedItems.map((item) => (
        <Post key={item.id} item={item} />
      ))}
    </div>
  );
}
