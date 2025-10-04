"use server";

import { communityConnectorTool, CommunityConnectorInput } from "@/ai/flows/community-connector-tool";
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
