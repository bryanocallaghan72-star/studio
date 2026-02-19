'use client';

import { useParams } from 'next/navigation';
import { doc, type Timestamp } from 'firebase/firestore';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { CommunityChat } from '@/components/iykyk/CommunityChat';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Community } from '@/lib/data';

// This type should align with the data stored in the 'socials' Firestore collection.
// Based on SocialPageClient.tsx and the data model.
type SocialActivity = {
    id: string;
    title: string;
    description: string;
    startAt: Timestamp;
    hostId: string;
    hostUsername: string;
    currentParticipants: number;
    maxParticipants: number;
    category: 'Health & Fitness' | 'Vibes' | 'Brunch' | 'Sushi';
};

export default function SocialChatPage() {
    const params = useParams();
    const id = params.id as string;
    const firestore = useFirestore();

    const socialDocRef = useMemoFirebase(() => {
        if (!firestore || !id) return null;
        return doc(firestore, 'socials', id);
    }, [firestore, id]);

    const { data: activity, isLoading, error } = useDoc<SocialActivity>(socialDocRef);

    if (isLoading) {
        return (
            <div className="flex h-full min-h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    
    // This handles both Firestore errors and the case where the document doesn't exist.
    if (error || !activity) {
        return (
            <Card className="m-4 md:m-6 text-center">
                <CardHeader>
                    <AlertTriangle className="mx-auto h-12 w-12 text-amber-500" />
                    <CardTitle className="mt-4">
                        {error ? "Error Loading Activity" : "Activity Not Found"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        {error ? error.message : "This social activity may have ended or the link is incorrect."}
                    </p>
                    <Button asChild className="mt-6">
                        <Link href="/social">Back to Social</Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    // The data is valid, construct the prop for CommunityChat
    const mockCommunity: Community = {
        id: activity.id,
        name: activity.title,
        description: activity.description,
        category: activity.category,
        members: activity.currentParticipants,
        channels: ["general"],
    };

    return <CommunityChat community={mockCommunity} />;
}
