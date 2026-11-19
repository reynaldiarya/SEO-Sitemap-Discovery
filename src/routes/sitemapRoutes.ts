import { Hono } from 'hono';
import type { Handler } from 'hono';

import { discoverSitemapController, extractSitemapController } from '../controllers/index.js';
import { validateRequest } from '../middleware/index.js';
import type { JsonBodyEnv } from '../middleware/index.js';
import { sitemapSchema, discoverySchema } from '../schemas/index.js';

const router = new Hono<JsonBodyEnv>();
const allowPost: Handler = (c) =>
  c.text('POST', 200, {
    Allow: 'POST',
    'Content-Type': 'text/plain',
    'X-Content-Type-Options': 'nosniff',
  });

router.post('/extract', validateRequest(sitemapSchema), extractSitemapController);
router.post('/discovery', validateRequest(discoverySchema), discoverSitemapController);
router.options('/extract', allowPost);
router.options('/discovery', allowPost);

export default router;
