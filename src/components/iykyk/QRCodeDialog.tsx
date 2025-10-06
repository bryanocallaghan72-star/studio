
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Ticket } from "lucide-react";
import { QRCodeSVG } from "./QRCodeSVG";

type Deal = {
  title: string;
  venue: string;
  description: string;
};

type QRCodeDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  deal: Deal;
};

export function QRCodeDialog({ isOpen, onOpenChange, deal }: QRCodeDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Ticket className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-2xl">{deal.title}</DialogTitle>
          <DialogDescription className="text-center">
            {deal.description} at <strong>{deal.venue}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-4 p-4">
          <div className="p-4 bg-white rounded-lg border">
            <QRCodeSVG className="h-48 w-48" />
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Show this code to the staff to redeem your perk.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
