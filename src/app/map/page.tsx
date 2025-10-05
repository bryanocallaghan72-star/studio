
"use client";

import { IykykVibeMap } from "@/components/iykyk/IykykVibeMap";
import { Header } from "@/components/iykyk/Header";
import { MobileNav } from "@/components/iykyk/MobileNav";
import { Suspense } from "react";

function MapContent() {
  return <IykykVibeMap />;
}

export default function MapPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-8 p-4 md:p-6 pb-24">
        <Suspense fallback={<div>Loading map...</div>}>
          <MapContent />
        </Suspense>
      </main>
      <MobileNav />
    </div>
  );
}
