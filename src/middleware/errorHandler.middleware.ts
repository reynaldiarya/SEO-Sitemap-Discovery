import type { Request, Response, NextFunction } from 'express';

import { logger } from '../utils';

/**
 * Middleware global untuk menangani error yang tidak tertangkap di controller.
 * Mencegah aplikasi crash total dan memberikan response error yang rapi ke user.
 */
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(err.message);

  // Jika sedang mode development, tampilkan stack trace agar mudah debugging
  if (process.env.NODE_ENV === 'development') {
    logger.debug(err.stack);
  }

  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};
