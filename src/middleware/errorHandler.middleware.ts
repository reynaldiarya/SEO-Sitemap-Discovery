import type { Request, Response, NextFunction } from 'express';

import { logger } from '../utils';

/**
 * Global middleware to handle uncaught errors in controllers.
 * Prevents application crashes and returns a clean error response to the client.
 */
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(err.message);

  // If in development mode, log the stack trace for easier debugging
  if (process.env.NODE_ENV === 'development') {
    logger.debug(err.stack);
  }

  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};
