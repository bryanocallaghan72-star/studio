'use server';
/**
 * @fileOverview A flow for generating a single, surprising activity in Bondi.
 * This flow now uses a curated, deterministic list instead of an LLM.
 * 
 * - generateSurprise - The main function to call the flow.
 */

import { getSurpriseForNow } from '@/lib/get-surprise';
import { SurpriseOption, Vibe } from '@/lib/surprise-options';

/**
 * Selects a random, time-appropriate surprise activity from a curated list.
 *
 * @param request An object containing the user's desired vibe.
 * @returns A promise that resolves to a randomly selected SurpriseOption.
 */
export async function generateSurprise(request: { vibe: Vibe }): Promise<SurpriseOption | null> {
  return getSurpriseForNow(request.vibe);
}
