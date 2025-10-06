
"use client";

import Link from "next/link";
import { appData } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

export function CommunityList() {
  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Join a Community</h2>
        <p className="text-muted-foreground mt-2">Connect with others who share your vibe.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {appData.communities.map((community) => {
          const category = appData.categories[community.category];
          const Icon = category?.icon || Users;
          return (
            <Card key={community.id} className="flex flex-col text-center items-center p-6 bg-card shadow-lg hover:shadow-xl transition-shadow hover:-translate-y-1">
                <CardHeader className="p-0">
                    <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto"
                        style={{ backgroundColor: category?.color ? `${category.color}33` : 'var(--primary-foreground)' }}
                    >
                        <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: category?.color || 'var(--primary)' }}
                        >
                            <Icon className="h-6 w-6" style={{ color: category?.textColor || 'var(--primary-foreground)' }}/>
                        </div>
                    </div>
                    <CardTitle>{community.name}</CardTitle>
                    <CardDescription className="mt-1">{community.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-0 mt-6 w-full flex-grow flex flex-col justify-end">
                    <Link href={`/community/${community.id}`}>
                        <Button className="w-full font-semibold">Enter Community</Button>
                    </Link>
                </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
