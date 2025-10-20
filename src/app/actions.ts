
"use server";

import { generateItinerary as generateItineraryFlow } from "@/ai/flows/generate-itinerary-flow";
import { generateSurprise as generateSurpriseFlow } from "@/ai/flows/generate-surprise-flow";
import { Itinerary, ItineraryRequest, ItineraryRequestSchema, Surprise } from "@/ai/schemas";
import { appData } from "@/lib/data";

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
    const currentHour = new Date().getHours();
    let timeOfDay: 'morning' | 'afternoon' | 'evening';
    if (currentHour >= 5 && currentHour < 12) timeOfDay = 'morning';
    else if (currentHour >= 12 && currentHour < 18) timeOfDay = 'afternoon';
    else timeOfDay = 'evening';

    const availableVenues = appData.map.pins.filter(pin => {
      const category = pin.type;
      if (timeOfDay === 'morning' && ['Brunch', 'Health & Fitness'].includes(category)) return true;
      if (timeOfDay === 'afternoon' && ['Lunch', 'Retail', 'Vibes', 'Surf'].includes(category)) return true;
      if (timeOfDay === 'evening' && ['Cocktails', 'Restaurants', 'Nightlife', 'Sushi'].includes(category)) return true;
      return false;
    }).map(p => ({ name: p.name, type: p.type }));

    if (availableVenues.length === 0) {
      throw new Error('No available venues for the current time of day.');
    }

    const response = await generateSurpriseFlow({ timeOfDay, availableVenues });
    
    if (!response || !response.name) {
      throw new Error('AI did not return a valid surprise stop.');
    }

    const venueDetails = appData.map.pins.find(v => v.name === response.name);

    return { 
      success: {
        name: response.name,
        notes: response.notes,
        type: venueDetails?.type || 'Vibes',
      }
    };
  } catch (error: any) {
    console.error('Surprise generation failed:', error);
    return { error: { title: 'Generation Failed', message: error.message || 'Sorry, I couldn\'t come up with a surprise right now. Please try again later.' } };
  }
}
