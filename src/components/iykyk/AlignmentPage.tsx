'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useDailyCard } from '@/hooks/useDailyCard';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

// Map alignment internal types to semantic glow colors
// We keep the glow for atmosphere but ensure it's subtle on the light theme
const cardGlowStyles: Record<string, string> = {
  water: 'rgba(126, 184, 247, 0.15)',
  fire: 'rgba(249, 115, 22, 0.15)',
  earth: 'rgba(16, 185, 129, 0.15)',
  air: 'rgba(148, 163, 184, 0.15)',
  social: 'rgba(99, 102, 241, 0.15)',
  calm: 'rgba(167, 139, 250, 0.15)',
};

const DailyCardSkeleton = () => (
    <div className="w-full max-w-md mx-auto p-4">
        <Card className="aspect-[9/14] w-full bg-[#faf7f2] p-6 flex flex-col justify-center items-center text-center rounded-[24px]">
            <Skeleton className="h-16 w-16 rounded-full mb-6" />
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-5/6 mb-8" />
            <Skeleton className="h-10 w-full" />
        </Card>
    </div>
);

export function AlignmentPage() {
  const dailyCard = useDailyCard();

  if (!dailyCard) {
    return <DailyCardSkeleton />;
  }

  const { title, description, ritual, icon: Icon, type } = dailyCard;
  const glowColor = cardGlowStyles[type] || cardGlowStyles.calm;

  return (
    <section className="flex flex-col items-center justify-center p-4 bg-[#f2ece0] min-h-[calc(100vh-83px)] pb-32">
        <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-[#1a1208]">iykyk Alignment</h2>
            <p className="text-[13px] font-medium text-[rgba(26,18,8,0.45)] uppercase tracking-widest mt-2">Your daily ritual · Bondi</p>
        </div>

        <div className="relative w-full max-w-md">
            {/* Ambient Ritual Glow */}
            <motion.div
                className="absolute -inset-8 rounded-full blur-3xl opacity-50"
                style={{ backgroundColor: glowColor }}
                animate={{ opacity: [0.3, 0.5, 0.3], scale: [0.95, 1.05, 0.95] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Floating Ritual Card */}
            <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
                <Card 
                  className="relative aspect-[9/14] w-full bg-[#faf7f2] rounded-[24px] overflow-hidden shadow-xl border-x-[0.5px] border-b-[0.5px] border-black/[0.08]"
                  style={{ borderTop: '3px solid #c4762a' }}
                >
                    <div className="h-full flex flex-col justify-between items-center text-center p-8">
                        
                        <CardHeader className="p-0 flex flex-col items-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                                className="mb-6 text-[#c4762a]"
                            >
                                <Icon size={64} strokeWidth={1.2} />
                            </motion.div>
                            <h3 className="text-2xl font-bold tracking-tight text-[#1a1208] leading-tight">
                              {title}
                            </h3>
                        </CardHeader>
                        
                        <CardContent className="p-0">
                            <p className="text-[15px] leading-relaxed text-[rgba(26,18,8,0.60)]">
                              {description}
                            </p>
                        </CardContent>

                        <CardFooter className="p-0 flex-col gap-6 w-full">
                            {/* Ritual Box with Copper Tint Wash */}
                            <div className="w-full p-5 bg-[rgba(196,118,42,0.08)] rounded-[16px] border-[0.5px] border-[rgba(196,118,42,0.20)] text-left">
                                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#c4762a]">Your Ritual</p>
                                <p className="text-[14px] font-medium text-[#1a1208] mt-2 leading-relaxed">
                                  {ritual}
                                </p>
                            </div>
                            
                            <Button className="w-full h-12 bg-[#c4762a] hover:bg-[#b06824] text-white font-bold rounded-[16px] shadow-lg shadow-[#c4762a]/15 transition-all active:scale-95">
                              Share my Vibe
                            </Button>
                        </CardFooter>
                    </div>
                </Card>
            </motion.div>
        </div>
        
        <div className="mt-10 flex flex-col items-center gap-1 opacity-40">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#1a1208]">Next draw at midnight</p>
          <div className="w-1 h-1 rounded-full bg-[#c4762a]" />
        </div>
    </section>
  );
}
