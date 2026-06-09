import type { Request, Response, RequestHandler } from 'express';

import { sitemapDiscoveryService } from '../services';
import { logger } from '../utils';
import type { DiscoveryRequest, DiscoveryResponse } from '../types';

/**
 * Controller to discover sitemaps for a given domain.
 */
export const discoverSitemapController: RequestHandler = async (
  req: Request<Record<string, unknown>, unknown, DiscoveryRequest>,
  res: Response
) => {
  const { domain } = req.body;

  try {
    const result: DiscoveryResponse = await sitemapDiscoveryService.discoverSitemaps(domain);
    res.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Sitemap Discovery Error for ${domain}: ${message}`);
    res.status(500).json({ error: 'Failed to discover sitemaps', details: message });
  }
};
