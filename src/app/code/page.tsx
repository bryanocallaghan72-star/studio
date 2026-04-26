
'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Code, Rss, Trophy, Loader2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { useCreators } from '@/hooks/useCreators';

const getTrophyColor = (rank: number) => {
  if (rank === 0) return "text-yellow-400"; // Gold
  if (rank === 1) return "text-slate-400";  // Silver
  if (rank === 2) return "text-orange-400"; // Bronze
  return "text-muted-foreground";
}

const MOCK_ACTIVITY = [
    { name: 'Mon', uv: 4000 },
    { name: 'Tue', uv: 3000 },
    { name: 'Wed', uv: 2000 },
    { name: 'Thu', uv: 2780 },
    { name: 'Fri', uv: 1890 },
    { name: 'Sat', uv: 2390 },
    { name: 'Sun', uv: 3490 },
];

export default function CodePage() {
  const [isClient, setIsClient] = useState(false);
  const { creators, isLoading } = useCreators();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (isLoading) {
    return (
        <div className="flex h-[50vh] w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#c4762a]" />
        </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f2ece0] p-4 md:p-6 pb-32">
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#c4762a]/10">
            <Code className="h-6 w-6 text-[#c4762a]" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-[#1a1208] uppercase italic">CODE</h1>
            <p className="text-[13px] font-bold text-[rgba(26,18,8,0.40)] uppercase tracking-widest">Bondi's source code · Top creators</p>
          </div>
        </div>
      </header>

      <div className="space-y-4 max-w-lg mx-auto w-full">
        {creators.length > 0 ? (
          creators.slice(0, 10).map((creator, index) => (
            <Link key={creator.id} href={`/profile/${creator.id}`}>
              <Card className="group flex items-center overflow-hidden transition-all active:scale-[0.98] hover:shadow-md p-4 rounded-2xl border border-black/[0.06] bg-white">
                <div className="flex items-center gap-3 w-10 flex-shrink-0">
                    <Trophy className={`h-5 w-5 ${getTrophyColor(index)}`} />
                    <span className="text-sm font-black text-[rgba(26,18,8,0.20)]">{index + 1}</span>
                </div>
                
                <Avatar className="h-12 w-12 border-2 border-[#f2ece0] shadow-sm">
                  <AvatarImage src={creator.avatar} alt={creator.name} />
                  <AvatarFallback className="font-bold">{creator.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>

                <div className="ml-4 flex-grow min-w-0">
                    <h3 className="text-base font-bold text-[#1a1208] truncate">{creator.name}</h3>
                    <p className="text-[11px] font-bold text-[rgba(26,18,8,0.40)]">@{creator.id}</p>
                </div>

                <div className="w-16 h-8 ml-2 hidden sm:block">
                    {isClient && (
                      <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={MOCK_ACTIVITY}>
                              <Area 
                                type="monotone" 
                                dataKey="uv" 
                                stroke="#c4762a" 
                                strokeWidth={2} 
                                fill="transparent" 
                              />
                          </AreaChart>
                      </ResponsiveContainer>
                    )}
                </div>

                <div className="ml-4 text-[rgba(26,18,8,0.20)]">
                  <ChevronRight size={18} />
                </div>
              </Card>
            </Link>
          ))
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-black/[0.05] rounded-3xl">
            <p className="text-sm font-bold text-[rgba(26,18,8,0.40)] uppercase tracking-widest">No creators found</p>
            <p className="text-xs text-[rgba(26,18,8,0.30)] mt-2">Become the first verified creator in the code.</p>
          </div>
        )}
      </div>
    </div>
  );
}
