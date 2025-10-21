"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Map } from "lucide-react";
import { cn } from "@/lib/utils";
import { ColorPinSVG } from "./ColorPinSVG";
import { appData } from "@/lib/data";

const { categories, map: { pins: venues } } = appData;

export function IykykVibeMap() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('category') || 'All';

  const handleTabChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category === 'All') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const filteredPins = useMemo(() => {
    return venues.filter(pin => {
      return activeTab === 'All' || pin.type === activeTab;
    });
  }, [activeTab]);

  return (
    <section>
        <div className="flex items-center gap-3 mb-4 p-4 md:p-6 pb-0">
            <Map className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold tracking-tight">iykyk Vibe</h2>
        </div>
        <p className="text-muted-foreground mb-4 p-4 md:p-6 pt-2">
            Explore Bondi's landscape. Tap a pin for more info.
        </p>

        <div className="flex overflow-x-auto pb-4 px-4 md:px-6 scrollbar-hide">
            {Object.entries(categories).map(([category, {icon: Icon, color, textColor}]) => (
                <button
                    key={category}
                    onClick={() => handleTabChange(category)}
                    data-active={activeTab === category}
                    className={cn(
                        "flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-full mx-1 transition-all duration-300 inline-flex items-center shadow-sm",
                        "bg-card text-foreground hover:bg-secondary",
                        "data-[active=true]:bg-[--active-bg] data-[active=true]:text-[--active-text]"
                    )}
                    style={{
                        "--active-bg": color,
                        "--active-text": textColor,
                    } as React.CSSProperties}
                >
                    <Icon className="mr-2 h-4 w-4" />
                    {category}
                </button>
            ))}
        </div>

        <div className="flex-grow flex flex-col relative aspect-[4/3] md:aspect-video mt-2 rounded-lg border overflow-hidden mx-4 md:mx-6">
            <div className="flex-grow bg-secondary/30 relative overflow-hidden">
                <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                    {/* Background */}
                    <rect width="800" height="600" fill="hsl(var(--background))" />

                    {/* Ocean - Starts far to the right at x=750 */}
                    <rect 
                        x="750" 
                        y="0" 
                        width="50" 
                        height="600" 
                        fill="hsl(var(--primary)/0.2)" 
                    />
                    
                    {/* Beach (Sand) - Starts just before the ocean at x=650 */}
                    <rect 
                        x="650" 
                        y="0" 
                        width="100" 
                        height="600" 
                        fill="hsl(var(--secondary))" 
                    />

                    {/* Wavy Shoreline Path - Starts at x=650 to align with the beach */}
                    <path 
                        d="M 650,0 C 640,150 660,300 650,450 C 640,525 660,550 650,600" 
                        stroke="hsl(var(--primary)/0.3)" 
                        strokeWidth="2" 
                        fill="none" 
                    />

                    {/* Roads - Make sure they stop before the beach starts (e.g., at x2="650") */}
                    <g stroke="hsl(var(--border))" strokeWidth="2" fill="none">
                        <line x1="0" y1="150" x2="650" y2="150" />
                        <line x1="0" y1="300" x2="650" y2="300" />
                        <line x1="0" y1="450" x2="650" y2="450" />
                    </g>

                    {/* Labels */}
                    <g fontFamily="sans-serif" fill="hsl(var(--muted-foreground))" fontSize="14">
                        <text x="560" y="145">Curlewis St</text>
                        <text x="560" y="295">Roscoe St</text>
                        <text x="560" y="445">Hall St</text>
                    </g>
                </svg>
                
                {filteredPins.map(pin => (
                  <Link key={pin.id} href={`/venue/${pin.slug}`} className="absolute group transform -translate-x-1/2 -translate-y-full cursor-pointer" style={{ left: pin.x, top: pin.y }}>
                    <ColorPinSVG className="w-8 h-8 drop-shadow-lg transition-transform duration-200 group-hover:scale-125" color={categories[pin.type as keyof typeof categories]?.color || '#FF7F50'} />
                    <span className="sr-only">View details for {pin.name}</span>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 rounded-lg bg-gray-800 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
                        {pin.name}
                    </div>
                  </Link>
                ))}
            </div>
        </div>
    </section>
  );
}
