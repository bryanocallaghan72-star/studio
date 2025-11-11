
'use client';

import Link from "next/link";
import { featureData } from '@/lib/features';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Gift, Camera, Sparkles, Map, Flame, Tag, Calendar, Users, Home, Compass, Zap, Shirt, Bed, Code } from 'lucide-react';
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
                    const Icon = iconMap[feature.icon as keyof typeof iconMap] || Home;
                    const image = PlaceHolderImages.find(p => p.id === feature.imageId);
                    return (
                        <Link href={feature.href} key={feature.href}>
                             <Card className="group w-full h-full flex flex-col md:flex-row items-center p-4 bg-secondary text-foreground rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                {image && (
                                    <div className="relative w-full h-40 md:w-32 md:h-full rounded-xl overflow-hidden mr-0 md:mr-6 mb-4 md:mb-0">
                                        <Image
                                            src={image.imageUrl}
                                            alt={feature.title}
                                            fill
                                            className="object-cover"
                                            data-ai-hint={image.imageHint}
                                        />
                                    </div>
                                )}
                                <div className="text-left">
                                    <h3 className="text-lg font-bold">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                                </div>
                            </Card>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}
