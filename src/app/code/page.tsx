
'use client';

import { Header } from "@/components/iykyk/Header";
import { MobileNav } from "@/components/iykyk/MobileNav";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { appData } from "@/lib/data";
import { Code, Rss } from "lucide-react";
import Link from "next/link";

export default function CodePage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-6 pb-24">
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Code className="h-8 w-8 text-primary" />
            <div>
              <h2 className="text-3xl font-bold tracking-tight">iykyk Code</h2>
              <p className="text-muted-foreground">The creators, curators, and characters who are the source code of Bondi's vibe.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {appData.creators.map((creator) => (
              <Card key={creator.id} className="group flex flex-col overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 rounded-2xl p-6 text-center items-center">
                 <Avatar className="h-24 w-24 border-4 border-background shadow-lg mb-4">
                  <AvatarImage src={creator.avatar} alt={creator.name} />
                  <AvatarFallback>{creator.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold">{creator.name}</h3>
                <p className="text-sm text-muted-foreground">@{creator.id}</p>
                <CardContent className="p-0 mt-4 text-center">
                    <p className="text-muted-foreground text-sm flex-grow">{creator.bio}</p>
                    <div className="flex gap-2 mt-4">
                        <Link href={`/profile/${creator.id}`} className="flex-1">
                            <Button variant="outline" className="w-full">View Profile</Button>
                        </Link>
                         <Button className="flex-1">
                            <Rss className="mr-2 h-4 w-4" />
                            Follow
                        </Button>
                    </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <MobileNav />
    </div>
  );
}
