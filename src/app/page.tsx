
import { Header } from "@/components/iykyk/Header";
import { MobileNav } from "@/components/iykyk/MobileNav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, Map, Calendar, Flame, Ticket, Gift, Users } from "lucide-react";
import Link from "next/link";
import { appData } from "@/lib/data";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SurpriseMe } from "@/components/iykyk/SurpriseMe";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

const features = [
  {
    href: "/map",
    icon: Map,
    title: "iykyk Vibe",
    description: "Mood-based map for coffee, sushi, nightlife, and fitness.",
    color: "text-primary",
    imageId: "map-1",
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
    href: "/my-day",
    icon: Calendar,
    title: "iykyk My Day",
    description: "Curated daily itinerary that you can shuffle like a playlist.",
    color: "text-primary",
    imageId: "my-day-1"
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
  {
    href: "#", // Placeholder, will be Community Connector page later
    icon: Users,
    title: "Community Connector",
    description: "Connect with themed groups, from sushi lovers to cocktail hunters.",
    color: "text-primary",
    imageId: "community-fitness"
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-8 p-4 md:p-6 pb-24">
        <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">What's the vibe today?</h2>
            <p className="text-muted-foreground mt-2">Your real-time cultural portal to Bondi.</p>
        </div>

        <Carousel 
            opts={{
                align: "start",
                loop: true,
            }}
            className="w-full"
        >
            <CarouselContent className="-ml-4">
                 {features.map((feature) => {
                    const image = PlaceHolderImages.find(img => img.id === feature.imageId);
                    return (
                        <CarouselItem key={feature.title} className="pl-4 md:basis-1/2 lg:basis-1/3">
                            <div className="p-1">
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
                                             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                        </div>
                                        <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2 absolute bottom-0 left-0 text-white p-4">
                                            <div className="rounded-full bg-white/20 backdrop-blur-sm p-3 border border-white/30">
                                                <feature.icon className={`h-6 w-6 ${feature.color}`} />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                                                <p className="text-white/90 text-sm">{feature.description}</p>
                                            </div>
                                        </CardHeader>
                                    </Card>
                                </Link>
                            </div>
                        </CarouselItem>
                    )
                 })}
            </CarouselContent>
            <CarouselPrevious className="ml-12" />
            <CarouselNext className="mr-12" />
        </Carousel>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="group h-full flex flex-col">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                <div className="rounded-full bg-primary/10 p-3">
                  <Gift className={`h-6 w-6 text-accent`} />
                </div>
                <CardTitle className="text-xl">iykyk Surprise Me</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <p className="text-muted-foreground flex-grow">Playful randomness with a chance to discover hidden gems.</p>
                <SurpriseMe />
              </CardContent>
            </Card>
            <Card className="group h-full flex flex-col">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                <div className="rounded-full bg-primary/10 p-3">
                  <Users className={`h-6 w-6 text-primary`} />
                </div>
                <CardTitle className="text-xl">Community Connector</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <p className="text-muted-foreground flex-grow">Connect with themed groups, from sushi lovers to cocktail hunters.</p>
                <Link href="#" className="mt-4">
                    <Button variant="secondary" className="w-full">Find Your Tribe</Button>
                </Link>
              </CardContent>
            </Card>
        </div>


        <section>
          <h2 className="text-3xl font-bold tracking-tight text-center my-6">Featured Creators</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {appData.creators.map((creator) => (
              <Link href={`/creator/${creator.id}`} key={creator.id}>
                <Card className="group flex flex-col items-center text-center p-4 transition-all hover:shadow-xl hover:-translate-y-1 h-full">
                  <Avatar className="h-16 w-16 mb-2 border-2 border-primary">
                    <AvatarImage src={creator.avatar} alt={creator.name} />
                    <AvatarFallback>{creator.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <p className="font-semibold text-sm group-hover:text-primary">@{creator.id}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>

      </main>
      <MobileNav />
    </div>
  );
}
