'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { DEMO_VENUES } from '@/data/DemoVenues';
import { BookingConfirmationDialog } from './BookingConfirmationDialog';
import { Input } from '@/components/ui/input';
import { useFirestore, useUser, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';

type Venue = (typeof DEMO_VENUES)[0];

type BookingSheetProps = {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    venue: Venue;
    creatorId?: string | null;
};

export function BookingSheet({ isOpen, onOpenChange, venue, creatorId }: BookingSheetProps) {
    const firestore = useFirestore();
    const { user } = useUser();
    const [partySize, setPartySize] = useState('2');
    const [timeOption, setTimeOption] = useState('now');
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [time, setTime] = useState("19:30"); // Default 7:30 PM
    const [isConfirmationOpen, setConfirmationOpen] = useState(false);

    const handleRequestTable = () => {
        if (creatorId && user && firestore) {
            const influenceRef = collection(firestore, 'users', creatorId, 'influencedActions');
            const influenceData = {
                userId: user.uid,
                actionType: 'claimDeal', // Or a more specific 'bookTable'
                itemId: venue.id,
                timestamp: new Date().toISOString(),
            };
            addDocumentNonBlocking(influenceRef, influenceData);
        }

        // Close the booking sheet
        onOpenChange(false);
        // Open the confirmation dialog
        setConfirmationOpen(true);
    }

    return (
        <>
            <Sheet open={isOpen} onOpenChange={onOpenChange}>
                <SheetContent side="bottom" className="rounded-t-2xl">
                    <SheetHeader className="text-center">
                        <SheetTitle>Book a Table at {venue.name}</SheetTitle>
                        <SheetDescription>
                            Complete the details below to request your table.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="py-6 space-y-8">
                        {/* Party Size */}
                        <div className="space-y-4">
                            <Label className="text-lg font-semibold">Party Size</Label>
                            <RadioGroup defaultValue="2" value={partySize} onValueChange={setPartySize} className="flex gap-2">
                                {['2', '3', '4', '5+'].map(size => (
                                    <div key={size}>
                                        <RadioGroupItem value={size} id={`party-${size}`} className="sr-only" />
                                        <Label
                                            htmlFor={`party-${size}`}
                                            className={cn(
                                                "flex items-center justify-center rounded-full border-2 border-muted bg-popover p-4 w-16 h-16 font-bold text-xl cursor-pointer transition-all",
                                                "hover:bg-accent hover:text-accent-foreground",
                                                partySize === size && "bg-primary text-primary-foreground border-primary"
                                            )}
                                        >
                                            {size}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>

                        {/* Time Options */}
                        <div className="space-y-4">
                            <Label className="text-lg font-semibold">When</Label>
                            <RadioGroup defaultValue="now" value={timeOption} onValueChange={setTimeOption}>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="now" id="time-now" />
                                        <Label htmlFor="time-now" className="text-base">Now (within 30-60 mins)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="later" id="time-later" />
                                        <Label htmlFor="time-later" className="text-base">Later Today</Label>
                                    </div>
                                    {timeOption === 'later' && (
                                        <div className="pl-6 pt-2">
                                            <Input 
                                                id="time" 
                                                type="time" 
                                                value={time}
                                                onChange={e => setTime(e.target.value)}
                                                className="w-full"
                                            />
                                        </div>
                                    )}
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="another-day" id="time-another-day" />
                                        <Label htmlFor="time-another-day" className="text-base">Another Day</Label>
                                    </div>
                                     {timeOption === 'another-day' && (
                                        <div className="pl-6 pt-2 grid grid-cols-2 gap-4">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                                                </PopoverContent>
                                            </Popover>
                                             <Input 
                                                id="time-future" 
                                                type="time" 
                                                value={time}
                                                onChange={e => setTime(e.target.value)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </RadioGroup>
                        </div>
                    </div>

                    <SheetFooter>
                        <Button
                            type="submit"
                            className="w-full h-14 text-lg font-bold"
                            onClick={handleRequestTable}
                            disabled={!user}
                        >
                            {user ? 'Request Table' : 'Sign in to Request'}
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
            
            <BookingConfirmationDialog
                isOpen={isConfirmationOpen}
                onOpenChange={setConfirmationOpen}
                venue={venue}
                partySize={partySize}
                bookingTime={timeOption === 'now' ? 'ASAP' : time}
                bookingDate={date}
                creatorId={creatorId}
            />
        </>
    );
}
