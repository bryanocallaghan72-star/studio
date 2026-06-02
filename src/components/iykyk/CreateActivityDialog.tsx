'use client';

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { appData } from "@/lib/data";
import { useFirestore, useUser } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

type CreateActivityDialogProps = {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    defaultTitle: string;
    defaultCategory: 'Health & Fitness' | 'Vibes' | 'Brunch' | 'Sushi';
};

export function CreateActivityDialog({ isOpen, onOpenChange, defaultTitle, defaultCategory }: CreateActivityDialogProps) {
    const { firestore } = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();

    const [title, setTitle] = useState(defaultTitle);
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [maxParticipants, setMaxParticipants] = useState(10);
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [time, setTime] = useState("12:00");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreate = async () => {
        if (!user || !firestore) {
            toast({
                variant: "destructive",
                title: "Authentication Required",
                description: "You must be signed in to post an activity.",
            });
            return;
        }

        if (!title.trim() || !location.trim()) {
            toast({
                variant: "destructive",
                title: "Missing Information",
                description: "Please provide at least a title and a location.",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            // Construct the start date/time
            const startAt = date ? new Date(date) : new Date();
            if (time) {
                const [hours, minutes] = time.split(':').map(Number);
                startAt.setHours(hours || 0, minutes || 0, 0, 0);
            }

            const selectedPin = appData.map.pins.find(p => p.name === location);

            const activityData = {
                title: title.trim(),
                description: description.trim(),
                locationText: location,
                venueSlug: selectedPin?.slug || null,
                maxParticipants: Number(maxParticipants),
                currentParticipants: 1, // Host is the first participant
                startAt: startAt,
                time: startAt.toISOString(), // Secondary field for schema compatibility
                category: defaultCategory,
                hostId: user.uid,
                hostUsername: user.displayName || user.email?.split('@')[0] || 'Bondi Local',
                hostAvatarUrl: user.photoURL || null,
                createdAt: serverTimestamp(),
            };

            await addDoc(collection(firestore, 'socials'), activityData);
            
            toast({
                title: "Activity Posted! 🤙",
                description: "Your vibe is live. Check the social feed to see who joins.",
            });

            // Reset and close
            setDescription("");
            onOpenChange(false);
        } catch (error: any) {
            console.error("Social write failed:", error);
            toast({
                variant: "destructive",
                title: "Could not post activity",
                description: error.message || "An unexpected error occurred. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md bg-[#f2ece0] border-none rounded-3xl shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-[#1a1208]">New Social Activity</DialogTitle>
                    <DialogDescription className="text-[rgba(26,18,8,0.50)]">
                        Host a moment. From surf seshes to coffee catchups.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-5 py-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-[#c4762a]">Title</Label>
                        <Input 
                            id="title" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            placeholder="e.g. Spikeball at 4pm"
                            className="rounded-xl border-black/[0.08] bg-white h-12 text-sm font-bold text-[#1a1208]"
                        />
                    </div>
                     <div className="space-y-1.5">
                        <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-[#c4762a]">Description</Label>
                        <Textarea 
                            id="description" 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            placeholder="What's the plan? Meet at the flags..." 
                            className="rounded-xl border-black/[0.08] bg-white text-sm leading-relaxed text-[#1a1208] min-h-[80px]"
                        />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="location" className="text-[10px] font-black uppercase tracking-widest text-[#c4762a]">Location</Label>
                            <Select onValueChange={setLocation} defaultValue={location}>
                                <SelectTrigger className="rounded-xl border-black/[0.08] bg-white h-12 text-sm font-bold text-[#1a1208]">
                                    <SelectValue placeholder="Select a spot" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-black/[0.08] bg-white">
                                    {appData.map.pins.map(pin => (
                                        <SelectItem key={pin.id} value={pin.name} className="text-sm font-medium">
                                            {pin.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-1.5">
                            <Label htmlFor="participants" className="text-[10px] font-black uppercase tracking-widest text-[#c4762a]">Max Guests</Label>
                            <Input 
                                id="participants" 
                                type="number" 
                                value={maxParticipants} 
                                onChange={(e) => setMaxParticipants(parseInt(e.target.value, 10))} 
                                className="rounded-xl border-black/[0.08] bg-white h-12 text-sm font-bold text-[#1a1208]"
                            />
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-[#c4762a]">Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full justify-start text-left font-bold rounded-xl border-black/[0.08] bg-white h-12 text-sm",
                                    !date && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4 text-[#c4762a]" />
                                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0 border-none shadow-xl rounded-2xl">
                                <Calendar
                                  mode="single"
                                  selected={date}
                                  onSelect={setDate}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-1.5">
                           <Label htmlFor="time" className="text-[10px] font-black uppercase tracking-widest text-[#c4762a]">Time</Label>
                           <Input 
                                id="time" 
                                type="time" 
                                value={time} 
                                onChange={e => setTime(e.target.value)} 
                                className="rounded-xl border-black/[0.08] bg-white h-12 text-sm font-bold text-[#1a1208]"
                           />
                        </div>
                    </div>
                </div>
                <DialogFooter className="mt-4">
                    <Button 
                        variant="ghost" 
                        onClick={() => onOpenChange(false)} 
                        disabled={isSubmitting}
                        className="text-[rgba(26,18,8,0.40)] font-bold"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleCreate} 
                        disabled={isSubmitting}
                        className="bg-[#c4762a] hover:bg-[#b06824] text-white font-black px-8 h-12 rounded-2xl shadow-lg shadow-[#c4762a]/20"
                    >
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        {isSubmitting ? "POSTING..." : "POST TO SOCIAL"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
