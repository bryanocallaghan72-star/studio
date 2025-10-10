

import { Moon, Sparkles, Sun } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";

const morningActivities = [
    { title: "Bondi Sunrise Yoga", description: "Start your day with rejuvenating yoga on the beach.", imageId: "morning-1", tag: "Wellness" },
    { title: "Bondi Sunrise Yoga 2.0", description: "Start your day with rejuvenating yoga on the beach.", imageId: "morning-1", tag: "Wellness" },
    { title: "Acai Bowl Heaven", description: "Fuel your morning with a delicious and healthy acai bowl.", imageId: "morning-2", tag: "Healthy" },
];

const nightActivities = [
    { title: "Seaside Dining", description: "Enjoy spring cocktails with a stunning ocean view.", imageId: "cocktail-101", tag: "cocktails" },
    { title: "Cocktail Hour", description: "Discover a hidden bar with expertly mixed cocktails.", imageId: "community-sushi", tag: "Bar" },
    { title: "City Lights Stroll", description: "A romantic walk along the illuminated coastline.", imageId: "night-2", tag: "Romantic" },
];

const lateNightActivities = [
    { title: "Neon Bar Hop", description: "Explore the vibrant late-night scene with neon-lit bars.", imageId: "late-night-1", tag: "Party" },
    { title: "Midnight Snacks", description: "Find the best street food to satisfy your late-night cravings.", imageId: "late-night-2", tag: "Food" },
    { title: "Live Music Venue", description: "Catch a live band at an intimate local venue.", imageId: "sushi-1", tag: "Music" },
];


const ActivityCard = ({ title, description, imageId, tag }: { title: string; description: string; imageId: string, tag: string }) => {
    const image = PlaceHolderImages.find(img => img.id === imageId);
    return (
        <Card className="overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
            {image && (
                 <div className="relative h-40 w-full">
                    <Image
                        src={image.imageUrl}
                        alt={image.description}
                        fill
                        className="object-cover"
                        data-ai-hint={image.imageHint}
                    />
                 </div>
            )}
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{title}</CardTitle>
                    <Badge variant="outline" className="border-accent text-accent">{tag}</Badge>
                </div>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
        </Card>
    );
};


export function FlowTabs() {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight mb-2">iykyk Flow</h2>
      <p className="text-muted-foreground mb-4">Time-of-day rhythm for what's good, right now.</p>
      <Tabs defaultValue="morning" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-card border">
          <TabsTrigger value="morning"><Sun className="mr-2 h-5 w-5"/>Morning</TabsTrigger>
          <TabsTrigger value="night"><Moon className="mr-2 h-5 w-5"/>Night</TabsTrigger>
          <TabsTrigger value="late-night"><Sparkles className="mr-2 h-5 w-5"/>Late Night</TabsTrigger>
        </TabsList>
        <TabsContent value="morning">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {morningActivities.map(activity => <ActivityCard key={activity.title} {...activity} />)}
            </div>
        </TabsContent>
        <TabsContent value="night">
             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {nightActivities.map(activity => <ActivityCard key={activity.title} {...activity} />)}
            </div>
        </TabsContent>
        <TabsContent value="late-night">
             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {lateNightActivities.map(activity => <ActivityCard key={activity.title} {...activity} />)}
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
