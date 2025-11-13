
'use client';

import { useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generateSurprise } from './actions';
import { SurpriseOption } from './schemas';

export function useSurpriseMe() {
    const [isGenerating, startTransition] = useTransition();
    const [showModal, setShowModal] = useState(false);
    const [activity, setActivity] = useState<SurpriseOption | null>(null);
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

    const handleAccept = (acceptedActivity: SurpriseOption) => {
        toast({
            title: "Let's Go!",
            description: `Time for a: ${acceptedActivity.title}.`,
        });
        setShowModal(false);
        setActivity(null);
        // This feature no longer links to a specific venue, so no navigation needed.
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
