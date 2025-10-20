import 'dotenv/config';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

import './flows/generate-itinerary-flow';
import './flows/generate-surprise-flow';
import './flows/generate-yolo-flow';

export default genkit({
  plugins: [
    googleAI({
      // The API key is read from the GEMINI_API_KEY environment variable.
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
