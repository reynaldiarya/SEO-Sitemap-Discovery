import express from 'express';

import sitemapRoutes from './routes/sitemapRoutes';
import { errorHandler } from './middleware/errorHandler.middleware';

const app = express();

app.use(express.json());
app.use('/sitemap', sitemapRoutes);

app.use(errorHandler);

export default app;
