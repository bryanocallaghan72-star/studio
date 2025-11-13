
'use server';
/**
 * @fileOverview An AI flow for generating a single, surprising activity in Bondi.
 * 
 * - generateSurpriseFlow - The main function to call the flow.
 */

import { surpriseOptions, SurpriseOption, TimeBucket } from "@/lib/surprise-options";

/**
 * Selects a random, time-appropriate surprise activity from a curated list.
 * This flow does NOT use an LLM. It's a simple, deterministic selection.
 *
 * @param request An object containing the current time of day bucket.
 * @returns A promise that resolves to a randomly selected SurpriseOption.
 */
export async function generateSurpriseFlow(request: { timeBucket: TimeBucket }): Promise<SurpriseOption> {
  
  const { timeBucket } = request;

  // Filter options based on the current time of day
  const availableOptions = surpriseOptions.filter(option => 
    option.timeBuckets.includes(timeBucket)
  );
  
  if (availableOptions.length === 0) {
    // Fallback if no options are available for the current time
    // This could be a default "chill" activity that works anytime
    const fallbackOption = surpriseOptions.find(o => o.id === 'ocean-gaze') || surpriseOptions[0];
    if (!fallbackOption) {
      throw new Error("No surprise options available.");
    }
    return fallbackOption;
  }

  // Select a random option from the filtered list
  const randomIndex = Math.floor(Math.random() * availableOptions.length);
  const selectedOption = availableOptions[randomIndex];
  
  if (!selectedOption) {
    throw new Error("Failed to select a surprise option.");
  }
  
  return selectedOption;
}
