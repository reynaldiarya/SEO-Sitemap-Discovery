import type { Request, Response, RequestHandler } from 'express';

import { sitemapService } from '../services';
import type { SitemapRequest, ExtractionResponse } from '../types';
import { logger } from '../utils';

/**
 * Controller to extract keywords from an XML sitemap.
 */
export const extractSitemapController: RequestHandler = async (
  req: Request<Record<string, unknown>, unknown, SitemapRequest>,
  res: Response
) => {
  const { sitemapUrl, format } = req.body;

  try {
    const result = await sitemapService.extractSitemap(sitemapUrl);

    // If the result is a sitemap index (collection of sitemaps), return it directly
    if (result.type === 'sitemapindex') {
      res.json(result);
      return;
    }

    const extractionResult = result as ExtractionResponse;

    // If the client requests plain text format, format the keywords as a string
    if (format === 'text' && extractionResult.keywordLists) {
      res.header('Content-Type', 'text/plain');
      const textResponse = Array.isArray(extractionResult.keywordLists)
        ? extractionResult.keywordLists.join('\n')
        : extractionResult.keywordLists;
      res.send(textResponse);
      return;
    }

    // Return the response as JSON by default
    res.json(extractionResult);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Sitemap Extraction Error: ${message}`);

    res.status(500).json({ error: 'Failed', details: message });
  }
};
