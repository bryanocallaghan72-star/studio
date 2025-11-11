'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Map, Sparkles, Tag } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  const handleEnter = () => {
    router.push('/discover');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background text-white">
      <Image
        src="https://images.unsplash.com/photo-1593384581543-0a96116d34b6?q=80&w=2070&auto=format&fit=crop"
        alt="Bondi Beach Sunset"
        fill
        className="object-cover"
        priority
        data-ai-hint="Bondi sunset"
      />
      <div className="absolute inset-0 bg-black/60" />
      
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center text-center p-4 h-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex-grow flex flex-col items-center justify-center">
            <motion.div variants={itemVariants}>
                <Badge variant="secondary" className="bg-white/10 backdrop-blur-sm border-white/20 text-white shadow-lg mb-4">
                    Your Real-Time Cultural Portal
                </Badge>
            </motion.div>

            <motion.h1 
                variants={itemVariants} 
                className="text-6xl font-black tracking-tighter text-white md:text-8xl"
            >
                iykyk
            </motion.h1>

            <motion.p 
                variants={itemVariants} 
                className="mt-2 text-lg text-white/80 md:text-xl max-w-lg"
            >
                The lifestyle OS for Bondi: shuffle plans, unlock perks, and discover the city in real-time.
            </motion.p>
            
            <motion.div variants={itemVariants} className="mt-8">
                <Button
                onClick={handleEnter}
                className="h-14 rounded-full bg-white px-10 text-lg font-bold text-black shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                Enter Bondi
                </Button>
            </motion.div>
        </div>

        <motion.div 
            variants={itemVariants} 
            className="flex-shrink-0 w-full max-w-2xl pb-8"
        >
            <div className="flex justify-around items-center text-center text-xs text-white/70">
                <div className="flex flex-col items-center gap-1">
                    <Map size={20} />
                    <span>Vibe Maps</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <Sparkles size={20} />
                    <span>Creator-led</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <Tag size={20} />
                    <span>Local Perks</span>
                </div>
            </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
