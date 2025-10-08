
"use client";
import { useState } from "react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Heart, MessageCircle, Send, MoreVertical, X } from "lucide-react";
import Image from "next/image";
import { CommentSheet } from "./CommentSheet";

const reelsData = [
  {
    id: 3,
    creator: {
      name: "SunsetChaser",
      avatar: "https://github.com/sunset.png",
    },
    description: "Bondi, you have my heart ❤️",
    imageId: "morning-1",
    likes: 15200,
    comments: 876,
    commentData: []
  },
];

const formatLikes = (likes: number) => {
    if (likes >= 1000) {
        return (likes / 1000).toFixed(1) + 'k';
    }
    return likes.toString();
}


const ReelPlayer = ({ reel }: { reel: (typeof reelsData)[0] }) => {
    const image = PlaceHolderImages.find((img) => img.id === reel.imageId);
    const [isLiked, setIsLiked] = useState(false);
    const [isCommentSheetOpen, setIsCommentSheetOpen] = useState(false);
    const likeCount = isLiked ? reel.likes + 1 : reel.likes;

    return (
        <>
        <div className="relative h-screen w-full snap-start flex-shrink-0">
             {image && (
                <Image 
                    src={image.imageUrl}
                    alt={image.description}
                    fill
                    className="object-cover"
                    data-ai-hint={image.imageHint}
                />
            )}
            <div className="absolute top-4 left-4 text-white font-bold text-lg z-10">
                iykyk
            </div>
            <div className="absolute top-4 right-4 z-10">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white">
                    <X />
                </Button>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            
            <div className="absolute bottom-20 left-0 p-4 text-white w-full z-10">
                <div className="flex items-center gap-3 mb-2">
                     <Avatar className="h-10 w-10 border-2 border-white">
                        <AvatarImage src={reel.creator.avatar} />
                        <AvatarFallback>{reel.creator.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="font-semibold">{reel.creator.name}</p>
                </div>
                <p className="text-sm">{reel.description}</p>
            </div>

            <div className="absolute bottom-24 right-2 flex flex-col items-center gap-5 text-white z-10">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-auto p-0 flex flex-col items-center hover:bg-transparent text-white hover:text-white"
                    onClick={() => setIsLiked(!isLiked)}
                >
                    <Heart className={`h-8 w-8 transition-all ${ isLiked ? "text-red-500 fill-current" : ""}`} />
                    <span className="text-xs font-semibold">{formatLikes(likeCount)}</span>
                </Button>
                 <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-auto p-0 flex flex-col items-center hover:bg-transparent text-white hover:text-white"
                    onClick={() => setIsCommentSheetOpen(true)}
                 >
                    <MessageCircle className="h-8 w-8"/>
                    <span className="text-xs font-semibold">{reel.comments}</span>
                </Button>
                 <Button variant="ghost" size="icon" className="h-auto p-0 flex flex-col items-center hover:bg-transparent text-white hover:text-white">
                    <Send className="h-8 w-8"/>
                </Button>
                <Button variant="ghost" size="icon" className="h-auto p-0 flex flex-col items-center hover:bg-transparent text-white hover:text-white">
                    <MoreVertical className="h-8 w-8"/>
                </Button>
            </div>
        </div>
        <CommentSheet 
            isOpen={isCommentSheetOpen}
            onOpenChange={setIsCommentSheetOpen}
            comments={reel.commentData}
            commentCount={reel.comments}
            onPostComment={() => {}}
        />
        </>
    )
}


export function Reels() {
    return (
        <div className="relative h-[calc(100vh)] w-full overflow-y-auto snap-y snap-mandatory scrollbar-hide">
            {reelsData.map((reel) => (
                <ReelPlayer key={reel.id} reel={reel} />
            ))}
        </div>
    )
}
