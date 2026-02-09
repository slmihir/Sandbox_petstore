import { Router, Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// ─── Helper to format product for API response ────

function formatProduct(p: any) {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category.toLowerCase(),
    petType: p.petType.toLowerCase(),
    brand: p.brand,
    price: Number(p.price),
    originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
    image: p.image,
    images: p.images,
    description: p.description,
    features: p.features,
    weight: p.weight,
    dimensions: p.dimensions,
    rating: Number(p.rating),
    reviewCount: p.reviewCount,
    featured: p.featured,
    inStock: p.inStock,
    stockCount: p.stockCount,
    sku: p.sku,
    dateAdded: p.createdAt.toISOString().split('T')[0],
  };
}

// ─── GET /api/products ─────────────────────────────

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      search,
      category,
      petType,
      brand,
      minPrice,
      maxPrice,
      featured,
      sort = 'newest',
      page = '1',
      limit = '20',
    } = req.query as Record<string, string | undefined>;

    const where: Prisma.ProductWhereInput = {};

    // Search
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Category filter (supports comma-separated)
    if (category) {
      const categories = category.split(',').map(c => c.toUpperCase()) as any[];
      where.category = { in: categories };
    }

    // Pet type filter
    if (petType) {
      where.OR = [
        ...(where.OR || []),
        { petType: petType.toUpperCase() as any },
        { petType: 'ALL' },
      ];
      // If search was also used, we need to restructure the query
      if (search) {
        where.AND = [
          {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { brand: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          },
          {
            OR: [
              { petType: petType.toUpperCase() as any },
              { petType: 'ALL' },
            ],
          },
        ];
        delete where.OR;
      }
    }

    // Brand filter
    if (brand) {
      where.brand = brand;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    // Featured filter
    if (featured === 'true') {
      where.featured = true;
    }

    // Sorting
    let orderBy: Prisma.ProductOrderByWithRelationInput = {};
    switch (sort) {
      case 'name-asc': orderBy = { name: 'asc' }; break;
      case 'name-desc': orderBy = { name: 'desc' }; break;
      case 'price-asc': orderBy = { price: 'asc' }; break;
      case 'price-desc': orderBy = { price: 'desc' }; break;
      case 'rating': orderBy = { rating: 'desc' }; break;
      case 'newest':
      default: orderBy = { createdAt: 'desc' }; break;
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page || '1'));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit || '20')));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, orderBy, skip, take: limitNum }),
      prisma.product.count({ where }),
    ]);

    res.json({
      products: products.map(formatProduct),
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/products/featured ────────────────────

router.get('/featured', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await prisma.product.findMany({
      where: { featured: true },
      orderBy: { createdAt: 'desc' },
      take: 8,
    });
    res.json(products.map(formatProduct));
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/products/brands ──────────────────────

router.get('/brands', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const brands = await prisma.product.findMany({
      select: { brand: true },
      distinct: ['brand'],
      orderBy: { brand: 'asc' },
    });
    res.json(brands.map(b => b.brand));
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/products/categories ──────────────────

router.get('/categories', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.product.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });
    res.json(categories.map(c => c.category.toLowerCase()));
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/products/price-range ─────────────────

router.get('/price-range', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await prisma.product.aggregate({
      _min: { price: true },
      _max: { price: true },
    });
    res.json({
      min: Number(result._min.price) || 0,
      max: Number(result._max.price) || 100,
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/products/:id ─────────────────────────

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id },
          { slug: id },
        ],
      },
    });

    if (!product) {
      throw new AppError(404, 'Product not found.');
    }

    res.json(formatProduct(product));
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/products/:id/related ─────────────────

router.get('/:id/related', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id as string } });
    if (!product) {
      throw new AppError(404, 'Product not found.');
    }

    const related = await prisma.product.findMany({
      where: {
        id: { not: product.id },
        OR: [
          { category: product.category },
          { petType: product.petType },
        ],
      },
      take: 4,
      orderBy: { rating: 'desc' },
    });

    res.json(related.map(formatProduct));
  } catch (err) {
    next(err);
  }
});

export default router;
