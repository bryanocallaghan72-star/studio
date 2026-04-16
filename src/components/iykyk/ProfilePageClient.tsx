'use client';

import { useMemo, useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Rss, Star, MapPin, Loader2, Edit, Ticket, Users } from "lucide-react";
import { doc } from 'firebase/firestore';

import { Header } from "@/components/iykyk/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { useUser } from '@/firebase/auth/use-user';
import { appData } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { EditProfileDialog } from '@/components/iykyk/EditProfileDialog';
import { WithId } from '@/firebase/firestore/use-collection';
import { Skeleton } from '@/components/ui/skeleton';
import { useClaimedDeals } from '@/hooks/useClaimedDeals';
import { useCreators } from '@/hooks/useCreators';
import { CreatorInsights } from '@/components/iykyk/CreatorInsights';
import { cn } from '@/lib/utils';

// Update user profile type to include new optional fields
type UserProfile = WithId<{
  username: string;
  bio?: string;
  avatarUrl?: string;
  bannerUrl?: string;
}>;

export function ProfilePageClient({ uid }: { uid: string }) {
  const { user: currentUser } = useUser();
  const firestore = useFirestore();
  const [activeTab, setActiveTab] = useState<'Profile' | 'Insights'>('Profile');
  const [profileError, setProfileError] = useState(false);

  const { creatorsById } = useCreators();

  // Check if this is a known mock creator from our local data
  const mockUserProfile = useMemo(() => {
    return creatorsById[uid];
  }, [uid, creatorsById]);

  const isMockUser = !!mockUserProfile;
  const isOwner = currentUser && currentUser.uid === uid;
  const shouldFetchFirestore = !isMockUser;

  const userDocRef = useMemoFirebase(() => {
    // Defensively skip Firestore if it's a mock user or we have no DB instance
    if (!shouldFetchFirestore || !firestore || !uid) return null;
    return doc(firestore, 'users', uid);
  }, [firestore, uid, shouldFetchFirestore]);
  
  const { data: firestoreUserProfile, isLoading: isFirestoreLoading, error: firestoreError } = useDoc<UserProfile>(userDocRef);
  
  // Rules restrict claimedDeals to owners only. 
  // We gate the hook to avoid permission error crashes for visitors.
  const shouldFetchClaims = !isMockUser && isOwner;
  const { count: claimsCount, isLoading: isClaimsLoading, error: claimsError } = useClaimedDeals(shouldFetchClaims ? uid : undefined);
  
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  // Sync hook errors to local state to trigger fallbacks
  useEffect(() => {
    if (firestoreError || claimsError) {
      console.warn("Handled profile read error:", firestoreError || claimsError);
      setProfileError(true);
    }
  }, [firestoreError, claimsError]);
  
  const userProfile = useMemo(() => {
    // 1. Prioritize local mock data (e.g. /profile/alice)
    if (mockUserProfile) {
      return {
        isMock: true,
        id: mockUserProfile.id,
        username: mockUserProfile.name,
        bio: mockUserProfile.bio,
        avatarUrl: mockUserProfile.avatar,
        bannerUrl: undefined,
      };
    }
    // 2. Use real Firestore data if available
    if (firestoreUserProfile) {
      return { isMock: false, ...firestoreUserProfile };
    }
    // 3. Graceful fallback for non-existent real users or errors
    if (profileError || (!isFirestoreLoading && !firestoreUserProfile && shouldFetchFirestore)) {
        return {
            isMock: true,
            id: uid,
            username: isOwner 
              ? (currentUser?.displayName ?? currentUser?.email?.split('@')[0] ?? 'Bondi Local') 
              : 'Bondi Local',
            bio: 'Bondi local 🌊',
            avatarUrl: null,
            bannerUrl: undefined,
        };
    }
    return null;
  }, [mockUserProfile, firestoreUserProfile, profileError, isFirestoreLoading, shouldFetchFirestore, uid, isOwner, currentUser]);
  
  const userPins = useMemo(() => {
    return [...appData.map.pins].sort(() => 0.5 - Math.random()).slice(0, 3);
  }, [uid]);

  const isLoading = shouldFetchFirestore ? isFirestoreLoading : false;
  const followerCount = mockUserProfile ? Math.floor(Math.random() * 5000 + 1000) : 0;

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#f2ece0]">
        <Loader2 className="h-10 w-10 animate-spin text-[#c4762a]" />
        <p className="mt-4 text-[11px] font-bold text-[#c4762a] uppercase tracking-widest">Loading Profile...</p>
      </div>
    );
  }

  if (!userProfile) {
    return (
       <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#f2ece0] p-6 text-center">
        <h1 className="text-2xl font-bold text-[#1a1208]">Profile Not Found</h1>
        <p className="text-[13px] text-[rgba(26,18,8,0.50)] mt-2">We couldn't find a user with that ID.</p>
        <Link href="/discover" className="mt-8 w-full max-w-xs">
          <Button className="w-full h-12 bg-[#c4762a] rounded-2xl font-bold">Go to Discover</Button>
        </Link>
      </div>
    )
  }
  
  const renderImpactStats = () => {
    if (isClaimsLoading) {
      return (
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-[88px] w-full rounded-2xl" />
          <Skeleton className="h-[88px] w-full rounded-2xl" />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 rounded-2xl border border-black/[0.06] bg-white p-4">
              <div className="p-2.5 rounded-xl bg-[#c4762a]/10">
                  <Ticket className="h-5 w-5 text-[#c4762a]" />
              </div>
              <div>
                  <p className="text-xl font-black text-[#c4762a] leading-none">{claimsCount}</p>
                  <p className="text-[10px] font-bold text-[rgba(26,18,8,0.40)] uppercase tracking-tight mt-1">Claims</p>
              </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-black/[0.06] bg-white p-4">
              <div className="p-2.5 rounded-xl bg-[#c4762a]/10">
                  <Users className="h-5 w-5 text-[#c4762a]" />
              </div>
              <div>
                  <p className="text-xl font-black text-[#c4762a] leading-none">{followerCount.toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-[rgba(26,18,8,0.40)] uppercase tracking-tight mt-1">Followers</p>
              </div>
          </div>
      </div>
    );
  }

  const avatarImage = userProfile.avatarUrl || `https://api.dicebear.com/8.x/lorelei/svg?seed=${userProfile.username}`;

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f2ece0] p-4 md:p-6 pb-32">
      <main className="flex flex-1 flex-col gap-8 max-w-lg mx-auto w-full">
        
        {/* Profile Header Card */}
        <div className="space-y-0">
          <div 
            className="relative h-32 w-full rounded-t-3xl overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #1a1208 0%, #3d2a10 50%, #c4762a 100%)' }}
          >
             {userProfile.bannerUrl && (
               <Image 
                  src={userProfile.bannerUrl}
                  alt="Banner"
                  fill
                  className="object-cover"
                  priority
               />
             )}
          </div>
          <div className="bg-white border-x border-b border-black/[0.06] rounded-b-3xl p-6 relative">
            <div className="absolute -top-12 left-6">
              <Avatar className="h-24 w-24 border-[6px] border-white shadow-lg">
                <AvatarImage src={avatarImage} alt={userProfile.username} />
                <AvatarFallback className="text-2xl font-black">{userProfile.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex justify-end pt-2">
                {isOwner && !userProfile.isMock ? (
                  <Button onClick={() => setEditDialogOpen(true)} variant="outline" size="sm" className="h-9 rounded-xl border-black/[0.08] font-bold text-[13px]">
                    <Edit className="mr-2 h-3.5 w-3.5" />
                    Edit
                  </Button>
                ) : !isOwner && (
                  <Button size="sm" className="h-9 rounded-xl bg-[#c4762a] hover:bg-[#b06824] font-bold text-[13px] px-6">
                      <Rss className="mr-2 h-3.5 w-3.5" />
                      Follow
                  </Button>
                )}
            </div>
             <div className="mt-4 space-y-3">
                 <div>
                    <h1 className="text-2xl font-black tracking-tight text-[#1a1208] leading-tight">{userProfile.username}</h1>
                    <p className="text-[13px] font-bold text-[rgba(26,18,8,0.40)]">@{userProfile.isMock ? userProfile.id : userProfile.username}</p>
                 </div>
                <p className="text-[14px] leading-relaxed text-[rgba(26,18,8,0.65)]">{userProfile.bio || "No bio yet."}</p>
            </div>
          </div>
        </div>

        {/* Owner-Only Tab Toggle */}
        {isOwner && (
          <div className="flex justify-center w-full bg-[rgba(26,18,8,0.06)] rounded-full p-1 shadow-inner border border-black/[0.03]">
            <button 
              className={cn(
                "flex-1 px-4 py-2.5 rounded-full text-[13px] font-bold transition-all duration-300 outline-none focus:outline-none focus:ring-0 focus:shadow-none active:outline-none",
                activeTab === 'Profile' ? 'bg-white text-[#1a1208] shadow-sm border border-black/5' : 'text-[rgba(26,18,8,0.40)]'
              )} 
              style={{ outline: 'none', boxShadow: 'none' }}
              onClick={() => setActiveTab('Profile')}
            >
              Profile
            </button>
            <button 
              className={cn(
                "flex-1 px-4 py-2.5 rounded-full text-[13px] font-bold transition-all duration-300 outline-none focus:outline-none focus:ring-0 focus:shadow-none active:outline-none",
                activeTab === 'Insights' ? 'bg-white text-[#1a1208] shadow-sm border border-black/5' : 'text-[rgba(26,18,8,0.40)]'
              )} 
              style={{ outline: 'none', boxShadow: 'none' }}
              onClick={() => setActiveTab('Insights')}
            >
              Insights
            </button>
          </div>
        )}

        {/* Conditional Tab Rendering */}
        {isOwner && activeTab === 'Insights' ? (
          <CreatorInsights creatorId={uid} />
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500 slide-in-from-bottom-2">
            <section className="space-y-4">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-[rgba(26,18,8,0.40)]">Impact</h2>
                {renderImpactStats()}
            </section>

            <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-[rgba(26,18,8,0.40)]">Pinned Vibes</h2>
                  <Badge variant="outline" className="border-black/[0.08] text-[10px] font-bold text-[rgba(26,18,8,0.40)]">
                    {userPins.length} SPOTS
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {userPins.map(spot => {
                        const typeToImageId: Record<string, string> = {
                          'Sushi': 'sushi-1',
                          'Nightlife': 'nightlife-1',
                          'Brunch': 'coffee-1',
                          'Vibes': 'morning-1'
                        };
                        const imageId = typeToImageId[spot.type] || 'morning-1';
                        const image = PlaceHolderImages.find(img => img.id === imageId);
                        return (
                            <Link key={spot.id} href={`/venue/${spot.slug}`}>
                                <Card className="group overflow-hidden relative aspect-square transition-all hover:shadow-lg border-none rounded-2xl bg-white">
                                    {image && <>
                                        <Image 
                                            src={image.imageUrl}
                                            alt={spot.name}
                                            fill
                                            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                                            data-ai-hint={image.imageHint}
                                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                    </>}
                                    <div className="absolute bottom-0 left-0 p-4 w-full">
                                        <h3 className="font-bold text-white text-[13px] line-clamp-1 leading-tight">{spot.name}</h3>
                                        <p className="text-[10px] font-bold text-white/60 flex items-center gap-1 uppercase tracking-tight mt-0.5"><MapPin className="h-2.5 w-2.5"/>{spot.type}</p>
                                    </div>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
            </section>
          </div>
        )}

      </main>
      {isOwner && !userProfile.isMock && firestoreUserProfile && (
         <EditProfileDialog 
          isOpen={isEditDialogOpen}
          onOpenChange={setEditDialogOpen}
          userProfile={firestoreUserProfile}
        />
      )}
    </div>
  );
}
