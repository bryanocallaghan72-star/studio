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
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-black text-white">
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
        className="relative z-10 text-center px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h1 className="text-6xl font-black tracking-tighter text-[#f4f0e8] md:text-8xl">
          iykyk
        </h1>
        <p className="mt-4 text-lg text-[#f4f0e8]/60 font-light tracking-wide md:text-xl">
          Your Cultural Concierge for Bondi
        </p>
        <Button
          onClick={handleEnter}
          className="mt-12 h-14 rounded-full border border-[#f4f0e8]/30 bg-transparent px-12 text-lg font-medium text-[#f4f0e8] backdrop-blur-md transition-all hover:bg-[#f4f0e8]/10 active:scale-95"
        >
          Enter Bondi
        </Button>
      </motion.div>
    </div>
  );
}
