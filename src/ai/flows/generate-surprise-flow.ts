
'use server';
/**
 * @fileOverview An AI flow for generating a single, surprising activity in Bondi.
 * 
 * - generateSurpriseFlow - The main function to call the flow.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { SurpriseResponse } from '@/features/surprise/schemas';

export async function generateSurpriseFlow(request: { timeOfDay: 'morning' | 'afternoon' | 'evening'; availableVenues: { name: string; type: string; }[] }): Promise<SurpriseResponse> {
  
  const prompt = `You are a spontaneous friend who knows all the best 'iykyk' spots in Bondi. Suggest ONE surprising and fun activity for the user based on the current time of day. 
  
      You must only choose from the provided list of venues. Your response must be ONLY a valid JSON object with the keys "name" and "notes" (a short, enticing reason to go).
      
      Current time of day: ${request.timeOfDay}. 
      Available Venues: ${JSON.stringify(request.availableVenues)}`;

  const { text } = await ai.generate({
      model: googleAI.model('gemini-1.5-flash'),
      prompt: prompt,
  });

  return JSON.parse(text);
}
