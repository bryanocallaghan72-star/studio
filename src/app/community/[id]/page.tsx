
import { CommunityChat } from "@/components/iykyk/CommunityChat";
import { Header } from "@/components/iykyk/Header";
import { MobileNav } from "@/components/iykyk/MobileNav";
import { appData } from "@/lib/data";
import { notFound } from "next/navigation";

export default function CommunityChatPage({ params }: { params: { id: string } }) {
    const community = appData.communities.find(c => c.id === params.id);

    if (!community) {
        notFound();
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
          <Header />
          <main className="flex-1 flex flex-col pb-24">
            <CommunityChat community={community} />
          </main>
          <MobileNav />
        </div>
      );
}
