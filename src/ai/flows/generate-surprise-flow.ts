
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


// The input is now empty as we are hardcoding the venues in the prompt.
const SurpriseRequestSchema = z.object({});
export type SurpriseRequest = z.infer<typeof SurpriseRequestSchema>;


export async function generateSurprise(): Promise<Surprise> {
  // Call the flow with an empty object.
  return generateSurpriseFlow({});
}

const prompt = ai.definePrompt({
  name: 'generateSurprisePrompt',
  input: { schema: SurpriseRequestSchema },
  output: { schema: SurpriseSchema },
  model: googleAI.model('gemini-flash'),
  prompt: `You are a hyper-local concierge for Bondi, Australia, known for your quirky and creative suggestions.

Generate a single, surprising activity suggestion. The suggestion should be fun, spontaneous, and feel like a true hidden gem.

It MUST take place at one of the following real venues. Pick one from the list and use its exact name for the 'venue' field in your response.

Available venues:
- Bondi Icebergs
- Hotel Ravesis
- The Depot
- Raw Bar
- Speedo's Cafe
- Totti's
- The Corner House
- Harry's Bondi
- LULU
- Bills
- Sean's
- The Bucket List
- Porch and Parlour
- Anatomy
- Acai Brothers
- The Rum Diary Bar
- Fluidform Pilates
- Lets Go Surfing

Make the title and description creative and exciting. Generate an imageHint that we can use to find a photo on a stock photo site.
`,
});

const generateSurpriseFlow = ai.defineFlow(
  {
    name: 'generateSurpriseFlow',
    inputSchema: SurpriseRequestSchema,
    outputSchema: SurpriseSchema,
  },
  async (request) => {
    const { output } = await prompt(request);
    return output!;
  }
);
