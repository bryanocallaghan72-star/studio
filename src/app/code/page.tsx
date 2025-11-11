
'use client';

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { appData } from "@/lib/data";
import { Code, Rss, Trophy } from "lucide-react";
import Link from "next/link";
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

// Sort creators by a mock 'score' or just use index for ranking display
const rankedCreators = appData.creators.slice(0, 10);

const getTrophyColor = (rank: number) => {
  if (rank === 0) return "text-yellow-400"; // Gold
  if (rank === 1) return "text-slate-400";  // Silver
  if (rank === 2) return "text-orange-400"; // Bronze
  return "text-muted-foreground";
}

export default function CodePage() {
  return (
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
          <Card key={creator.id} className="group flex items-center overflow-hidden transition-all hover:shadow-xl p-4 rounded-2xl border hover:border-primary">
             <div className="flex items-center gap-4 w-1/12 md:w-1/5">
                <Trophy className={`h-6 w-6 ${getTrophyColor(index)}`} />
                <span className="text-2xl font-bold text-muted-foreground hidden md:inline">#{index + 1}</span>
             </div>
             <Avatar className="h-12 w-12 md:h-16 md:w-16 border-4 border-background shadow-lg">
              <AvatarImage src={creator.avatar} alt={creator.name} />
              <AvatarFallback>{creator.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="ml-4 flex-grow">
                <h3 className="text-lg md:text-xl font-bold">{creator.name}</h3>
                <p className="text-sm text-muted-foreground">@{creator.id}</p>
            </div>
            <div className="w-24 h-12 md:w-32 md:h-16 ml-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={creator.activity}>
                        <defs>
                            <linearGradient id={`colorUv-${index}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="uv" stroke="hsl(var(--primary))" strokeWidth={2} fill={`url(#colorUv-${index})`} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            <div className="hidden sm:flex flex-col sm:flex-row gap-2 ml-4">
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
  );
}
