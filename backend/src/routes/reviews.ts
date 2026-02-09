import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1, 'Comment is required').max(2000),
});

// ─── GET /api/reviews/:productId ───────────────────

router.get('/:productId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = req.params.productId as string;
    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(reviews.map(r => ({
      id: r.id,
      productId: r.productId,
      userId: r.userId,
      userName: r.userName,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt.toISOString(),
    })));
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/reviews/:productId ──────────────────

router.post('/:productId', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = req.params.productId as string;
    const { rating, comment } = createReviewSchema.parse(req.body);

    // Verify product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new AppError(404, 'Product not found.');
    }

    // Get user name
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      throw new AppError(404, 'User not found.');
    }

    // Check if user already reviewed this product
    const existing = await prisma.review.findFirst({
      where: { productId, userId: req.userId },
    });
    if (existing) {
      throw new AppError(409, 'You have already reviewed this product.');
    }

    // Create review and update product rating/count in a transaction
    const review = await prisma.$transaction(async (tx) => {
      const newReview = await tx.review.create({
        data: {
          productId,
          userId: req.userId!,
          userName: user.name,
          rating,
          comment,
        },
      });

      // Recalculate product average rating and review count
      const agg = await tx.review.aggregate({
        where: { productId },
        _avg: { rating: true },
        _count: { id: true },
      });

      await tx.product.update({
        where: { id: productId },
        data: {
          rating: Math.round((agg._avg.rating || 0) * 10) / 10,
          reviewCount: agg._count.id,
        },
      });

      return newReview;
    });

    res.status(201).json({
      id: review.id,
      productId: review.productId,
      userId: review.userId,
      userName: review.userName,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt.toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
