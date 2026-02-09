import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { slugify } from '../utils/slug.js';

const router = Router();

// All admin routes require authentication + admin role
router.use(requireAuth, requireAdmin);

// ─── GET /api/admin/dashboard ──────────────────────

router.get('/dashboard', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [totalProducts, totalOrders, totalUsers, totalRevenue, recentOrders] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.order.findMany({
        include: { items: true, user: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    res.json({
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue: Number(totalRevenue._sum.total) || 0,
      },
      recentOrders: recentOrders.map(o => ({
        id: o.id,
        customer: o.user.name,
        email: o.user.email,
        total: Number(o.total),
        status: o.status.toLowerCase(),
        itemCount: o.items.length,
        createdAt: o.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/admin/orders ─────────────────────────

router.get('/orders', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, page = '1', limit = '20' } = req.query as Record<string, string>;

    const where: any = {};
    if (status) where.status = status.toUpperCase();

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, parseInt(limit));

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: true,
          user: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      orders: orders.map(o => ({
        id: o.id,
        customer: o.user.name,
        email: o.user.email,
        status: o.status.toLowerCase(),
        total: Number(o.total),
        itemCount: o.items.length,
        items: o.items.map(i => ({
          productName: i.productName,
          quantity: i.quantity,
          price: Number(i.price),
        })),
        shippingAddress: o.shippingAddress,
        createdAt: o.createdAt.toISOString(),
      })),
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    next(err);
  }
});

// ─── PATCH /api/admin/orders/:id/status ────────────

router.patch('/orders/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const statusSchema = z.object({
      status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
    });
    const { status } = statusSchema.parse(req.body);

    const order = await prisma.order.update({
      where: { id: req.params.id as string },
      data: { status },
    });

    res.json({ id: order.id, status: order.status.toLowerCase() });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/admin/products ──────────────────────

const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  category: z.enum(['FOOD', 'TOYS', 'BEDS', 'ACCESSORIES', 'GROOMING', 'HEALTH']),
  petType: z.enum(['DOG', 'CAT', 'BIRD', 'FISH', 'REPTILE', 'ALL']),
  brand: z.string().min(1, 'Brand is required'),
  price: z.number().positive('Price must be greater than 0'),
  originalPrice: z.number().positive().optional().nullable(),
  image: z.string().min(1, 'Image URL is required'),
  images: z.array(z.string()).default([]),
  description: z.string().min(1, 'Description is required'),
  features: z.array(z.string()).default([]),
  weight: z.string().min(1, 'Weight is required'),
  dimensions: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  stockCount: z.number().int().min(0).default(0),
  sku: z.string().min(1, 'SKU is required'),
});

/** Generate a unique slug — appends a suffix if the slug already exists */
async function uniqueSlug(name: string, excludeId?: string): Promise<string> {
  const base = slugify(name);
  let slug = base;
  let attempt = 0;
  while (true) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    attempt++;
    slug = `${base}-${attempt}`;
  }
}

router.post('/products', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createProductSchema.parse(req.body);

    // Check for duplicate SKU
    const existingSku = await prisma.product.findUnique({ where: { sku: data.sku } });
    if (existingSku) {
      throw new AppError(400, `A product with SKU "${data.sku}" already exists.`);
    }

    const slug = await uniqueSlug(data.name);

    const product = await prisma.product.create({
      data: {
        ...data,
        originalPrice: data.originalPrice || undefined,
        dimensions: data.dimensions || undefined,
        slug,
        inStock: data.stockCount > 0,
        images: data.images.length > 0 ? data.images : [data.image],
      },
    });

    res.status(201).json({ id: product.id, name: product.name, slug: product.slug });
  } catch (err) {
    next(err);
  }
});

// ─── PATCH /api/admin/products/:id ─────────────────

const updateProductSchema = createProductSchema.partial().extend({
  // Allow (and ignore) these extra fields the frontend might send
  id: z.string().optional(),
  slug: z.string().optional(),
  rating: z.number().optional(),
  reviewCount: z.number().optional(),
  inStock: z.boolean().optional(),
  dateAdded: z.string().optional(),
});

router.patch('/products/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = req.params.id as string;
    const existing = await prisma.product.findUnique({ where: { id: productId } });
    if (!existing) throw new AppError(404, 'Product not found.');

    // Parse and strip fields that shouldn't be written to DB
    const { id: _id, slug: _slug, rating: _rating, reviewCount: _rc, inStock: _is, dateAdded: _da, ...data } = updateProductSchema.parse(req.body);

    // Check SKU uniqueness if SKU is being changed
    if (data.sku && data.sku !== existing.sku) {
      const skuTaken = await prisma.product.findUnique({ where: { sku: data.sku } });
      if (skuTaken) throw new AppError(400, `A product with SKU "${data.sku}" already exists.`);
    }

    const slug = data.name ? await uniqueSlug(data.name, productId) : undefined;

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        ...data,
        originalPrice: data.originalPrice === null ? null : data.originalPrice,
        dimensions: data.dimensions === null ? null : data.dimensions,
        slug,
        inStock: data.stockCount !== undefined ? data.stockCount > 0 : undefined,
      },
    });

    res.json({ id: product.id, name: product.name });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/admin/products/:id ────────────────

router.delete('/products/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Product deleted.' });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/admin/inventory ──────────────────────

router.get('/inventory', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        sku: true,
        category: true,
        brand: true,
        price: true,
        stockCount: true,
        inStock: true,
      },
      orderBy: { name: 'asc' },
    });

    res.json(products.map(p => ({
      ...p,
      price: Number(p.price),
      category: p.category.toLowerCase(),
    })));
  } catch (err) {
    next(err);
  }
});

export default router;
