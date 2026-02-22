'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GovWebsiteScenarioSchema = z.object({
    id: z.number().optional(),
    url: z.string().describe("The full URL of the website, including http/https."),
    title: z.string().describe("The title of the webpage."),
    body: z.string().describe("The main content of the webpage."),
    inputs: z.array(z.object({
        label: z.string(),
        placeholder: z.string()
    })).describe("An array of input fields shown on the page."),
    isSuspicious: z.boolean().describe("Whether the website is suspicious or safe."),
    explanation: z.string().describe("A brief explanation of why the website is suspicious or safe."),
});


const GenerateGovWebsiteScenariosInputSchema = z.object({
  count: z.number().describe('The number of scenarios to generate.'),
});

const GenerateGovWebsiteScenariosOutputSchema = z.object({
  scenarios: z.array(GovWebsiteScenarioSchema),
});


const prompt = ai.definePrompt({
    name: 'generateGovWebsiteScenariosPrompt',
    input: { schema: GenerateGovWebsiteScenariosInputSchema },
    output: { schema: GenerateGovWebsiteScenariosOutputSchema },
    prompt: `You are an AI assistant for an internet safety training app focusing on Malaysian users. Your task is to generate realistic fake and real government website scenarios for a quiz.

Generate {{{count}}} unique scenarios.

Each scenario should be an object with the following structure. You do not need to include the "id" field.
- "url": The website URL. For suspicious sites, use non-.gov.my domains (like .com, .net, .org, .info) or use deceptive domains (like mygov-portal.com, hasil.gov-my.net). For safe sites, use official .gov.my domains (e.g., hasil.gov.my, jpj.gov.my, moh.gov.my). Also use http for some suspicious sites.
- "title": The webpage title.
- "body": The text content of the page.
- "inputs": An array of objects representing form fields, each with a "label" and "placeholder". Can be an empty array if the site is informational.
- "isSuspicious": A boolean (true if suspicious, false if safe).
- "explanation": A concise explanation of why the site is suspicious or safe, referencing the URL and content.

Provide a mix of suspicious and safe sites. Suspicious sites should create false urgency, ask for unnecessary personal/financial data, or mimic real services on fake domains. Safe sites should be plausible official government services or informational pages.

Do not repeat scenarios. Avoid generic placeholders like '[fake website]'.`,
});

export const generateGovWebsiteScenariosFlow = ai.defineFlow(
    {
        name: 'generateGovWebsiteScenariosFlow',
        inputSchema: GenerateGovWebsiteScenariosInputSchema,
        outputSchema: GenerateGovWebsiteScenariosOutputSchema,
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
