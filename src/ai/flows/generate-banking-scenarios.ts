'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BankingScenarioSchema = z.object({
    id: z.number().optional(),
    type: z.enum(['email', 'notification', 'offer', 'login', 'sms']).describe("The type of banking interaction."),
    sender: z.string().optional().describe("The sender of the email or SMS. Only for 'email' and 'sms' types."),
    subject: z.string().optional().describe("The subject of the email. Only for 'email' type."),
    text: z.string().describe("The main content of the message or scenario description."),
    url: z.string().optional().describe("A URL associated with the scenario. Often used for 'login' types or links in messages."),
    isScam: z.boolean().describe("Whether the situation is a scam or safe."),
    explanation: z.string().describe("A brief explanation of why the situation is a scam or safe."),
});

const GenerateBankingScenariosInputSchema = z.object({
  count: z.number().describe('The number of scenarios to generate.'),
});

const GenerateBankingScenariosOutputSchema = z.object({
  scenarios: z.array(BankingScenarioSchema),
});

const prompt = ai.definePrompt({
    name: 'generateBankingScenariosPrompt',
    input: { schema: GenerateBankingScenariosInputSchema },
    output: { schema: GenerateBankingScenariosOutputSchema },
    prompt: `You are an AI assistant for an internet safety training app. Your task is to generate a list of realistic online banking scenarios for a quiz.

Generate {{{count}}} unique scenarios.

Each scenario MUST be an object with the following structure:
- "type": The type of interaction, one of ['email', 'notification', 'offer', 'login', 'sms'].
- "sender": The sender for 'email' or 'sms' types. Omit this field for other types.
- "subject": The subject for 'email' type. Omit this field for other types.
- "text": The main text content.
- "url": A URL for 'login' types or links in messages. Omit this field if not applicable.
- "isScam": A boolean (true if it's a scam, false if it's safe).
- "explanation": A concise explanation of why it's a scam or safe.

CRITICAL: Only include "sender", "subject", and "url" when they are relevant to the scenario type.

Provide a mix of scams and safe situations. Scams should use common phishing tactics, fake URLs, pressure tactics, and too-good-to-be-true offers. Safe situations should represent normal banking interactions.

Do not repeat scenarios. Ensure URLs for scams look subtly wrong (e.g., net-bank.co, nett-bank.com, an IP address). Ensure URLs for safe scenarios are correct (e.g. net-bank.com).`,
});

export const generateBankingScenariosFlow = ai.defineFlow(
    {
        name: 'generateBankingScenariosFlow',
        inputSchema: GenerateBankingScenariosInputSchema,
        outputSchema: GenerateBankingScenariosOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        if (!output) {
            throw new Error('Failed to generate scenarios.');
        }
        output.scenarios.forEach((scenario, index) => {
            scenario.id = index + 1;
        });
        return output;
    }
);
