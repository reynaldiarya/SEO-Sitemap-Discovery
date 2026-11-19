import type { ErrorHandler } from 'hono';

import { logger } from '../utils/index.js';

/**
 * Global middleware to handle uncaught errors in controllers.
 * Prevents application crashes and returns a clean error response to the client.
 */
export const errorHandler: ErrorHandler = (err, c) => {
  logger.error(err.message);

  const development = process.env.NODE_ENV === 'development';
  if (development) {
    logger.debug(err.stack);
  }

  return c.json(
    { error: 'Internal Server Error', message: development ? err.message : undefined },
    500
  );
};
