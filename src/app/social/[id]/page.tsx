
import { CommunityChat } from "@/components/iykyk/CommunityChat";
import { appData, type SocialActivity } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function SocialChatPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const activity = (appData.socialActivities as SocialActivity[]).find(c => c.id === id);

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
        <CommunityChat community={mockCommunity} />
    );
}
