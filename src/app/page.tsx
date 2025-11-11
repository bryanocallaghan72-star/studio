'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Map, Users, Gift } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/firebase/auth/use-user';
import { PlaceHolderImages } from '@/lib/placeholder-images';

function LandingPageContent() {
  const { user, isUserLoading } = useUser();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
        <Sparkles className="h-12 w-12 animate-pulse text-primary" />
      </div>
    );
  }

  const image = PlaceHolderImages.find(p => p.id === 'bondi-sunset');

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background p-4 text-center">
      {image && (
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={image.imageUrl}
            alt="Sunset over Bondi Beach"
            fill
            className="object-cover"
            data-ai-hint={image.imageHint}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </motion.div>
      )}

      <div className="relative z-10 flex flex-col items-center">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-4 text-sm">
              <Sparkles className="mr-2 h-3 w-3 text-primary" />
              Your Real-Time Cultural Portal
            </Badge>
          </motion.div>
        </AnimatePresence>

        <motion.h1 
          className="text-5xl font-black tracking-tighter text-foreground md:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          iykyk
        </motion.h1>

        <motion.p 
          className="mt-4 max-w-lg text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          The lifestyle OS for Bondi. Shuffle plans, unlock perks, and discover your city in real-time through the eyes of local creators.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {isUserLoading ? (
             <Button size="lg" disabled>
                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                Loading...
             </Button>
          ) : (
            <Link href={user ? "/discover" : "/login"} passHref legacyBehavior>
              <Button asChild size="lg">
                <a>
                  {user ? "Enter, you're on the list" : "Get Started"}
                  <ArrowRight className="ml-2" />
                </a>
              </Button>
            </Link>
          )}
        </motion.div>

        <motion.div 
            className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
        >
            <span className="flex items-center gap-1.5"><Map className="h-4 w-4"/> Vibe Maps</span>
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4"/> Creator-led</span>
            <span className="flex items-center gap-1.5"><Gift className="h-4 w-4"/> Local Perks</span>
        </motion.div>
      </div>
    </div>
  );
}

export default function Home() {
  return <LandingPageContent />;
}
