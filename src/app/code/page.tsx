
'use client';

import { Header } from "@/components/iykyk/Header";
import { MobileNav } from "@/components/iykyk/MobileNav";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { appData } from "@/lib/data";
import { Code, Rss, Trophy } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function CodePage() {
  // Sort creators by a mock 'score' or just use index for ranking display
  const rankedCreators = appData.creators.slice(0, 10);

  const getTrophyColor = (rank: number) => {
    if (rank === 0) return "text-yellow-400";
    if (rank === 1) return "text-gray-400";
    if (rank === 2) return "text-orange-400";
    return "text-muted-foreground";
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-6 pb-24">
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Code className="h-8 w-8 text-primary" />
            <div>
              <h2 className="text-3xl font-bold tracking-tight">iykyk Code</h2>
              <p className="text-muted-foreground">This week's top creators, ranked by their impact on Bondi's vibe.</p>
            </div>
          </div>

          <div className="space-y-4 mt-8">
            {rankedCreators.map((creator, index) => (
              <Card key={creator.id} className="group flex items-center overflow-hidden transition-all hover:shadow-xl hover:border-primary p-4 rounded-2xl border">
                 <div className="flex items-center gap-4 w-1/5">
                    <Trophy className={`h-6 w-6 ${getTrophyColor(index)}`} />
                    <span className="text-2xl font-bold text-muted-foreground">#{index + 1}</span>
                 </div>
                 <Avatar className="h-16 w-16 border-4 border-background shadow-lg">
                  <AvatarImage src={creator.avatar} alt={creator.name} />
                  <AvatarFallback>{creator.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="ml-4 flex-grow">
                    <h3 className="text-xl font-bold">{creator.name}</h3>
                    <p className="text-sm text-muted-foreground">@{creator.id}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Link href={`/profile/${creator.id}`}>
                        <Button variant="outline">Profile</Button>
                    </Link>
                     <Button>
                        <Rss className="mr-2 h-4 w-4" />
                        Follow
                    </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <MobileNav />
    </div>
  );
}
