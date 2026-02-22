import { config } from 'dotenv';
config();

import '@/ai/flows/ai-guidance-tool-flow.ts';
import '@/ai/flows/personalized-performance-summary.ts';
import '@/ai/flows/generate-sms-scenarios';
import '@/ai/flows/generate-banking-scenarios';
import '@/ai/flows/generate-gov-website-scenarios';
import '@/ai/flows/generate-social-media-scenarios';
