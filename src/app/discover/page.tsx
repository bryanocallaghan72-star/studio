
'use client';

import { useState, useTransition, useEffect, useMemo } from 'react';
import { Header } from "@/components/iykyk/Header";
import { MobileNav } from "@/components/iykyk/MobileNav";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Sparkles, Map, Flame, Tag, Calendar, Users, Gift, Loader2, Home, Compass } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SurpriseMe } from '@/components/iykyk/SurpriseMe';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { communityConnectorTool } from '@/ai/flows/community-connector-tool';
import type { CommunityConnectorOutput } from '@/ai/schemas';
import { Skeleton } from '@/components/ui/skeleton';

const PlaceHolderImages = [
    {
      "id": "coffee-1",
      "description": "A cozy coffee shop interior with warm lighting.",
      "imageUrl": "https://images.unsplash.com/photo-1511920183353-30a042785542?q=80&w=1974&auto=format&fit=crop",
      "imageHint": "coffee shop"
    },
    {
      "id": "sushi-1",
      "description": "A beautiful and delicious platter of assorted sushi.",
      "imageUrl": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=1948&auto=format&fit=crop",
      "imageHint": "sushi platter"
    },
    {
      "id": "nightlife-1",
      "description": "A stylish cocktail bar with a moody, ambient atmosphere.",
      "imageUrl": "https://images.unsplash.com/photo-1514362545857-3bc7dca2a145?q=80&w=1974&auto=format&fit=crop",
      "imageHint": "cocktail bar"
    },
    {
      "id": "fitness-1",
      "description": "A serene shot of a person doing yoga on the beach at sunrise.",
      "imageUrl": "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=2070&auto=format&fit=crop",
      "imageHint": "beach yoga"
    },
    {
      "id": "morning-1",
      "description": "The sun rising over a calm Bondi beach, casting a golden glow.",
      "imageUrl": "https://images.unsplash.com/photo-1600115010857-edbbc7e1efb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxiZWFjaCUyMHN1bnJpc2V8ZW58MHx8fHwxNzU5NTIxMzM0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "imageHint": "beach sunrise"
    },
    {
      "id": "morning-2",
      "description": "A vibrant and healthy acai bowl topped with fresh fruit.",
      "imageUrl": "https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxhY2FpJTIwYm93bHxlbnwwfHx8fDE3NTk1MzYxODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "imageHint": "acai bowl"
    },
    {
      "id": "night-1",
      "description": "An inviting, bustling restaurant at night with warm lights.",
      "imageUrl": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop",
      "imageHint": "restaurant night"
    },
    {
      "id": "night-2",
      "description": "The reflection of city lights shimmering on the water at night.",
      "imageUrl": "https://images.unsplash.com/photo-1542345339-2365319b5c37?q=80&w=1964&auto=format&fit=crop",
      "imageHint": "city lights"
    },
    {
      "id": "late-night-1",
      "description": "A vibrant neon sign glowing in a dark, late-night setting.",
      "imageUrl": "https://images.unsplash.com/photo-1573229676664-42b1b3d6c134?q=80&w=1974&auto=format&fit=crop",
      "imageHint": "neon sign"
    },
    {
      "id": "late-night-2",
      "description": "A street food vendor serving delicious food on a busy night street.",
      "imageUrl": "https://images.unsplash.com/photo-1563295281-563d3a04b8fc?q=80&w=1974&auto=format&fit=crop",
      "imageHint": "street food"
    },
    {
      "id": "hot-1",
      "description": "A lively, crowded beach on a sunny day.",
      "imageUrl": "https://images.unsplash.com/photo-1494336936582-73fd5e57b56d?q=80&w=2070&auto=format&fit=crop",
      "imageHint": "crowded beach"
    },
    {
      "id": "hot-2",
      "description": "A long queue of people waiting outside a trendy cafe.",
      "imageUrl": "https://images.unsplash.com/photo-1559197363-f6b1eeae2735?q=80&w=1974&auto=format&fit=crop",
      "imageHint": "cafe queue"
    },
    {
      "id": "deal-1",
      "description": "Two colorful cocktails sitting on a bar, part of a deal.",
      "imageUrl": "https://images.unsplash.com/photo-1551024709-8f23eda2c5a5?q=80&w=1974&auto=format&fit=crop",
      "imageHint": "cocktail deal"
    },
    {
      "id": "deal-2",
      "description": "A close-up of delicious-looking sushi rolls, suggesting a special offer.",
      "imageUrl": "https://images.unsplash.com/photo-1620802996453-dc7573a718f0?q=80&w=1964&auto=format&fit=crop",
      "imageHint": "sushi deal"
    },
    {
      "id": "my-day-1",
      "description": "A surfer skillfully riding a big wave.",
      "imageUrl": "https://images.unsplash.com/photo-1502680390409-69e067403c16?q=80&w=2070&auto=format&fit=crop",
      "imageHint": "surfing"
    },
    {
      "id": "my-day-2",
      "description": "A person peacefully reading a book in a lush, green park.",
      "imageUrl": "https://images.unsplash.com/photo-1524564532789-32948135a585?q=80&w=1974&auto=format&fit=crop",
      "imageHint": "park reading"
    },
    {
      "id": "my-day-3",
      "description": "A group of friends enjoying a sunny picnic in a park.",
      "imageUrl": "https://images.unsplash.com/photo-1559011494-a4f6693456b3?q=80&w=1974&auto=format&fit=crop",
      "imageHint": "friends picnic"
    },
    {
      "id": "my-day-4",
      "description": "A person shopping on a vibrant, bustling city street.",
      "imageUrl": "https://images.unsplash.com/photo-1525562723836-dca67a71d0ab?q=80&w=1974&auto=format&fit=crop",
      "imageHint": "street shopping"
    },
    {
      "id": "surprise-1",
      "description": "A hidden urban laneway covered in colorful street art.",
      "imageUrl": "https://images.unsplash.com/photo-1528747513221-1e9c8f3b068e?q=80&w=1974&auto=format&fit=crop",
      "imageHint": "street art"
    },
    {
      "id": "community-sushi",
      "description": "A group of friends sharing and enjoying a large platter of sushi.",
      "imageUrl": "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1925&auto=format&fit=crop",
      "imageHint": "friends sushi"
    },
    {
      "id": "community-cocktail",
      "description": "Friends toasting with colorful cocktails at a bar.",
      "imageUrl": "https://images.unsplash.com/photo-1608245849834-6657b399d36a?q=80&w=1974&auto=format&fit=crop",
      "imageHint": "cocktail toast"
    },
    {
      "id": "community-fitness",
      "description": "An outdoor group fitness class with people exercising together.",
      "imageUrl": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop",
      "imageHint": "group fitness"
    },
    {
      "id": "bondi-beach",
      "description": "A stunning aerial shot of the entire Bondi Beach coastline.",
      "imageUrl": "https://images.unsplash.com/photo-1590523278143-35a1a1d1375a?q=80&w=2070&auto=format&fit=crop",
      "imageHint": "Bondi beach"
    },
    {
      "id": "bondi-sunset",
      "description": "A beautiful sunset over Bondi Beach with vibrant colors.",
      "imageUrl": "https://images.unsplash.com/photo-1582875143873-a30226c6c9a3?q=80&w=2070&auto=format&fit=crop",
      "imageHint": "Bondi sunset"
    },
    {
      "id": "sunset-yoga",
      "description": "A silhouette of a person doing yoga against a stunning sunset.",
      "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120&auto=format&fit=crop",
      "imageHint": "sunset yoga"
    },
    {
      "id": "stay-1",
      "description": "A bright, modern living room in a beachside apartment with ocean views.",
      "imageUrl": "https://images.unsplash.com/photo-1615571022219-eb45cf7faa9d?q=80&w=2070&auto=format&fit=crop",
      "imageHint": "modern apartment"
    },
    {
      "id": "stay-2",
      "description": "A rooftop terrace with comfortable seating and city views at sunset.",
      "imageUrl": "https://images.unsplash.com/photo-1613553474176-2d559a721834?q=80&w=1974&auto=format&fit=crop",
      "imageHint": "rooftop terrace"
    },
    {
      "id": "stay-3",
      "description": "A lush, private garden with a small patio and seating area.",
      "imageUrl": "https://images.unsplash.com/photo-1589223789938-e3c386713c8f?q=80&w=1974&auto=format&fit=crop",
      "imageHint": "private garden"
    },
    {
      "id": "stay-4",
      "description": "A cozy and stylish studio apartment interior.",
      "imageUrl": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
      "imageHint": "studio apartment"
    }
  ]

const iconMap = {
    Sparkles,
    Map,
    Flame,
    Tag,
    Calendar,
    Users,
    Gift,
    Home,
    Compass
};

const featureData = [
    {
      href: "/map",
      icon: "Map",
      title: "iykyk Vibe",
      description: "Mood-based map for coffee, sushi, nightlife, and fitness.",
      color: "text-primary",
      imageId: "bondi-beach",
    },
    {
      href: "/flow",
      icon: "Compass",
      title: "iykyk Flow",
      description: "Discover the rhythm of your city through creators’ movements.",
      color: "text-indigo-500",
      imageId: "bondi-sunset",
    },
    {
      href: "/fire",
      icon: "Flame",
      title: "iykyk Fire",
      description: "Trending venues and creator hotspots updated daily.",
      color: "text-rose-500",
      imageId: "hot-1",
    },
    {
      href: "/deals",
      icon: "Tag",
      title: "iykyk Deals",
      description: "Exclusive offers and perks for locals and explorers.",
      color: "text-emerald-500",
      imageId: "deal-2",
    },
    {
      href: "/my-day",
      icon: "Calendar",
      title: "iykyk My Day",
      description: "Curated daily itinerary that you can shuffle like a playlist.",
      color: "text-primary",
      imageId: "my-day-3",
    },
    {
      href: "/stays",
      icon: "Home",
      title: "iykyk Stays",
      description: "Creator-approved Airbnb stays and local getaways.",
      color: "text-sky-500",
      imageId: "stay-2",
    },
];

const FeatureCardSkeleton = () => (
    <div className="bg-card h-48 w-full overflow-hidden rounded-xl">
        <Skeleton className="w-full h-full" />
    </div>
);

export default function DiscoverPage() {
  const [interests, setInterests] = useState('');
  const [pending, startTransition] = useTransition();
  const [communityResults, setCommunityResults] = useState<CommunityConnectorOutput | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleFindCommunity = () => {
    if (!interests) return;
    startTransition(async () => {
      const result = await communityConnectorTool({ interests });
      setCommunityResults(result);
    });
  };
  
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col pb-24">
        <div className="p-4 md:p-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight">What's the vibe today?</h2>
            <p className="text-muted-foreground mt-2">Your real-time cultural portal to Bondi.</p>
        </div>

        <div className="flex flex-col gap-4 px-4 md:px-6">
            {!isMounted ? (
                <>
                    <FeatureCardSkeleton />
                    <FeatureCardSkeleton />
                    <FeatureCardSkeleton />
                    <FeatureCardSkeleton />
                    <FeatureCardSkeleton />
                    <FeatureCardSkeleton />
                </>
            ) : (
                featureData.map((feature) => {
                      const image = PlaceHolderImages.find(img => img.id === feature.imageId);
                      const Icon = iconMap[feature.icon as keyof typeof iconMap];
                      return (
                        <Link key={feature.title} href={feature.href}>
                            <Card className="group relative w-full overflow-hidden rounded-xl transition-all hover:shadow-xl hover:-translate-y-1 bg-card h-48">
                                {image ? (
                                  <>
                                    <Image
                                      src={image.imageUrl}
                                      alt={feature.title}
                                      fill
                                      className="object-cover w-full h-full transition-transform group-hover:scale-105"
                                      data-ai-hint={image.imageHint}
                                    />
                                     <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                                  </>
                                ) : (
                                  <div className="absolute inset-0 bg-secondary" />
                                )}
                               
                                <div className="absolute bottom-0 left-0 p-6 w-full">
                                   <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-background/80 backdrop-blur-sm p-3">
                                           {Icon && <Icon className={`h-6 w-6 ${feature.color}`} />}
                                        </div>
                                        <div>
                                           <CardTitle className="text-lg text-white">{feature.title}</CardTitle>
                                           <CardDescription className="text-white/90">{feature.description}</CardDescription>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                      )
                    }
                )
            )}
        </div>

        <div className="px-4 md:px-6 mt-8 space-y-8">
            <Card>
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Gift className="h-8 w-8 text-accent" />
                        <h2 className="text-3xl font-bold tracking-tight">Surprise Me</h2>
                    </div>
                    <p className="text-muted-foreground">
                        Unlock hidden gems and spontaneous experiences with a single tap. A new adventure awaits!
                    </p>
                    <SurpriseMe />
                </div>
            </Card>

            <Card>
                <div className="p-6">
                     <div className="flex items-center gap-3 mb-4">
                        <Users className="h-8 w-8 text-primary" />
                        <h2 className="text-3xl font-bold tracking-tight">Community Connector</h2>
                    </div>
                    <p className="text-muted-foreground mb-4">
                        Find and connect with communities that share your interests. Your tribe is waiting for you.
                    </p>
                     <div className="flex gap-2">
                        <Input 
                            placeholder="e.g. coffee, live music, running" 
                            value={interests}
                            onChange={(e) => setInterests(e.target.value)}
                        />
                        <Button onClick={handleFindCommunity} disabled={pending}>
                            {pending ? <Loader2 className="animate-spin" /> : 'Find'}
                        </Button>
                    </div>

                    {communityResults && (
                        <div className="mt-6 space-y-4">
                            <h3 className='font-bold'>Top recommendations for you:</h3>
                            {communityResults.communities.map((community, index) => (
                                <div key={index} className="p-4 rounded-lg border bg-secondary/50">
                                    <h4 className="font-semibold">{community.name}</h4>
                                    <p className="text-sm text-muted-foreground">{community.description}</p>
                                    <p className="text-xs text-muted-foreground mt-1 capitalize">Activity: {community.activityLevel}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Card>
        </div>
      </main>
      <MobileNav />
    </div>
  );
}

    