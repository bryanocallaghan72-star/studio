
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
                    className={cn(
                        "flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-full mx-1 transition-all duration-300 inline-flex items-center shadow-sm",
                        activeTab === category
                            ? `text-[${textColor}]`
                            : 'bg-card text-foreground hover:bg-secondary'
                    )}
                    style={{
                        backgroundColor: activeTab === category ? color : undefined
                    }}
                >
                    <Icon className="mr-2 h-4 w-4" />
                    {category}
                </button>
            ))}
        </div>

        <div className="flex-grow flex flex-col relative aspect-[4/3] md:aspect-video mt-2 rounded-lg border overflow-hidden mx-4 md:mx-6">
            <div className="flex-grow bg-secondary relative overflow-hidden">
                <div className="w-full h-full absolute inset-0">
                <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
                    <defs>
                        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"/>
                            <feOffset in="blur" dx="2" dy="2" result="offsetBlur"/>
                            <feMerge>
                                <feMergeNode in="offsetBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    {/* Ocean */}
                    <rect width="800" height="600" fill="#aadaff" />
                    {/* Land Mass */}
                    <rect width="700" height="600" fill="#f5f3ef" />
                    {/* Beach */}
                    <path d="M 700 0 C 650 150, 650 450, 700 600 L 750 600 C 700 450, 700 150, 750 0 Z" fill="#ffeebc"/>
                    {/* Roads - simplified grid based on screenshot */}
                    <g stroke="#d4d4d4" strokeWidth="6">
                        {/* Campbell Parade */}
                        <path d="M680 0 C 630 150, 630 450, 680 600" fill="none" />
                        {/* Hall St */}
                        <line x1="0" y1="480" x2="650" y2="480" />
                        {/* Roscoe St */}
                        <line x1="0" y1="350" x2="660" y2="350" />
                        {/* Curlewis St */}
                        <line x1="0" y1="250" x2="670" y2="250" />
                        {/* Blair St */}
                        <line x1="0" y1="150" x2="680" y2="150" />
                        {/* Vertical Roads */}
                        <line x1="500" y1="0" x2="500" y2="600" />
                        <line x1="350" y1="0" x2="350" y2="600" />
                        <line x1="200" y1="0" x2="200" y2="600" />
                    </g>

                    {/* Labels */}
                    <g fontFamily="Poppins, sans-serif" fill="#7a7a7a" fontSize="14">
                        <text x="635" y="300" transform="rotate(90 635,300)">Campbell Parade</text>
                        <text x="520" y="475">Hall St</text>
                        <text x="520" y="345">Roscoe St</text>
                        <text x="520" y="245">Curlewis St</text>
                        <text x="520" y="145">Blair St</text>
                        <text x="710" y="40" fontSize="18" fill="#54a0d1">North Bondi</text>
                        <text x="710" y="500" fontSize="18" fill="#eac47c">Bondi Beach</text>
                    </g>
                </svg>
                </div>
                
                {filteredPins.map(pin => (
                  <Link key={pin.id} href={`/venue/${pin.slug}`} className="absolute group transform -translate-x-1/2 -translate-y-full cursor-pointer" style={{ left: pin.x, top: pin.y }}>
                    <ColorPinSVG className="w-10 h-10 drop-shadow-lg transition-transform duration-200 group-hover:scale-125" color={categories[pin.type as keyof typeof categories]?.color || '#FF7F50'} />
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
