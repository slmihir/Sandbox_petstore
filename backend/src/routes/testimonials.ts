import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

// ─── GET /api/testimonials ─────────────────────────

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json(testimonials.map(t => ({
      id: t.id,
      name: t.name,
      avatar: t.avatarUrl,
      comment: t.comment,
      rating: t.rating,
      productType: t.productType,
    })));
  } catch (err) {
    next(err);
  }
});

export default router;
