'use server';
/**
 * @fileOverview An AI assistant flow that provides simple, context-aware explanations and safety tips for internet safety.
 *
 * - aiGuidanceTool - A function that handles the internet safety inquiry.
 * - AiGuidanceToolInput - The input type for the aiGuidanceTool function.
 * - AiGuidanceToolOutput - The return type for the aiGuidanceTool function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiGuidanceToolInputSchema = z.object({
  question: z
    .string()
    .describe('The user\'s question about internet safety.'),
});
export type AiGuidanceToolInput = z.infer<typeof AiGuidanceToolInputSchema>;

const AiGuidanceToolOutputSchema = z.object({
  tip: z
    .string()
    .describe('A simple, context-aware explanation or safety tip.'),
});
export type AiGuidanceToolOutput = z.infer<typeof AiGuidanceToolOutputSchema>;

export async function aiGuidanceTool(
  input: AiGuidanceToolInput
): Promise<AiGuidanceToolOutput> {
  return aiGuidanceToolFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiGuidanceToolPrompt',
  input: {schema: AiGuidanceToolInputSchema},
  output: {schema: AiGuidanceToolOutputSchema},
  prompt: `You are a helpful AI assistant specializing in internet safety. Provide a simple, context-aware explanation or safety tip in response to the user's question. Focus on practical advice and easy-to-understand language.

User's question: {{{question}}}`,
});

const aiGuidanceToolFlow = ai.defineFlow(
  {
    name: 'aiGuidanceToolFlow',
    inputSchema: AiGuidanceToolInputSchema,
    outputSchema: AiGuidanceToolOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
