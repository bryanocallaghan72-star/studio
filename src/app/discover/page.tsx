
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
    
    return (
        <Link href={feature.href} passHref>
            <div className="w-full flex items-center p-4 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-white/5">
                <div className={`mr-6 bg-secondary p-3 rounded-xl`}>
                    {Icon && <Icon size={32} className={feature.color} />}
                </div>
                <div className="text-left">
                    <h3 className="text-lg font-bold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
            </div>
        </Link>
    );
};

export default function DiscoverPage() {
  return (
    <div className="flex flex-1 flex-col">
        <div className="text-left mb-8">
            <h2 className="text-3xl font-bold tracking-tight">iykyk</h2>
            <p className="text-muted-foreground mt-2">🔹 Suggested Flow</p>
        </div>

        <div className="space-y-4">
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
