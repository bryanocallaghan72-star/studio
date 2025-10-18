
'use server';
/**
 * @fileOverview An AI flow for generating a single, surprising activity in Bondi.
 * 
 * - generateSurprise - The main function to call the flow.
 */

import { ai } from '@/ai/genkit';
import { Surprise, SurpriseSchema } from '@/ai/schemas';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'zod';

export async function generateSurprise(): Promise<Surprise> {
  return generateSurpriseFlow();
}

const prompt = ai.definePrompt({
  name: 'generateSurprisePrompt',
  input: { schema: z.undefined() },
  output: { schema: SurpriseSchema },
  model: googleAI.model('gemini-flash'),
  prompt: `You are a creative, hyper-local concierge for Bondi, Australia. 
  
  Generate a single, fun, and surprising activity or hidden gem for a user.
  
  - The location must be a real place in or very near Bondi.
  - The description should be short, punchy, and enticing.
  - The imageHint should be two or three keywords that visually represent the activity.
  
  Make it something unexpected and delightful!`,
});


const generateSurpriseFlow = ai.defineFlow(
  {
    name: 'generateSurpriseFlow',
    outputSchema: SurpriseSchema,
  },
  async () => {
    // Generate the full response, including the raw output
    const response = await ai.generate({
      prompt: prompt.prompt, // Use the underlying prompt text
      model: googleAI.model('gemini-flash'),
      output: {
        schema: SurpriseSchema,
      },
    });

    // The structured output is in response.output
    // The raw text from the model is in response.text
    const output = response.output;

    if (!output) {
      console.error("Failed to parse AI output into SurpriseSchema.");
      console.log("Raw AI Response Text:", response.text);
      // Throw an error so the calling function knows something went wrong
      throw new Error("Could not generate a valid surprise. The AI response was malformed.");
    }
    
    console.log("Successfully generated surprise:", output);
    return output;
  }
);
