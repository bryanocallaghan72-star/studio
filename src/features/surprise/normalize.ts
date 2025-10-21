
import { SurpriseResponse, SurpriseOutput } from './schemas';
import { appData } from '@/lib/data';

/**
 * Normalizes the raw AI response into a structured, client-safe format.
 * It finds the full venue details from the app's data source and provides fallbacks.
 * 
 * @param response The raw response from the generateSurprise AI flow.
 * @returns A normalized SurpriseOutput object.
 */
export function normalizeSurprise(response: SurpriseResponse): SurpriseOutput {
    const name = response.name?.trim() || 'A local gem';
    const notes = response.notes || 'Trust me, it’s a vibe.';
    const venue = appData.map.pins.find(v => v.name === name);
    const slug = venue?.slug ?? name.toLowerCase().replace(/\s+/g, '-');
    const type = venue?.type || 'Vibes';

    return {
        name,
        notes,
        type,
        slug,
    };
}
