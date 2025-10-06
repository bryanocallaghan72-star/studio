
import { CommunityList } from "@/components/iykyk/CommunityList";
import { Header } from "@/components/iykyk/Header";
import { MobileNav } from "@/components/iykyk/MobileNav";

export default function CommunityPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-6 pb-24">
        <CommunityList />
      </main>
      <MobileNav />
    </div>
  );
}
