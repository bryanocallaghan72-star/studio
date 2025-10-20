
'use server';
/**
 * @fileOverview An AI flow for generating a single, spontaneous 'YOLO' activity.
 * 
 * - generateYolo - The main function to call the flow.
 */

import { ai } from 'genkit';
import { YoloRequestSchema, YoloResponse, YoloResponseSchema } from '@/ai/schemas';

export async function generateYolo(request: { timeOfDay: 'morning' | 'afternoon' | 'evening'; availableVenues: { name: string; type: string; }[] }): Promise<YoloResponse> {
  return generateYoloFlow(request);
}

const prompt = ai.definePrompt({
  name: 'generateYoloPrompt',
  input: { schema: YoloRequestSchema },
  output: { schema: YoloResponseSchema },
  prompt: `You are a spontaneous friend who lives by the motto "YOLO". Suggest ONE surprising and fun activity for the user based on the current time of day. 

  You must only choose from the provided list of venues. Your response must be a valid JSON object with the keys "name" and "notes" (a short, enticing reason to go).
  
  Current time of day: {{timeOfDay}}. 
  Available Venues: {{json availableVenues}}`,
});

const generateYoloFlow = ai.defineFlow(
  {
    name: 'generateYoloFlow',
    inputSchema: YoloRequestSchema,
    outputSchema: YoloResponseSchema,
  },
  async (request) => {
    const { output } = await prompt(request);
    if (!output) {
      throw new Error('AI did not return a valid YOLO response.');
    }
    return output;
  }
);
