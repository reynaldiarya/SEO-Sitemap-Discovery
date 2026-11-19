import { fileURLToPath } from 'node:url';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';

import { config } from './config/config.js';
import app from './app.js';

const publicDirectory = fileURLToPath(new URL('../public/', import.meta.url));
app.get('/assets/*', serveStatic({ root: publicDirectory }));

serve({ fetch: app.fetch, port: config.port }, ({ port }) => {
  console.log(`Server is running on http://localhost:${port}`);
});
