'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const router = useRouter();

  const handleEnter = () => {
    router.push('/discover');
  };

  return (
    <div className="fixed inset-0 z-[10001] flex flex-col items-center justify-center overflow-hidden bg-[#0a0c0f] text-[#f4f0e8] w-full h-[100dvh]">
      {/* Cinematic Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.7
        }}
      >
        <source src="/videos/bondi-hero.mp4" type="video/mp4" />
      </video>
      
      {/* Premium Overlay Gradient */}
      <div 
        className="absolute inset-0" 
        style={{ 
          background: 'linear-gradient(180deg, rgba(8,10,13,0.4) 0%, rgba(8,10,13,0.2) 40%, rgba(8,10,13,0.6) 100%)' 
        }} 
      />

      <motion.div
        className="relative z-10 text-center px-6 flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <h1 className="text-[clamp(48px,8vw,80px)] font-bold tracking-[-0.04em] leading-none text-[#f4f0e8] lowercase">
          iykyk
        </h1>
        <p className="mt-[12px] text-[clamp(14px,2vw,18px)] font-light tracking-[0.1em] text-[#f4f0e8]/60 uppercase">
          Your Cultural Concierge for Bondi
        </p>
        
        <button
          onClick={handleEnter}
          className="mt-[48px] px-[40px] py-[14px] text-[13px] font-medium tracking-[0.15em] uppercase text-[#f4f0e8] border border-[#f4f0e8]/30 rounded-[32px] bg-transparent transition-all duration-500 hover:bg-[#f4f0e8]/10 hover:border-[#f4f0e8]/60 active:scale-95 backdrop-blur-sm"
        >
          Enter Bondi
        </button>
      </motion.div>

      {/* Subtle Attribution */}
      <div className="absolute bottom-10 text-[10px] font-semibold text-[#f4f0e8]/20 tracking-[0.2em] uppercase">
        Lifestyle OS v1.0
      </div>
    </div>
  );
}
