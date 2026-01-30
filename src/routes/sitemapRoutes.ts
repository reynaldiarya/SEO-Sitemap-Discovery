import { Router } from 'express';

import { extractSitemapController, sitemapSchema } from '../controllers/sitemapController';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

router.post('/', validateRequest(sitemapSchema), extractSitemapController);

export default router;
