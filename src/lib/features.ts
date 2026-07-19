
import { Sparkles, Map, Flame, Tag, Calendar, Users, Gift, Home, Compass, Zap, Shirt, Camera, Bed, Code, Utensils, Star, Dumbbell } from "lucide-react";

/**
 * LAUNCH MODE — City2Surf (Sun 9 Aug).
 * The hub shows only the launch trio + a Coming Soon teaser.
 * Every parked card is preserved below in PARKED_FEATURES —
 * to restore any of them after race day, move entries back into featureData.
 */

export const featureData = [
    {
      href: "/city2surf",
      icon: "Zap",
      title: "City2Surf x iykyk",
      description: "One day only - Sun 9 Aug. Finisher-only offers from Bondi locals.",
      color: "text-primary",
      imageId: "morning-1",
    },
    {
      href: "/fire",
      icon: "Flame",
      title: "iykyk Fire",
      description: "Real-time drops from Bondi venues. Claim before they're gone.",
      color: "text-rose-500",
      imageId: "sushi-1",
    },
    {
      href: "/my-day",
      icon: "Calendar",
      title: "iykyk My Day",
      description: "Crossed the line - what now? A local day plan, shuffled to your vibe.",
      color: "text-primary",
      imageId: "community-fitness",
    },
    {
      href: "/city2surf",
      icon: "Sparkles",
      title: "More Coming Soon",
      description: "Vibe map, stays, tables, style, AR and more unlock after race day.",
      color: "text-primary",
      imageId: "night-2",
    },
];

// ─── PARKED FOR LAUNCH — restore after Aug 9 by moving back into featureData ───
export const PARKED_FEATURES = [
    {
      href: "/map",
      icon: "Map",
      title: "iykyk Vibe",
      description: "Mood-based map for coffee, sushi, nightlife, and fitness.",
      color: "text-primary",
      imageId: "sunset-yoga",
    },
    {
      href: "/flow",
      icon: "Compass",
      title: "iykyk Flow",
      description: "Discover the rhythm of your city through creators' movements.",
      color: "text-indigo-500",
      imageId: "morning-1",
    },
    {
      href: "/alignment",
      icon: "Star",
      title: "iykyk Alignment",
      description: "Daily energy cards and Bondi rituals for serendipity and intuition.",
      color: "text-purple-500",
      imageId: "night-2",
    },
    {
      href: "/active",
      icon: "Dumbbell",
      title: "iykyk Active",
      description: "Find your flow with local studios, classes, and wellness.",
      color: "text-pink-500",
      imageId: "fitness-1",
    },
    {
      href: "/deals",
      icon: "Tag",
      title: "iykyk Deals",
      description: "Exclusive offers and perks for locals and explorers.",
      color: "text-emerald-500",
      imageId: "community-sushi",
    },
    {
      href: "/code",
      icon: "Code",
      title: "iykyk Code",
      description: "Meet the creators who are the source code of Bondi's vibe.",
      color: "text-indigo-500",
      imageId: "nightlife-1",
    },
    {
      href: "/style",
      icon: "Shirt",
      title: "iykyk Style",
      description: "Local boutiques, brands, and the definition of Bondi style.",
      color: "text-rose-500",
      imageId: "style-1",
    },
    {
      href: "/stays",
      icon: "Bed",
      title: "iykyk Stays",
      description: "Creator-approved Airbnb stays and local getaways.",
      color: "text-sky-500",
      imageId: "stay-1",
    },
    {
      href: "/flash-stays",
      icon: "Zap",
      title: "Flash Stays",
      description: "Last-minute deals on creator-approved stays.",
      color: "text-purple-500",
      imageId: "stay-2",
    },
    {
      href: "/tables",
      icon: "Utensils",
      title: "iykyk Tables",
      description: "Claim last-minute tables at your favorite spots.",
      color: "text-amber-500",
      imageId: "my-day-3",
    },
];
