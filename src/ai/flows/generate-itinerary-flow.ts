'use server';
/**
 * @fileOverview An AI flow for generating a personalized itinerary based on a user's mood.
 *
 * - generateItinerary - The main function to call the flow.
 */

import { ai } from '@/ai/genkit.server';
import {
  Itinerary,
  ItineraryRequest,
  ItineraryRequestSchema,
  ItinerarySchema,
} from '@/ai/schemas';

export async function generateItinerary(
  request: ItineraryRequest
): Promise<Itinerary> {
  return generateItineraryFlow(request);
}

const prompt = ai.definePrompt({
  name: 'generateItineraryPrompt',
  model: 'googleai/gemini-2.5-flash',
  input: { schema: ItineraryRequestSchema },
  output: { schema: ItinerarySchema },
  prompt: `You are a hyper-local concierge for Bondi, Australia, specializing in crafting perfect day plans for the iykyk app.

Given a user's desired mood, generate a creative, multi-stop itinerary. The itinerary should feel authentic, local, and perfectly match the vibe.

- Locations must be in or very near Bondi.
- Stops should be logical in sequence and timing.
- Keep descriptions short, punchy, and enticing.

{{#if heldStops}}
The user wants to shuffle their itinerary but has locked in the following stops. Your response MUST include these exact stops in the final plan.
Do NOT modify the held stops.
{{#each heldStops}}
- {{this.time}}: {{this.title}} at {{this.location}}
{{/each}}

You MUST generate exactly {{numberOfNewStops}} new, different, and surprising stop(s) to replace the unlocked ones.
The new stops must NOT be the same as any of the held stops.
The final plan must contain BOTH the held stops and the new stops, for a total of 3 or 4 stops. Ensure the combined itinerary flows logically and the new stops fit naturally with the held ones.
{{else}}
Generate a complete itinerary object with 3 to 4 stops based on this request.
{{/if}}

User's Request:
- Mood/Vibe: "{{vibe}}"
- Pace: {{pace}} (1=Chill, 5=Packed)
- Budget: {{budget}} (1=$, 5=$$$)
- Travel Mode: "{{travelMode}}"
`,
});

const generateItineraryFlow = ai.defineFlow(
  {
    name: 'generateItineraryFlow',
    inputSchema: ItineraryRequestSchema,
    outputSchema: ItinerarySchema,
  },
  async (request) => {
    // ✅ Call the executable prompt directly instead of ai.generate({ ... })
    const llmResponse = await prompt(request);

    const output = llmResponse.output;
    if (!output) {
      throw new Error('AI failed to generate an itinerary.');
    }

    return output;
  }
);
