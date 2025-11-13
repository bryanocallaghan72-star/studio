
'use client';

import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  X, 
  MapPin, 
  Dumbbell,
  Wind,
  Users
} from "lucide-react";
import { AnimatePresence, motion } from 'framer-motion';
import { SurpriseOption } from "./schemas";
import Link from 'next/link';

const SurpriseMeModal = ({ isOpen, onClose, onAccept, onReshuffle, activity, isGenerating }: {
  isOpen: boolean;
  onClose: () => void;
  onAccept: (activity: SurpriseOption) => void;
  onReshuffle: () => void;
  activity: SurpriseOption | null;
  isGenerating: boolean;
}) => {
  if (!isOpen) return null;

  // Map vibe to a specific icon and color
  const vibeIcons: { [key: string]: React.ReactNode } = {
    'active': <Dumbbell size={48} className="text-pink-400" />,
    'chill': <Wind size={48} className="text-blue-400" />,
    'social': <Users size={48} className="text-purple-400" />,
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
                {vibeIcons[activity.vibe] || <Sparkles size={48} className="text-primary" />}
              </div>
              <h2 className="text-2xl font-bold mb-2">{activity.title}</h2>
              <p className="text-sm text-muted-foreground mb-4">{activity.description}</p>
              
              {activity.locationHint && (
                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground bg-secondary/50 rounded-full px-3 py-1 mb-6">
                    <MapPin size={12} />
                    <span>{activity.locationHint}</span>
                </div>
              )}

              <div className="space-y-3">
                <Button onClick={() => onAccept(activity)} className="w-full px-8 py-3 h-auto text-base rounded-full font-bold shadow-lg transform active:scale-95 transition-transform">
                    Sounds good!
                </Button>
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
