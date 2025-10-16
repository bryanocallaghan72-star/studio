
import { Header } from "@/components/iykyk/Header";
import { MobileNav } from "@/components/iykyk/MobileNav";
import { Card, CardDescription, CardTitle, CardContent } from "@/components/ui/card";
import { Sparkles, Map, Flame, Tag, Calendar, Users, Gift, Home, Compass, Zap, Shirt } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SurpriseMe } from '@/components/iykyk/SurpriseMe';
import { featureData } from '@/lib/features';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const iconMap = {
    Sparkles,
    Map,
    Flame,
    Tag,
    Calendar,
    Users,
    Gift,
    Home,
    Compass,
    Zap,
    Shirt,
};

export default function DiscoverPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <div className="flex flex-1 flex-col pb-24">
        <div className="p-4 md:p-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Your Cultural Concierge</h2>
            <p className="text-muted-foreground mt-2">The lifestyle OS. Shuffle plans, unlock perks, and discover Bondi in real-time.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 px-4 md:px-6 md:grid-cols-2">
            {featureData.map((feature) => {
                const image = PlaceHolderImages.find(img => img.id === feature.imageId);
                const Icon = iconMap[feature.icon as keyof typeof iconMap];

                return (
                  <Link key={feature.title} href={feature.href}>
                      <Card className="group relative w-full overflow-hidden rounded-xl transition-all hover:shadow-xl hover:-translate-y-1 bg-card h-48 flex items-center justify-center">
                          {image ? (
                            <>
                              <Image
                                src={image.imageUrl}
                                alt={feature.title}
                                width={image.width}
                                height={image.height}
                                className="absolute inset-0 object-cover w-full h-full transition-transform group-hover:scale-105"
                                data-ai-hint={image.imageHint}
                              />
                               <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                            </>
                          ) : (
                            <div className="absolute inset-0 bg-secondary" />
                          )}
                         
                          <div className="relative bottom-0 left-0 p-6 w-full">
                             <div className="flex items-center gap-3">
                                  <div className="rounded-full bg-background/80 backdrop-blur-sm p-3">
                                     {Icon && <Icon className={`h-6 w-6 ${feature.color}`} />}
                                  </div>
                                  <div>
                                     <CardTitle className="text-lg text-white">{feature.title}</CardTitle>
                                     <CardDescription className="text-white/90">{feature.description}</CardDescription>
                                  </div>
                              </div>
                          </div>
                      </Card>
                  </Link>
                )
            })}
        </div>

        <div className="px-4 md:px-6 mt-8 space-y-8">
            <Card>
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Gift className="h-8 w-8 text-accent" />
                        <h2 className="text-3xl font-bold tracking-tight">Surprise Me</h2>
                    </div>
                    <p className="text-muted-foreground">
                        Unlock hidden gems and spontaneous experiences with a single tap. A new adventure awaits!
                    </p>
                    <SurpriseMe />
                </div>
            </Card>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
