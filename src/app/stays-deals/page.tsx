
import { Header } from "@/components/iykyk/Header";
import { StaysDeals } from "@/components/iykyk/StaysDeals";
import { MobileNav } from "@/components/iykyk/MobileNav";

export default function StaysDealsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-6 pb-24">
        <StaysDeals />
      </main>
      <MobileNav />
    </div>
  );
}
