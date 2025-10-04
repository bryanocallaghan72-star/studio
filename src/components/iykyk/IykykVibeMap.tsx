
"use client";

import { useState } from "react";
import Link from "next/link";
import { Map } from "lucide-react";
import { cn } from "@/lib/utils";
import { ColorPinSVG } from "./ColorPinSVG";
import { appData } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const { categories, map: { pins: venues }, creators } = appData;

export function IykykVibeMap() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPins = venues.filter(pin => {
    const categoryMatch = activeTab === 'All' || pin.type === activeTab;
    const searchMatch = pin.name.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  return (
    <section>
        <div className="flex items-center gap-3 mb-4">
            <Map className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold tracking-tight">iykyk Vibe</h2>
        </div>
        <p className="text-muted-foreground mb-4">
            Explore Bondi's landscape. Tap a pin for a venue, or an avatar for a creator.
        </p>

        <div className="flex justify-center overflow-x-auto pb-4 scrollbar-hide">
            {Object.entries(categories).map(([category, {icon: Icon, color, textColor}]) => (
                <button 
                    key={category} 
                    onClick={() => setActiveTab(category)} 
                    className={cn(
                        "flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-full mx-1 transition-all duration-200 inline-flex items-center",
                        activeTab !== category && 'bg-card text-card-foreground hover:bg-secondary'
                    )}
                    style={activeTab === category ? { backgroundColor: color, color: textColor } : {}}
                >
                    <Icon className="mr-2 h-4 w-4" />
                    {category}
                </button>
            ))}
        </div>

        <div className="flex-grow flex flex-col relative aspect-[4/3] md:aspect-video mt-2 rounded-lg border overflow-hidden">
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
                
                {activeTab === 'All' && creators.map(creator => (
                    <Link key={creator.id} href={`/creator/${creator.id}`} className="absolute group transform -translate-x-1/2 -translate-y-1/2 cursor-pointer" style={{ left: creator.x, top: creator.y }}>
                        <Avatar className="h-12 w-12 border-2 border-primary shadow-lg transition-transform duration-200 group-hover:scale-110 animate-pulse">
                            <AvatarImage src={creator.avatar} alt={creator.name} />
                            <AvatarFallback>{creator.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 rounded-lg bg-gray-800 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
                            @{creator.id}
                        </div>
                    </Link>
                ))}

                {filteredPins.map(pin => (
                  <Link key={pin.id} href={`/venue/${pin.slug}`} className="absolute group transform -translate-x-1/2 -translate-y-full cursor-pointer" style={{ left: pin.x, top: pin.y }}>
                    <ColorPinSVG className="w-10 h-10 drop-shadow-lg transition-transform duration-200 group-hover:scale-125" color={categories[pin.type]?.color || '#FF7F50'} />
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
