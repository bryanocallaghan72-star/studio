
'use client';

import { useState, useTransition } from 'react';
import { Header } from "@/components/iykyk/Header";
import { MobileNav } from "@/components/iykyk/MobileNav";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Sparkles, Map, Flame, Ticket, Calendar, Users, Gift, Loader2, Bed } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { SurpriseMe } from '@/components/iykyk/SurpriseMe';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { communityConnectorTool } from '@/ai/flows/community-connector-tool';
import type { CommunityConnectorOutput } from '@/ai/schemas';

const featureData = [
  {
    href: "/map",
    icon: Map,
    title: "iykyk Vibe",
    description: "Mood-based map for coffee, sushi, nightlife, and fitness.",
    color: "text-primary",
    imageId: "bondi-beach",
    imageUrl: "https://images.unsplash.com/photo-1590523278143-35a1a1d1375a?q=80&w=2070&auto=format&fit=crop",
    imageHint: "Bondi beach"
  },
  {
    href: "/flow",
    icon: Sparkles,
    title: "iykyk Flow",
    description: "Time-of-day rhythm suggestions, from morning to late night.",
    color: "text-primary",
    imageId: "bondi-sunset",
  },
  {
    href: "/fire",
    icon: Flame,
    title: "iykyk Fire",
    description: "Real-time “What’s hot right now” with countdowns and FOMO.",
    color: "text-destructive",
    imageId: "hot-1",
  },
  {
    href: "/deals",
    icon: Ticket,
    title: "iykyk Deals",
    description: "Venue-linked offers, perks, and creator-powered funnels.",
    color: "text-accent",
    imageId: "deal-1",
  },
  {
    href: "/my-day",
    icon: Calendar,
    title: "iykyk My Day",
    description: "Curated daily itinerary that you can shuffle like a playlist.",
    color: "text-primary",
    imageId: "my-day-2",
  },
  {
    href: "/stays",
    icon: Bed,
    title: "iykyk Stays",
    description: "Curated boutique stays and local gems.",
    color: "text-primary",
    imageId: "stay-1",
  },
];


export default function DiscoverPage() {
  const [interests, setInterests] = useState('');
  const [pending, startTransition] = useTransition();
  const [communityResults, setCommunityResults] = useState<CommunityConnectorOutput | null>(null);

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
            {featureData.map((feature) => {
                  const image = feature.imageUrl ? { imageUrl: feature.imageUrl, imageHint: feature.imageHint } : PlaceHolderImages.find(img => img.id === feature.imageId);
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
                                       <feature.icon className={`h-6 w-6 ${feature.color}`} />
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

