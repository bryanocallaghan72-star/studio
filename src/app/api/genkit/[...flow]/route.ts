import { appRoute } from '@genkit-ai/next';

// Import flows here to register them with the Next.js API route handler.
import { generateItinerary } from '@/ai/flows/generate-itinerary-flow';
import { generateSurpriseFlow } from '@/ai/flows/generate-surprise-flow';

// This is a simplified approach. In a real app, you'd likely have a map
// of flows and dynamically select them based on the request.
// For now, we'll just export a primary one.
// You can also export multiple routes from here.
export const POST = appRoute({
  flow: generateItinerary,
});
