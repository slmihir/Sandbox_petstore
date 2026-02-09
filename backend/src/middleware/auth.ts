import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import { prisma } from '../lib/prisma.js';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: string;
    }
  }
}

/**
 * Requires a valid JWT token. Attaches userId and userRole to request.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Authentication required.' });
      return;
    }

    const token = header.slice(7);
    const payload = verifyToken(token);

    // Verify user still exists
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      res.status(401).json({ message: 'User no longer exists.' });
      return;
    }

    req.userId = payload.userId;
    req.userRole = payload.role;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

/**
 * Requires the authenticated user to have ADMIN role.
 * Must be used after requireAuth.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.userRole !== 'ADMIN') {
    res.status(403).json({ message: 'Admin access required.' });
    return;
  }
  next();
}

/**
 * Optionally parses JWT if present. Does not reject unauthenticated requests.
 */
export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (header?.startsWith('Bearer ')) {
      const token = header.slice(7);
      const payload = verifyToken(token);
      req.userId = payload.userId;
      req.userRole = payload.role;
    }
  } catch {
    // Token invalid — continue as unauthenticated
  }
  next();
}
