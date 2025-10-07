"use server";

import { generateItinerary as generateItineraryFlow } from "@/ai/flows/generate-itinerary-flow";
import { Itinerary, ItineraryRequest, ItineraryRequestSchema } from "@/ai/schemas";

export async function generateItinerary(request: ItineraryRequest): Promise<{ success?: Itinerary, error?: string }> {
  const validatedRequest = ItineraryRequestSchema.safeParse(request);
  
  if (!validatedRequest.success) {
    console.error('Invalid itinerary request:', validatedRequest.error);
    return { error: 'Invalid itinerary request.' };
  }

  if (!request.vibe || request.vibe.length < 3) {
    return { error: 'Please describe the mood for your day in a bit more detail.' };
  }
  
  try {
    const result = await generateItineraryFlow(validatedRequest.data);
    return { success: result };
  } catch (error) {
    console.error('Itinerary generation failed:', error);
    return { error: 'Sorry, I couldn\'t generate an itinerary right now. Please try again later.' };
  }
}
