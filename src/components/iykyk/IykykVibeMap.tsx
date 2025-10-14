
"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Map } from "lucide-react";
import { cn } from "@/lib/utils";
import { ColorPinSVG } from "./ColorPinSVG";
import { appData } from "@/lib/data";

const { categories, map: { pins: venues } } = appData;

export function IykykVibeMap() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const [activeTab, setActiveTab] = useState(initialCategory);

  const filteredPins = venues.filter(pin => {
    return activeTab === 'All' || pin.type === activeTab;
  });

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
                    onClick={() => setActiveTab(category)}
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

        <div className="flex-grow flex flex-col relative aspect-[16/9] md:aspect-video mt-2 rounded-lg border overflow-hidden mx-4 md:mx-6">
            <div className="flex-grow bg-secondary/30 relative overflow-hidden">
                <svg width="100%" height="100%" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice">
                    {/* Background */}
                    <rect width="800" height="450" fill="hsl(var(--background))" />
                    
                    {/* Ocean */}
                    <path d="M 650,0 C 630,150 670,300 650,450 L 800,450 L 800,0 Z" fill="hsl(var(--accent) / 0.5)" />
                    <path d="M 680,0 C 660,150 700,300 680,450 L 800,450 L 800,0 Z" fill="hsl(var(--accent) / 0.5)" />

                    {/* Sand */}
                    <rect x="580" y="0" width="70" height="450" fill="hsl(35, 50%, 85%)" />
                    <text x="615" y="225" fontFamily="sans-serif" fill="hsl(var(--muted-foreground))" fontSize="14" transform="rotate(-90, 615, 225)">Bondi Beach</text>

                    {/* Roads */}
                    <g stroke="hsl(var(--border))" strokeWidth="2" fill="none">
                        <line x1="0" y1="100" x2="580" y2="100" />
                        <line x1="0" y1="225" x2="580" y2="225" />
                        <line x1="0" y1="350" x2="580" y2="350" />
                    </g>
                    
                    {/* Labels */}
                    <g fontFamily="sans-serif" fill="hsl(var(--muted-foreground))" fontSize="14">
                        <text x="500" y="95">Curlewis St</text>
                        <text x="500" y="220">Roscoe St</text>
                        <text x="500" y="345">Hall St</text>
                    </g>
                </svg>
                
                {filteredPins.map(pin => (
                  <Link key={pin.id} href={`/venue/${pin.slug}`} className="absolute group transform -translate-x-1/2 -translate-y-full cursor-pointer" style={{ left: pin.x, top: pin.y }} aria-label={`View details for ${pin.name}`}>
                    <ColorPinSVG className="w-8 h-8 drop-shadow-lg transition-transform duration-200 group-hover:scale-125" color={categories[pin.type as keyof typeof categories]?.color || '#FF7F50'} />
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

