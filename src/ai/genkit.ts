import { genkit, type Plugin } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { nextDev } from '@genkit-ai/next';

const plugins: Plugin<any>[] = [
  googleAI(),
];
if (process.env.NODE_ENV === 'development') {
  plugins.push(nextDev);
}

export const ai = genkit({
  plugins,
});
