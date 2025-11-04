'use server';
/**
 * @fileOverview An AI flow for generating a single, surprising activity in Bondi.
 * 
 * - generateSurpriseFlow - The main function to call the flow.
 */

import { ai } from '@/ai/genkit.server';
import { SurpriseResponse } from '@/features/surprise/schemas';

export async function generateSurpriseFlow(request: { timeOfDay: 'morning' | 'afternoon' | 'evening'; availableVenues: { name: string; type: string; }[] }): Promise<SurpriseResponse> {
  
  const prompt =
    `You are a spontaneous friend for Bondi. Return ONLY JSON {"name","notes"}.\n` +
    `Time: ${request.timeOfDay}\nVenues: ${JSON.stringify(request.availableVenues)}`;

  const { text } = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: prompt,
  });

  return JSON.parse(text);
}
