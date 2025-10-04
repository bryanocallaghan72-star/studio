
import { Header } from "@/components/iykyk/Header";
import { MobileNav } from "@/components/iykyk/MobileNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { appData } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Rss, Star, MapPin } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function CreatorProfilePage({ params }: { params: { id: string } }) {
  const creator = appData.creators.find(c => c.id === params.id);

  if (!creator) {
    notFound();
  }

  const favoriteSpots = appData.map.pins.slice(0, 3); // Placeholder

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-8 p-4 md:p-6 pb-24">
        
        <Card className="overflow-hidden">
          <div className="relative h-32 w-full bg-secondary">
             <Image 
                src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop"
                alt={`${creator.name}'s banner`}
                fill
                className="object-cover"
             />
          </div>
          <CardContent className="p-6 pt-0">
            <div className="flex items-end gap-4 -mt-12">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src={creator.avatar} alt={creator.name} />
                <AvatarFallback>{creator.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-grow pb-1">
                <h1 className="text-2xl font-bold tracking-tight">{creator.name}</h1>
                <p className="text-sm text-muted-foreground">@{creator.id}</p>
              </div>
              <Button>
                <Rss className="mr-2 h-4 w-4" />
                Follow
              </Button>
            </div>
            <p className="mt-4 text-muted-foreground">{creator.bio}</p>
          </CardContent>
        </Card>

        <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2">
                <Star className="text-accent"/>
                Favorite Spots
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteSpots.map(spot => {
                    const image = PlaceHolderImages.find(img => img.id === 'hot-1'); // placeholder
                    return (
                        <Card key={spot.id} className="group overflow-hidden relative">
                            {image && <>
                                <Image 
                                    src={image.imageUrl}
                                    alt={spot.name}
                                    width={400}
                                    height={200}
                                    className="object-cover w-full h-32 transition-transform group-hover:scale-105"
                                    data-ai-hint={image.imageHint}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            </>}
                            <div className="absolute bottom-0 left-0 p-3">
                                <h3 className="font-semibold text-white">{spot.name}</h3>
                                <p className="text-sm text-white/80 flex items-center gap-1"><MapPin className="h-3 w-3"/>{spot.type}</p>
                            </div>
                        </Card>
                    )
                })}
            </div>
        </section>

      </main>
      <MobileNav />
    </div>
  );
}
