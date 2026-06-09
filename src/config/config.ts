import { config as loadEnv } from 'dotenv';
import { z } from 'zod';

loadEnv();

const envSchema = z.object({
  PORT: z
    .string()
    .default('3003')
    .transform((val) => parseInt(val, 10)),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error('Error: Invalid environment variables:', env.error.format());
  process.exit(1);
}

export const config = {
  port: env.data.PORT,
};
