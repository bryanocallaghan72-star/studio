
'use server';
/**
 * @fileOverview An AI flow for generating a single, surprising activity in Bondi.
 * 
 * - generateSurprise - The main function to call the flow.
 */

import { ai } from '@/ai/genkit';
import { Surprise, SurpriseSchema } from '@/ai/schemas';
import { z } from 'zod';
import { appData } from '@/lib/data';


// Define the input schema for the flow, which includes the list of venue names
const SurpriseRequestSchema = z.object({
  venues: z.array(z.string()),
});
export type SurpriseRequest = z.infer<typeof SurpriseRequestSchema>;


export async function generateSurprise(): Promise<Surprise> {
  // Get a simple list of venue names from our app data
  const venueNames = appData.map.pins.map(pin => pin.name);
  
  // Call the flow with the list of venues
  return generateSurpriseFlow({ venues: venueNames });
}

const prompt = ai.definePrompt({
  name: 'generateSurprisePrompt',
  input: { schema: SurpriseRequestSchema },
  output: { schema: SurpriseSchema },
  model: 'googleai/gemini-flash',
  prompt: `You are a hyper-local concierge for Bondi, Australia, known for your quirky and creative suggestions.

Generate a single, surprising activity suggestion. The suggestion should be fun, spontaneous, and feel like a true hidden gem.

It MUST take place at one of the following real venues. Pick one from the list and use its exact name for the 'venue' field in your response.

Available venues:
{{#each venues}}
- {{this}}
{{/each}}

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
