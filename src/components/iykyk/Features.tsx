"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Ticket, Calendar, Gift, Users, Sparkles, Zap } from "lucide-react";

const features = [
  {
    icon: Flame,
    title: "iykyk Fire",
    description: "Discover what's hot and trending right now. Don't miss out on the most talked-about events and places.",
    color: "text-destructive"
  },
  {
    icon: Sparkles,
    title: "iykyk Flow",
    description: "Get suggestions based on the time of day, whether it's morning coffee, a lively night out, or a late-night snack.",
    color: "text-primary"
  },
  {
    icon: Ticket,
    title: "iykyk Deals",
    description: "Access exclusive deals, perks, and special offers from local businesses and creators.",
    color: "text-accent"
  },
  {
    icon: Calendar,
    title: "iykyk My Day",
    description: "Your personalized, curated itinerary for the day. Shuffle and discover new adventures.",
    color: "text-primary"
  },
  {
    icon: Gift,
    title: "iykyk Surprise Me",
    description: "Unlock hidden gems and spontaneous experiences with a single tap. A new adventure awaits!",
    color: "text-accent"
  },
  {
    icon: Users,
    title: "Community Connector",
    description: "Find and connect with communities that share your interests. Your tribe is waiting for you.",
    color: "text-primary"
  }
];

export function Features() {
  return (
    <section>
        <div className="flex items-center gap-3 mb-4">
            <Zap className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold tracking-tight">Features</h2>
        </div>
      <p className="text-muted-foreground mb-4">
        Everything you need to explore the world like a local.
      </p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Card key={index} className="group transition-all hover:shadow-xl hover:-translate-y-1">
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
        ))}
      </div>
    </section>
  );
}
