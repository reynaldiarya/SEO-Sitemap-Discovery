import type { Request, Response, RequestHandler } from 'express';
import { z } from 'zod';

import { sitemapDiscoveryService } from '../services/sitemapDiscoveryService';
import { logger } from '../utils/logger';
import type { DiscoveryRequest, DiscoveryResponse } from '../types/sitemapTypes';

export const discoverySchema = z.object({
  body: z.object({
    domain: z
      .string()
      .min(1, 'Domain is required')
      .refine((val) => {
        // Simple regex to validate domain-like structure, though discovery service handles http/https adding
        return /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|^(https?:\/\/)/.test(val);
      }, 'Invalid domain format'),
  }),
});

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
