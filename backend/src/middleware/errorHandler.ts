import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { env } from '../config/env.js';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  // Zod validation errors
  if (err instanceof ZodError) {
    const fieldErrors = err.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    // Build a human-readable summary
    const summary = fieldErrors.map(e => e.field ? `${e.field}: ${e.message}` : e.message).join('; ');
    res.status(400).json({
      message: summary || 'Validation failed.',
      errors: fieldErrors,
    });
    return;
  }

  // Prisma unique constraint violations (e.g. duplicate SKU, slug, email)
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
    const target = (err.meta?.target as string[])?.join(', ') || 'field';
    res.status(400).json({
      message: `A record with that ${target} already exists.`,
    });
    return;
  }

  // Known app errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  // Unknown errors
  console.error('Unhandled error:', err);
  res.status(500).json({
    message: env.NODE_ENV === 'production'
      ? 'An unexpected error occurred.'
      : err.message,
  });
}
