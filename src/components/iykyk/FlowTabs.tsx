
import { Moon, Sparkles, Sun } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { morningActivities, nightActivities, lateNightActivities } from "@/lib/activities";

type Activity = {
    id: string;
    title: string;
    description: string;
    imageId: string;
    tag: string;
};

const tabData = [
    {
        value: "morning",
        label: "Morning",
        icon: Sun,
        activities: morningActivities,
    },
    {
        value: "night",
        label: "Night",
        icon: Moon,
        activities: nightActivities,
    },
    {
        value: "late-night",
        label: "Late Night",
        icon: Sparkles,
        activities: lateNightActivities,
    },
];

const ActivityCard = ({ title, description, imageId, tag }: Omit<Activity, 'id'>) => {
    const image = PlaceHolderImages.find(img => img.id === imageId);
    return (
        <Card className="overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
            {image ? (
                 <div className="relative h-40 w-full">
                    <Image
                        src={image.imageUrl}
                        alt={description}
                        fill
                        className="object-cover"
                        data-ai-hint={image.imageHint}
                    />
                 </div>
            ) : (
                <div className="relative h-40 w-full bg-secondary" />
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
          {tabData.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>
                <tab.icon className="mr-2 h-5 w-5"/>
                {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabData.map(tab => (
            <TabsContent key={tab.value} value={tab.value}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {tab.activities.map(activity => <ActivityCard key={activity.id} {...activity} />)}
                </div>
            </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
