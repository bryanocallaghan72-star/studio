
'use client';

import { useState, useEffect } from 'react';
import { Header } from "@/components/iykyk/Header";
import { MobileNav } from "@/components/iykyk/MobileNav";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Sparkles, Map, Flame, Tag, Calendar, Users, Gift, Home, Compass } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SurpriseMe } from '@/components/iykyk/SurpriseMe';
import { featureData } from '@/lib/features';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Skeleton } from '@/components/ui/skeleton';

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

const FeatureCardSkeleton = () => (
    <div className="bg-card h-48 w-full overflow-hidden rounded-xl">
        <Skeleton className="w-full h-full" />
    </div>
);

export default function DiscoverPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col pb-24">
        <div className="p-4 md:p-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight">What's the vibe today?</h2>
            <p className="text-muted-foreground mt-2">Your real-time cultural portal to Bondi.</p>
        </div>

        <div className="flex flex-col gap-4 px-4 md:px-6">
            {!isMounted && featureData.map((feature) => <FeatureCardSkeleton key={feature.title} />)}
            {isMounted && featureData.map((feature) => {
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
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
