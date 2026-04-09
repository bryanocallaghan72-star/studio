"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Ticket, Copy, Check } from "lucide-react";

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
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let result = "BND-";
      for (let i = 0; i < 3; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setCode(result);
    }
  }, [isOpen]);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else {
        const el = document.createElement("textarea");
        el.value = code;
        el.style.position = "absolute";
        el.style.left = "-9999px";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#f2ece0] border-none rounded-3xl shadow-2xl">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#c4762a]/10 mb-4">
            <Ticket className="h-6 w-6 text-[#c4762a]" />
          </div>
          <DialogTitle className="text-center text-2xl font-bold text-[#1a1208]">
            {deal.title}
          </DialogTitle>
          <DialogDescription className="text-center text-[rgba(26,18,8,0.60)]">
            {deal.description} at <strong>{deal.venue}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-6 p-4">
          <div className="relative w-full">
            <div className="flex items-center justify-center rounded-2xl border border-black/[0.08] bg-white py-8 px-6 shadow-sm">
              <span className="font-mono text-4xl font-black tracking-[0.2em] text-[#1a1208]">
                {code}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#c4762a] text-white shadow-lg transition-transform active:scale-90"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
          <div className="text-center space-y-1">
            <p className="text-xs font-bold text-[#c4762a] uppercase tracking-widest">
              Redemption Code
            </p>
            <p className="text-[11px] font-medium text-[rgba(26,18,8,0.40)]">
              Valid for 24 hours · Show at venue
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
