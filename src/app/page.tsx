import { Header } from "@/components/iykyk/Header";
import { VibeSelector } from "@/components/iykyk/VibeSelector";
import { FlowTabs } from "@/components/iykyk/FlowTabs";
import { HotNow } from "@/components/iykyk/HotNow";
import { Deals } from "@/components/iykyk/Deals";
import { MyDay } from "@/components/iykyk/MyDay";
import { SurpriseMe } from "@/components/iykyk/SurpriseMe";
import { CommunityConnector } from "@/components/iykyk/CommunityConnector";
import { Features } from "@/components/iykyk/Features";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-8 p-4 md:p-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">iykyk Vibe</h1>
          <p className="text-muted-foreground">Mood-based suggestions for your current desires.</p>
          <VibeSelector />
        </div>
        
        <Features />

        <FlowTabs />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="flex flex-col gap-8 lg:col-span-2">
            <HotNow />
            <Deals />
          </div>
          <div className="flex flex-col gap-8">
            <MyDay />
            <SurpriseMe />
            <CommunityConnector />
          </div>
        </div>
      </main>
    </div>
  );
}
