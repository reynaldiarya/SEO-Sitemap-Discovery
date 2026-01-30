import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import type { ZodSchema } from 'zod';

import { logger } from '../utils/logger';

/**
 * Middleware untuk validasi request menggunakan library Zod.
 * Memastikan data yang dikirim user sesuai format yang diharapkan.
 */
export const validateRequest =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      // Coba parse (validasi) body, query, dan params
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      // Jika sukses, lanjut ke controller
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        logger.warn(`Validation Error: ${JSON.stringify((error as any).errors)}`);
        return res.status(400).json({
          error: 'Validation Error',
          // Kembalikan detail error agar user tahu field mana yang salah
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          details: (error as any).errors.map((e: any) => ({
            path: e.path,
            message: e.message,
          })),
        });
      }
      next(error);
    }
  };
