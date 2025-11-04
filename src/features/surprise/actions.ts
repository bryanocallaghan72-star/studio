'use server';

import { generateSurpriseFlow } from "@/ai/flows/generate-surprise-flow";
import { appData } from "@/lib/data";
import { SurpriseOutput } from "./schemas";
import { normalizeSurprise } from "./normalize";

/**
 * Server action to generate a "Surprise Me" suggestion.
 * This action handles determining the time of day, filtering available venues,
 * calling the AI flow, normalizing the response, and returning a structured result.
 * 
 * @returns A promise that resolves to an object with either a `success` or `error` property.
 */
export async function generateSurprise(): Promise<{ success?: SurpriseOutput, error?: string }> {
  try {
    // 1. Determine Time of Day
    const currentHour = new Date().getHours();
    let timeOfDay: 'morning' | 'afternoon' | 'evening';
    if (currentHour >= 5 && currentHour < 12) timeOfDay = 'morning';
    else if (currentHour >= 12 && currentHour < 18) timeOfDay = 'afternoon';
    else timeOfDay = 'evening';

    // 2. Filter Venues for the AI
    const availableVenues = appData.map.pins.filter(pin => {
      const category = pin.type;
      if (timeOfDay === 'morning' && ['Brunch', 'Health & Fitness', 'Surf'].includes(category)) return true;
      if (timeOfDay === 'afternoon' && ['Lunch', 'Retail', 'Vibes', 'Surf'].includes(category)) return true;
      if (timeOfDay === 'evening' && ['Cocktails', 'Restaurants', 'Nightlife', 'Sushi'].includes(category)) return true;
      return false;
    }).map(p => ({ name: p.name, type: p.type }));

    if (availableVenues.length === 0) {
      throw new Error('No available venues for the current time of day.');
    }

    // 3. Call the AI Flow
    const rawResponse = await generateSurpriseFlow({ timeOfDay, availableVenues });
    
    if (!rawResponse || !rawResponse.name) {
      throw new Error('AI did not return a valid surprise stop.');
    }

    // 4. Normalize the Response and return
    return { success: normalizeSurprise(rawResponse) };

  } catch (error: any) {
    console.error('Surprise generation failed:', error);
    const errorMessage = error.message.includes('GEMINI_API_KEY') 
      ? 'Please set the GEMINI_API_KEY environment variable. For more details see https://genkit.dev/docs/plugins/google-genai/'
      : error.message || 'Sorry, I couldn\'t come up with a surprise right now. Please try again later.';
    return { error: errorMessage };
  }
}
