'use server';
/**
 * @fileOverview This file implements a Genkit flow to generate a personalized performance summary
 * for a user after completing a simulation.
 *
 * - generatePersonalizedPerformanceSummary - A function that orchestrates the generation of the summary.
 * - PersonalizedPerformanceSummaryInput - The input type for the summary generation.
 * - PersonalizedPerformanceSummaryOutput - The return type for the summary generation.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Defines the input schema for the personalized performance summary flow.
 */
const PersonalizedPerformanceSummaryInputSchema = z.object({
  scenarioName: z.string().describe('The name of the simulation scenario.'),
  actionsTaken: z
    .array(z.string())
    .describe('A list of significant actions taken by the user during the simulation.'),
  identifiedRisks:
    z.array(
      z.object({
        description: z.string().describe('Description of the potential risk or anomaly.'),
        correctlyIdentified: z
          .boolean()
          .describe('Whether the user correctly identified this risk.'),
      })
    )
    .describe(
      'A list of risks or anomalies presented in the simulation and whether the user correctly identified them.'
    ),
  score: z.number().describe("The user's final score or performance metric in the simulation."),
});
export type PersonalizedPerformanceSummaryInput = z.infer<
  typeof PersonalizedPerformanceSummaryInputSchema
>;

/**
 * Defines the output schema for the personalized performance summary flow.
 */
const PersonalizedPerformanceSummaryOutputSchema = z.object({
  overallSummary: z
    .string()
    .describe('An overall summary of the user\'s performance in the simulation.'),
  strengths: z
    .array(z.string())
    .describe('A list of specific aspects where the user performed well.'),
  areasForImprovement: z
    .array(z.string())
    .describe('A list of specific areas where the user can improve, with actionable advice.'),
});
export type PersonalizedPerformanceSummaryOutput = z.infer<
  typeof PersonalizedPerformanceSummaryOutputSchema
>;

/**
 * Generates a personalized performance summary based on the user's simulation input.
 * @param input - The input data for generating the summary.
 * @returns A promise that resolves to the personalized performance summary.
 */
export async function generatePersonalizedPerformanceSummary(
  input: PersonalizedPerformanceSummaryInput
): Promise<PersonalizedPerformanceSummaryOutput> {
  return personalizedPerformanceSummaryFlow(input);
}

/**
 * Defines the prompt for generating a personalized performance summary.
 * The prompt instructs the AI to act as a guidance tool, providing constructive feedback.
 */
const prompt = ai.definePrompt({
  name: 'personalizedPerformanceSummaryPrompt',
  input: {schema: PersonalizedPerformanceSummaryInputSchema},
  output: {schema: PersonalizedPerformanceSummaryOutputSchema},
  prompt: `You are an AI-powered guidance tool for the ElderNet Guide application. Your task is to provide a personalized, constructive performance summary to a user who has completed a simulation. The summary should be in plain language, highlight strengths, and offer actionable advice for improvement.\n\nThe user completed the following simulation:\nScenario: {{{scenarioName}}}\nOverall Score: {{{score}}}%\n\nUser Actions Log:\n{{#each actionsTaken}}- {{{this}}}\n{{/each}}\n\n{{#if identifiedRisks}}\nIdentified Risks:\n{{#each identifiedRisks}}- Risk: "{{{this.description}}}", Correctly Identified: {{#if this.correctlyIdentified}}Yes{{else}}No{{/if}}\n{{/each}}\n{{/if}}\n\nBased on this information, generate a JSON object with the following fields:\n- "overallSummary": A brief, general overview of their performance. This should be a single string.\n- "strengths": An array of strings, listing 2-3 specific actions or decisions where the user demonstrated good judgment or understanding.\n- "areasForImprovement": An array of strings, listing 2-3 specific areas where the user could improve. For each point, provide clear, actionable advice or a tip.\n\nEnsure the language is encouraging and supportive, focusing on learning and growth.`,
});

/**
 * Defines the Genkit flow for generating a personalized performance summary.
 * It uses the 'personalizedPerformanceSummaryPrompt' to generate the summary.
 */
const personalizedPerformanceSummaryFlow = ai.defineFlow(
  {
    name: 'personalizedPerformanceSummaryFlow',
    inputSchema: PersonalizedPerformanceSummaryInputSchema,
    outputSchema: PersonalizedPerformanceSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate performance summary.');
    }
    return output;
  }
);
