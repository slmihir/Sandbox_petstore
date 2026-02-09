// env loading happens in config/env.ts before validation
import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { prisma } from './lib/prisma.js';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import reviewRoutes from './routes/reviews.js';
import orderRoutes from './routes/orders.js';
import testimonialRoutes from './routes/testimonials.js';
import promoRoutes from './routes/promo.js';
import adminRoutes from './routes/admin.js';

const app = express();

// ─── Middleware ─────────────────────────────────────

app.use(cors({
  origin: env.CORS_ORIGIN.split(',').map(s => s.trim()),
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

// ─── Health check ──────────────────────────────────

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Routes ────────────────────────────────────────

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/promo', promoRoutes);
app.use('/api/admin', adminRoutes);

// ─── Error Handler ─────────────────────────────────

app.use(errorHandler);

// ─── Start Server ──────────────────────────────────

async function start() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('Connected to PostgreSQL database.');

    app.listen(env.PORT, () => {
      console.log(`PawParadise API running on http://localhost:${env.PORT}`);
      console.log(`Environment: ${env.NODE_ENV}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received. Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

start();
