import { Router } from 'express';

import { extractSitemapController, sitemapSchema } from '../controllers/sitemapController';
import {
  discoverSitemapController,
  discoverySchema,
} from '../controllers/sitemapDiscoveryController';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

router.post('/', validateRequest(sitemapSchema), extractSitemapController);
router.post('/discovery', validateRequest(discoverySchema), discoverSitemapController);

export default router;
