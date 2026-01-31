import type { Request, Response, NextFunction } from 'express';
import { ZodError, type ZodSchema, type ZodIssue } from 'zod';

import { logger } from '../utils';

/**
 * Middleware untuk validasi request menggunakan library Zod.
 * Memastikan data yang dikirim user sesuai format yang diharapkan.
 */
export const validateRequest =
  (schema: ZodSchema<unknown>) => (req: Request, res: Response, next: NextFunction) => {
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
        const issues: ZodIssue[] = error.issues;
        logger.warn(`Validation Error: ${JSON.stringify(issues)}`);
        return res.status(400).json({
          error: 'Validation Error',
          // Kembalikan detail error agar user tahu field mana yang salah
          details: issues.map((e: ZodIssue) => ({
            path: e.path,
            message: e.message,
          })),
        });
      }
      next(error);
    }
  };
