import { ai } from '@/ai/genkit';
import '@/ai/flows/generate-itinerary-flow';

import {defineNextActions} from '@genkit-ai/next';

export const {GET, POST} = defineNextActions({
  ai,
});
