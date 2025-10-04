import { Header } from "@/components/iykyk/Header";
import { VibeSelector } from "@/components/iykyk/VibeSelector";
import { FlowTabs } from "@/components/iykyk/FlowTabs";
import { HotNow } from "@/components/iykyk/HotNow";
import { Deals } from "@/components/iykyk/Deals";
import { MyDay } from "@/components/iykyk/MyDay";
import { SurpriseMe } from "@/components/iykyk/SurpriseMe";
import { CommunityConnector } from "@/components/iykyk/CommunityConnector";
import { MobileNav } from "@/components/iykyk/MobileNav";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-8 p-4 md:p-6 pb-24">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">iykyk Vibe</h1>
          <p className="text-muted-foreground">What are you feeling right now?</p>
          <VibeSelector />
        </div>
        
        <FlowTabs />

        <HotNow />
        
        <Deals />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <MyDay />
            <CommunityConnector />
        </div>
        <SurpriseMe />

      </main>
      <MobileNav />
    </div>
  );
}
