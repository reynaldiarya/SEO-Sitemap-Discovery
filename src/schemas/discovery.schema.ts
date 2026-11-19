import { z } from 'zod';

/**
 * Validation schema for sitemap discovery request.
 */
export const discoverySchema = z.object({
  body: z.object({
    domain: z
      .string()
      .min(1, 'Domain is required')
      .refine((val) => {
        // Simple regex to validate domain-like structure
        return /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|^(https?:\/\/)/.test(val);
      }, 'Invalid domain format'),
  }),
});

export type DiscoverySchemaType = z.infer<typeof discoverySchema>;
