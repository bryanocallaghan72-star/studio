'use client';

import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  X, 
  MapPin, 
  Utensils, 
  ShoppingCart, 
  Wine,
  Waves,
  Dumbbell
} from "lucide-react";
import { AnimatePresence, motion } from 'framer-motion';
import { SurpriseOutput } from "./schemas";
import Link from 'next/link';

const SurpriseMeModal = ({ isOpen, onClose, onAccept, onReshuffle, activity, isGenerating }: {
  isOpen: boolean;
  onClose: () => void;
  onAccept: (activity: SurpriseOutput) => void;
  onReshuffle: () => void;
  activity: SurpriseOutput | null;
  isGenerating: boolean;
}) => {
  if (!isOpen) return null;

  const icons: { [key: string]: React.ReactNode } = {
    'Health & Fitness': <Dumbbell size={48} className="text-pink-400" />,
    'Brunch': <Utensils size={48} className="text-orange-400" />,
    'Lunch': <Utensils size={48} className="text-teal-400" />,
    'Retail': <ShoppingCart size={48} className="text-blue-400" />,
    'Cocktails': <Wine size={48} className="text-purple-400" />,
    'Nightlife': <Sparkles size={48} className="text-yellow-400" />,
    'Restaurants': <Utensils size={48} className="text-red-400" />,
    'Sushi': <MapPin size={48} className="text-green-400" />,
    'Vibes': <Sparkles size={48} className="text-yellow-400" />,
    'Surf': <Waves size={48} className="text-sky-400" />,
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
      <motion.div 
        className="relative bg-card text-foreground rounded-3xl shadow-2xl p-8 w-full max-w-md text-center border"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X size={24} />
        </button>
        
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
                <Sparkles size={48} className="text-primary mx-auto mb-4 animate-pulse" />
                <h2 className="text-2xl font-bold mb-2">Thinking of something...</h2>
                <p className="text-sm text-muted-foreground">Finding the perfect vibe for you.</p>
            </motion.div>
          ) : activity ? (
            <motion.div
              key="activity"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mx-auto mb-4 w-20 h-20 bg-secondary rounded-full flex items-center justify-center">
                {icons[activity.type] || <Sparkles size={48} className="text-primary" />}
              </div>
              <h2 className="text-2xl font-bold mb-2">Your next move...</h2>
              <p className="text-lg font-semibold mb-1">{activity.name}</p>
              <p className="text-sm text-muted-foreground mb-6">{activity.notes}</p>
              
              <div className="space-y-3">
                <Link href={`/venue/${activity.slug}`} passHref>
                    <Button onClick={() => onAccept(activity)} className="w-full px-8 py-3 h-auto text-base rounded-full font-bold shadow-lg transform active:scale-95 transition-transform">
                        Let's Go!
                    </Button>
                </Link>
                <Button onClick={onReshuffle} variant="ghost" className="w-full px-8 py-3 h-auto rounded-full font-semibold transition-colors hover:bg-secondary">
                  Try Again
                </Button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SurpriseMeModal;
