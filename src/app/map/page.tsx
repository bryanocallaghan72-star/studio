
"use client";

import { IykykVibeMap } from "@/components/iykyk/IykykVibeMap";
import { Header } from "@/components/iykyk/Header";
import { MobileNav } from "@/components/iykyk/MobileNav";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { DesktopNav } from "@/components/iykyk/DesktopNav";

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
    <div className="flex min-h-screen w-full flex-col bg-background">
      <div className="md:flex">
        <DesktopNav />
        <main className="flex-1 md:pl-16">
          <Header />
          <div className="flex-1 pb-24 md:pb-0">
            <MapContent />
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}

