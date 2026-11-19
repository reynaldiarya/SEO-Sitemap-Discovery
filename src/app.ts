import { Hono } from 'hono';
import { html } from 'hono/html';

import { errorHandler, parseJsonBody } from './middleware/index.js';
import type { JsonBodyEnv } from './middleware/index.js';
import sitemapRoutes from './routes/sitemapRoutes.js';
import { Home } from './web/home.js';

const app = new Hono<JsonBodyEnv>({
  getPath: (request) =>
    new URL(request.url).pathname.replace(/^\/sitemap\/(?:discovery|extract)\/?$/i, (path) =>
      path.toLowerCase().replace(/\/$/, '')
    ),
});

app.use(async (c, next) => {
  await next();
  if (c.res.headers.get('Content-Type') === 'application/json') {
    c.header('Content-Type', 'application/json; charset=utf-8');
  }
});
app.use(parseJsonBody);
app.onError(errorHandler);
app.route('/sitemap', sitemapRoutes);
app.get('/', (c) => c.html(html`<!doctype html>${Home()}`));

app.notFound((c) => {
  // prettier-ignore
  const page = html`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>Cannot ${c.req.method} ${new URL(c.req.url).pathname}</pre>
</body>
</html>
`;
  return c.html(page, 404, {
    'Content-Security-Policy': "default-src 'none'",
    'X-Content-Type-Options': 'nosniff',
  });
});

export default app;
