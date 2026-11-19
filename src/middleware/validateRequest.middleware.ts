import { createMiddleware } from 'hono/factory';
import type { ZodType } from 'zod';

import { logger } from '../utils/index.js';
import type { JsonBodyEnv } from './parseJsonBody.middleware.js';

export type ValidatedJson<Body> = { out: { json: Body } };

export const validateRequest = <Body extends object>(schema: ZodType<{ body: Body }>) =>
  createMiddleware<JsonBodyEnv, string, ValidatedJson<Body>>(async (c, next) => {
    const result = schema.safeParse({
      body: c.get('jsonBody'),
      query: c.req.query(),
      params: c.req.param(),
    });

    if (!result.success) {
      const issues = result.error.issues;
      logger.warn(`Validation Error: ${JSON.stringify(issues)}`);
      return c.json(
        {
          error: 'Validation Error',
          details: issues.map(({ path, message }) => ({ path, message })),
        },
        400
      );
    }

    c.req.addValidatedData('json', result.data.body);
    await next();
  });
