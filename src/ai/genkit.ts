
// This file now re-exports the globally configured 'ai' instance from the dev server entry point.
// This ensures that all parts of the application (server-side flows, API routes)
// use the exact same, correctly configured Genkit instance.
export { ai } from './dev';
