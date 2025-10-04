"use client";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Heart, MessageCircle, Send, MoreVertical } from "lucide-react";
import Image from "next/image";

const reelsData = [
  {
    id: 1,
    creator: {
      name: "BondiBarista",
      avatar: "https://github.com/barista.png",
    },
    description: "The perfect pour this morning ☕️",
    imageId: "coffee-1",
    likes: "1.2k",
    comments: "48",
  },
  {
    id: 2,
    creator: {
      name: "CocktailKing",
      avatar: "https://github.com/cocktail.png",
    },
    description: "Shaking things up tonight! 🍸 #iykyk",
    imageId: "nightlife-1",
    likes: "3.5k",
    comments: "102",
  },
  {
    id: 3,
    creator: {
      name: "SunsetChaser",
      avatar: "https://github.com/sunset.png",
    },
    description: "Bondi, you have my heart ❤️",
    imageId: "morning-1",
    likes: "15.2k",
    comments: "876",
  },
    {
    id: 4,
    creator: {
      name: "StreetArtExplorer",
      avatar: "https://github.com/art.png",
    },
    description: "Found this hidden gem in the laneways.",
    imageId: "surprise-1",
    likes: "8.9k",
    comments: "341",
  },
];


const ReelPlayer = ({ reel }: { reel: (typeof reelsData)[0] }) => {
    const image = PlaceHolderImages.find((img) => img.id === reel.imageId);

    return (
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 p-4 text-white w-full">
                <div className="flex items-center gap-2 mb-2">
                     <Avatar className="h-9 w-9 border-2 border-white">
                        <AvatarImage src={reel.creator.avatar} />
                        <AvatarFallback>{reel.creator.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="font-semibold">{reel.creator.name}</p>
                </div>
                <p className="text-sm">{reel.description}</p>
            </div>

            <div className="absolute bottom-20 right-2 flex flex-col items-center gap-4 text-white">
                <Button variant="ghost" size="icon" className="h-auto p-0 flex flex-col items-center hover:bg-transparent text-white hover:text-white">
                    <Heart className="h-8 w-8"/>
                    <span className="text-xs font-semibold">{reel.likes}</span>
                </Button>
                 <Button variant="ghost" size="icon" className="h-auto p-0 flex flex-col items-center hover:bg-transparent text-white hover:text-white">
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
    )
}


export function Reels() {
    return (
        <div className="relative h-screen w-full overflow-y-scroll snap-y snap-mandatory">
            {reelsData.map((reel) => (
                <ReelPlayer key={reel.id} reel={reel} />
            ))}
        </div>
    )
}
