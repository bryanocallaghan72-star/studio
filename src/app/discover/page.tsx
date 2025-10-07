
import { Header } from "@/components/iykyk/Header";
import { MobileNav } from "@/components/iykyk/MobileNav";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
    color: "text-primary",
    imageId: "bondi-sunset",
  },
  {
    href: "/flow",
    icon: Sparkles,
    title: "iykyk Flow",
    description: "Time-of-day rhythm suggestions, from morning to late night.",
    color: "text-primary",
    imageId: "night-1"
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

export default function DiscoverPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-8 p-4 md:p-6 pb-24">
        <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">What's the vibe today?</h2>
            <p className="text-muted-foreground mt-2">Your real-time cultural portal to Bondi.</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
            {features.map((feature) => {
                const image = PlaceHolderImages.find(img => img.id === feature.imageId);
                return (
                    <div key={feature.title} className="p-1">
                        <Link href={feature.href}>
                            <Card className="group h-full transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden">
                                <div className="relative h-48 w-full">
                                    {image && (
                                        <Image 
                                            src={image.imageUrl}
                                            alt={feature.title}
                                            fill
                                            className="object-cover transition-transform group-hover:scale-105"
                                            data-ai-hint={image.imageHint}
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end">
                                      <CardHeader className="text-white p-4 w-full">
                                        <div className="flex items-start gap-4">
                                            <div className="rounded-full bg-white/20 backdrop-blur-sm p-3 border border-white/30">
                                                <feature.icon className={`h-6 w-6 ${feature.color}`} />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                                                <p className="text-white/90 text-sm mt-1">{feature.description}</p>
                                            </div>
                                        </div>
                                      </CardHeader>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    </div>
                )
            })}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card className="group h-full flex flex-col">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                <div className="rounded-full bg-primary/10 p-3">
                  <Calendar className={`h-6 w-6 text-primary`} />
                </div>
                <CardTitle className="text-xl">iykyk My Day</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <p className="text-muted-foreground flex-grow">Curated daily itinerary that you can shuffle like a playlist.</p>
                <Link href="/my-day">
                    <Button variant="secondary" className="w-full">Plan My Day</Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="group h-full flex flex-col">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                <div className="rounded-full bg-accent/10 p-3">
                  <Gift className={`h-6 w-6 text-accent`} />
                </div>
                <CardTitle className="text-xl">iykyk Surprise Me</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <p className="text-muted-foreground flex-grow">Playful randomness with a chance to discover hidden gems.</p>
                <SurpriseMe />
              </CardContent>
            </Card>
        </div>
         <div className="grid grid-cols-1">
             <Card className="group h-full flex flex-col">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                <div className="rounded-full bg-primary/10 p-3">
                  <Users className={`h-6 w-6 text-primary`} />
                </div>
                <CardTitle className="text-xl">iykyk & Co</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <p className="text-muted-foreground flex-grow">Connect with themed groups, from sushi lovers to cocktail hunters.</p>
                <Link href="/community">
                    <Button variant="secondary" className="w-full">Find Your Tribe</Button>
                </Link>
              </CardContent>
            </Card>
        </div>


      </main>
      <MobileNav />
    </div>
  );
}
