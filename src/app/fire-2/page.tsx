
import { Header } from "@/components/iykyk/Header";
import { HotNow } from "@/components/iykyk/HotNow";
import { MobileNav } from "@/components/iykyk/MobileNav";

export default function FirePage2() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-6 pb-24">
        <h1 className="text-2xl font-bold mb-4">iykyk Fire 2.0</h1>
        <HotNow />
      </main>
      <MobileNav />
    </div>
  );
}
