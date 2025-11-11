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

export default function DiscoverPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center pt-16 md:pt-24">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Your Cultural Concierge</h1>
        <p className="text-muted-foreground mt-4 max-w-xl">
            The lifestyle OS: Shuffle plans, unlock perks, and discover Bondi in real-time.
        </p>
    </div>
  );
}