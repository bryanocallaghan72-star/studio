import { genkit, type Plugin } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const plugins: Plugin<any>[] = [
  googleAI(),
];

export const ai = genkit({
  plugins,
});
