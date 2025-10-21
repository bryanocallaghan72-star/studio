'use client';

import { useRef } from 'react';
import { motion, useDragControls, PanInfo } from 'framer-motion';
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

const SLIDER_HEIGHT = 288; // h-72

export function ARLayerSlider({ activeLayer, setActiveLayer }: ARLayerSliderProps) {
    const dragControls = useDragControls();
    const sliderRef = useRef<HTMLDivElement>(null);
    const activeLayerIndex = layers.findIndex(l => l.id === activeLayer);

    const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const slider = sliderRef.current;
        if (!slider) return;

        const segmentHeight = SLIDER_HEIGHT / (layers.length - 1);
        const newIndex = Math.round(info.point.y / segmentHeight);

        if (newIndex >= 0 && newIndex < layers.length && layers[newIndex].id !== activeLayer) {
            setActiveLayer(layers[newIndex].id);
        }
    };
    
    const segmentHeight = SLIDER_HEIGHT / (layers.length - 1);
    const dotY = activeLayerIndex * segmentHeight;

    return (
        <div
            ref={sliderRef}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-between h-72 py-2"
            onPointerDown={(e) => dragControls.start(e)}
        >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-0.5 bg-white/30" />
            {layers.map((layer, index) => {
                const Icon = layer.icon;
                const isActive = layer.id === activeLayer;
                return (
                    <div key={layer.id} className={cn(
                        "relative z-10 rounded-full transition-all duration-300",
                        isActive ? 'bg-white text-black' : 'bg-black/50 text-white'
                    )}>
                        <Icon className="h-5 w-5 m-1.5" />
                    </div>
                )
            })}

            <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 z-20 h-8 w-8 flex items-center justify-center"
                style={{ y: dotY - 12 }}
                drag="y"
                dragControls={dragControls}
                dragConstraints={sliderRef}
                dragElastic={0.1}
                onDrag={handleDrag}
            >
                <div className="h-2.5 w-2.5 rounded-full bg-white shadow-lg" />
            </motion.div>
        </div>
    );
}
