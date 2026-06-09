import { z } from 'zod';

/**
 * Validation schema for sitemap extraction request.
 */
export const sitemapSchema = z.object({
  body: z.object({
    sitemapUrl: z.string().url('Invalid sitemap URL'),
    format: z.string().optional(), // Optional output format (json/text)
  }),
});

export type SitemapSchemaType = z.infer<typeof sitemapSchema>;
