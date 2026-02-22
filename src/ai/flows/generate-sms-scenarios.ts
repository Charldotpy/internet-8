'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmsScenarioSchema = z.object({
    id: z.number().optional(),
    sender: z.string().describe("The sender of the SMS message, e.g., '555-0102' or 'Delivery Service'."),
    text: z.string().describe("The text content of the SMS message."),
    isScam: z.boolean().describe("Whether the message is a scam or safe."),
    explanation: z.string().describe("A brief explanation of why the message is a scam or safe."),
});

const GenerateSmsScenariosInputSchema = z.object({
  count: z.number().describe('The number of scenarios to generate.'),
});

const GenerateSmsScenariosOutputSchema = z.object({
  scenarios: z.array(SmsScenarioSchema),
});

const prompt = ai.definePrompt({
    name: 'generateSmsScenariosPrompt',
    input: { schema: GenerateSmsScenariosInputSchema },
    output: { schema: GenerateSmsScenariosOutputSchema },
    prompt: `You are an AI assistant for an internet safety training app. Your task is to generate a list of realistic SMS message scenarios for a quiz.

Generate {{{count}}} unique scenarios.

Each scenario should be an object with the following structure. You do not need to include the "id" field.
- "sender": The sender of the message.
- "text": The content of the message.
- "isScam": A boolean (true if it's a scam, false if it's safe).
- "explanation": A concise explanation of why it's a scam or safe.

Provide a mix of scams and safe messages. Scams should use common tactics like urgency, suspicious links, unexpected prizes, or requests for personal information. Safe messages should be typical, everyday communications.

Do not repeat scenarios.`,
});

export const generateSmsScenariosFlow = ai.defineFlow(
    {
        name: 'generateSmsScenariosFlow',
        inputSchema: GenerateSmsScenariosInputSchema,
        outputSchema: GenerateSmsScenariosOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        if (!output) {
            throw new Error('Failed to generate scenarios.');
        }
        // Re-assign IDs to be sequential from 1, just in case the model doesn't do it right.
        output.scenarios.forEach((scenario, index) => {
            scenario.id = index + 1;
        });
        return output;
    }
);
