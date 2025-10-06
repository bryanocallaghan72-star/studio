
"use client";

import { appData, type Community } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ArrowLeft, Hash, Send } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";


const mockMessages = [
    { id: 1, author: 'Jay', avatar: 'https://github.com/jay.png', text: 'Just tried the new omakase at Raw Bar. Unbelievable! #tips' },
    { id: 2, author: 'Alice', avatar: 'https://github.com/alice.png', text: 'Anyone heading to Ravesis tonight? I\'m DJing from 10pm! #events' },
    { id: 3, author: 'You', avatar: 'https://github.com/you.png', text: 'Sounds awesome! What\'s the vibe like there on a Thursday?' },
    { id: 4, author: 'Shannon', avatar: 'https://github.com/shannon.png', text: 'Ravesis is always a good time! A bit boujee but the music is great.' },
    { id: 5, author: 'Lucas', avatar: 'https://github.com/lucas.png', text: 'I\'m working at The Corner House tonight, come say hi if you\'re around! Quieter vibe but great cocktails. #meetups' },
];


export function CommunityChat({ community }: { community: Community }) {
    const [activeChannel, setActiveChannel] = useState('general');

    const CategoryIcon = appData.categories[community.category]?.icon;

    return (
        <div className="flex h-full flex-col">
             <div className="flex items-center gap-4 border-b p-4">
                 <Link href="/community">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                {CategoryIcon && <CategoryIcon className="h-6 w-6 text-primary" />}
                <div>
                    <h2 className="text-xl font-bold tracking-tight">{community.name}</h2>
                    <p className="text-sm text-muted-foreground">{community.members} members</p>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                <div className="w-1/3 border-r bg-card/50 p-4">
                    <h3 className="text-sm font-semibold text-muted-foreground px-2 mb-2">Channels</h3>
                    <div className="space-y-1">
                        {community.channels.map(channel => (
                            <button 
                                key={channel} 
                                onClick={() => setActiveChannel(channel)}
                                className={cn(
                                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm font-medium",
                                    activeChannel === channel ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary'
                                )}
                            >
                                <Hash className="h-4 w-4"/>
                                {channel}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 flex flex-col">
                    <div className="flex-1 space-y-4 p-4 overflow-y-auto">
                        {mockMessages.map(message => (
                             <div key={message.id} className="flex items-start gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={message.author === 'You' ? 'https://github.com/user.png' : message.avatar} />
                                    <AvatarFallback>{message.author.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-sm">{message.author}</p>
                                    <div className="rounded-lg bg-secondary p-3 text-sm mt-1">
                                        <p>{message.text}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto flex items-center gap-2 border-t bg-background p-4">
                        <Input placeholder="Send a message..." className="flex-1 bg-secondary border-none focus-visible:ring-1 focus-visible:ring-primary"/>
                        <Button>
                            <Send className="h-5 w-5"/>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
