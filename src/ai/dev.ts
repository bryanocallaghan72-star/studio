
import 'dotenv/config';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

import './flows/generate-itinerary-flow';
import './flows/generate-surprise-flow';
import './flows/generate-yolo-flow';

// This is the single, authoritative Genkit configuration for the entire app.
export const ai = genkit({
  plugins: [
    googleAI({
      // The API key is read from the GEMINI_API_KEY environment variable.
      // We explicitly set the default model here for all generate() calls.
      defaultModel: 'gemini-1.5-flash'
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

export default ai;
