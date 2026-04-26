
'use client';

import { appData } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Send, MoreVertical, BookHeart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const { sliceOfLifePosts } = appData;

export function SliceOfLifeFeed() {
    return (
        <div className="relative h-screen w-full snap-y snap-mandatory overflow-y-scroll scrollbar-hide">
            <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
                <div className="flex items-center gap-2 text-white">
                    <BookHeart className="h-6 w-6"/>
                    <h1 className="text-xl font-bold tracking-tight">Slice of Life</h1>
                </div>
                <Link href="/discover">
                    <Button variant="outline" className="bg-white/20 border-white/30 text-white backdrop-blur-md hover:bg-white/30">
                        Exit
                    </Button>
                </Link>
            </header>
            
            {sliceOfLifePosts.map((post) => {
                const creator = post.creator;
                return (
                    <div key={post.id} className="relative h-screen w-full snap-start flex-shrink-0 bg-black">
                        {/* Video Player Placeholder */}
                        <Image 
                            src={post.thumbnailUrl}
                            alt={post.title}
                            fill
                            className="object-cover opacity-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/50" />
                        
                        {/* UI Overlay */}
                        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-10">
                            <div className="space-y-3">
                                <Badge variant="secondary" className="w-fit bg-white/20 border-white/30 text-white backdrop-blur-md">
                                    {post.postType}
                                </Badge>
                                <h2 className="text-3xl font-bold tracking-tight">{post.title}</h2>
                                <div className="flex items-center gap-3">
                                    <Link href={`/profile/${creator.id}`} className="flex items-center gap-3 group">
                                        <Avatar className="h-10 w-10 border-2 border-white/50 group-hover:border-white transition-colors">
                                            <AvatarImage src={creator.avatar} />
                                            <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-semibold group-hover:underline">@{creator.name}</span>
                                    </Link>
                                </div>
                                <p className="text-white/80 text-base leading-relaxed line-clamp-3">
                                    {post.description}
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="absolute bottom-6 right-6 flex flex-col items-center gap-6 text-white z-10">
                            <button className="flex flex-col items-center gap-1">
                                <Heart className="h-8 w-8" />
                                <span className="text-xs font-semibold">{post.likes}</span>
                            </button>
                            <button className="flex flex-col items-center gap-1">
                                <MessageCircle className="h-8 w-8" />
                                <span className="text-xs font-semibold">{post.commentsCount}</span>
                            </button>
                            <button>
                                <Send className="h-8 w-8" />
                            </button>
                             <button>
                                <MoreVertical className="h-8 w-8" />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
