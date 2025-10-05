
import { CommunityConnector } from "@/components/iykyk/CommunityConnector";
import { Header } from "@/components/iykyk/Header";
import { MobileNav } from "@/components/iykyk/MobileNav";

export default function CommunityConnectorPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-6 pb-24 flex items-center justify-center">
        <CommunityConnector />
      </main>
      <MobileNav />
    </div>
  );
}
