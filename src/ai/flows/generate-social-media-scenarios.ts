'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SocialMediaScenarioSchema = z.object({
    id: z.number().optional(),
    platform: z.string().describe("The social media platform, e.g., 'Instagram', 'Facebook', 'Instagram DM', 'Facebook DM'"),
    profileName: z.string().describe("The name of the user or page making the post/sending the message."),
    profileImageId: z.string().describe("The ID of a suitable profile image from the provided list."),
    imageId: z.string().optional().describe("The ID of a suitable post image from the provided list. Omit this for DMs or text-only posts."),
    text: z.string().describe("The text content of the post or message."),
    isScam: z.boolean().describe("Whether the situation is a scam or safe."),
    explanation: z.string().describe("A brief explanation of why it's a scam or safe."),
});

const GenerateSocialMediaScenariosInputSchema = z.object({
  count: z.number().describe('The number of scenarios to generate.'),
});

const GenerateSocialMediaScenariosOutputSchema = z.object({
  scenarios: z.array(SocialMediaScenarioSchema),
});

const imageIdList = [
    "social-post-cruise", "social-profile-cruise", "social-post-nature", "social-profile-natgeo",
    "social-profile-anna", "social-post-console", "social-profile-john", "social-profile-community",
    "social-post-lost-pet", "social-profile-crypto", "social-post-chart", "social-profile-aunt",
    "social-profile-baker", "social-post-cake", "social-profile-recruiter", "social-post-job",
    "social-profile-friend2", "social-post-vacation", "social-profile-news", "social-post-breaking",
    "social-profile-health", "social-post-pills", "social-profile-pet-shelter", "social-post-puppy",
    "social-profile-celebrity", "social-profile-charity", "social-post-charity", "social-profile-gamer",
    "social-post-game", "social-profile-car-brand", "social-post-car", "social-profile-foodie",
    "social-post-food", "social-profile-phone-brand", "social-post-phone", "social-profile-quiz",
    "social-post-quiz", "social-profile-grandma", "social-post-baby", "social-profile-gardener",
    "social-post-garden", "social-profile-lost-item", "social-post-lost-wallet", "social-profile-tech-support",
    "social-post-virus-warning"
];

const prompt = ai.definePrompt({
    name: 'generateSocialMediaScenariosPrompt',
    input: { schema: GenerateSocialMediaScenariosInputSchema },
    output: { schema: GenerateSocialMediaScenariosOutputSchema },
    prompt: `You are an AI assistant for an internet safety training app. Your task is to generate realistic social media scenarios for a quiz.

Generate {{{count}}} unique scenarios.

Each scenario should be an object with the following structure:
- "platform": The social media platform, e.g. 'Instagram', 'Facebook', 'Instagram DM', or 'Facebook DM'.
- "profileName": The name of the profile.
- "profileImageId": The ID of an appropriate profile image. Choose one from this list: ${imageIdList.filter(id => id.includes('profile')).join(', ')}.
- "imageId": The ID of an appropriate image for the post. Choose one from this list: ${imageIdList.filter(id => id.includes('post')).join(', ')}. Omit this field for DMs or text-only posts.
- "text": The text content of the post or message. For scams, embed a suspicious-looking but fake URL (e.g., bit.ly/prize-claim, free-gifts.net).
- "isScam": A boolean (true if it's a scam, false if it's safe).
- "explanation": A concise explanation of why it's a scam or safe, referencing any suspicious links or tactics.

Provide a mix of scams and safe posts. Scams can include phishing, fake giveaways, investment scams, romance scams, etc. Safe posts should be normal social interactions.

Do not repeat scenarios.`,
});

export const generateSocialMediaScenariosFlow = ai.defineFlow(
    {
        name: 'generateSocialMediaScenariosFlow',
        inputSchema: GenerateSocialMediaScenariosInputSchema,
        outputSchema: GenerateSocialMediaScenariosOutputSchema,
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
