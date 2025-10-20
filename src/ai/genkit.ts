import { genkit, type Plugin } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const plugins: Plugin<any>[] = [
  googleAI({ apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY }),
];

export const ai = genkit({
  plugins,
});
