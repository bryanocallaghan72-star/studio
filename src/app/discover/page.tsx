
'use client';

import Link from "next/link";
import { featureData } from '@/lib/features';
import { Card } from "@/components/ui/card";
import { Calendar, Map, Compass, Flame, Tag, Code, Shirt, Bed, Zap, Gift, Camera, Sparkles, Users, Home } from 'lucide-react';
import { SurpriseMeButton } from "@/features/surprise/SurpriseMeButton";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

const iconMap = {
    Calendar,
    Map,
    Compass,
    Flame,
    Tag,
    Code,
    Shirt,
    Bed,
    Zap,
    Gift,
    Camera,
    Sparkles,
    Users,
    Home
  };

export default function DiscoverPage() {
    return (
        <div className="flex flex-col gap-8 md:gap-12">
            <div className="flex flex-col items-center justify-center text-center pt-16 md:pt-24">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">iykyk</h1>
                <p className="text-muted-foreground mt-4 max-w-xl">
                    Your real-time cultural portal to Bondi.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SurpriseMeButton />
                {featureData.map(feature => {
                    const image = PlaceHolderImages.find(p => p.id === feature.imageId);
                    return (
                        <Link href={feature.href} key={feature.href}>
                             <Card className="group relative w-full h-48 overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                {image && (
                                    <Image
                                        src={image.imageUrl}
                                        alt={feature.title}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        data-ai-hint={image.imageHint}
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-20" />
                                <div className="absolute bottom-0 left-0 p-4 z-30 text-white">
                                    <h3 className="text-lg font-bold">{feature.title}</h3>
                                    <p className="text-sm text-white/80 mt-1">{feature.description}</p>
                                </div>
                            </Card>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}
