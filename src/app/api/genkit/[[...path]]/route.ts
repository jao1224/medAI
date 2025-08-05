import { createApiHandler } from '@genkit-ai/next';
import { ai } from '@/ai/genkit';
import '@/ai/flows/auto-draft-messages';
import '@/ai/flows/suggest-appointment-times';

export const { GET, POST } = createApiHandler({
    ai,
});
