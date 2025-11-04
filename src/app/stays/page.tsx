import { Header } from "@/components/iykyk/Header";
import { StaysList } from "@/components/iykyk/StaysList";
import { MobileNav } from "@/components/iykyk/MobileNav";

export default function StaysPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-6 pb-24">
        <StaysList />
      </main>
      <MobileNav />
    </div>
  );
}
