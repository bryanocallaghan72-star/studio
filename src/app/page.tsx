
import { Header } from "@/components/iykyk/Header";
import { MobileNav } from "@/components/iykyk/MobileNav";
import { Card, CardContent } from "@/components/ui/card";
import { appData } from "@/lib/data";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";

export default function Home() {
  const categoriesToShow = Object.entries(appData.categories).filter(([key]) => key !== 'All');
  const creators = appData.creators.slice(0, 4); // Let's feature a few creators

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-8 p-4 md:p-6 pb-24">
        <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tighter">What's the vibe?</h1>
            <p className="text-muted-foreground mt-2">Select a category to explore the iykyk map.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categoriesToShow.map(([name, {icon: Icon, color, textColor}]) => (
                <Link key={name} href={`/map?category=${name}`}>
                    <Card className="aspect-square flex flex-col items-center justify-center p-6 text-center transition-all hover:scale-105 hover:shadow-xl" style={{ backgroundColor: color, color: textColor }}>
                        <Icon className="h-10 w-10 mb-2" />
                        <h3 className="font-bold text-lg">{name}</h3>
                    </Card>
                </Link>
            ))}
        </div>

        <div className="mt-8">
            <h2 className="text-3xl font-bold tracking-tight mb-4 flex items-center gap-3">
                <Users className="text-primary h-8 w-8"/>
                Featured Creators
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {creators.map(creator => (
                    <Link href={`/creator/${creator.id}`} key={creator.id}>
                        <Card className="aspect-[3/4] flex flex-col items-center justify-center p-4 text-center transition-all hover:scale-105 hover:shadow-xl">
                            <Avatar className="w-20 h-20 mb-4 border-4 border-primary/50">
                                <AvatarImage src={creator.avatar} alt={creator.name} />
                                <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <h3 className="font-bold text-lg">{creator.name}</h3>
                            <p className="text-sm text-muted-foreground">@{creator.id}</p>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
