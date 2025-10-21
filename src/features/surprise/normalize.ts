
import { SurpriseResponse, SurpriseOutput } from './schemas';
import { appData } from '@/lib/data';

/**
 * Normalizes the raw AI response into a structured, client-safe format.
 * It finds the full venue details from the app's data source.
 * 
 * @param response The raw response from the generateSurprise AI flow.
 * @returns A normalized SurpriseOutput object.
 */
export function normalizeSurprise(response: SurpriseResponse): SurpriseOutput {
    // Find the venue details from our static data based on the name from the AI.
    const venueDetails = appData.map.pins.find(v => v.name === response.name);

    // Create a slug from the venue name for URL usage.
    const slug = response.name.toLowerCase().replace(/\s+/g, '-');

    return {
        name: response.name,
        notes: response.notes,
        // Fallback to 'Vibes' if type is unknown
        type: venueDetails?.type || 'Vibes',
        // Fallback to a generated slug if venue not found
        slug: venueDetails?.slug || slug,
    };
}
