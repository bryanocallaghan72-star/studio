
import { Feed } from "@/components/iykyk/Feed";
import { Header } from "@/components/iykyk/Header";
import { MobileNav } from "@/components/iykyk/MobileNav";

export default function FeedPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col pb-24">
        <Feed />
      </main>
      <MobileNav />
    </div>
  );
}
