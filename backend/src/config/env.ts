import dotenv from 'dotenv';
import { z } from 'zod';

// Load .env BEFORE validating — override: true ensures .env takes priority
// over any pre-existing shell env vars (e.g. DATABASE_URL from another project)
dotenv.config({ override: true });

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(10),
  JWT_EXPIRES_IN: z.string().default('7d'),
  PORT: z.coerce.number().default(3001),
  CORS_ORIGIN: z.string().default('http://localhost:5173,http://localhost:5174'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

function loadEnv() {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
    process.exit(1);
  }
  return parsed.data;
}

export const env = loadEnv();
