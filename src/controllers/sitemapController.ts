import type { Request, Response, RequestHandler } from 'express';
import { z } from 'zod';

import { sitemapService } from '../services/sitemapService';
import type { SitemapRequest, ExtractionResponse } from '../types/sitemapTypes';
import { logger } from '../utils/logger';

// Schema validasi URL sitemap
export const sitemapSchema = z.object({
  body: z.object({
    sitemapUrl: z.string().url('Invalid sitemap URL'),
    format: z.string().optional(), // Opsi format output (json/text)
  }),
});

/**
 * Controller untuk mengekstrak keyword dari sitemap XML.
 */
export const extractSitemapController: RequestHandler = async (
  req: Request<Record<string, unknown>, unknown, SitemapRequest>,
  res: Response
) => {
  const { sitemapUrl, format } = req.body;

  try {
    const result = await sitemapService.extractSitemap(sitemapUrl);

    // Jika hasilnya adalah sitemap index (kumpulan sitemap), kembalikan langsung
    if (result.type === 'sitemapindex') {
      res.json(result);
      return;
    }

    const extractionResult = result as ExtractionResponse;

    // Jika user minta format text (biasanya untuk copy-paste), kita format jadi string
    if (format === 'text' && extractionResult.keywordLists) {
      res.header('Content-Type', 'text/plain');
      const textResponse = Array.isArray(extractionResult.keywordLists)
        ? extractionResult.keywordLists.join('\n')
        : extractionResult.keywordLists;
      res.send(textResponse);
      return;
    }

    // Default return JSON
    res.json(extractionResult);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Sitemap Extraction Error: ${message}`);

    res.status(500).json({ error: 'Failed', details: message });
  }
};
