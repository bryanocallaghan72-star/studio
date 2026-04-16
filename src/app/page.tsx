'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
      {/* Scoped CSS to hide potential Gemini/AI widgets on this page only */}
      <style dangerouslySetInnerHTML={{ __html: `
        [data-gemini], 
        .gemini-widget,
        button[aria-label*="Gemini"],
        button[aria-label*="Google"],
        .google-ai-widget,
        [class*="gemini"],
        [id*="gemini"] {
          display: none !important;
        }
      ` }} />
      
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

      {/* Top Branding Content */}
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
      </div>

      {/* Bottom CTA Actions */}
      <div 
        className="absolute bottom-[clamp(40px,8vh,80px)] left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-4 w-full px-6"
        style={{
          opacity: showContent ? 1 : 0,
          transition: 'opacity 1.5s ease',
          transitionDelay: '0.4s'
        }}
      >
        <button
          onClick={handleEnter}
          className="px-[40px] py-[14px] text-[13px] font-medium tracking-[0.15em] uppercase text-[#f4f0e8] border border-[#f4f0e8]/30 rounded-[32px] bg-transparent transition-all duration-500 hover:bg-[#f4f0e8]/10 hover:border-[#f4f0e8]/60 active:scale-95 backdrop-blur-sm whitespace-nowrap"
        >
          Enter Bondi
        </button>
        
        <Link 
          href="/auth" 
          className="text-[11px] font-medium text-[#f4f0e8]/40 hover:text-[#f4f0e8]/70 transition-colors underline underline-offset-4"
        >
          New here? Create an account
        </Link>
      </div>

      {/* Subtle Attribution */}
      <div 
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-[#f4f0e8]/20 tracking-[0.2em] uppercase z-20 whitespace-nowrap"
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
