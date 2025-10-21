import { z } from 'zod';

// Schema for the AI flow request
const VenueSchema = z.object({
  name: z.string(),
  type: z.string(),
});

export const SurpriseRequestSchema = z.object({
    timeOfDay: z.enum(['morning', 'afternoon', 'evening']),
    availableVenues: z.array(VenueSchema),
});
export type SurpriseRequest = z.infer<typeof SurpriseRequestSchema>;

// Schema for the raw AI flow response
export const SurpriseResponseSchema = z.object({
    name: z.string().describe("The chosen venue name from the list provided."),
    notes: z.string().describe("A short, catchy, and enticing reason for the user to go to this specific venue right now."),
});
export type SurpriseResponse = z.infer<typeof SurpriseResponseSchema>;


// Schema for the final, normalized output returned to the client
export const SurpriseOutputSchema = z.object({
    name: z.string(),
    notes: z.string(),
    type: z.string(),
    slug: z.string(),
});
export type SurpriseOutput = z.infer<typeof SurpriseOutputSchema>;
