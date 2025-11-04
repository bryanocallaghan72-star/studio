'use client';

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { appData, SocialActivity } from "@/lib/data";

type CreateActivityDialogProps = {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    defaultTitle: string;
    defaultCategory: SocialActivity['category'];
};

export function CreateActivityDialog({ isOpen, onOpenChange, defaultTitle, defaultCategory }: CreateActivityDialogProps) {
    const [title, setTitle] = useState(defaultTitle);
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [maxParticipants, setMaxParticipants] = useState(10);
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [time, setTime] = useState("12:00 PM");

    const handleCreate = () => {
        console.log({
            title,
            description,
            location,
            maxParticipants,
            date,
            time
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a New Activity</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to get your group activity started.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What's the plan?" />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Select onValueChange={setLocation} defaultValue={location}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a venue" />
                                </SelectTrigger>
                                <SelectContent>
                                    {appData.map.pins.map(pin => (
                                        <SelectItem key={pin.id} value={pin.name}>{pin.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="participants">Max Participants</Label>
                            <Input id="participants" type="number" value={maxParticipants} onChange={(e) => setMaxParticipants(parseInt(e.target.value, 10))} />
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={date}
                                  onSelect={setDate}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="time">Time</Label>
                           <Input id="time" type="time" value={time} onChange={e => setTime(e.target.value)} />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleCreate}>Create Activity</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
