
'use client';

import { useMemo, useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Rss, Star, MapPin, Loader2, Edit, TrendingUp, Users } from "lucide-react";
import { collection, doc } from 'firebase/firestore';

import { Header } from "@/components/iykyk/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDoc, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { useUser } from '@/firebase/auth/use-user';
import { appData } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { EditProfileDialog } from '@/components/iykyk/EditProfileDialog';
import { WithId } from '@/firebase/firestore/use-collection';

export function ProfilePageClient({ uid }: { uid: string }) {
  const { user: currentUser } = useUser();
  const firestore = useFirestore();

  const mockUserProfile = useMemo(() => {
    return appData.creators.find(creator => creator.id === uid);
  }, [uid]);

  const shouldFetchFirestore = !mockUserProfile;

  const userDocRef = useMemoFirebase(() => {
    if (!shouldFetchFirestore || !firestore || !uid) return null;
    return doc(firestore, 'users', uid);
  }, [firestore, uid, shouldFetchFirestore]);
  
  const influencedActionsQuery = useMemoFirebase(() => {
    if (!firestore || !uid) return null;
    return collection(firestore, 'users', uid, 'influencedActions');
  }, [firestore, uid]);

  const { data: firestoreUserProfile, isLoading: isFirestoreLoading } = useDoc<WithId<{ username: string; bio?: string }>>(userDocRef);
  const { data: influencedActions } = useCollection(influencedActionsQuery);
  
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  
  const userProfile = useMemo(() => {
    if (mockUserProfile) {
      return {
        isMock: true,
        id: mockUserProfile.id,
        username: mockUserProfile.name,
        bio: mockUserProfile.bio,
      };
    }
    if (firestoreUserProfile) {
      return { isMock: false, ...firestoreUserProfile };
    }
    return null;
  }, [mockUserProfile, firestoreUserProfile]);
  
  const userPins = useMemo(() => {
    return [...appData.map.pins].sort(() => 0.5 - Math.random()).slice(0, 3);
  }, [uid]);

  const isOwner = currentUser && currentUser.uid === uid;
  const isLoading = shouldFetchFirestore ? isFirestoreLoading : false;

  const influenceScore = influencedActions ? influencedActions.length : mockUserProfile ? Math.floor(Math.random() * 200 + 50) : 0;
  const followerCount = mockUserProfile ? Math.floor(Math.random() * 5000 + 1000) : 0;

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading Profile...</p>
      </div>
    );
  }

  if (!userProfile) {
    return (
       <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
        <h1 className="text-2xl font-bold">Profile Not Found</h1>
        <p className="text-muted-foreground">We couldn't find a user with that ID.</p>
        <Link href="/discover" className="mt-4">
          <Button>Go to Discover</Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col gap-8 p-4 md:p-6 pb-24">
        
        <Card className="overflow-hidden border-none shadow-none bg-transparent">
          <div className="relative h-40 w-full bg-secondary rounded-2xl">
             <Image 
                src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop"
                alt={`${userProfile.username}'s banner`}
                fill
                className="object-cover rounded-2xl"
                data-ai-hint="abstract gradient"
                priority
             />
          </div>
          <CardContent className="p-0">
            <div className="flex items-end gap-4 -mt-16 px-6">
              <Avatar className="h-28 w-28 border-4 border-background">
                <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${userProfile.username}`} alt={userProfile.username} />
                <AvatarFallback>{userProfile.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
             <div className="px-6 mt-4 space-y-4">
                 <div>
                    <h1 className="text-2xl font-bold tracking-tight">{userProfile.username}</h1>
                    <p className="text-sm text-muted-foreground">@{userProfile.isMock ? userProfile.id : userProfile.username}</p>
                 </div>
                <p className="text-muted-foreground">{userProfile.bio || "No bio yet."}</p>
                {isOwner && !userProfile.isMock ? (
                  <Button onClick={() => setEditDialogOpen(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                ) : !isOwner && (
                  <Button>
                      <Rss className="mr-2 h-4 w-4" />
                      Follow
                  </Button>
                )}
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Impact</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 rounded-lg border p-4">
                    <div className="p-3 rounded-full bg-primary/10">
                        <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{influenceScore}</p>
                        <p className="text-sm text-muted-foreground">Influence Score</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border p-4">
                    <div className="p-3 rounded-full bg-primary/10">
                        <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{followerCount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Followers</p>
                    </div>
                </div>
            </CardContent>
        </Card>


        <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2">
                <Star className="text-accent"/>
                Pins
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {userPins.map(spot => {
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
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
      {isOwner && !userProfile.isMock && firestoreUserProfile && (
         <EditProfileDialog 
          isOpen={isEditDialogOpen}
          onOpenChange={setEditDialogOpen}
          userProfile={firestoreUserProfile}
        />
      )}
    </>
  );
}
