
import { ai } from '@/ai/genkit';
import {defineNextActions} from '@genkit-ai/next';

// Import flows here to register them with the Next.js API route handler.
// This is the single place where all flows should be imported for registration.
import '@/ai/flows/generate-itinerary-flow';
import '@/ai/flows/generate-surprise-flow';

export const {GET, POST} = defineNextActions({
  ai,
});
