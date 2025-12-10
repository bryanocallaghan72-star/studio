

'use client';

import { useState } from "react";
import { Header } from "@/components/iykyk/Header";
import { MobileNav } from "@/components/iykyk/MobileNav";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Flame, MapPin, Ticket, Clock, TrendingUp, Info, Utensils, Calendar, ShoppingBag, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DEMO_VENUES } from "@/data/DemoVenues";
import { appData } from "@/lib/data";
import { BookingSheet } from "@/components/iykyk/BookingSheet";

const getImageForVenue = (venueName: string) => {
    const venue = DEMO_VENUES.find(v => v.name === venueName);
    if (venue?.image) {
        return {
            imageUrl: venue.image,
            imageHint: venue.category,
            width: 1000,
            height: 1000,
        };
    }
    const venueNameLower = venueName.toLowerCase();
    if (venueNameLower.includes('sushi') || venueNameLower.includes('raw bar')) return PlaceHolderImages.find(img => img.id === 'sushi-1');
    if (venueNameLower.includes('bar') || venueNameLower.includes('cocktail') || venueNameLower.includes('ravesis')) return PlaceHolderImages.find(img => img.id === 'nightlife-1');
    if (venueNameLower.includes('cafe') || venueNameLower.includes('brunch') || venueNameLower.includes('depot') || venueNameLower.includes('harry')) return PlaceHolderImages.find(img => img.id === 'coffee-1');
    if (venueNameLower.includes('beach')) return PlaceHolderImages.find(img => img.id === 'hot-1');
    if (venueNameLower.includes('totti')) return PlaceHolderImages.find(img => img.id === 'my-day-3');
    return PlaceHolderImages.find(img => img.id === 'night-1');
}

const spottedHereCreators = [appData.creators[2], appData.creators[3]]; // Lucas and Jay

const VibeIndicator = ({ vibe }: { vibe: string }) => {
    const vibeStyles = {
        Chill: 'bg-blue-100 text-blue-800',
        Buzzing: 'bg-amber-100 text-amber-800 animate-pulse',
        Packed: 'bg-red-100 text-red-800 font-bold',
    };
    return <Badge className={cn('ml-2', vibeStyles[vibe as keyof typeof vibeStyles] || vibeStyles.Chill)}>{vibe}</Badge>;
}

const getVenueAction = (venueType: string) => {
    switch (venueType) {
        case 'Restaurants':
        case 'Sushi':
        case 'Sushi & Sake':
        case 'Brunch':
        case 'Cocktails':
        case 'Nightlife':
        case 'Cafe & Matcha':
        case 'Viral Matcha':
        case 'Aesthetic Brunch':
        case 'Beach Club Vibe':
        case 'Social Dining':
        case 'Iconic View':
        case 'Beachfront Bar':
        case 'Italo Disco Dining':
        case 'Cocktail Bar':
            return { text: 'Book a Table', icon: Utensils, bookable: true };
        case 'Health & Fitness':
            return { text: 'Book a Class', icon: Calendar, bookable: false };
        case 'Retail':
            return { text: 'Visit Website', icon: ShoppingBag, bookable: false };
        case 'Surf':
            return { text: 'Book a Lesson', icon: Waves, bookable: false };
        case 'Vibes':
        default:
            return { text: 'Get Directions', icon: MapPin, bookable: false };
    }
}

export default function VenueProfilePage() {
    const params = useParams();
    const id = params.id as string;
    const [isBookingSheetOpen, setIsBookingSheetOpen] = useState(false);
    
    const venue = DEMO_VENUES.find(p => p.id.replace('venue_', '') === id);

    if (!venue) {
        notFound();
    }

    const image = getImageForVenue(venue.name);
    const activeDeal = appData.hotItems.find(item => item.venue === venue.name && new Date(item.expiresAt).getTime() > Date.now());
    const venueAction = getVenueAction(venue.category);
    const ActionIcon = venueAction.icon;

    const mockVenue = {
        ...venue,
        slug: venue.id.replace('venue_', ''),
        type: venue.category,
        description: 'A great place in Bondi.',
        openingHours: '9am - 10pm',
        vibeTags: ['Popular', 'Scenic'],
        currentVibe: venue.vibe === 'morning' ? 'Chill' : 'Buzzing'
    }
    
    const handleBookClick = () => {
        if (venueAction.bookable) {
            setIsBookingSheetOpen(true);
        } else {
            // Handle other actions like 'Get Directions' or 'Visit Website'
            console.log("Action:", venueAction.text);
        }
    };


  return (
    <>
    <div className="flex min-h-screen w-full flex-col bg-background pb-24">
        <Header />
        <main className="flex-1">
            <div className="relative h-80 w-full">
                {image && (
                    <Image
                        src={image.imageUrl}
                        alt={mockVenue.name}
                        fill
                        className="object-cover"
                        data-ai-hint={image.imageHint}
                        priority
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 md:p-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight flex items-center">
                        {mockVenue.name}
                        {mockVenue.currentVibe && <VibeIndicator vibe={mockVenue.currentVibe} />}
                    </h1>
                    <Badge className="mt-2" variant="secondary">{mockVenue.type}</Badge>
                </div>
            </div>
            
            <div className="flex flex-col gap-6 p-4 md:p-6">
                
                <Card>
                    <CardContent className="p-6">
                        <p className="text-muted-foreground">{mockVenue.description}</p>
                        <Button className="w-full mt-4 font-bold text-lg h-12" onClick={handleBookClick}>
                            <ActionIcon className="mr-2"/>
                            {venueAction.text}
                        </Button>
                    </CardContent>
                </Card>

                {activeDeal && (
                    <Card className="border-destructive bg-destructive/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl text-destructive">
                                <Flame className="animate-pulse" />
                                Live Deal!
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <h3 className="font-bold text-lg">{activeDeal.title}</h3>
                            <p className="text-muted-foreground">{activeDeal.description}</p>
                            <Button variant="destructive" className="mt-4">Claim Now</Button>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Info className="text-primary" />
                            Essential Info
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-semibold flex items-center gap-2 mb-2"><Clock size={16}/> Opening Hours</h4>
                            <p className="text-muted-foreground">{mockVenue.openingHours}</p>
                        </div>
                         {mockVenue.vibeTags && mockVenue.vibeTags.length > 0 && (
                            <div>
                                <h4 className="font-semibold flex items-center gap-2 mb-2"><TrendingUp size={16}/> Vibe Tags</h4>
                                 <div className="flex flex-wrap gap-2">
                                    {mockVenue.vibeTags.map(tag => (
                                        <Badge key={tag} variant="outline">{tag}</Badge>
                                    ))}
                                </div>
                            </div>
                        )}
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
    </div>
    <BookingSheet 
        isOpen={isBookingSheetOpen}
        onOpenChange={setIsBookingSheetOpen}
        venue={venue}
    />
    </>
  );
}
