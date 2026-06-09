import type { Request, Response, NextFunction } from 'express';
import { ZodError, type ZodSchema, type ZodIssue } from 'zod';

import { logger } from '../utils';

/**
 * Middleware to validate incoming request data using the Zod library.
 * Ensures the data sent by the client matches the expected format.
 */
export const validateRequest =
  (schema: ZodSchema<unknown>) => (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse and validate request body, query, and params
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      // If validation succeeds, proceed to the next handler
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues: ZodIssue[] = error.issues;
        logger.warn(`Validation Error: ${JSON.stringify(issues)}`);
        return res.status(400).json({
          error: 'Validation Error',
          // Return validation error details to inform the client of invalid fields
          details: issues.map((e: ZodIssue) => ({
            path: e.path,
            message: e.message,
          })),
        });
      }
      next(error);
    }
  };
