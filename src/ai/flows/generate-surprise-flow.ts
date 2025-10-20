
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
import { GenerativeModel } from '@google/generative-ai';

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
  - The imageHint should be two to three keywords that visually represent the activity.
  
  Make it something unexpected and delightful! Your output MUST be a valid JSON object matching the requested schema.`,
});

const generateSurpriseFlow = ai.defineFlow(
  {
    name: 'generateSurpriseFlow',
    inputSchema: z.undefined(), // Explicitly define input as undefined
    outputSchema: SurpriseSchema, // Still expect SurpriseSchema for the flow output
  },
  async () => {
    // Get the actual GenerativeModel instance
    const model = googleAI.model('gemini-flash');

    // Make the raw model call to get the text output
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: (prompt as any).prompt() }], // Get the raw prompt string
        },
      ],
      // No schema parsing here yet, we just want the raw text
    });

    const rawText = result.response.text();

    // Now, attempt to parse the raw text into your schema
    try {
      // You'll likely need to extract JSON from markdown if the model wraps it
      const jsonMatch = rawText.match(/```json\n([\s\S]*?)\n```/);
      let jsonString = rawText;

      if (jsonMatch && jsonMatch[1]) {
        jsonString = jsonMatch[1]; // Extract content within ```json ... ```
      }

      const parsedOutput = JSON.parse(jsonString);
      const validatedOutput = SurpriseSchema.parse(parsedOutput); // Zod validation

      console.log("Successfully generated and parsed surprise:", validatedOutput);
      return validatedOutput;

    } catch (e: any) {
      console.error("Failed to parse or validate AI output into SurpriseSchema.");
      console.error("Error details:", e.message);
      console.log("Raw AI Response Text (for debugging):", rawText);
      throw new Error(`Could not generate a valid surprise. AI response was malformed or unexpected. Details: ${e.message}`);
    }
  }
);
