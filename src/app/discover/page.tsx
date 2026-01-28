
'use client';

import { MobileNav } from "@/components/iykyk/MobileNav";
import { Card, CardDescription, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { featureData } from '@/lib/features';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from "@/components/ui/button";
import { Sparkles, Map, Flame, Tag, Calendar, Users, Gift, Home, Compass, Zap, Shirt, Camera, Bed, Code, Utensils, Star, Wrench } from 'lucide-react';
import { SurpriseMe } from "@/components/iykyk/SurpriseMe";

const iconMap: { [key: string]: React.ElementType } = {
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
    Utensils,
    Star,
    Wrench,
};

export default function DiscoverPage() {

  return (
    <div className="discover-text-override flex min-h-screen w-full flex-col bg-background">
      
      <div className="flex flex-1 flex-col pb-24">
        <div className="p-4 md:p-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Your Cultural Concierge</h2>
            <p className="text-muted-foreground mt-2">Your real-time cultural portal to Bondi.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 px-4 md:px-6 md:grid-cols-2">
            {featureData.map((feature) => {
                const image = PlaceHolderImages.find(img => img.id === feature.imageId);
                const Icon = iconMap[feature.icon as keyof typeof iconMap];

                return (
                  <Link key={feature.title} href={feature.href}>
                      <Card className="group relative w-full overflow-hidden rounded-xl transition-all hover:shadow-xl hover:-translate-y-1 bg-card h-48 flex items-end justify-start">
                          {image ? (
                            <>
                              <Image
                                src={image.imageUrl}
                                alt={feature.title}
                                width={image.width}
                                height={image.height}
                                className="absolute inset-0 object-cover w-full h-full transition-transform group-hover:scale-105"
                                data-ai-hint={image.imageHint}
                              />
                               <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                            </>
                          ) : (
                            <div className="absolute inset-0 bg-secondary" />
                          )}
                         
                          <div className="relative z-10 p-4 w-full">
                             <div className="flex items-center gap-3">
                                  <div className="rounded-full bg-black/30 backdrop-blur-sm p-3">
                                     {Icon && <Icon className="h-6 w-6 icon-color" />}
                                  </div>
                                  <div>
                                     <CardTitle
                                        className="card-title text-lg font-semibold"
                                      >
                                        {feature.title}
                                      </CardTitle>
                                     <CardDescription
                                        className="card-description"
                                      >
                                        {feature.description}
                                      </CardDescription>
                                  </div>
                              </div>
                          </div>
                      </Card>
                  </Link>
                )
            })}
        </div>

        <div className="px-4 md:px-6 mt-8 space-y-8">
             <SurpriseMe />

            <Card>
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Camera className="h-8 w-8 text-purple-500" />
                        <h2 className="text-3xl font-bold tracking-tight">iykyk Lens</h2>
                    </div>
                    <p className="text-muted-foreground">
                        The future: an AR-powered view of your city's vibe.
                    </p>
                     <p className="text-sm font-semibold text-purple-500 mt-2">Walk to Unlock</p>
                    <Link href="/ar">
                        <Button variant="secondary" className="w-full bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 mt-4">
                           <Sparkles className="mr-2 h-5 w-5" />
                            Launch AR Mode
                        </Button>
                    </Link>
                </div>
            </Card>

            <div className="text-center">
                <Button asChild variant="outline">
                    <Link href="/admin">
                        <Wrench className="mr-2 h-4 w-4" />
                        Admin Panel
                    </Link>
                </Button>
            </div>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
