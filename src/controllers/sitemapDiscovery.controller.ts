import type { Handler } from 'hono';

import type { JsonBodyEnv, ValidatedJson } from '../middleware/index.js';
import type { DiscoverySchemaType } from '../schemas/index.js';
import { sitemapDiscoveryService } from '../services/index.js';
import { logger } from '../utils/index.js';

/**
 * Controller to discover sitemaps for a given domain.
 */
export const discoverSitemapController: Handler<
  JsonBodyEnv,
  string,
  ValidatedJson<DiscoverySchemaType['body']>
> = async (c) => {
  const { domain } = c.req.valid('json');

  try {
    const result = await sitemapDiscoveryService.discoverSitemaps(domain);
    return c.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Sitemap Discovery Error for ${domain}: ${message}`);
    return c.json({ error: 'Failed to discover sitemaps', details: message }, 500);
  }
};
