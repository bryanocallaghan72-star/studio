
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bed, Star } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { appData } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Link from 'next/link';

export function StaysList() {

    return (
        <section>
            <div className="flex items-center gap-3 mb-4">
                <Bed className="h-8 w-8 text-primary" />
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">iykyk Stays</h2>
                    <p className="text-muted-foreground">“From Map to Mattress — iykyk’s Got You.”</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-8">
                {appData.stays.map(stay => {
                    const image = PlaceHolderImages.find(img => img.id === stay.imageId);
                    const creator = appData.creators.find(c => c.id === stay.creatorId);
                    return (
                        <Card key={stay.id} className="group relative overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 rounded-2xl">
                             {image && (
                                <div className="relative h-64 w-full">
                                    <Image
                                        src={image.imageUrl}
                                        alt={stay.description}
                                        fill
                                        className="object-cover"
                                        data-ai-hint={image.imageHint}
                                    />
                                </div>
                            )}
                            <CardContent className="p-6 space-y-4">
                                <div>
                                    <h3 className="text-2xl font-bold">{stay.title}</h3>
                                    <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                        <span className="font-semibold text-foreground">{stay.rating}</span>
                                        <span>·</span>
                                        <span className="font-semibold text-foreground">${stay.pricePerNight}</span>
                                        <span>/ night</span>
                                     </div>
                                </div>
                                
                                <p className="text-muted-foreground italic">"{stay.description}"</p>

                                <div className='flex items-center justify-between'>
                                     {creator && (
                                        <Link href={`/profile/${creator.id}`} className='flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors w-fit'>
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={creator.avatar} alt={creator.name} />
                                                <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span>Recommended by @{creator.id}</span>
                                        </Link>
                                    )}
                                    <Button className="font-bold shadow-lg">
                                        Book Now
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </section>
    );
}
