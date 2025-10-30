
'use server';

// This file is automatically run by Next.js when the server starts.
// It is used to initialize server-side resources like Genkit.

import { ai } from '@/ai/genkit.server';
import { defineNextActions } from '@genkit-ai/next';

// This function is required to be exported. It registers all Genkit flows
// and makes them available to the Next.js app.
export async function register() {
    console.log('Registering Genkit flows...');
    
    // Import flows here to ensure they are registered with the Genkit 'ai' instance.
    require('@/ai/flows/generate-itinerary-flow');
    require('@/ai/flows/generate-surprise-flow');
    
    // This is required to expose the Genkit actions to the Next.js runtime.
    defineNextActions({ ai });
}
