"use client";

import { useState } from "react";
import Link from "next/link";
import { Map, MapPin, ShoppingBag, Beer, Utensils, Coffee, Heart, Sun, Dumbbell, Calendar, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ColorPinSVG } from "./ColorPinSVG";

const categories = {
    "All": { icon: Sparkles, color: "#FF7F50" },
    "Brunch": { icon: Coffee, color: "#FFA07A" },
    "Restaurants": { icon: Utensils, color: "#FA8072" },
    "Nightlife": { icon: Beer, color: "#E9967A" },
    "Health & Fitness": { icon: Dumbbell, color: "#40E0D0" },
    "Vibes": { icon: Sun, color: "#48D1CC" },
    "Sushi": { icon: Utensils, color: "#20B2AA" },
    "Cocktails": { icon: Beer, color: "#008B8B" },
    "Retail": { icon: ShoppingBag, color: "#AFEEEE" },
    "Events": { icon: Calendar, color: "#7FFFD4" },
};

const venues = [
    { id: 1, name: "Icebergs Dining Room", slug: "icebergs-dining-room", type: "Restaurants", x: "30%", y: "80%" },
    { id: 2, name: "Hotel Ravesis", slug: "hotel-ravesis", type: "Nightlife", x: "55%", y: "30%" },
    { id: 3, name: "The Depot", slug: "the-depot", type: "Brunch", x: "65%", y: "65%" },
    { id: 4, name: "Bondi Beach", slug: "bondi-beach", type: "Vibes", x: "25%", y: "15%" },
    { id: 5, name: "Raw Bar", slug: "raw-bar", type: "Sushi", x: "40%", y: "50%" },
    { id: 6, name: "Speedo's Cafe", slug: "speedos-cafe", type: "Brunch", x: "80%", y: "25%" },
    { id: 7, name: "Totti's", slug: "tottis", type: "Restaurants", x: "85%", y: "75%" },
    { id: 8, name: "Bondi Trattoria", slug: "bondi-trattoria", type: "Restaurants", x: "20%", y: "55%" },
    { id: 9, name: "The Corner House", slug: "the-corner-house", type: "Cocktails", x: "75%", y: "45%" },
    { id: 10, name: "Harry's Bondi", slug: "harrys-bondi", type: "Brunch", x: "15%", y: "40%" },
    { id: 11, name: "LULU", slug: "lulu-pan-asian", type: "Restaurants", x: "50%", y: "60%" },
    { id: 12, name: "RND Izakaya", slug: "rnd-izakaya", type: "Restaurants", x: "10%", y: "70%" },
    { id: 13, name: "Luca and Luca", slug: "luca-and-luca-gelato", type: "Brunch", x: "70%", y: "20%" },
    { id: 14, name: "Volume One", slug: "volume-one", type: "Cocktails", x: "55%", y: "85%" },
];


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
            Explore Bondi's landscape. Tap a pin to feel the vibe.
        </p>

        <div className="flex justify-center overflow-x-auto pb-4 scrollbar-hide">
            {Object.entries(categories).map(([category, {icon: Icon}]) => (
                <button 
                    key={category} 
                    onClick={() => setActiveTab(category)} 
                    className={cn(
                        "flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-full mx-1 transition-all duration-200 inline-flex items-center",
                        activeTab === category 
                            ? 'bg-primary text-primary-foreground shadow-md' 
                            : 'bg-card text-card-foreground hover:bg-secondary'
                    )}
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
