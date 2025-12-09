'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import type { DEMO_VENUES } from '@/data/DemoVenues';

type Venue = (typeof DEMO_VENUES)[0];

type BookingConfirmationDialogProps = {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    venue: Venue;
    partySize: string;
    bookingTime: string;
    bookingDate?: Date;
};

export function BookingConfirmationDialog({ isOpen, onOpenChange, venue, partySize, bookingTime, bookingDate }: BookingConfirmationDialogProps) {

    const formattedDate = bookingDate ? new Date(bookingDate).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Today';

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader className="items-center text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                      <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>
                    <DialogTitle className="text-2xl">Request Sent!</DialogTitle>
                    <DialogDescription className="text-base pt-2">
                        Your request for a table for <strong>{partySize}</strong> at <strong>{venue.name}</strong> has been sent.
                    </DialogDescription>
                </DialogHeader>
                <div className="text-center text-muted-foreground my-4">
                    <p>{formattedDate} at {bookingTime}</p>
                    <p className="text-sm mt-4">The venue will confirm your booking shortly, usually via SMS.</p>
                </div>
                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)} className="w-full h-12 text-lg">
                        Awesome!
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
