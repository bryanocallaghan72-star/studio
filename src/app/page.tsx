
import { Header } from "@/components/iykyk/Header";
import { MobileNav } from "@/components/iykyk/MobileNav";
import { Card, CardContent } from "@/components/ui/card";
import { appData } from "@/lib/data";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Home() {
  const categoriesToShow = Object.entries(appData.categories).filter(([key]) => key !== 'All');

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
      </main>
      <MobileNav />
    </div>
  );
}
