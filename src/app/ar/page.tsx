
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, CameraOff, Flame, Sparkles, Tag, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { appData } from '@/lib/data';
import { cn } from '@/lib/utils';

type LayerType = 'all' | 'fire' | 'deals';

const getPinsForLayer = (layer: LayerType) => {
    let filteredVenues = [];

    switch (layer) {
        case 'fire':
            const fireVenues = new Set(appData.hotItems.map(item => item.venue));
            filteredVenues = appData.map.pins.filter(pin => fireVenues.has(pin.name));
            break;
        case 'deals':
            const dealVenues = new Set(appData.deals.map(item => item.venue));
            filteredVenues = appData.map.pins.filter(pin => dealVenues.has(pin.name));
            break;
        case 'all':
        default:
            filteredVenues = appData.map.pins;
            break;
    }

    return filteredVenues.slice(0, 6).map((pin, index) => ({
      id: pin.id,
      name: pin.name,
      type: pin.type,
      slug: pin.slug,
      style: {
        top: `${15 + (index % 3) * 25}%`,
        left: `${15 + (index % 2) * 50 + Math.random() * 10 - 5}%`,
        animationDelay: `${index * 0.15}s`,
      },
    }));
}


export default function ARPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [activeLayer, setActiveLayer] = useState<LayerType>('all');
  
  const arPins = useMemo(() => getPinsForLayer(activeLayer), [activeLayer]);

  const layers = [
      { id: 'all', label: 'All', icon: Layers },
      { id: 'fire', label: 'Fire', icon: Flame },
      { id: 'deals', label: 'Deals', icon: Tag },
  ] as const;

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    };

    getCameraPermission();

    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black text-white">
      <video ref={videoRef} className="absolute inset-0 h-full w-full object-cover" autoPlay muted playsInline />
      <div className="absolute inset-0 bg-black/40" />
      
      <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
        <Link href="/discover" passHref>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-lg font-bold">iykyk Lens</h1>
        <div className="w-10" />
      </header>

      {hasCameraPermission === false && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
          <Alert variant="destructive" className="bg-destructive/80 text-destructive-foreground border-destructive-foreground/50">
            <CameraOff className="h-4 w-4" />
            <AlertTitle>Camera Access Required</AlertTitle>
            <AlertDescription>
              Please allow camera access in your browser settings to use the iykyk Lens. You may need to click the lock icon in the address bar.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {hasCameraPermission === true && (
        <div className="relative z-10 h-full w-full">
          {arPins.map(pin => (
            <motion.div
              key={pin.id}
              className="absolute"
              style={pin.style}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 100 }}
            >
              <Link href={`/venue/${pin.slug || pin.name.toLowerCase().replace(/ /g, '-')}`}>
                <div className="group relative cursor-pointer">
                    <div className="animate-pulse absolute -inset-2.5 rounded-full bg-primary/30 blur-lg"></div>
                    <div className="relative rounded-full border-2 border-white/50 bg-black/60 px-4 py-2 text-center shadow-lg backdrop-blur-md transition-all group-hover:scale-110 group-hover:bg-primary">
                        <p className="font-bold text-white">{pin.name}</p>
                        <Badge variant="secondary" className="mt-1">{pin.type}</Badge>
                    </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      <footer className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center justify-center p-6 bg-gradient-to-t from-black/50 to-transparent">
        <div className="flex items-center gap-2 rounded-full bg-black/50 p-2 backdrop-blur-md">
            {layers.map(layer => {
                const Icon = layer.icon;
                return (
                    <Button 
                        key={layer.id} 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setActiveLayer(layer.id)}
                        className={cn(
                            "rounded-full transition-colors h-12 w-12 flex-col gap-1 text-xs",
                            activeLayer === layer.id 
                                ? 'bg-primary text-primary-foreground' 
                                : 'text-white hover:bg-white/20 hover:text-white'
                        )}
                    >
                       <Icon className="h-5 w-5" />
                       <span>{layer.label}</span>
                    </Button>
                );
            })}
        </div>
        <p className="mt-4 text-sm font-semibold">Point your camera to discover what's hot</p>
      </footer>
    </div>
  );
}
