
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const router = useRouter();

  const handleEnter = () => {
    router.push('/discover');
  };

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-black text-white">
      <video
        src="https://cdn.pixelbin.io/v2/throbbing-poetry-5e04c5/original/pexels-taryn-elliott-7876874__2160p_.mp4"
        poster="https://images.unsplash.com/photo-1593384581543-0a96116d34b6?q=80&w=2070&auto=format&fit=crop"
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 h-full w-full object-cover"
        data-ai-hint="Bondi sunset"
      />
      <div className="absolute inset-0 bg-black/50" />
      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h1 className="text-6xl font-black tracking-tighter text-white md:text-8xl">
          iykyk
        </h1>
        <p className="mt-2 text-lg text-white/80 md:text-xl">
          Your Cultural Concierge for Bondi
        </p>
        <Button
          onClick={handleEnter}
          className="mt-8 h-14 rounded-full bg-white px-10 text-lg font-bold text-black shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          Enter Bondi
        </Button>
      </motion.div>
    </div>
  );
}
