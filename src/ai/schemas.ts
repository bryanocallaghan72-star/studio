import { z } from 'zod';

// Schema for Itinerary Generation
const ItineraryStopSchema = z.object({
    time: z.string().describe('The suggested time for the activity (e.g., "9:00 AM", "1:00 PM").'),
    title: z.string().describe('A short, catchy title for the itinerary stop.'),
    location: z.string().describe('The specific venue or location for the stop (e.g., "The Grassy Knoll Cafe", "Bondi Beach").'),
    description: z.string().describe('A brief, engaging description of the activity at this stop.'),
    isHeld: z.boolean().optional().describe('Indicates if the user has locked this stop during a shuffle.'),
    id: z.string().optional().describe('A unique client-side ID for the stop.'),
});
export type ItineraryStop = z.infer<typeof ItineraryStopSchema>;

export const ItinerarySchema = z.object({
    title: z.string().describe('A creative name for the overall itinerary (e.g., "The Ultimate Bondi Wellness Day").'),
    stops: z.array(ItineraryStopSchema).describe('An array of 3-4 stops that make up the itinerary for the day.'),
});
export type Itinerary = z.infer<typeof ItinerarySchema>;

export const ItineraryRequestSchema = z.object({
    vibe: z.string(),
    pace: z.number().optional(),
    budget: z.number().optional(),
    travelMode: z.string().optional(),
    // Add fields for shuffle functionality
    numberOfNewStops: z.number().optional().describe('The number of new stops to generate.'),
    heldStops: z.array(ItineraryStopSchema.omit({ id: true, isHeld: true })).optional().describe('An array of stops the user has locked and wants to keep.'),
    surpriseMe: z.boolean().optional().describe('If true, generate a single surprising stop instead of a full itinerary.'),
});
export type ItineraryRequest = z.infer<typeof ItineraryRequestSchema>;
