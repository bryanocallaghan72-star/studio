
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { appData } from "@/lib/data";
import { Users, UserPlus, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";

export type Community = {
  id: string;
  name: string;
  description: string;
  category: string;
  members: number;
  channels: string[];
};

export function CommunityList() {
    const firestore = useFirestore();
    const communitiesQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'communities');
    }, [firestore]);

    const { data: communities, isLoading } = useCollection<Community>(communitiesQuery);

    if (isLoading) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <section>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold tracking-tight">Find Your Tribe</h2>
                <p className="text-muted-foreground mt-2">
                    Connect with themed groups, from sushi lovers to cocktail hunters.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(communities || []).map(community => {
                    const categoryMeta = appData.categories[community.category];
                    const CategoryIcon = categoryMeta?.icon;
                    return (
                        <Card key={community.id} className="flex flex-col text-center items-center p-6 bg-card shadow-lg hover:shadow-xl transition-shadow hover:-translate-y-1">
                             <CardHeader className="p-0 items-center">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto bg-primary/10">
                                    {CategoryIcon ? <CategoryIcon className="h-8 w-8 text-primary" /> : <Users className="h-8 w-8 text-primary" />}
                                </div>
                                <CardTitle>{community.name}</CardTitle>
                                <CardDescription className="mt-1">{community.description}</CardDescription>
                            </CardHeader>
                             <CardContent className="p-0 mt-4 w-full flex-grow flex flex-col justify-end">
                                <Badge variant="outline" className="mx-auto mb-4">
                                    {community.members} members
                                </Badge>
                                <Link href={`/social/${community.id}`} className="w-full">
                                    <Button className="w-full font-semibold">
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        Join
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </section>
    );
}
