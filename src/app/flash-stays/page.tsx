import { Header } from "@/components/iykyk/Header";
import { FlashStays } from "@/components/iykyk/FlashStays";
import { MobileNav } from "@/components/iykyk/MobileNav";

export default function FlashStaysPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-6 pb-24">
        <FlashStays />
      </main>
      <MobileNav />
    </div>
  );
}
