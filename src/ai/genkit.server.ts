import 'server-only';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const geminiApiKey = process.env.GOOGLE_GENAI_API_KEY ?? process.env.GEMINI_API_KEY;

export const ai = genkit({
  plugins: geminiApiKey ? [googleAI({ apiKey: geminiApiKey })] : [],
});
