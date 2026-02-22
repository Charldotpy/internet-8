'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BankingScenarioSchema = z.object({
    id: z.number().optional(),
    type: z.enum(['email', 'notification', 'offer', 'login', 'sms']).describe("The type of banking interaction."),
    sender: z.string().describe("The sender of the email or SMS. If not applicable, this MUST be an empty string (\"\")."),
    subject: z.string().describe("The subject of the email. If not applicable, this MUST be an empty string (\"\")."),
    text: z.string().describe("The main content of the message or scenario description."),
    url: z.string().describe("A URL associated with the scenario. If not applicable, this MUST be an empty string (\"\")."),
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
- "sender": The sender for 'email' or 'sms' types. Use realistic names (e.g., 'NetBank Secure', 'YourBank Rewards') or plausible fake phone numbers. If not applicable, this MUST be an empty string ("").
- "subject": The subject for 'email' type. If not applicable, this MUST be an empty string ("").
- "text": The main text content.
- "url": A URL for 'login' types or links in messages. For scams, create realistic-looking but fake URLs like 'net-bank.co', 'nett-bank.com', or an IP address. For safe scenarios, use a correct-looking URL like 'net-bank.com'. If not applicable, this MUST be an empty string ("").
- "isScam": A boolean (true if it's a scam, false if it's safe).
- "explanation": A concise explanation of why it's a scam or safe.

CRITICAL: For fields 'sender', 'subject', and 'url', you MUST provide an empty string "" if the field is not relevant to the scenario type. Do not omit the fields.

Provide a mix of scams and safe situations. Scams should use common phishing tactics, pressure tactics, and too-good-to-be-true offers. Safe situations should represent normal banking interactions.

Do not repeat scenarios. Avoid generic placeholders like '[scam website]'.`,
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
