import { Header } from "@/components/iykyk/Header";
import { IykykVibeMap } from "@/components/iykyk/IykykVibeMap";
import { FlowTabs } from "@/components/iykyk/FlowTabs";
import { HotNow } from "@/components/iykyk/HotNow";
import { Deals } from "@/components/iykyk/Deals";
import { MapMyDay } from "@/components/iykyk/MapMyDay";
import { SurpriseMe } from "@/components/iykyk/SurpriseMe";
import { CommunityConnector } from "@/components/iykyk/CommunityConnector";
import { MobileNav } from "@/components/iykyk/MobileNav";
import { Features } from "@/components/iykyk/Features";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-8 p-4 md:p-6 pb-24">
        <IykykVibeMap />
        
        <FlowTabs />

        <HotNow />
        
        <Deals />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <MapMyDay />
            <CommunityConnector />
        </div>
        <SurpriseMe />

        <Features />

      </main>
      <MobileNav />
    </div>
  );
}
