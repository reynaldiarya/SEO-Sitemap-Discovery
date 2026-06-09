import express, { json } from 'express';

import sitemapRoutes from './routes/sitemapRoutes';
import { errorHandler } from './middleware';

const app = express();

app.use(json());
app.use('/sitemap', sitemapRoutes);

app.use(errorHandler);

export default app;
