
'use server';

import { generateSurpriseFlow } from "@/ai/flows/generate-surprise-flow";
import { SurpriseOption, TimeBucket } from "@/lib/surprise-options";

/**
 * Server action to generate a "Surprise Me" suggestion.
 * This action determines the time of day, calls the simplified flow
 * to select a random activity from a curated list, and returns the result.
 * 
 * @returns A promise that resolves to an object with either a `success` or `error` property.
 */
export async function generateSurprise(): Promise<{ success?: SurpriseOption, error?: string }> {
  try {
    // 1. Determine Time of Day Bucket
    const currentHour = new Date().getHours();
    let timeBucket: TimeBucket;
    if (currentHour >= 5 && currentHour < 12) timeBucket = 'morning';
    else if (currentHour >= 12 && currentHour < 17) timeBucket = 'day';
    else if (currentHour >= 17 && currentHour < 20) timeBucket = 'goldenHour';
    else timeBucket = 'night';

    // 2. Call the new, simplified flow
    const result = await generateSurpriseFlow({ timeBucket });
    
    if (!result) {
      throw new Error('The surprise generator failed to return an activity.');
    }

    // 3. Return the selected option directly
    return { success: result };

  } catch (error: any) {
    console.error('Surprise generation failed:', error);
    const errorMessage = error.message || 'Sorry, I couldn\'t come up with a surprise right now. Please try again later.';
    return { error: errorMessage };
  }
}
