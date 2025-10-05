
import { Header } from "@/components/iykyk/Header";
import { Deals } from "@/components/iykyk/Deals";
import { MobileNav } from "@/components/iykyk/MobileNav";

export default function DealsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-6 pb-24">
        <Deals />
      </main>
      <MobileNav />
    </div>
  );
}
