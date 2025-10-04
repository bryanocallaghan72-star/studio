'use server';

/**
 * @fileOverview AI tool that recommends the top three active communities based on user interests.
 *
 * - communityConnectorTool - A function that suggests relevant communities.
 */

import {ai} from '@/ai/genkit';
import { CommunityConnectorInput, CommunityConnectorInputSchema, CommunityConnectorOutput, CommunityConnectorOutputSchema } from '@/ai/schemas';

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
