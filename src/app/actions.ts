"use server";

import { generateItinerary as generateItineraryFlow } from "@/ai/flows/generate-itinerary-flow";
import { Itinerary, ItineraryRequest, ItineraryRequestSchema } from "@/ai/schemas";

export async function generateItinerary(request: ItineraryRequest): Promise<{ success?: Itinerary, error?: { title: string, message: string } }> {
  // Temporary debug log to verify API key presence in production
  console.log('API KEY CHECK:', process.env.GOOGLE_GENAI_API_KEY ? `Found, ends with: ${process.env.GOOGLE_GENAI_API_KEY.slice(-6)}` : 'UNDEFINED');

  const validatedRequest = ItineraryRequestSchema.safeParse(request);
  
  if (!validatedRequest.success) {
    console.error('Invalid itinerary request:', validatedRequest.error);
    return { error: { title: 'Invalid Request', message: 'The request to generate an itinerary was malformed.' } };
  }

  if (!request.vibe || request.vibe.length < 3) {
     return { error: { title: 'Vibe is too short', message: 'Please describe the mood for your day in a bit more detail.' } };
  }
  
  try {
    const result = await generateItineraryFlow(validatedRequest.data);
    return { success: result };
  } catch (error: any) {
    // 1. Log the specific error reason to console.error with full detail
    console.error('CRITICAL: Itinerary generation failed:', error);
    
    let userMessage = "Something went wrong. Try shuffling again.";
    const rawError = String(error?.message || error || "");

    // 2. Map common failure modes to human-readable strings
    if (rawError.includes("API_KEY") || rawError.includes("apiKey") || rawError.includes("auth")) {
      userMessage = "AI service not configured. Try again later.";
    } else if (rawError.includes("timeout") || rawError.includes("deadline") || rawError.includes("ETIMEDOUT")) {
      userMessage = "Request took too long. Try shuffling again.";
    } else if (rawError.includes("validation") || rawError.includes("schema") || rawError.includes("ZodError")) {
      userMessage = "Couldn't build your itinerary. Try again.";
    }
    
    // 3. Ensure the error string is always returned to the client
    return { 
      error: { 
        title: 'Generation Failed', 
        message: userMessage 
      } 
    };
  }
}
