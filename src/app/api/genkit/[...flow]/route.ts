// In src/app/api/genkit/[...flow]/route.ts

import { genkitPlugin } from '@/ai/genkit.server'; 

export const { GET, POST } = genkitPlugin.getHandler();
