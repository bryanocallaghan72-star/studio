'use server';
/**
 * @fileOverview An AI flow for generating a personalized itinerary based on a user's mood.
 * 
 * - generateItinerary - The main function to call the flow.
 * - Itinerary - The output type for the generated itinerary.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ItineraryStopSchema = z.object({
  time: z.string().describe('The suggested time for the activity (e.g., "9:00 AM", "1:00 PM").'),
  title: z.string().describe('A short, catchy title for the itinerary stop.'),
  location: z.string().describe('The specific venue or location for the stop (e.g., "The Grassy Knoll Cafe", "Bondi Beach").'),
  description: z.string().describe('A brief, engaging description of the activity at this stop.'),
});

const ItinerarySchema = z.object({
  title: z.string().describe('A creative name for the overall itinerary (e.g., "The Ultimate Bondi Wellness Day").'),
  stops: z.array(ItineraryStopSchema).describe('An array of 3-4 stops that make up the itinerary for the day.'),
});
export type Itinerary = z.infer<typeof ItinerarySchema>;


export async function generateItinerary(mood: string): Promise<Itinerary> {
  return generateItineraryFlow(mood);
}

const prompt = ai.definePrompt({
  name: 'generateItineraryPrompt',
  input: { schema: z.string() },
  output: { schema: ItinerarySchema },
  prompt: `You are a hyper-local concierge for Bondi, Australia, specializing in crafting perfect day plans for the iykyk app.

Given a user's desired mood, generate a creative, multi-stop itinerary with 3 to 4 stops. The itinerary should feel authentic, local, and perfectly match the vibe.

- **Locations must be in or very near Bondi.**
- **Stops should be logical in sequence and timing.**
- **Keep descriptions short, punchy, and enticing.**

User's Mood: "{{{prompt}}}"

Generate a complete itinerary object.
`,
});

const generateItineraryFlow = ai.defineFlow(
  {
    name: 'generateItineraryFlow',
    inputSchema: z.string(),
    outputSchema: ItinerarySchema,
  },
  async (mood) => {
    const { output } = await prompt(mood);
    return output!;
  }
);
