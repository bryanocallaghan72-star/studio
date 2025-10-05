
import { CommunityConnector } from "@/components/iykyk/CommunityConnector";
import { Deals } from "@/components/iykyk/Deals";
import { Features } from "@/components/iykyk/Features";
import { FlowTabs } from "@/components/iykyk/FlowTabs";
import { Header } from "@/components/iykyk/Header";
import { HotNow } from "@/components/iykyk/HotNow";
import { IykykVibeMap } from "@/components/iykyk/IykykVibeMap";
import { MapMyDay } from "@/components/iykyk/MapMyDay";
import { MobileNav } from "@/components/iykyk/MobileNav";
import { SurpriseMe } from "@/components/iykyk/SurpriseMe";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-8 p-4 md:p-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <IykykVibeMap />
                <Separator />
                <FlowTabs />
                <Separator />
                <Features />
            </div>
            <div className="space-y-8">
                <SurpriseMe />
                <MapMyDay />
                <HotNow />
                <Deals />
                <CommunityConnector />
            </div>
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
