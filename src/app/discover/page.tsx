
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

const FeatureItem = ({ feature, index }: { feature: (typeof featureData)[0]; index: number }) => {
    const Icon = iconMap[feature.icon as keyof typeof iconMap];
    const image = PlaceHolderImages.find(img => img.id === feature.imageId);
    const isOdd = index % 2 !== 0;

    return (
        <Link href={feature.href} passHref>
            <Card className="group relative overflow-hidden rounded-2xl transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 h-full flex flex-col">
                <div className="p-6 flex-grow">
                    <div className="flex items-start gap-4">
                        {Icon && <Icon className={`h-8 w-8 mt-1 flex-shrink-0 ${feature.color}`} />}
                        <div>
                            <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">{feature.title}</h3>
                            <p className="text-muted-foreground text-sm mt-1">{feature.description}</p>
                        </div>
                    </div>
                </div>
                {image && (
                    <div className={cn("relative w-full h-32 mt-auto", isOdd ? "ml-auto" : "")}>
                        <Image
                            src={image.imageUrl}
                            alt={feature.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint={image.imageHint}
                        />
                    </div>
                )}
            </Card>
        </Link>
    );
};

export default function DiscoverPage() {
  return (
    <div className="flex flex-1 flex-col">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Your Cultural Concierge</h2>
            <p className="text-muted-foreground mt-2">The lifestyle OS: Shuffle plans, unlock perks, and discover Bondi in real-time.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featureData.map((feature, index) => (
                <FeatureItem key={feature.title} feature={feature} index={index} />
            ))}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="rounded-2xl">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Gift className="h-8 w-8 text-accent" />
                        <h2 className="text-2xl font-bold tracking-tight">Surprise Me</h2>
                    </div>
                    <p className="text-muted-foreground">
                        Unlock hidden gems and spontaneous experiences with a single tap. A new adventure awaits!
                    </p>
                    <SurpriseMeButton />
                </div>
            </Card>

            <Card className="rounded-2xl">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Camera className="h-8 w-8 text-purple-500" />
                        <h2 className="text-2xl font-bold tracking-tight">iykyk Lens</h2>
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
