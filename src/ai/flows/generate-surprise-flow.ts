
'use server';
/**
 * @fileOverview An AI flow for generating a single, surprising activity in Bondi based on context.
 * 
 * - generateSurprise - The main function to call the flow.
 */

import { ai } from '@/ai/genkit';
import { SurpriseRequestSchema, SurpriseResponse, SurpriseResponseSchema } from '@/ai/schemas';
import { googleAI } from '@genkit-ai/google-genai';

export async function generateSurprise(request: { timeOfDay: 'morning' | 'afternoon' | 'evening'; availableVenues: { name: string; type: string; }[] }): Promise<SurpriseResponse> {
  return generateSurpriseFlow(request);
}

const prompt = ai.definePrompt({
  name: 'generateSurprisePrompt',
  input: { schema: SurpriseRequestSchema },
  output: { schema: SurpriseResponseSchema },
  model: googleAI.model('gemini-flash'),
  prompt: `You are a spontaneous friend who knows all the best 'iykyk' spots in Bondi. Suggest ONE surprising and fun activity for the user based on the current time of day. 

  You must only choose from the provided list of venues. Your response must be a valid JSON object with the keys "name" and "notes" (a short, enticing reason to go).
  
  Current time of day: {{timeOfDay}}. 
  Available Venues: {{json availableVenues}}`,
});

const generateSurpriseFlow = ai.defineFlow(
  {
    name: 'generateSurpriseFlow',
    inputSchema: SurpriseRequestSchema,
    outputSchema: SurpriseResponseSchema,
  },
  async (request) => {
    const { output } = await prompt(request);
    if (!output) {
      throw new Error('AI failed to generate a surprise.');
    }
    return output;
  }
);
