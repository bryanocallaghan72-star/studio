
import { z } from 'zod';
import { surpriseOptions } from '@/lib/surprise-options';

// This file is now simplified. We only need the type for the data passed
// from the server action to the client components.
// The `SurpriseOption` type from `surprise-options.ts` is the source of truth.

// We can use Zod to create a schema from the static data for validation if needed,
// but for now, we'll just re-export the type for use in components.

export type { SurpriseOption } from '@/lib/surprise-options';
