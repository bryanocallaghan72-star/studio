'use server';

/**
 * @fileOverview AI tool that recommends the top three active communities based on user interests.
 *
 * - communityConnectorTool - A function that suggests relevant communities.
 * - CommunityConnectorInput - The input type for the communityConnectorTool function.
 * - CommunityConnectorOutput - The return type for the communityConnectorTool function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CommunityConnectorInputSchema = z.object({
  interests: z
    .string()
    .describe('A comma-separated list of user interests, e.g., sushi, cocktails, fitness.'),
});
export type CommunityConnectorInput = z.infer<typeof CommunityConnectorInputSchema>;

const CommunityConnectorOutputSchema = z.object({
  communities: z.array(
    z.object({
      name: z.string().describe('The name of the community.'),
      description: z.string().describe('A brief description of the community.'),
      activityLevel: z
        .string()
        .describe('An indication of how active the community is (e.g., high, medium, low).'),
    })
  ).describe('A list of the top three recommended communities.'),
});
export type CommunityConnectorOutput = z.infer<typeof CommunityConnectorOutputSchema>;

export async function communityConnectorTool(input: CommunityConnectorInput): Promise<CommunityConnectorOutput> {
  return communityConnectorToolFlow(input);
}

const prompt = ai.definePrompt({
  name: 'communityConnectorPrompt',
  input: {schema: CommunityConnectorInputSchema},
  output: {schema: CommunityConnectorOutputSchema},
  prompt: `You are a community recommendation expert for the iykyk app. Given a user's interests, you will suggest the top three most relevant and active communities within the app.

Interests: {{{interests}}}

Format your response as a JSON object with a "communities" key. The value of "communities" should be an array of community objects. Each community object should include the "name", "description", and "activityLevel". The activityLevel should be "high", "medium", or "low".
`,
});

const communityConnectorToolFlow = ai.defineFlow(
  {
    name: 'communityConnectorToolFlow',
    inputSchema: CommunityConnectorInputSchema,
    outputSchema: CommunityConnectorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
