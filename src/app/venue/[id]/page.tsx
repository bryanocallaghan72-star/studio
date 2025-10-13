
import { Header } from "@/components/iykyk/Header";
import { MobileNav } from "@/components/iykyk/MobileNav";
import { appData } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Flame, MapPin, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const getImageForVenue = (venueName: string) => {
    const venueNameLower = venueName.toLowerCase();
    if (venueNameLower.includes('sushi') || venueNameLower.includes('raw bar')) return "sushi-1";
    if (venueNameLower.includes('bar') || venueNameLower.includes('cocktail') || venueNameLower.includes('ravesis')) return "nightlife-1";
    if (venueNameLower.includes('cafe') || venueNameLower.includes('brunch') || venueNameLower.includes('depot') || venueNameLower.includes('harry')) return "coffee-1";
    if (venueNameLower.includes('beach')) return "hot-1";
    if (venueNameLower.includes('totti')) return "my-day-3";
    return "night-1";
}

const spottedHereCreators = [appData.creators[2], appData.creators[3]]; // Lucas and Jay

export default function VenueProfilePage({ params }: { params: { id: string } }) {
  const venue = appData.map.pins.find(p => p.slug === params.id);

  if (!venue) {
    notFound();
  }

  const imageId = getImageForVenue(venue.name);
  const image = PlaceHolderImages.find(img => img.id === imageId);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col pb-24">
        <div className="relative h-80 w-full">
            {image && (
                <Image
                    src={image.imageUrl}
                    alt={venue.name}
                    fill
                    className="object-cover"
                    data-ai-hint={image.imageHint}
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4 md:p-6">
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{venue.name}</h1>
                <Badge className="mt-2" variant="secondary">{venue.type}</Badge>
            </div>
        </div>
        
        <div className="flex flex-col gap-8 p-4 md:p-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <MapPin className="text-primary" />
                        About this Vibe
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{venue.description}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Ticket className="text-accent" />
                        Deals at {venue.name}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">No active deals right now. Check back soon!</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Flame className="text-destructive" />
                        Spotted Here
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {spottedHereCreators.map(creator => (
                             <Link key={creator.id} href={`/profile/${creator.id}`} className="flex items-center gap-4 group">
                                <Avatar>
                                    <AvatarImage src={creator.avatar} alt={`@${creator.id}`} />
                                    <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-grow">
                                    <p className="font-semibold group-hover:underline">@{creator.id}</p>
                                    <p className="text-sm text-muted-foreground line-clamp-1">{creator.bio}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="group-hover:text-primary">
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>

        </div>
      </main>
      <MobileNav />
    </div>
  );
}
