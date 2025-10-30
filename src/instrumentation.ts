
'use server';

// This file is automatically run by Next.js when the server starts.
// It is used to initialize server-side resources like Genkit.

// By importing the flows here, we ensure they are registered with the Genkit 'ai' instance
// when the server boots up. This makes them available for use in API routes and server actions.
import '@/ai/flows/generate-itinerary-flow';
import '@/ai/flows/generate-surprise-flow';

export async function register() {
    // This function can be used for other server-side initializations if needed.
    // For Genkit, simply importing the flows above is sufficient for registration.
    console.log('Genkit flows have been registered.');
}
