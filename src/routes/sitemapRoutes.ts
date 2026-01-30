import { Router } from 'express';

import { extractSitemapController } from '../controllers/sitemapExtract.controller';
import { discoverSitemapController } from '../controllers/sitemapDiscovery.controller';
import { sitemapSchema, discoverySchema } from '../schemas';
import { validateRequest } from '../middleware/validateRequest.middleware';

const router = Router();

router.post('/extract', validateRequest(sitemapSchema), extractSitemapController);
router.post('/discovery', validateRequest(discoverySchema), discoverSitemapController);

export default router;
