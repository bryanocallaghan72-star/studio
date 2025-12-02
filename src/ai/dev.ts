// This file serves as the entry point for the Genkit development server.
// It simply re-exports the globally configured 'ai' instance from the main config file.
import { ai } from './genkit.server';
import './flows/generate-itinerary-flow';
import './flows/generate-surprise-flow';

export default ai;
