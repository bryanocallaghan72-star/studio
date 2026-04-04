'use client';

import { MobileNav } from "@/components/iykyk/MobileNav";
import { Card, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { featureData } from '@/lib/features';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from "@/components/ui/button";
import { Sparkles, Map, Flame, Tag, Calendar, Users, Gift, Home, Compass, Zap, Shirt, Camera, Bed, Code, Utensils, Star, Wrench } from 'lucide-react';
import { SurpriseMe } from "@/components/iykyk/SurpriseMe";
import { useDemoTime } from "@/context/DemoTimeContext";

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
  const { currentPhase } = useDemoTime();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-1 flex-col pb-24 max-w-lg mx-auto w-full">
        <div className="p-8 pt-12 text-center space-y-2">
            <h2 className="text-hero leading-tight">Your Cultural Concierge</h2>
            <p className="text-[13px] font-light text-muted-foreground">Your real-time cultural portal to Bondi.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2">
            {featureData.map((feature) => {
                const image = PlaceHolderImages.find(img => img.id === feature.imageId);
                const displayTitle = feature.title.replace('iykyk ', '');

                return (
                  <Link key={feature.title} href={feature.href}>
                      <Card className="group relative w-full aspect-[4/3] overflow-hidden rounded-2xl border-border bg-card">
                          {image && (
                            <Image
                              src={image.imageUrl}
                              alt={feature.title}
                              fill
                              className="absolute inset-0 object-cover transition-transform duration-700 group-hover:scale-110"
                              data-ai-hint={image.imageHint}
                            />
                          )}
                          
                          <div className="absolute inset-0 scrim-bottom" />
                         
                          <div className="absolute inset-0 flex flex-col justify-end p-5">
                             <div className="space-y-1">
                                  <p className="text-[10px] font-bold tracking-[0.1em] uppercase" style={{ color: 'var(--phase-accent)' }}>
                                    {feature.icon}
                                  </p>
                                  <CardTitle className="text-[15px] font-semibold text-card-foreground">
                                    {displayTitle}
                                  </CardTitle>
                                  <p className="text-[11px] leading-relaxed text-muted-foreground line-clamp-2">
                                    {feature.description}
                                  </p>
                              </div>
                          </div>
                      </Card>
                  </Link>
                )
            })}
        </div>

        <div className="px-4 mt-12 space-y-12">
             <SurpriseMe />

            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <Camera className="h-5 w-5" style={{ color: 'var(--phase-accent)' }} />
                    <h2 className="text-xl font-bold tracking-tight text-hero !text-2xl">iykyk Lens</h2>
                </div>
                <p className="text-[13px] font-light text-muted-foreground leading-relaxed">
                    The future: an AR-powered view of your city's vibe.
                    <span className="block font-semibold mt-1" style={{ color: 'var(--phase-accent)' }}>Walk to Unlock</span>
                </p>
                <Link href="/ar">
                    <Button variant="outline" className="w-full btn-phase-cta h-12">
                       <Sparkles className="mr-2 h-4 w-4" />
                        Launch AR Mode
                    </Button>
                </Link>
            </div>

            <div className="text-center pb-8">
                <Button asChild variant="ghost" className="text-section-label">
                    <Link href="/admin">
                        <Wrench className="mr-2 h-3 w-3" />
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
