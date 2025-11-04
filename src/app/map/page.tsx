"use client";

import { IykykVibeMap } from "@/components/iykyk/IykykVibeMap";
import { Header } from "@/components/iykyk/Header";
import { MobileNav } from "@/components/iykyk/MobileNav";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

function MapContent() {
  return (
    <Suspense fallback={
        <div className="flex h-[80vh] w-full items-center justify-center bg-background">
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
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 pb-24">
        <MapContent />
      </main>
      <MobileNav />
    </div>
  );
}
