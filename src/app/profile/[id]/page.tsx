
'use client';

import { useMemo } from 'react';
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Rss, Star, MapPin, Loader2 } from "lucide-react";
import { doc, collection } from 'firebase/firestore';

import { Header } from "@/components/iykyk/Header";
import { MobileNav } from "@/components/iykyk/MobileNav";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { appData } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function ProfilePage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !params.id) return null;
    return doc(firestore, 'users', params.id);
  }, [firestore, params.id]);

  const { data: userProfile, isLoading } = useDoc(userDocRef);

  // For the prototype, we'll show a few pins as their "favorite spots" or "pins".
  const creatorPins = appData.map.pins.slice(0, 9); 

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading Profile...</p>
      </div>
    );
  }

  if (!userProfile) {
    notFound();
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-8 p-4 md:p-6 pb-24">
        
        <Card className="overflow-hidden border-none shadow-none">
          <div className="relative h-40 w-full bg-secondary">
             <Image 
                src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop"
                alt={`${userProfile.username}'s banner`}
                fill
                className="object-cover"
                data-ai-hint="abstract gradient"
             />
          </div>
          <CardContent className="p-0">
            <div className="flex items-end gap-4 -mt-16 px-6">
              <Avatar className="h-28 w-28 border-4 border-background">
                <AvatarImage src={`https://github.com/${userProfile.username}.png`} alt={userProfile.username} />
                <AvatarFallback>{userProfile.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-grow pb-2">
                 <h1 className="text-2xl font-bold tracking-tight">{userProfile.username}</h1>
                 <p className="text-sm text-muted-foreground">@{userProfile.username}</p>
              </div>
            </div>
             <div className="px-6 mt-4 space-y-4">
                <p className="text-muted-foreground">{userProfile.bio || "No bio yet."}</p>
                <Button className="w-full md:w-auto">
                    <Rss className="mr-2 h-4 w-4" />
                    Follow
                </Button>
            </div>
          </CardContent>
        </Card>

        <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2">
                <Star className="text-accent"/>
                Pins
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {creatorPins.map(spot => {
                    const imageId = spot.type === 'Sushi' ? 'sushi-1' : spot.type === 'Nightlife' ? 'nightlife-1' : 'coffee-1';
                    const image = PlaceHolderImages.find(img => img.id === imageId);
                    return (
                        <Link key={spot.id} href={`/venue/${spot.slug}`}>
                            <Card className="group overflow-hidden relative aspect-square transition-all hover:shadow-xl hover:-translate-y-1">
                                {image && <>
                                    <Image 
                                        src={image.imageUrl}
                                        alt={spot.name}
                                        fill
                                        className="object-cover w-full h-full transition-transform group-hover:scale-105"
                                        data-ai-hint={image.imageHint}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                </>}
                                <div className="absolute bottom-0 left-0 p-3 w-full">
                                    <h3 className="font-semibold text-white text-sm line-clamp-1">{spot.name}</h3>
                                    <p className="text-xs text-white/80 flex items-center gap-1"><MapPin className="h-3 w-3"/>{spot.type}</p>
                                </div>
                            </Card>
                        </Link>
                    )
                })}
            </div>
        </section>

      </main>
      <MobileNav />
    </div>
  );
}
