'use client';

import { useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generateSurprise } from './actions';
import { SurpriseOutput } from './schemas';

export function useSurpriseMe() {
    const [isGenerating, startTransition] = useTransition();
    const [showModal, setShowModal] = useState(false);
    const [activity, setActivity] = useState<SurpriseOutput | null>(null);
    const { toast } = useToast();

    const handleGenerate = () => {
        setActivity(null);
        setShowModal(true);

        startTransition(async () => {
            const result = await generateSurprise();
            if (result.error) {
                toast({
                    variant: "destructive",
                    title: 'Generation Failed',
                    description: result.error,
                });
                setShowModal(false); // Close modal on error
            } else if (result.success) {
                setActivity(result.success);
                // Modal remains open on success
            }
        });
    };

    const handleAccept = (acceptedActivity: SurpriseOutput) => {
        toast({
            title: "Let's Go!",
            description: `Get ready to check out ${acceptedActivity.name}.`,
        });
        setShowModal(false);
        setActivity(null);
        // In a real app, you might navigate here:
        // router.push(`/venue/${acceptedActivity.slug}`);
    };

    const handleClose = () => {
        setShowModal(false);
    }

    return {
        isGenerating,
        showModal,
        activity,
        handleGenerate,
        handleAccept,
        handleClose,
    };
}
