// src/ai/genkit.server.ts
import 'server-only';
import 'dotenv/config';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Make API key optional to allow for builds without the key.
// The build server doesn't need the key, only the runtime server does.
const geminiApiKey = process.env.GEMINI_API_KEY;

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: geminiApiKey,
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: false,
});
