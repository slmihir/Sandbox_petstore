import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

const shippingAddressSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zipCode: z.string().min(1),
});

const orderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1),
});

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  shippingAddress: shippingAddressSchema,
  promoCode: z.string().optional(),
});

// ─── Helper to format order response ───────────────

function formatOrder(order: any) {
  return {
    id: order.id,
    userId: order.userId,
    status: order.status.toLowerCase(),
    subtotal: Number(order.subtotal),
    discount: Number(order.discount),
    shippingCost: Number(order.shippingCost),
    total: Number(order.total),
    promoCode: order.promoCode,
    shippingAddress: order.shippingAddress,
    items: order.items?.map((item: any) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      price: Number(item.price),
    })) || [],
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}

// ─── GET /api/orders ───────────────────────────────

router.get('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders.map(formatOrder));
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/orders/:id ───────────────────────────

router.get('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id as string },
      include: { items: true },
    });

    if (!order) {
      throw new AppError(404, 'Order not found.');
    }

    // Users can only see their own orders (admins can see all)
    if (order.userId !== req.userId && req.userRole !== 'ADMIN') {
      throw new AppError(403, 'Access denied.');
    }

    res.json(formatOrder(order));
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/orders ──────────────────────────────

router.post('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { items, shippingAddress, promoCode } = createOrderSchema.parse(req.body);

    // Fetch products and validate stock
    const productIds = items.map(i => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      throw new AppError(400, 'One or more products not found.');
    }

    const productMap = new Map(products.map(p => [p.id, p]));

    // Validate stock availability
    for (const item of items) {
      const product = productMap.get(item.productId)!;
      if (!product.inStock || product.stockCount < item.quantity) {
        throw new AppError(400, `Insufficient stock for "${product.name}".`);
      }
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = items.map(item => {
      const product = productMap.get(item.productId)!;
      const lineTotal = Number(product.price) * item.quantity;
      subtotal += lineTotal;
      return {
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
      };
    });

    // Apply promo code if provided
    let discount = 0;
    if (promoCode) {
      const promo = await prisma.promoCode.findUnique({ where: { code: promoCode.toUpperCase() } });
      if (promo && promo.active) {
        discount = subtotal * (promo.discountPercent / 100);
      }
    }

    const shippingCost = subtotal >= 49 ? 0 : 5.99;
    const total = subtotal - discount + shippingCost;

    // Create order in a transaction (order + decrement stock)
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: req.userId!,
          subtotal,
          discount,
          shippingCost,
          total,
          promoCode: promoCode?.toUpperCase() || null,
          shippingAddress: shippingAddress as any,
          items: {
            create: orderItems,
          },
        },
        include: { items: true },
      });

      // Decrement stock counts
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockCount: { decrement: item.quantity },
          },
        });
      }

      return newOrder;
    });

    res.status(201).json(formatOrder(order));
  } catch (err) {
    next(err);
  }
});

export default router;
