import 'server-only';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Genkit initialization.
 * We always register the googleAI plugin to prevent crashes during definePrompt
 * calls at startup, even if the API key is missing. The key will be required
 * at runtime when the flow is actually executed.
 */
const geminiApiKey = process.env.GOOGLE_GENAI_API_KEY ?? process.env.GEMINI_API_KEY;

export const ai = genkit({
  plugins: [
    googleAI({ apiKey: geminiApiKey || 'placeholder-key-for-initialization' })
  ],
});
