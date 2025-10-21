
'use server';
/**
 * @fileOverview An AI flow for generating a single, surprising activity in Bondi.
 * 
 * - generateSurpriseFlow - The main function to call the flow.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'zod';
import { SurpriseResponseSchema } from '@/features/surprise/schemas';

export async function generateSurpriseFlow(request: { timeOfDay: 'morning' | 'afternoon' | 'evening'; availableVenues: { name: string; type: string; }[] }): Promise<z.infer<typeof SurpriseResponseSchema>> {
  
  const prompt = `You are a spontaneous friend who knows all the best 'iykyk' spots in Bondi. Suggest ONE surprising and fun activity for the user based on the current time of day. 
  
      You must only choose from the provided list of venues. Your response must be ONLY a valid JSON object with the keys "name" and "notes" (a short, enticing reason to go).
      
      Current time of day: ${request.timeOfDay}. 
      Available Venues: ${JSON.stringify(request.availableVenues)}`;

  const llmResponse = await ai.generate({
      model: 'gemini-1.5-flash',
      prompt: prompt,
  });

  try {
    // Attempt to parse the cleaned text as JSON
    const parsed = JSON.parse(llmResponse.text);
    // Validate the parsed object against our schema
    return SurpriseResponseSchema.parse(parsed);
  } catch (e) {
    console.error("Failed to parse or validate AI response:", e);
    throw new Error("AI returned an invalid JSON format.");
  }
}
