
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Flame, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ARLayerSlider } from '@/components/iykyk/ar/ARLayerSlider';
import { ARPinLayer } from '@/components/iykyk/ar/ARPinLayer';
import { ARCameraFeed } from '@/components/iykyk/ar/ARCameraFeed';
import { useCamera } from '@/hooks/useCamera';
import { AnimatePresence, motion } from 'framer-motion';
import { MobileNav } from '@/components/iykyk/MobileNav';

export type LayerType = 'all' | 'fire' | 'deals' | 'drops' | 'quests' | 'rewards';

const LENS_LABELS: Record<LayerType, string> = {
  all: 'All vibes',
  fire: 'Fire',
  deals: 'Deals',
  drops: 'Drops',
  quests: 'Quests',
  rewards: 'Rewards',
};

export default function ARPage() {
  const [activeLayer, setActiveLayer] = useState<LayerType>('all');
  const { videoRef, hasCameraPermission } = useCamera();

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black text-white">
      <ARCameraFeed videoRef={videoRef} hasCameraPermission={hasCameraPermission} />
      
      <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
        <Link href="/discover" passHref>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <ArrowLeft />
          </Button>
        </Link>
        {/* The h1 is now replaced by the dynamic HUD */}
        <div className="w-10" />
      </header>

      {/* Lens HUD */}
      <motion.div
        className="absolute top-4 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="rounded-full bg-black/60 px-4 py-1.5 backdrop-blur-md border border-white/15 shadow-lg">
          <p className="text-xs font-medium text-white/80 tracking-wide">
            iykyk Lens · {LENS_LABELS[activeLayer]}
          </p>
        </div>
      </motion.div>

      {hasCameraPermission === true && (
        <>
            <ARPinLayer activeLayer={activeLayer} />
            <ARLayerSlider activeLayer={activeLayer} setActiveLayer={setActiveLayer} />
        </>
      )}
      <MobileNav />
    </div>
  );
}
