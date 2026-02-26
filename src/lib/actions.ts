'use server';

import { z } from 'zod';
import { aiGuidanceTool } from '@/ai/flows/ai-guidance-tool-flow';
import { generatePersonalizedPerformanceSummary } from '@/ai/flows/personalized-performance-summary';
import type { PersonalizedPerformanceSummaryInput } from '@/ai/flows/personalized-performance-summary';
import { generateSmsScenariosFlow } from '@/ai/flows/generate-sms-scenarios';
import { generateBankingScenariosFlow } from '@/ai/flows/generate-banking-scenarios';
import { generateGovWebsiteScenariosFlow } from '@/ai/flows/generate-gov-website-scenarios';
import { generateSocialMediaScenariosFlow } from '@/ai/flows/generate-social-media-scenarios';
import { generateTts } from '@/ai/flows/generate-tts';


export async function getAiGuidance(prevState: any, formData: FormData) {
  const schema = z.object({
    input: z.string().min(1, 'Please enter a question or message.'),
  });

  const validatedFields = schema.safeParse({
    input: formData.get('input'),
  });

  if (!validatedFields.success) {
    return {
      tip: '',
      error: validatedFields.error.flatten().fieldErrors.input?.join(', '),
    };
  }

  try {
    const result = await aiGuidanceTool({ input: validatedFields.data.input });
    return { tip: result.tip, error: '' };
  } catch (error: any) {
    console.error(error);
    return { tip: '', error: error.message || 'Sorry, I had trouble getting a tip. Please try again.' };
  }
}

export async function getPerformanceSummary(input: PersonalizedPerformanceSummaryInput) {
  try {
    const summary = await generatePersonalizedPerformanceSummary(input);
    return { summary, error: null };
  } catch (error: any) {
    console.error(error);
    return { summary: null, error: error.message || 'Failed to generate performance summary.' };
  }
}

export async function generateSmsScenarios(input: { count: number }) {
  try {
    const result = await generateSmsScenariosFlow(input);
    return result.scenarios;
  } catch (error: any) {
    console.error('Error generating SMS scenarios:', error);
    throw new Error(error.message || 'Failed to generate simulation. Please try again.');
  }
}

export async function generateBankingScenarios(input: { count: number }) {
  try {
    const result = await generateBankingScenariosFlow(input);
    return result.scenarios;
  } catch (error: any) {
    console.error('Error generating Banking scenarios:', error);
    throw new Error(error.message || 'Failed to generate simulation. Please try again.');
  }
}

export async function generateGovWebsiteScenarios(input: { count: number }) {
  try {
    const result = await generateGovWebsiteScenariosFlow(input);
    return result.scenarios;
  } catch (error: any) {
    console.error('Error generating Gov Website scenarios:', error);
    throw new Error(error.message || 'Failed to generate simulation. Please try again.');
  }
}

export async function generateSocialMediaScenarios(input: { count: number }) {
  try {
    const result = await generateSocialMediaScenariosFlow(input);
    return result.scenarios;
  } catch (error: any) {
    console.error('Error generating Social Media scenarios:', error);
    throw new Error(error.message || 'Failed to generate simulation. Please try again.');
  }
}

export async function getTtsAudio(input: { text: string }) {
    try {
      const result = await generateTts(input);
      return { audioData: result.audioData, error: null };
    } catch (error: any) {
      console.error('Error generating TTS audio:', error);
      return { audioData: null, error: error.message || 'Failed to generate audio.' };
    }
  }
