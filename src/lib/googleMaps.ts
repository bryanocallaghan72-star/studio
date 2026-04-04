export const GOOGLE_MAPS_LOADER_ID = "google-map-script";
export const GOOGLE_MAPS_LIBRARIES: ("places")[] = ["places"];
export const GOOGLE_MAPS_REGION = "AU";
export const GOOGLE_MAPS_LANGUAGE = "en";

/**
 * Validates if a string looks like a valid Google Maps API Key.
 * Prevents loading the API with garbage strings like "undefined" or "null".
 */
export function isValidGoogleMapsKey(key: string | undefined | null): key is string {
    if (!key) return false;
    if (key === 'undefined' || key === 'null' || key === '') return false;
    // Google Cloud API keys typically start with AIza
    return key.startsWith('AIza');
}
