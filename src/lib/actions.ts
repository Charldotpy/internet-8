'use server';

import { z } from 'zod';
import { aiGuidanceTool } from '@/ai/flows/ai-guidance-tool-flow';
import { generatePersonalizedPerformanceSummary } from '@/ai/flows/personalized-performance-summary';
import type { PersonalizedPerformanceSummaryInput } from '@/ai/flows/personalized-performance-summary';


export async function getAiGuidance(prevState: any, formData: FormData) {
  const schema = z.object({
    question: z.string().min(1, 'Please enter a question.'),
  });

  const validatedFields = schema.safeParse({
    question: formData.get('question'),
  });

  if (!validatedFields.success) {
    return {
      tip: '',
      error: validatedFields.error.flatten().fieldErrors.question?.join(', '),
    };
  }

  try {
    const result = await aiGuidanceTool({ question: validatedFields.data.question });
    return { tip: result.tip, error: '' };
  } catch (error) {
    console.error(error);
    return { tip: '', error: 'Sorry, I had trouble getting a tip. Please try again.' };
  }
}

export async function getPerformanceSummary(input: PersonalizedPerformanceSummaryInput) {
  try {
    const summary = await generatePersonalizedPerformanceSummary(input);
    return { summary, error: null };
  } catch (error) {
    console.error(error);
    return { summary: null, error: 'Failed to generate performance summary.' };
  }
}
