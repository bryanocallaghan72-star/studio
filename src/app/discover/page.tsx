
'use client';

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { featureData } from '@/lib/features';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from "@/components/ui/button";
import { Gift, Camera, Sparkles, Map, Flame, Tag, Calendar, Users, Home, Compass, Zap, Shirt, Bed, Code } from 'lucide-react';
import { SurpriseMeButton } from "@/features/surprise/SurpriseMeButton";

const iconMap = {
    Sparkles,
    Map,
    Flame,
    Tag,
    Calendar,
    Users,
    Gift,
    Home,
    Compass,
    Zap,
    Shirt,
    Camera,
    Bed,
    Code,
};

export default function DiscoverPage() {

  return (
    <div className="flex flex-1 flex-col">
        <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Your Cultural Concierge</h2>
            <p className="text-muted-foreground mt-2">The lifestyle OS: Shuffle plans, unlock perks, and discover Bondi in real-time.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {featureData.map((feature) => {
                const image = PlaceHolderImages.find(img => img.id === feature.imageId);
                const Icon = iconMap[feature.icon as keyof typeof iconMap];

                return (
                  <Link key={feature.title} href={feature.href} passHref>
                      <Card className="group relative w-full h-40 overflow-hidden rounded-xl transition-all hover:shadow-xl hover:-translate-y-1 bg-card">
                          {image && (
                            <>
                              <Image
                                src={image.imageUrl}
                                alt={feature.title}
                                fill
                                className="absolute inset-0 object-cover w-full h-full transition-transform group-hover:scale-105"
                                data-ai-hint={image.imageHint}
                              />
                               <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                            </>
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
            })}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Gift className="h-8 w-8 text-accent" />
                        <h2 className="text-3xl font-bold tracking-tight">Surprise Me</h2>
                    </div>
                    <p className="text-muted-foreground">
                        Unlock hidden gems and spontaneous experiences with a single tap. A new adventure awaits!
                    </p>
                    <SurpriseMeButton />
                </div>
            </Card>

            <Card>
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Camera className="h-8 w-8 text-purple-500" />
                        <h2 className="text-3xl font-bold tracking-tight">iykyk Lens</h2>
                    </div>
                    <p className="text-muted-foreground">
                        The future: an AR-powered view of your city's vibe.
                    </p>
                    <Link href="/ar">
                        <Button variant="secondary" className="w-full bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 mt-4">
                           <Sparkles className="mr-2 h-5 w-5" />
                            Launch AR Mode
                        </Button>
                    </Link>
                </div>
            </Card>
        </div>
    </div>
  );
}
