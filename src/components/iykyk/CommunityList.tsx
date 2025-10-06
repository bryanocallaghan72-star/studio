
import { appData } from "@/lib/data";
import { ArrowRight, Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function CommunityList() {
    return (
        <section>
            <div className="flex items-center gap-3 mb-4">
                <Users className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold tracking-tight">Communities</h2>
            </div>
            <p className="text-muted-foreground mb-6">
                Join the conversation, share tips, and connect with people who share your vibe.
            </p>
            <div className="grid grid-cols-1 gap-4">
                {appData.communities.map((community) => {
                    const CategoryIcon = appData.categories[community.category]?.icon || Users;
                    return (
                        <Link href={`/community/${community.id}`} key={community.id}>
                            <Card className="group transition-all hover:shadow-xl hover:-translate-y-1">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <div className="rounded-lg bg-primary/10 p-3">
                                        <CategoryIcon className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex-grow">
                                        <CardTitle className="text-lg">{community.name}</CardTitle>
                                        <CardDescription>{community.description}</CardDescription>
                                    </div>
                                     <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                                </CardHeader>
                                <CardContent className="flex items-center justify-between text-sm text-muted-foreground pt-0 pl-6 pr-6 pb-4">
                                     <Badge variant="secondary">{community.members} members</Badge>
                                </CardContent>
                            </Card>
                        </Link>
                    )
                })}
            </div>
        </section>
    );
}
