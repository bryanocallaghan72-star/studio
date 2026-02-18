// src/ai/genkit.server.ts
import 'server-only';
import 'dotenv/config';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Make API key optional to allow for builds without the key.
// The build server doesn't need the key, only the runtime server does.
const geminiApiKey = process.env.GEMINI_API_KEY;

// Do NOT use GenkitPlugin type (not exported in current genkit version)
const plugins: any[] = [];

// Only add the googleAI plugin if the API key is available.
// This prevents the build from crashing when the key is not set.
if (geminiApiKey) {
  plugins.push(googleAI({ apiKey: geminiApiKey }));
}

export const ai = genkit({
  plugins,
});
