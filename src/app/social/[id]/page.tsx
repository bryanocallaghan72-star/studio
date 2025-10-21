
import { CommunityChat } from "@/components/iykyk/CommunityChat";
import { Header } from "@/components/iykyk/Header";
import { MobileNav } from "@/components/iykyk/MobileNav";
import { appData } from "@/lib/data";
import { notFound } from "next/navigation";

export default function SocialChatPage({ params }: { params: { id: string } }) {
    const activity = appData.socialActivities.find(c => c.id === params.id);

    if (!activity) {
        notFound();
    }

    // The CommunityChat component can be adapted or we can pass the activity object.
    // For now, let's create a mock community object to satisfy its props.
    const mockCommunity = {
        id: activity.id,
        name: activity.title,
        description: activity.description,
        category: activity.category,
        members: activity.participants,
        channels: ['general'],
    };

    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
          <Header />
          <main className="flex-1 flex flex-col pb-24">
            <CommunityChat community={mockCommunity} />
          </main>
          <MobileNav />
        </div>
      );
}
