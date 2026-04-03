'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useDailyCard } from '@/hooks/useDailyCard';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

// Map alignment internal types to semantic glow tokens
const cardColorStyles: Record<string, { glow: string; text: string; token?: string }> = {
  water: { glow: 'glow-from', text: 'glow-text', token: 'energy' },
  fire: { glow: 'glow-from', text: 'glow-text', token: 'love' },
  earth: { glow: 'glow-from', text: 'glow-text', token: 'abundance' },
  air: { glow: 'from-slate-500/50', text: 'text-slate-300' },
  social: { glow: 'from-indigo-500/50', text: 'text-indigo-300' },
  calm: { glow: 'glow-from', text: 'glow-text', token: 'clarity' },
};

const DailyCardSkeleton = () => (
    <div className="w-full max-w-md mx-auto p-4">
        <Card className="aspect-[9/14] w-full bg-card/80 backdrop-blur-lg p-6 flex flex-col justify-center items-center text-center">
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
  const styles = cardColorStyles[type] || cardColorStyles.calm;

  return (
    <section className="flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight">iykyk Alignment</h2>
            <p className="text-muted-foreground mt-2">Your daily energy card and Bondi ritual.</p>
        </div>

        <div data-glow={styles.token} className="relative w-full max-w-md">
            {/* Background Glow */}
            <motion.div
                className={cn(
                    "absolute -inset-4 rounded-3xl blur-2xl opacity-60",
                    !styles.token && "bg-gradient-to-br to-transparent",
                    styles.glow
                )}
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Floating Card */}
            <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
                <Card className="relative aspect-[9/14] w-full bg-card/80 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                    <div className="h-full flex flex-col justify-between items-center text-center p-8">
                        
                        <CardHeader className="p-0">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className={cn("mx-auto mb-6", styles.text)}
                            >
                                <Icon size={64} strokeWidth={1.5} />
                            </motion.div>
                            <h3 className="text-2xl font-bold tracking-tight text-foreground">{title}</h3>
                        </CardHeader>
                        
                        <CardContent className="p-0">
                            <p className="text-muted-foreground">{description}</p>
                        </CardContent>

                        <CardFooter className="p-0 flex-col gap-4 w-full">
                            <div className="w-full p-4 bg-black/10 rounded-lg border border-white/5">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your Ritual</p>
                                <p className="font-medium text-foreground mt-1">{ritual}</p>
                            </div>
                            <Button className="w-full">Share my Vibe</Button>
                        </CardFooter>
                    </div>
                </Card>
            </motion.div>
        </div>
        <p className="text-xs text-muted-foreground mt-8">A new card will be drawn for you at midnight.</p>
    </section>
  );
}
