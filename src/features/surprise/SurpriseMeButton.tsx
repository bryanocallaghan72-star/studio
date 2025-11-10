'use client';

import { Button } from "@/components/ui/button";
import { Gift, Sparkles } from "lucide-react";
import { AnimatePresence } from 'framer-motion';
import { useSurpriseMe } from "./useSurpriseMe";
import SurpriseMeModal from "./SurpriseMeModal";

export function SurpriseMeButton() {
    const {
        isGenerating,
        showModal,
        activity,
        handleGenerate,
        handleAccept,
        handleClose,
    } = useSurpriseMe();

    return (
        <>
            <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full flex items-center p-4 bg-secondary text-foreground rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                <div className="mr-6 bg-background/50 p-3 rounded-xl"><Sparkles size={32} /></div>
                <div className="text-left">
                    <h3 className="text-lg font-bold">Surprise Me</h3>
                    <p className="text-sm text-muted-foreground">{isGenerating ? 'Thinking...' : 'Shuffle a random itinerary.'}</p>
                </div>
            </button>

            <AnimatePresence>
                <SurpriseMeModal 
                    isOpen={showModal} 
                    onClose={handleClose} 
                    onAccept={handleAccept} 
                    onReshuffle={handleGenerate}
                    activity={activity} 
                    isGenerating={isGenerating} 
                />
            </AnimatePresence>
        </>
    );
}
