
'use client';

import { useState, useTransition } from 'react';
import { Header } from "@/components/iykyk/Header";
import { MobileNav } from "@/components/iykyk/MobileNav";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Sparkles, Map, Flame, Ticket, Calendar, Gift, Users, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { SurpriseMe } from '@/components/iykyk/SurpriseMe';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { communityConnectorTool } from '@/ai/flows/community-connector-tool';
import { Badge } from '@/components/ui/badge';

const features = [
  {
    href: "/map",
    icon: Map,
    title: "iykyk Vibe",
    description: "Mood-based map for coffee, sushi, nightlife, and fitness.",
    color: "text-primary",
    imageId: "bondi-beach",
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
];


const CommunityConnector = () => {
    const [isPending, startTransition] = useTransition();
    const [interests, setInterests] = useState('');
    const [results, setResults] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!interests) {
            setError("Please enter your interests.");
            return;
        }
        setError(null);
        setResults(null);
        startTransition(async () => {
            const res = await communityConnectorTool({ interests });
            if (res.communities) {
                setResults(res);
            } else {
                setError("Could not find communities. Please try again.");
            }
        });
    }

    return (
        <Card className="w-full bg-card shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-3">
                       <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                       <CardTitle className="text-lg">Community Connector</CardTitle>
                       <CardDescription>Find your tribe. Tell us what you're into.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <Input 
                        placeholder="e.g., sushi, live music, running"
                        value={interests}
                        onChange={(e) => setInterests(e.target.value)}
                        disabled={isPending}
                    />
                    <Button type="submit" disabled={isPending}>
                        {isPending ? <Loader2 className="animate-spin" /> : 'Find'}
                    </Button>
                </form>
                 {error && <p className="text-destructive text-sm mt-2">{error}</p>}
                 {results && results.communities && (
                    <div className="mt-4 space-y-3">
                        <h3 className="font-semibold">Top 3 recommendations for you:</h3>
                        {results.communities.map(community => (
                            <div key={community.name} className="p-3 rounded-lg border bg-secondary/50">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-bold">{community.name}</h4>
                                    <Badge variant="outline">{community.activityLevel} activity</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{community.description}</p>
                            </div>
                        ))}
                    </div>
                 )}
            </CardContent>
        </Card>
    )
}

export default function DiscoverPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col pb-24">
        <div className="p-4 md:p-6 text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tight">What's the vibe today?</h2>
            <p className="text-muted-foreground mt-2">Your real-time cultural portal to Bondi.</p>
        </div>

        <div className="flex flex-col gap-4 px-4 md:px-6">
            {features.map((feature) => {
              const image = PlaceHolderImages.find(img => img.id === feature.imageId);
              return (
                <Link key={feature.title} href={feature.href}>
                    <Card className="group relative w-full overflow-hidden rounded-xl transition-all hover:shadow-xl hover:-translate-y-1 bg-card h-48">
                        {image && (
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
            )})}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 md:px-6 mt-4">
             <Card className="w-full bg-card shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-accent/10 p-3">
                           <Gift className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                           <CardTitle className="text-lg">Surprise Me</CardTitle>
                           <CardDescription>Unlock a hidden gem. Tap to reveal.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <SurpriseMe />
                </CardContent>
            </Card>
            <CommunityConnector />
        </div>
      </main>
      <MobileNav />
    </div>
  );
}

    