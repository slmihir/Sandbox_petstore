import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import { requireAuth } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// ─── Validation Schemas ────────────────────────────

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

// ─── Helper to format user response (never expose password hash) ───

function formatUser(user: { id: string; name: string; email: string; role: string; avatarUrl: string | null; createdAt: Date }) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role.toLowerCase(),
    avatar: user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`,
    joinedDate: user.createdAt.toISOString().split('T')[0],
  };
}

// ─── POST /api/auth/signup ─────────────────────────

router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = signupSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError(409, 'An account with that email already exists.');
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`,
      },
    });

    const token = signToken({ userId: user.id, role: user.role });

    res.status(201).json({
      token,
      user: formatUser(user),
    });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/auth/login ──────────────────────────

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError(401, 'No account found with that email.');
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      throw new AppError(401, 'Incorrect password.');
    }

    const token = signToken({ userId: user.id, role: user.role });

    res.json({
      token,
      user: formatUser(user),
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/auth/me ──────────────────────────────

router.get('/me', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      throw new AppError(404, 'User not found.');
    }

    res.json({ user: formatUser(user) });
  } catch (err) {
    next(err);
  }
});

export default router;
