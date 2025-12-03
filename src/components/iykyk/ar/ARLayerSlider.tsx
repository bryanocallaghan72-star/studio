
'use client';

import { useRef } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Layers, Flame, Tag, Gift, MessageSquare, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LayerType } from '@/app/ar/page';

type ARLayerSliderProps = {
    activeLayer: LayerType;
    setActiveLayer: (layer: LayerType) => void;
};

const layers: { id: LayerType, label: string; icon: React.ElementType }[] = [
    { id: 'all', label: 'All', icon: Layers },
    { id: 'fire', label: 'Fire', icon: Flame },
    { id: 'deals', label: 'Deals', icon: Tag },
    { id: 'drops', label: 'Drops', icon: Gift },
    { id: 'quests', label: 'Quests', icon: MessageSquare },
    { id: 'rewards', label: 'Rewards', icon: Crown },
];

const SLIDER_HEIGHT = 288; // h-72, which is 18rem or 288px

export function ARLayerSlider({ activeLayer, setActiveLayer }: ARLayerSliderProps) {
    const sliderRef = useRef<HTMLDivElement>(null);
    const activeLayerIndex = layers.findIndex(l => l.id === activeLayer);

    const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const slider = sliderRef.current;
        if (!slider) return;

        const sliderBounds = slider.getBoundingClientRect();
        // Calculate the local Y position of the drag event within the slider bounds
        const localY = info.point.y - sliderBounds.top;

        const segmentHeight = slider.clientHeight / layers.length;
        
        // Determine the new index based on the local Y position
        let newIndex = Math.floor(localY / segmentHeight);
        newIndex = Math.max(0, Math.min(layers.length - 1, newIndex)); // Clamp index

        const newLayer = layers[newIndex];
        if (newLayer && newLayer.id !== activeLayer) {
            setActiveLayer(newLayer.id);
        }
    };
    
    const segmentHeight = SLIDER_HEIGHT / layers.length;
    const dotY = activeLayerIndex * segmentHeight + segmentHeight / 2;

    return (
        <div
            ref={sliderRef}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-between h-72"
        >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-0.5 bg-white/30" />
            
            <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 z-20 h-8 w-8 flex items-center justify-center cursor-grab active:cursor-grabbing"
                style={{ y: dotY - 16 }} // Center the dot on the segment
                drag="y"
                dragConstraints={sliderRef}
                dragElastic={0.1}
                onDrag={handleDrag}
                dragMomentum={false} // Prevents overshooting
            >
                <div className="h-2.5 w-2.5 rounded-full bg-white shadow-lg ring-2 ring-black/30" />
            </motion.div>

            <div className="relative z-10 w-full h-full flex flex-col justify-around">
                {layers.map((layer) => {
                    const Icon = layer.icon;
                    const isActive = layer.id === activeLayer;
                    return (
                        <button
                            key={layer.id}
                            onClick={() => setActiveLayer(layer.id)}
                            className={cn(
                                "relative z-10 rounded-full transition-all duration-300 mx-auto",
                                isActive ? 'bg-white text-black scale-110 shadow-lg' : 'bg-black/50 text-white hover:bg-white/20'
                            )}
                        >
                            <Icon className="h-5 w-5 m-1.5" />
                        </button>
                    )
                })}
            </div>
        </div>
    );
}
