import { z } from 'zod';

/**
 * Schema validasi untuk request ekstraksi sitemap.
 */
export const sitemapSchema = z.object({
  body: z.object({
    sitemapUrl: z.string().url('Invalid sitemap URL'),
    format: z.string().optional(), // Opsi format output (json/text)
  }),
});

export type SitemapSchemaType = z.infer<typeof sitemapSchema>;
