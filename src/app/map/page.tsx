
import { Header } from "@/components/iykyk/Header";
import { IykykVibeMap } from "@/components/iykyk/IykykVibeMap";
import { MobileNav } from "@/components/iykyk/MobileNav";
import { Suspense } from "react";

const MapPageContent = () => {
    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <Header />
            <main className="flex flex-1 flex-col gap-8 p-4 md:p-6 pb-24">
                <IykykVibeMap />
            </main>
            <MobileNav />
        </div>
    )
}

export default function MapPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <MapPageContent />
    </Suspense>
  );
}
