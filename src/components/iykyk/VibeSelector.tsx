import { Coffee, Dumbbell, Glasses, Utensils } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const vibes = [
  { name: "Coffee", icon: Coffee },
  { name: "Sushi", icon: Utensils },
  { name: "Nightlife", icon: Glasses },
  { name: "Fitness", icon: Dumbbell },
];

export function VibeSelector() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {vibes.map((vibe) => (
        <Card key={vibe.name} className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
          <CardContent className="flex flex-col items-center justify-center gap-4 p-6 text-center">
            <div className="rounded-full bg-primary/10 p-4 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <vibe.icon className="h-8 w-8" />
            </div>
            <p className="font-semibold text-foreground">{vibe.name}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
