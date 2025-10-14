
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Shirt, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { appData } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Link from 'next/link';
import { Badge } from "../ui/badge";

export function StyleList() {
    return (
        <section>
            <div className="flex items-center gap-3 mb-4">
                <Shirt className="h-8 w-8 text-primary" />
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">iykyk Style</h2>
                    <p className="text-muted-foreground">The definitive guide to Bondi's fashion scene.</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {appData.styleItems.map(item => {
                    const image = PlaceHolderImages.find(img => img.id === item.imageId);
                    const creator = item.creatorId ? appData.creators.find(c => c.id === item.creatorId) : null;
                    return (
                        <Card key={item.id} className="group relative overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 rounded-2xl">
                             {image && (
                                <div className="relative h-80 w-full">
                                    <Image
                                        src={image.imageUrl}
                                        alt={item.description}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                        data-ai-hint={image.imageHint}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                </div>
                            )}
                             <CardContent className="absolute bottom-0 left-0 w-full p-6 text-white">
                                <Badge variant="secondary" className="mb-2">{item.category}</Badge>
                                <h3 className="text-2xl font-bold">{item.title}</h3>
                                <p className="text-white/90 mt-1">{item.description}</p>
                                
                                <div className='flex items-center justify-between mt-4'>
                                     {creator && (
                                        <Link href={`/profile/${creator.id}`} className='flex items-center gap-2 text-sm font-semibold text-white hover:text-primary transition-colors w-fit'>
                                            <Avatar className="h-8 w-8 border-2 border-white">
                                                <AvatarImage src={creator.avatar} alt={creator.name} />
                                                <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span>@{creator.id}'s pick</span>
                                        </Link>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </section>
    );
}
