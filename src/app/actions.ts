
"use server";

import { generateItinerary as generateItineraryFlow } from "@/ai/flows/generate-itinerary-flow";
import { Itinerary, ItineraryRequest, ItineraryRequestSchema, Surprise } from "@/ai/schemas";

export async function generateItinerary(request: ItineraryRequest): Promise<{ success?: Itinerary, error?: { title: string, message: string } }> {
  const validatedRequest = ItineraryRequestSchema.safeParse(request);
  
  if (!validatedRequest.success) {
    console.error('Invalid itinerary request:', validatedRequest.error);
    return { error: { title: 'Invalid Request', message: 'The request to generate an itinerary was malformed.' } };
  }

  if (!request.vibe || request.vibe.length < 3) {
     return { error: { title: 'Vibe is too short', message: 'Please describe the mood for your day in a bit more detail.' } };
  }
  
  try {
    const result = await generateItineraryFlow(validatedRequest.data);
    return { success: result };
  } catch (error) {
    console.error('Itinerary generation failed:', error);
    return { error: { title: 'Generation Failed', message: 'Sorry, I couldn\'t generate an itinerary right now. Please try again later.' } };
  }
}

export async function generateSurprise(): Promise<{ success?: Surprise, error?: { title: string, message: string }}> {
  try {
    // Use the itinerary flow with a special flag
    const itineraryResult = await generateItineraryFlow({ vibe: 'surprise me', surpriseMe: true });
    
    if (!itineraryResult || itineraryResult.stops.length === 0) {
      throw new Error('AI did not return a valid surprise stop.');
    }

    const surpriseStop = itineraryResult.stops[0];

    // Adapt the itinerary stop to the Surprise schema
    const surprise: Surprise = {
      title: surpriseStop.title,
      description: surpriseStop.description,
      venue: surpriseStop.location,
      imageHint: surpriseStop.title, // Use title as a hint
    };

    return { success: surprise };
  } catch (error) {
    console.error('Surprise generation failed:', error);
    return { error: { title: 'Generation Failed', message: 'Sorry, I couldn\'t come up with a surprise right now. Please try again later.' } };
  }
}
