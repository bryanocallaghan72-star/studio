
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
    Sparkles, Map, Flame, Tag, Calendar, Users, Gift, Home, Compass, Zap, Shirt, Camera, Bed, Code,
};

const FeatureItem = ({ feature }: { feature: (typeof featureData)[0] }) => {
    const Icon = iconMap[feature.icon as keyof typeof iconMap];
    const image = PlaceHolderImages.find(img => img.id === feature.imageId);
    
    return (
        <Link href={feature.href} passHref>
            <Card className="relative group w-full h-48 overflow-hidden rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
                {image && (
                    <Image 
                        src={image.imageUrl} 
                        alt={feature.title}
                        fill
                        className="object-cover w-full h-full transition-transform group-hover:scale-105"
                        data-ai-hint={image.imageHint}
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 w-full flex items-end justify-between">
                    <div className="text-left">
                        <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                        <p className="text-sm text-white/80">{feature.description}</p>
                    </div>
                    <div className={cn("p-2 rounded-lg bg-white/10 backdrop-blur-sm", feature.color)}>
                        {Icon && <Icon size={24} className="text-white" />}
                    </div>
                </div>
            </Card>
        </Link>
    );
};

export default function DiscoverPage() {
  return (
    <div className="flex flex-1 flex-col">
        <div className="text-left mb-8">
            <h2 className="text-3xl font-bold tracking-tight">iykyk</h2>
            <p className="text-muted-foreground mt-2">Your Cultural Concierge</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featureData.map((feature) => (
                <FeatureItem key={feature.title} feature={feature} />
            ))}
        </div>

        <div className="mt-8">
            <SurpriseMeButton />
        </div>
    </div>
  );
}
