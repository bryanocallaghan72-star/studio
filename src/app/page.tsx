'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

export default function LandingPage() {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Fade in the UI content over the background video after a short delay
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 800);

    // Explicitly trigger play to ensure video starts after hydration
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Video autoplay failed:", error);
      });
    }

    return () => clearTimeout(timer);
  }, []);

  const handleEnter = () => {
    router.push('/discover');
  };

  return (
    <div 
      className="fixed inset-0 z-[10001] flex flex-col items-center justify-start overflow-hidden bg-[#05014a] text-[#f4f0e8] w-full h-[100dvh]"
      style={{ paddingTop: 'clamp(80px, 15vh, 140px)' }}
    >
      
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="pointer-events-none absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 5 }}
      >
        <source src="/iykyk-Loading.mp4" type="video/mp4" />
      </video>
      
      {/* Premium Overlay Gradient - Always present to ensure text readability */}
      <div 
        className="absolute inset-0 z-10" 
        style={{ 
          background: 'linear-gradient(180deg, rgba(8,10,13,0.5) 0%, rgba(8,10,13,0.3) 40%, rgba(8,10,13,0.7) 100%)',
        }} 
      />

      {/* Main Landing UI Content */}
      <div
        className="relative z-20 text-center px-6 flex flex-col items-center"
        style={{
          opacity: showContent ? 1 : 0,
          transition: 'opacity 1.2s ease',
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

      {/* Subtle Attribution */}
      <div 
        className="absolute bottom-10 text-[10px] font-semibold text-[#f4f0e8]/20 tracking-[0.2em] uppercase z-20"
        style={{
          opacity: showContent ? 1 : 0,
          transition: 'opacity 1.5s ease',
        }}
      >
        Lifestyle OS v1.0
      </div>
    </div>
  );
}
