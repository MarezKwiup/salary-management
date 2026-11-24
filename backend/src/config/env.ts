import 'dotenv/config';
import process from 'node:process';
import { z } from 'zod';

const envSchema = z.object({
    DATABASE_URL: z.url(),
    TEST_DATABASE_URL: z.url().optional(),
    PORT: z.coerce.number().int().positive().default(4000),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error('Invalid environment configuration');
    for (const issue of parsed.error.issues) {
        console.error(` - ${issue.path.join('.')}: ${issue.message}`);
    }

    process.exit(1);
}

export const env = parsed.data;
