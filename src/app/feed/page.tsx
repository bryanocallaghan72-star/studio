
import { Feed } from "@/components/iykyk/Feed";
import { Header } from "@/components/iykyk/Header";
import { MobileNav } from "@/components/iykyk/MobileNav";
import { DesktopNav } from "@/components/iykyk/DesktopNav";

export default function FeedPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <div className="md:flex">
        <DesktopNav />
        <main className="flex-1 md:pl-16">
          <Header />
          <div className="flex flex-1 flex-col pb-24">
            <Feed />
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
