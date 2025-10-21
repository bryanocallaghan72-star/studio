'use client';

import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
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
            <Button 
                variant="secondary" 
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 mt-4" 
                onClick={handleGenerate}
                disabled={isGenerating && showModal}
            >
                <Gift className="mr-2 h-5 w-5" />
                Surprise Me
            </Button>

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
