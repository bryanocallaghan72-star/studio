
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Flame, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ARLayerSlider } from '@/components/iykyk/ar/ARLayerSlider';
import { ARPinLayer } from '@/components/iykyk/ar/ARPinLayer';
import { ARCameraFeed } from '@/components/iykyk/ar/ARCameraFeed';
import { useCamera } from '@/hooks/useCamera';
import { AnimatePresence } from 'framer-motion';

export type LayerType = 'all' | 'fire' | 'deals' | 'drops' | 'quests' | 'rewards';

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
        <h1 className="text-lg font-bold">iykyk Lens</h1>
        <div className="w-10" />
      </header>

      {hasCameraPermission === true && (
        <>
            <ARPinLayer activeLayer={activeLayer} />
            <ARLayerSlider activeLayer={activeLayer} setActiveLayer={setActiveLayer} />
        </>
      )}
    </div>
  );
}
