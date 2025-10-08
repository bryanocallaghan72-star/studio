
'use client';

import { Header } from "@/components/iykyk/Header";
import { MobileNav } from "@/components/iykyk/MobileNav";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Sparkles, Map, Calendar, Flame, Ticket, Gift, Users } from "lucide-react";
import Link from "next/link";
import { SurpriseMe } from "@/components/iykyk/SurpriseMe";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";

const features = [
  {
    href: "/map",
    icon: Map,
    title: "iykyk Vibe",
    description: "Mood-based map for coffee, sushi, nightlife, and fitness.",
    color: "text-white",
    imageId: "bondi-beach"
  },
  {
    href: "/flow",
    icon: Sparkles,
    title: "iykyk Flow",
    description: "Time-of-day rhythm suggestions, from morning to late night.",
    color: "text-primary",
    imageId: "bondi-sunset"
  },
  {
    href: "/fire",
    icon: Flame,
    title: "iykyk Fire",
    description: "Real-time “What’s hot right now” with countdowns and FOMO.",
    color: "text-destructive",
    imageId: "hot-1"
  },
  {
    href: "/deals",
    icon: Ticket,
    title: "iykyk Deals",
    description: "Venue-linked offers, perks, and creator-powered funnels.",
    color: "text-accent",
    imageId: "deal-1"
  },
];

const otherFeatures = [
    {
        href: "/my-day",
        icon: Calendar,
        title: "iykyk My Day",
        description: "Curated daily itinerary that you can shuffle like a playlist.",
        color: "text-primary",
        imageId: "my-day-3",
        cta: "Plan My Day",
        Component: null
    },
    {
        href: "/community",
        icon: Users,
        title: "iykyk & Co",
        description: "Connect with themed groups, from sushi lovers to cocktail hunters.",
        color: "text-primary",
        imageId: "community-sushi",
        cta: "Find Your Tribe",
        Component: null
    },
     {
        href: "#",
        icon: Gift,
        title: "iykyk Surprise Me",
        description: "Playful randomness with a chance to discover hidden gems.",
        color: "text-accent",
        imageId: "surprise-1",
        cta: null,
        Component: SurpriseMe
    },
]

export default function DiscoverPage() {
  const vibeFeature = features[0];
  const flowFeature = features[1];

  const vibeImage = PlaceHolderImages.find(img => img.id === vibeFeature.imageId);
  const flowImage = PlaceHolderImages.find(img => img.id === flowFeature.imageId);


  return (
    <div className="flex min-h-screen w-full flex-col bg-background dark:bg-transparent">
      <Header />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 pb-24">
        <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tight">What's the vibe today?</h2>
            <p className="text-muted-foreground mt-2">Your real-time cultural portal to Bondi.</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
            <Link href={vibeFeature.href}>
                <Card className="group relative w-full overflow-hidden rounded-xl transition-all hover:shadow-xl hover:-translate-y-1 bg-card">
                   <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-primary/10 p-3">
                               <vibeFeature.icon className={'h-6 w-6 text-primary'} />
                            </div>
                            <div>
                               <CardTitle className="text-lg">{vibeFeature.title}</CardTitle>
                               <CardDescription>{vibeFeature.description}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                </Card>
            </Link>

            <Link href={flowFeature.href}>
                <Card className="group relative h-48 w-full overflow-hidden rounded-xl transition-all hover:shadow-xl hover:-translate-y-1">
                   {flowImage ? (
                     <>
                        <Image
                            src={flowImage.imageUrl}
                            alt={flowFeature.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint={flowImage.imageHint}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                     </>
                   ) : (
                     <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted" />
                   )}
                   <CardHeader className="absolute bottom-0 left-0 w-full p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-background/20 backdrop-blur-sm p-3 border border-white/10">
                               <flowFeature.icon className={'h-6 w-6 text-white'} />
                            </div>
                            <div>
                               <CardTitle className="text-lg text-white">{flowFeature.title}</CardTitle>
                               <CardDescription className="text-white/80">{flowFeature.description}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                </Card>
            </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {otherFeatures.map(feature => {
                 const CardLink = ({children}) => feature.href === "#" ? <div>{children}</div> : <Link href={feature.href} className="h-full">{children}</Link>;
                 return (
                     <CardLink key={feature.title}>
                        <Card className="group h-full flex flex-col">
                            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                                <div className={`rounded-full p-3 bg-primary/10`}>
                                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                                </div>
                                <CardTitle className="text-xl">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow flex flex-col">
                                <p className="text-muted-foreground flex-grow">{feature.description}</p>
                                {feature.Component && <feature.Component />}
                                {feature.cta && (
                                    <Button variant="secondary" className="w-full mt-4">
                                        {feature.cta}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                     </CardLink>
                 )
             })}
        </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.slice(2).map((feature) => {
                return (
                    <Link key={feature.title} href={feature.href}>
                        <Card className="group relative w-full overflow-hidden rounded-xl transition-all hover:shadow-xl hover:-translate-y-1 bg-card">
                           <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="rounded-full bg-primary/10 p-3">
                                       <feature.icon className={`h-6 w-6 ${feature.color}`} />
                                    </div>
                                    <div>
                                       <CardTitle className="text-lg">{feature.title}</CardTitle>
                                       <CardDescription>{feature.description}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>
                )
            })}
        </div>

      </main>
      <MobileNav />
    </div>
  );
}

    