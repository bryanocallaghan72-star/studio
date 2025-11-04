
// In src/instrumentation.ts

// This export must exist
export async function register() {
  
  // This check ensures the code ONLY runs on the server (Node.js)
  // and not in the browser or Edge runtimes.
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    
    // Move your Node.js-specific imports *inside* this block
    // and use dynamic import() to prevent bundling on the client.
    try {
      
      // Dynamically import the files that start the Genkit chain.
      await import('./ai/flows/generate-itinerary-flow');
      await import('./ai/flows/generate-surprise-flow');
      
      console.log("Genkit instrumentation registered for Node.js.");

    } catch (error) {
      console.error("Failed to load server-only instrumentation:", error);
    }
  }
}
