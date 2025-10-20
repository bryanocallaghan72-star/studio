
'use server';

// This file now re-exports the globally configured 'ai' instance from the dev server entry point.
// This ensures that all parts of the application (server-side flows, API routes)
// use the exact same, correctly configured Genkit instance.
import 'dotenv/config';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// This is the single, authoritative Genkit configuration for the entire app.
export const ai = genkit({
  plugins: [
    googleAI({
      // The API key is read from the GEMINI_API_KEY environment variable.
      // We explicitly set the default model here for all generate() calls.
      defaultModel: 'gemini-1.5-flash',
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

// Import flows AFTER the ai object has been defined and exported.
// This prevents a circular dependency error.
import './flows/generate-itinerary-flow';
import './flows/generate-surprise-flow';
import './flows/generate-yolo-flow';
