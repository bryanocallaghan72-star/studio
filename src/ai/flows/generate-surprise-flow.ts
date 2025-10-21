
'use server';
/**
 * @fileOverview An AI flow for generating a single, surprising activity in Bondi based on context.
 * 
 * - generateSurprise - The main function to call the flow.
 */

import { ai } from '@/ai/genkit';
import { SurpriseRequestSchema, SurpriseResponse, SurpriseResponseSchema } from '@/features/surprise/schemas';
import { googleAI } from '@genkit-ai/google-genai';

export async function generateSurpriseFlow(request: { timeOfDay: 'morning' | 'afternoon' | 'evening'; availableVenues: { name: string; type: string; }[] }): Promise<SurpriseResponse> {
  const llmResponse = await ai.generate({
      model: googleAI.model('gemini-1.5-flash'),
      prompt: `You are a spontaneous friend who knows all the best 'iykyk' spots in Bondi. Suggest ONE surprising and fun activity for the user based on the current time of day. 
  
      You must only choose from the provided list of venues. Your response must be a valid JSON object with the keys "name" and "notes" (a short, enticing reason to go).
      
      Current time of day: ${request.timeOfDay}. 
      Available Venues: ${JSON.stringify(request.availableVenues)}`,
      output: {
        schema: SurpriseResponseSchema
      }
  });

  const output = llmResponse.output();
  if (!output) {
      throw new Error('AI did not return a valid surprise stop.');
  }
  return output;
}
