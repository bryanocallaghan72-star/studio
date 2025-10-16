
'use server';
/**
 * @fileOverview An AI flow for generating a single, surprising activity in Bondi.
 * 
 * - generateSurprise - The main function to call the flow.
 */

import { ai } from '@/ai/genkit';
import { Surprise, SurpriseSchema } from '@/ai/schemas';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'zod';

export async function generateSurprise(): Promise<Surprise> {
  return generateSurpriseFlow();
}

const prompt = ai.definePrompt({
  name: 'generateSurprisePrompt',
  output: { schema: SurpriseSchema },
  model: googleAI.model('gemini-flash'),
  prompt: `You are a creative, hyper-local concierge for Bondi, Australia. 
  
  Generate a single, fun, and surprising activity or hidden gem for a user.
  
  - The location must be a real place in or very near Bondi.
  - The description should be short, punchy, and enticing.
  - The imageHint should be 2-3 keywords that visually represent the activity.
  
  Make it something unexpected and delightful!`,
});

const generateSurpriseFlow = ai.defineFlow(
  {
    name: 'generateSurpriseFlow',
    outputSchema: SurpriseSchema,
  },
  async () => {
    const { output } = await prompt();
    return output!;
  }
);
