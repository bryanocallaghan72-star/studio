
// This file is the single source of truth for Genkit AI configuration.
import 'server-only';
import 'dotenv/config';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// This is the single, authoritative Genkit configuration for the entire app.
// It is defined and exported first, before any other files that might use it are imported.
export const ai = genkit({
  plugins: [
    googleAI({
      // The API key is read from the GEMINI_API_KEY environment variable.
      // We explicitly set the default model here for all generate() calls.
      defaultModel: 'gemini-1.5-flash',
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: false,
});
