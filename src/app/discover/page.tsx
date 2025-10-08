
'use client';

import { Header } from "@/components/iykyk/Header";
import { MobileNav } from "@/components/iykyk/MobileNav";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, Map, Flame, Ticket, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

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
      </main>
      <MobileNav />
    </div>
  );
}
