
import { Header } from "@/components/iykyk/Header";
import { MobileNav } from "@/components/iykyk/MobileNav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, Map, Calendar, Flame, Ticket, Gift, Users } from "lucide-react";
import Link from "next/link";
import { appData } from "@/lib/data";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const features = [
  {
    href: "/map",
    icon: Map,
    title: "iykyk Vibe",
    description: "Mood-based suggestions for coffee, sushi, nightlife, and fitness.",
    color: "text-primary",
  },
  {
    href: "/flow",
    icon: Sparkles,
    title: "iykyk Flow",
    description: "Time-of-day rhythm suggestions, from morning to late night.",
    color: "text-primary",
  },
  {
    href: "#",
    icon: Calendar,
    title: "iykyk My Day",
    description: "Curated daily itinerary that you can shuffle like a playlist.",
    color: "text-primary",
  },
  {
    href: "#",
    icon: Flame,
    title: "iykyk Fire",
    description: "Real-time “What’s hot right now” with countdowns and FOMO.",
    color: "text-destructive",
  },
  {
    href: "#",
    icon: Ticket,
    title: "iykyk Deals",
    description: "Venue-linked offers, perks, and creator-powered funnels.",
    color: "text-accent",
  },
  {
    href: "#",
    icon: Gift,
    title: "iykyk Surprise Me",
    description: "Playful randomness with a chance to discover hidden gems.",
    color: "text-accent",
  },
  {
    href: "#",
    icon: Users,
    title: "Community Connector",
    description: "Connect with themed groups, from sushi lovers to cocktail hunters.",
    color: "text-primary",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-8 p-4 md:p-6 pb-24">
        <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Welcome to iykyk</h2>
            <p className="text-muted-foreground mt-2">Your real-time cultural portal to Bondi. What's the vibe today?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
                <Link href={feature.href} key={feature.title}>
                    <Card className="group h-full transition-all hover:shadow-xl hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                             <div className="rounded-full bg-primary/10 p-3">
                                <feature.icon className={`h-6 w-6 ${feature.color}`} />
                            </div>
                            <CardTitle className="text-xl">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </CardContent>
                    </Card>
                </Link>
            ))}
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
