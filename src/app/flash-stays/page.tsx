
import { Header } from "@/components/iykyk/Header";
import { HotNow } from "@/components/iykyk/HotNow";
import { MobileNav } from "@/components/iykyk/MobileNav";

export default function FlashStaysPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-6 pb-24">
        <HotNow />
      </main>
      <MobileNav />
    </div>
  );
}
