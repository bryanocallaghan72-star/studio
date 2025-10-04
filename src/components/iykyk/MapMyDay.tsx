
"use client";

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Loader2, Shuffle, Wand2, Sparkles, Footprints, Bus, Car, Bike, Info } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { AnimatePresence, motion } from "framer-motion";
import { generateItinerary } from '@/app/actions';
import { Itinerary, ItineraryRequest } from '@/ai/schemas';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

const vibes = [
    "Tinder Date - Bondi",
    "Single & Ready to Mingle",
    "Date Night - Bondi",
    "Wellness Saturday",
    "Ladies' Lunch",
    "Quick Bondi Lunch",
    "Girls' Night Out",
    "Brunch", "Coffee", "Surf", "Walk", "Markets", "Sunset drinks", "Live music"
];

export function MapMyDay() {
    const [isPending, startTransition] = useTransition();
    const [itinerary, setItinerary] = useState<Itinerary | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    const [currentRequest, setCurrentRequest] = useState<Partial<ItineraryRequest>>({
      vibe: "Wellness Saturday",
      pace: 3,
      budget: 2,
      travelMode: 'walk'
    });
    
    const [showBuilder, setShowBuilder] = useState(true);

    function handleGenerateItinerary() {
        if (!currentRequest.vibe) {
            setError("Please select a vibe first.");
            return;
        }
        setError(null);
        setItinerary(null);
        setShowBuilder(false);
        startTransition(async () => {
          const response = await generateItinerary(currentRequest as ItineraryRequest);
          if (response.error) {
            setError(response.error);
            setShowBuilder(true);
          } else if (response.success) {
            setItinerary(response.success);
          }
        });
    }

    const handleShuffle = () => {
        if (!currentRequest) return;
        handleGenerateItinerary();
    };

    const getRandomImage = (index: number) => {
        const imageIds = ["my-day-1", "my-day-2", "my-day-3", "my-day-4", "morning-1", "night-1", "late-night-1"];
        return PlaceHolderImages.find(img => img.id === imageIds[index % imageIds.length]);
    }

    const PlanBuilder = () => (
      <div className="space-y-6">
        <div>
          <Label className="font-semibold text-sm mb-3 block">Choose your vibe:</Label>
          <div className="flex flex-wrap gap-2">
            {vibes.map(vibe => (
              <Button
                key={vibe}
                variant={currentRequest.vibe === vibe ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentRequest(prev => ({...prev, vibe}))}
              >
                {vibe}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <Label className="font-semibold text-sm">Pace: {['', 'Chill', 'Relaxed', 'Moderate', 'Busy', 'Packed'][currentRequest.pace || 0]}</Label>
          <Slider defaultValue={[currentRequest.pace || 3]} max={5} min={1} step={1} onValueChange={([val]) => setCurrentRequest(prev => ({...prev, pace: val}))}/>
        </div>

        <div className="space-y-4">
          <Label className="font-semibold text-sm">Budget: {['', '$', '$$', '$$$', '$$$$', '$$$$$'][currentRequest.budget || 0]}</Label>
          <Slider defaultValue={[currentRequest.budget || 2]} max={5} min={1} step={1} onValueChange={([val]) => setCurrentRequest(prev => ({...prev, budget: val}))}/>
        </div>

        <div>
          <Label className="font-semibold text-sm mb-3 block">Travel mode:</Label>
          <RadioGroup defaultValue={currentRequest.travelMode || "walk"} onValueChange={(val) => setCurrentRequest(prev => ({...prev, travelMode: val}))} className="flex gap-4">
            <Label htmlFor="walk" className="flex flex-col items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-accent has-[:checked]:bg-accent has-[:checked]:text-accent-foreground">
              <Footprints className="h-6 w-6" /> <span className="text-xs">Walk</span>
              <RadioGroupItem value="walk" id="walk" className="sr-only"/>
            </Label>
            <Label htmlFor="public" className="flex flex-col items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-accent has-[:checked]:bg-accent has-[:checked]:text-accent-foreground">
              <Bus className="h-6 w-6" /> <span className="text-xs">Public</span>
              <RadioGroupItem value="public" id="public" className="sr-only"/>
            </Label>
             <Label htmlFor="rideshare" className="flex flex-col items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-accent has-[:checked]:bg-accent has-[:checked]:text-accent-foreground">
              <Car className="h-6 w-6" /> <span className="text-xs">Rideshare</span>
              <RadioGroupItem value="rideshare" id="rideshare" className="sr-only"/>
            </Label>
          </RadioGroup>
        </div>

        <Button onClick={handleGenerateItinerary} disabled={isPending || !currentRequest.vibe} className="w-full">
            {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><Wand2 className="mr-2 h-4 w-4" /> Generate Itinerary</>}
        </Button>
      </div>
    );
    
    const ItineraryDisplay = () => (
      <div>
        <div className="flex items-center justify-between mb-4">
            <Button variant="outline" onClick={() => { setItinerary(null); setShowBuilder(true); }}>
                &larr; Back to Planner
            </Button>
            <Button variant="ghost" size="icon" onClick={handleShuffle} disabled={isPending}>
                {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Shuffle className="h-5 w-5" />}
                <span className="sr-only">Shuffle</span>
            </Button>
        </div>

        <AnimatePresence>
         {itinerary!.stops.map((activity, index) => {
             const image = getRandomImage(index);
             return (
                 <motion.div
                     key={activity.title + index}
                     layout
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -20 }}
                     transition={{ duration: 0.3 }}
                     className="flex items-start gap-4 p-2 rounded-lg hover:bg-secondary"
                 >
                     {image && (
                         <Image
                             src={image.imageUrl}
                             alt={image.description}
                             width={64}
                             height={64}
                             className="rounded-md object-cover aspect-square"
                             data-ai-hint={image.imageHint}
                         />
                     )}
                     <div className="flex-grow">
                         <p className="font-bold">{activity.title}</p>
                         <p className="text-sm font-semibold text-primary">{activity.time}</p>
                         <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                         <p className="text-xs text-muted-foreground mt-1">📍 {activity.location}</p>
                     </div>
                 </motion.div>
             );
         })}
         </AnimatePresence>
      </div>
    );

    return (
        <Card className="w-full flex flex-col">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Calendar className="h-6 w-6 text-primary" />
                    <CardTitle>Map my Day</CardTitle>
                </div>
                <CardDescription>
                    {showBuilder ? "Design your perfect day in Bondi. Set your vibe, pace, and budget." : itinerary?.title}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {isPending && !itinerary && (
                    <div className="flex flex-col items-center justify-center text-center h-full text-muted-foreground p-8 rounded-lg bg-secondary/50">
                        <Wand2 className="h-12 w-12 mb-4 animate-pulse text-primary" />
                        <p className="font-medium">Crafting your perfect day...</p>
                        <p className="text-sm">This can take a moment!</p>
                    </div>
                )}
                
                {showBuilder && !isPending && <PlanBuilder />}
                
                {itinerary && !showBuilder && !isPending && <ItineraryDisplay />}
            </CardContent>
        </Card>
    );
}
