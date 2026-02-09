# PawParadise

Full-stack e-commerce platform for pet products. Built with React, Express, PostgreSQL, and Prisma.

## Architecture

```
pawparadise/
├── backend/          # Express API server (Node.js + TypeScript)
│   ├── prisma/       # Database schema, migrations, seed script
│   └── src/          # API routes, middleware, config
├── storefront/       # Customer-facing React app (includes /admin panel)
│   └── src/
│       ├── pages/admin/   # Admin dashboard, inventory, orders
│       └── pages/         # Shop, cart, checkout, account, etc.
├── admin/            # Standalone admin panel (optional, runs on port 5174)
├── shared/           # Shared TypeScript types
└── scripts/          # Database setup automation
```

**Storefront** (`localhost:5173`) — the main app. Contains the customer shop AND the admin panel at `/admin`. Admin access requires logging in with an admin account.

**Backend API** (`localhost:3001`) — REST API. Handles auth, products, orders, reviews, and admin operations.

**Admin (standalone)** (`localhost:5174`) — optional separate admin app. The same functionality is built into the storefront at `/admin`, so this is only needed if you want a standalone admin portal.

## Tech Stack

| Layer     | Technology                                           |
| --------- | ---------------------------------------------------- |
| Frontend  | React 19, TypeScript, Tailwind CSS 4, Vite 6         |
| Backend   | Node.js, Express 5, TypeScript                       |
| Database  | PostgreSQL                                           |
| ORM       | Prisma 6                                             |
| Auth      | JWT (jsonwebtoken + bcrypt)                          |
| Validation| Zod (backend), custom validators (frontend)          |
| Icons     | Lucide React                                         |
| Routing   | React Router 7                                       |

## Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **PostgreSQL** 14+ running locally or remotely
- **npm** (comes with Node.js)

## Quick Start (Local Development)

### 1. Clone and install

```bash
git clone <repo-url> pawparadise
cd pawparadise
npm run install:all
```

### 2. Set up the database

**Option A — Automated setup script** (recommended):

```bash
chmod +x scripts/setup-db.sh
npm run setup
```

This will create the PostgreSQL database, generate the Prisma client, run migrations, and seed demo data.

**Option B — Manual setup:**

```bash
# Create the database
createdb pawparadise_db

# Copy and edit environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your PostgreSQL credentials

# Generate Prisma client, run migrations, seed data
cd backend
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
cd ..
```

### 3. Start all services

```bash
npm run dev
```

This starts all three services concurrently:

| Service    | URL                       |
| ---------- | ------------------------- |
| API        | http://localhost:3001      |
| Storefront | http://localhost:5173      |
| Admin      | http://localhost:5174      |

Or start individually:

```bash
npm run dev:api      # Backend only
npm run dev:store    # Storefront only
npm run dev:admin    # Standalone admin only
```

### 4. Demo credentials

| Role     | Email                    | Password     |
| -------- | ------------------------ | ------------ |
| Admin    | admin@pawparadise.com    | admin123     |
| Customer | jane@example.com         | password123  |
| Customer | john@example.com         | password123  |

Promo codes: `SAVE20` (20%), `PAWLOVE10` (10%), `WELCOME15` (15%)

## Environment Variables

All environment configuration lives in `backend/.env`. Copy from `.env.example`:

```bash
cp backend/.env.example backend/.env
```

| Variable        | Required | Default                                    | Description                              |
| --------------- | -------- | ------------------------------------------ | ---------------------------------------- |
| `DATABASE_URL`  | Yes      | —                                          | PostgreSQL connection string              |
| `JWT_SECRET`    | Yes      | —                                          | Secret for signing JWTs (min 10 chars)    |
| `JWT_EXPIRES_IN`| No       | `7d`                                       | JWT expiration (e.g. `7d`, `24h`)         |
| `PORT`          | No       | `3001`                                     | API server port                          |
| `NODE_ENV`      | No       | `development`                              | `development` or `production`             |
| `CORS_ORIGIN`   | No       | `http://localhost:5173,http://localhost:5174` | Comma-separated allowed origins         |

Frontend environment variables (optional, set in `storefront/.env` or `admin/.env`):

| Variable         | Default                       | Description          |
| ---------------- | ----------------------------- | -------------------- |
| `VITE_API_URL`   | `http://localhost:3001/api`   | Backend API base URL |

## Database

### Schema overview

- **Users** — customers and admins with bcrypt-hashed passwords
- **Products** — 6 categories (Food, Toys, Beds, Accessories, Grooming, Health), 6 pet types
- **Orders** — with items, shipping addresses, promo codes, status tracking
- **Reviews** — user reviews linked to products
- **Testimonials** — homepage testimonials
- **PromoCodes** — discount codes with percentage values

### Common commands

```bash
npm run db:migrate    # Run pending migrations (dev)
npm run db:seed       # Seed database with demo data
npm run db:reset      # Drop all tables, re-migrate, re-seed
npm run db:studio     # Open Prisma Studio (visual database browser)
```

### Connecting to a remote database

Set `DATABASE_URL` in `backend/.env` to your remote PostgreSQL URL:

```
DATABASE_URL="postgresql://user:password@your-host.com:5432/pawparadise_db?sslmode=require"
```

Then run migrations:

```bash
cd backend
npx prisma migrate deploy   # Use 'deploy' (not 'dev') for production
npm run db:seed              # Optional: seed demo data
```

## API Reference

Base URL: `http://localhost:3001/api`

### Public endpoints

| Method | Endpoint                     | Description                    |
| ------ | ---------------------------- | ------------------------------ |
| GET    | `/health`                    | Health check                   |
| POST   | `/auth/signup`               | Register new customer          |
| POST   | `/auth/login`                | Login (returns JWT)            |
| GET    | `/products`                  | List products (paginated, filterable) |
| GET    | `/products/featured`         | Featured products              |
| GET    | `/products/brands`           | List all brands                |
| GET    | `/products/categories`       | List all categories            |
| GET    | `/products/price-range`      | Min/max price range            |
| GET    | `/products/:id`              | Product detail (by ID or slug) |
| GET    | `/products/:id/related`      | Related products               |
| GET    | `/reviews/:productId`        | Reviews for a product          |
| GET    | `/testimonials`              | Homepage testimonials          |
| POST   | `/promo/validate`            | Validate a promo code          |

### Authenticated endpoints (requires `Authorization: Bearer <token>`)

| Method | Endpoint                     | Description                    |
| ------ | ---------------------------- | ------------------------------ |
| GET    | `/auth/me`                   | Current user profile           |
| POST   | `/reviews/:productId`        | Create a review                |
| GET    | `/orders`                    | List user's orders             |
| GET    | `/orders/:id`                | Order detail                   |
| POST   | `/orders`                    | Create new order               |

### Admin endpoints (requires admin role)

| Method | Endpoint                          | Description              |
| ------ | --------------------------------- | ------------------------ |
| GET    | `/admin/dashboard`                | Dashboard stats          |
| GET    | `/admin/orders`                   | All orders (paginated)   |
| PATCH  | `/admin/orders/:id/status`        | Update order status      |
| GET    | `/admin/inventory`                | Inventory list           |
| POST   | `/admin/products`                 | Create product           |
| PATCH  | `/admin/products/:id`             | Update product           |
| DELETE | `/admin/products/:id`             | Delete product           |

## Building for Production

### 1. Build everything

```bash
npm run build:all
```

This produces:
- `backend/dist/` — compiled Node.js server
- `storefront/dist/` — static files for the storefront
- `admin/dist/` — static files for the standalone admin (optional)

### 2. Run the API in production

```bash
cd backend
NODE_ENV=production node dist/index.js
```

### 3. Serve the frontend

The `storefront/dist/` and `admin/dist/` folders contain static files. Serve them with any static file server or CDN.

**With a reverse proxy (nginx, Caddy, ALB, CloudFront):**

- Route `/api/*` to the backend (e.g. `localhost:3001`)
- Serve `storefront/dist/` at the root `/`
- For the SPA router, configure fallback to `index.html` for all non-file routes

## Deploying to AWS

### Option A: EC2 + RDS (simple)

1. **RDS** — Create a PostgreSQL instance. Copy the connection string.
2. **EC2** — Launch an instance. Install Node.js 20+.
3. **Deploy backend:**
   ```bash
   # On EC2
   cd backend
   npm ci --production
   npx prisma migrate deploy
   npm run db:seed  # first time only
   NODE_ENV=production PORT=3001 node dist/index.js
   ```
   Use PM2 or systemd to keep the process alive.
4. **Deploy frontend:**
   Upload `storefront/dist/` to S3 + CloudFront, or serve via nginx on EC2.
5. **Set environment variables** on EC2 (via `.env` file, SSM Parameter Store, or Secrets Manager).

### Option B: ECS / Fargate (containerized)

Create a `Dockerfile` for the backend:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci
COPY backend/ .
RUN npx prisma generate && npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

- Push to ECR, deploy on ECS/Fargate.
- Use RDS for PostgreSQL.
- Use ALB to route `/api/*` to the backend container.
- Deploy `storefront/dist/` to S3 + CloudFront.

### Option C: Elastic Beanstalk

1. Zip the `backend/` directory (with `dist/`, `prisma/`, `node_modules/`, `package.json`).
2. Create an EB environment (Node.js platform).
3. Set environment variables in the EB console.
4. Deploy the zip.
5. Serve `storefront/dist/` via S3 + CloudFront.

### Environment variables for production

```bash
DATABASE_URL="postgresql://user:pass@your-rds-host:5432/pawparadise_db?sslmode=require"
JWT_SECRET="<generate-a-64-char-random-string>"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV="production"
CORS_ORIGIN="https://yourdomain.com"
```

For the storefront build, set before building:

```bash
VITE_API_URL="https://yourdomain.com/api" npm run build:store
```

## Project Scripts

Run from the project root:

| Script               | Description                                       |
| -------------------- | ------------------------------------------------- |
| `npm run install:all`| Install deps for backend, storefront, and admin   |
| `npm run setup`      | Automated database setup (create, migrate, seed)  |
| `npm run dev`        | Start all services (API + storefront + admin)     |
| `npm run dev:api`    | Start backend API only                            |
| `npm run dev:store`  | Start storefront only                             |
| `npm run dev:admin`  | Start standalone admin only                       |
| `npm run build:all`  | Build backend + storefront + admin for production |
| `npm run db:migrate` | Run Prisma migrations                             |
| `npm run db:seed`    | Seed demo data                                    |
| `npm run db:reset`   | Reset database (drop + migrate + seed)            |
| `npm run db:studio`  | Open Prisma Studio GUI                            |

## Troubleshooting

**"The column users.password_hash does not exist"**
The Prisma client is out of sync. Run `cd backend && npx prisma generate && npx prisma migrate deploy`.

**CORS errors in the browser console**
Ensure `CORS_ORIGIN` in `backend/.env` includes your frontend's origin. For local dev: `http://localhost:5173,http://localhost:5174`.

**"Invalid or expired token" on admin actions**
Your JWT may have expired. Log out and log back in.

**Database connection refused**
Ensure PostgreSQL is running: `pg_isready -h localhost`. Start it with `brew services start postgresql@16` (macOS) or `sudo systemctl start postgresql` (Linux).

**Backend uses wrong database**
If you have `DATABASE_URL` set in your shell environment, it may override `backend/.env`. Either unset it (`unset DATABASE_URL`) or the backend's dotenv config will auto-override it.

## License

Private project. All rights reserved.
# Sandbox_petstore
