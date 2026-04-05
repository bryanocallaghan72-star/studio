'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, UserCheck, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  venueName: string;
  offerText: string;
  creatorHandle: string;
}

type Step = 'INTENT' | 'CODE' | 'SUCCESS';

export function ClaimModal({ isOpen, onClose, venueName, offerText, creatorHandle }: ClaimModalProps) {
  const [step, setStep] = useState<Step>('INTENT');
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep('INTENT');
      // Generate a random BND-XXX code
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let result = 'BND-';
      for (let i = 0; i < 3; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setCode(result);
    }
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full max-w-sm overflow-hidden rounded-[32px] bg-[#f2ece0] shadow-2xl"
          >
            <div className="p-8">
              {step === 'INTENT' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center text-center"
                >
                  <h3 className="text-2xl font-bold text-[#1a1208]">{venueName}</h3>
                  <p className="mt-1 text-sm font-medium text-[#c4762a] uppercase tracking-wider">{offerText}</p>
                  
                  <div className="my-6 h-[0.5px] w-full bg-black/5" />
                  
                  <p className="text-sm leading-relaxed text-[#1a1208]/60">
                    This perk is creator-verified and expires when the timer runs out. 
                    Show your code at the venue to redeem.
                  </p>
                  
                  <div className="mt-8 flex w-full flex-col gap-3">
                    <Button 
                      onClick={() => setStep('CODE')}
                      className="h-14 w-full rounded-2xl bg-[#c4762a] text-lg font-bold text-white shadow-lg shadow-[#c4762a]/20 hover:bg-[#b06824]"
                    >
                      Reveal My Code
                    </Button>
                    <button 
                      onClick={onClose}
                      className="py-2 text-sm font-medium text-[#1a1208]/40 hover:text-[#1a1208]/60 transition-colors"
                    >
                      Maybe later
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 'CODE' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center text-center"
                >
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#c4762a]">
                    Your Code
                  </span>
                  
                  <div className="relative mt-4 w-full">
                    <div className="flex items-center justify-center rounded-2xl border border-black/[0.08] bg-white py-5 px-6 shadow-sm">
                      <span className="font-mono text-4xl font-black tracking-[0.15em] text-[#1a1208]">
                        {code}
                      </span>
                    </div>
                    <button 
                      onClick={handleCopy}
                      className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#c4762a] text-white shadow-lg transition-transform active:scale-90"
                    >
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                    {copied && (
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#c4762a] animate-in fade-in slide-in-from-top-1">
                        COPIED TO CLIPBOARD!
                      </span>
                    )}
                  </div>
                  
                  <p className="mt-10 text-[11px] font-semibold text-[#1a1208]/40">
                    Valid for 24 hours · Show at venue
                  </p>
                  
                  <div className="my-6 h-[0.5px] w-full bg-black/5" />
                  
                  <div className="flex items-center gap-2 text-[12px] font-medium text-[#1a1208]/50">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#c4762a]/10">
                      <UserCheck size={12} className="text-[#c4762a]" />
                    </div>
                    <span>Drop by @{creatorHandle} · Verified Bondi local</span>
                  </div>
                  
                  <div className="mt-8 flex w-full flex-col gap-3">
                    <Button 
                      onClick={() => setStep('SUCCESS')}
                      className="h-14 w-full rounded-2xl bg-[#c4762a] text-lg font-bold text-white shadow-lg shadow-[#c4762a]/20 hover:bg-[#b06824]"
                    >
                      I'm Heading There 🤙
                    </Button>
                    <button 
                      onClick={onClose}
                      className="py-2 text-sm font-medium text-[#1a1208]/40 hover:text-[#1a1208]/60 transition-colors"
                    >
                      Save for later
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 'SUCCESS' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="relative mb-8 flex h-24 w-24 items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                      className="absolute inset-0 rounded-full bg-green-500/10"
                    />
                    <svg className="h-20 w-20 text-green-500" viewBox="0 0 100 100">
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                      <motion.path
                        d="M30 50L45 65L70 35"
                        stroke="currentColor"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.4, delay: 0.6 }}
                      />
                    </svg>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-[#1a1208]">You're in!</h3>
                  <p className="mt-2 text-sm text-[#1a1208]/60 leading-relaxed px-4">
                    Your spot is secured. Show your code when you arrive at {venueName}.
                  </p>
                  
                  <div className="mt-10 w-full">
                    <Button 
                      onClick={onClose}
                      className="h-14 w-full rounded-2xl bg-[#1a1208] text-lg font-bold text-white shadow-xl active:scale-95 transition-all"
                    >
                      See you in Bondi
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
