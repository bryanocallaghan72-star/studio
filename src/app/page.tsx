'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const router = useRouter();
  const [videoEnded, setVideoEnded] = useState(false);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    // Show skip button after 1.5s delay
    const timer = setTimeout(() => {
      setShowSkip(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = () => {
    router.push('/discover');
  };

  const handleSkip = () => {
    setVideoEnded(true);
  };

  return (
    <div className="fixed inset-0 z-[10001] flex flex-col items-center justify-center overflow-hidden bg-[#05014a] text-[#f4f0e8] w-full h-[100dvh]">
      
      {/* Intro Video - Plays once */}
      <video
        autoPlay
        muted
        playsInline
        onEnded={() => setVideoEnded(true)}
        className="pointer-events-none"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: videoEnded ? 0 : 1,
          transition: 'opacity 0.8s ease',
          zIndex: 5,
        }}
      >
        <source src="/videos/iykyk-intro.mp4" type="video/mp4" />
      </video>
      
      {/* Premium Overlay Gradient - Always present behind content */}
      <div 
        className="absolute inset-0 z-10" 
        style={{ 
          background: 'linear-gradient(180deg, rgba(8,10,13,0.4) 0%, rgba(8,10,13,0.2) 40%, rgba(8,10,13,0.6) 100%)',
          opacity: videoEnded ? 1 : 0,
          transition: 'opacity 0.8s ease',
        }} 
      />

      {/* Main Landing UI Content */}
      <div
        className="relative z-20 text-center px-6 flex flex-col items-center"
        style={{
          opacity: videoEnded ? 1 : 0,
          transition: 'opacity 0.8s ease',
          transitionDelay: '0.3s'
        }}
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
      </div>

      {/* Subtle Skip Option */}
      <AnimatePresence>
        {showSkip && !videoEnded && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleSkip}
            className="absolute bottom-5 right-5 z-[30] p-4 text-[11px] font-medium tracking-[0.1em] text-[#f4f0e8]/30 uppercase hover:text-[#f4f0e8]/60 transition-colors"
          >
            Skip
          </motion.button>
        )}
      </AnimatePresence>

      {/* Subtle Attribution */}
      <div 
        className="absolute bottom-10 text-[10px] font-semibold text-[#f4f0e8]/20 tracking-[0.2em] uppercase z-20"
        style={{
          opacity: videoEnded ? 1 : 0,
          transition: 'opacity 0.8s ease',
          transitionDelay: '0.5s'
        }}
      >
        Lifestyle OS v1.0
      </div>
    </div>
  );
}
