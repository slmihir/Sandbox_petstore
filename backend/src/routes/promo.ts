import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

const validateSchema = z.object({
  code: z.string().min(1, 'Promo code is required'),
});

// ─── POST /api/promo/validate ──────────────────────

router.post('/validate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = validateSchema.parse(req.body);

    const promo = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase().trim() },
    });

    if (!promo || !promo.active) {
      throw new AppError(404, 'Invalid promo code.');
    }

    res.json({
      code: promo.code,
      discountPercent: promo.discountPercent,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
