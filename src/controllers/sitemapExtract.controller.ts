import type { Handler } from 'hono';

import type { JsonBodyEnv, ValidatedJson } from '../middleware/index.js';
import type { SitemapSchemaType } from '../schemas/index.js';
import { sitemapService } from '../services/index.js';
import { SITEMAP_URLS_MEDIA_TYPE } from '../types/index.js';
import type { UrlExtractionResponse } from '../types/index.js';
import { logger } from '../utils/index.js';

/**
 * Controller to extract keywords from an XML sitemap.
 */
export const extractSitemapController: Handler<
  JsonBodyEnv,
  string,
  ValidatedJson<SitemapSchemaType['body']>
> = async (c) => {
  const { sitemapUrl, format } = c.req.valid('json');
  const wantsUrls = format !== 'text' && c.req.header('Accept') === SITEMAP_URLS_MEDIA_TYPE;
  c.header('Vary', 'Accept');

  try {
    let urls: readonly string[] = [];
    const result = await sitemapService.extractSitemap(
      sitemapUrl,
      wantsUrls
        ? (entries) => {
            urls = entries;
          }
        : undefined
    );

    if (result.type === 'sitemapindex') {
      return c.json(result);
    }

    if (wantsUrls) {
      const response: UrlExtractionResponse = {
        type: 'extraction',
        urls,
        keywordLists: result.keywordLists ?? [],
      };
      return c.json(response, 200, { 'Content-Type': SITEMAP_URLS_MEDIA_TYPE });
    }

    if (format === 'text' && result.keywordLists) {
      const textResponse = Array.isArray(result.keywordLists)
        ? result.keywordLists.join('\n')
        : result.keywordLists;
      return c.text(textResponse);
    }

    return c.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Sitemap Extraction Error: ${message}`);

    return c.json({ error: 'Failed', details: message }, 500);
  }
};
