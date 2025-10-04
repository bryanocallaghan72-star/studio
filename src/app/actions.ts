"use server";

import { communityConnectorTool, CommunityConnectorInput } from "@/ai/flows/community-connector-tool";
import { generateItinerary as generateItineraryFlow, Itinerary } from "@/ai/flows/generate-itinerary-flow";
import { z } from "zod";

const CommunityConnectorActionSchema = z.object({
  interests: z.string().min(3, "Please enter at least one interest."),
});

export async function getCommunityRecommendations(values: { interests: string }) {
  const validatedFields = CommunityConnectorActionSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid input.",
    };
  }

  try {
    const input: CommunityConnectorInput = {
      interests: validatedFields.data.interests,
    };
    const result = await communityConnectorTool(input);
    return { success: result };
  } catch (error) {
    console.error(error);
    return {
      error: "Failed to get recommendations. Please try again.",
    };
  }
}

export async function generateItinerary(mood: string): Promise<{ success?: Itinerary, error?: string }> {
  if (!mood || mood.length < 3) {
    return { error: 'Please describe the mood for your day in a bit more detail.' };
  }
  try {
    const result = await generateItineraryFlow(mood);
    return { success: result };
  } catch (error) {
    console.error('Itinerary generation failed:', error);
    return { error: 'Sorry, I couldn\'t generate an itinerary right now. Please try again later.' };
  }
}
