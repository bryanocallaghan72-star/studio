
"use client";

import { IykykVibeMap } from "@/components/iykyk/IykykVibeMap";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

function MapContent() {
  return (
    <Suspense fallback={
        <div className="flex h-[calc(100vh-10rem)] w-full items-center justify-center bg-background">
            <div className="text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Loading Vibe Map...</p>
            </div>
        </div>
    }>
        <IykykVibeMap />
    </Suspense>
  );
}

export default function MapPage() {
  return (
      <div className="-m-4 md:-m-6 h-[calc(100vh-4rem)]">
        <MapContent />
      </div>
  );
}
