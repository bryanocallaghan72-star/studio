
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

        <div className="flex-grow flex flex-col relative aspect-[4/3] md:aspect-video mt-2 rounded-lg border overflow-hidden mx-4 md:mx-6">
            <div className="flex-grow bg-secondary relative overflow-hidden">
                <div className="w-full h-full absolute inset-0">
                <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
                    {/* Ocean */}
                    <rect width="800" height="600" fill="#aadaff" />
                    
                    {/* Land Mass */}
                    <path d="M 0 0 H 680 Q 720 300 680 600 H 0 Z" fill="#f5f3ef" />

                    {/* Beach */}
                    <path d="M 680 0 Q 640 150, 640 300 T 680 600 L 710 600 Q 670 300 710 0 Z" fill="#ffeebc"/>

                    {/* Grassy Knoll & Park Areas */}
                    <path d="M 660 0 H 710 V 150 Q 690 140 660 120 Z" fill="#c8e6c9" />
                    <path d="M 660 480 Q 690 490 710 520 V 600 H 660 Z" fill="#c8e6c9" />
                    <path d="M 300 500 H 500 V 580 H 300 Z" fill="#dcedc8" />


                    {/* Roads */}
                    <g stroke="#d4d4d4" strokeWidth="6" fill="none">
                        {/* Campbell Parade */}
                        <path d="M 670 0 Q 630 150, 630 300 T 670 600" strokeWidth="8" />
                        {/* Hall St */}
                        <path d="M 0 480 H 640" />
                        {/* Roscoe St */}
                        <path d="M 200 350 H 635" />
                        {/* Curlewis St */}
                        <path d="M 0 250 H 650" />
                         {/* Gould St */}
                        <path d="M 300 420 H 635" />
                         {/* Bondi Rd */}
                        <path d="M 0 550 H 350 L 400 480" />
                    </g>

                     {/* Labels */}
                    <g fontFamily="Poppins, sans-serif" fill="#7a7a7a" fontSize="14">
                        <text x="625" y="300" transform="rotate(90 625,300)">Campbell Pde</text>
                        <text x="520" y="475">Hall St</text>
                        <text x="520" y="345">Roscoe St</text>
                         <text x="520" y="415">Gould St</text>
                        <text x="520" y="245">Curlewis St</text>
                        <text x="250" y="545">Bondi Rd</text>
                        <text x="710" y="40" fontSize="18" fill="#54a0d1">North Bondi</text>
                        <text x="710" y="500" fontSize="18" fill="#eac47c">Bondi Beach</text>
                    </g>
                </svg>
                </div>
                
                {filteredPins.map(pin => (
                  <Link key={pin.id} href={`/venue/${pin.slug}`} className="absolute group transform -translate-x-1/2 -translate-y-full cursor-pointer" style={{ left: pin.x, top: pin.y }} aria-label={`View details for ${pin.name}`}>
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
