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
  input: z
    .string()
    .describe("The user's question or message about internet safety."),
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
  prompt: `You are a friendly and helpful AI assistant specializing in internet safety. Your goal is to provide simple, context-aware explanations and safety tips. Focus on practical advice and easy-to-understand language.

If the user asks a direct question about internet safety, provide a clear and concise tip.
If the user's input is a greeting, a thank you, or another conversational phrase that isn't a question, respond politely and in character as a safety assistant. For example, if they say 'hello', you could say 'Hello! How can I help you stay safe online today?'. If they say 'thanks', you could say 'You're welcome! Stay safe.'

User's input: {{{input}}}`,
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
