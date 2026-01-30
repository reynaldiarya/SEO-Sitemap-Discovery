import { Router } from 'express';

import { extractSitemapController } from '../controllers/sitemapController';
import { discoverSitemapController } from '../controllers/sitemapDiscoveryController';
import { sitemapSchema, discoverySchema } from '../schemas';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

router.post('/', validateRequest(sitemapSchema), extractSitemapController);
router.post('/discovery', validateRequest(discoverySchema), discoverSitemapController);

export default router;
