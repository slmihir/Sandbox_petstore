# PawParadise

Full-stack e-commerce platform for pet products. Built with React, Express, PostgreSQL, Prisma, and React Native (Expo).

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
├── mobile/           # Native mobile admin app (iOS + Android, Expo)
│   └── src/
│       ├── screens/       # Login, Dashboard, Orders, Inventory, Profile
│       ├── services/      # API client layer (mirrors web admin)
│       ├── navigation/    # React Navigation (tabs + stacks)
│       ├── components/    # Reusable UI components
│       ├── context/       # Auth state management
│       └── theme/         # Colors, spacing constants
├── shared/           # Shared TypeScript types
└── scripts/          # Database setup automation
```

**Storefront** (`localhost:5173`) — the main app. Contains the customer shop AND the admin panel at `/admin`. Admin access requires logging in with an admin account.

**Backend API** (`localhost:3001`) — REST API. Handles auth, products, orders, reviews, and admin operations.

**Admin (standalone)** (`localhost:5174`) — optional separate admin app. The same functionality is built into the storefront at `/admin`, so this is only needed if you want a standalone admin portal.

**Mobile Admin** (iOS + Android) — native mobile app for admin tasks. Connects to the same backend API. Built with React Native and Expo.

## Tech Stack

| Layer     | Technology                                           |
| --------- | ---------------------------------------------------- |
| Frontend  | React 19, TypeScript, Tailwind CSS 4, Vite 6         |
| Mobile    | React Native 0.81, Expo SDK 54, TypeScript           |
| Backend   | Node.js, Express 5, TypeScript                       |
| Database  | PostgreSQL                                           |
| ORM       | Prisma 6                                             |
| Auth      | JWT (jsonwebtoken + bcrypt)                          |
| Validation| Zod (backend), custom validators (frontend)          |
| Icons     | Lucide React (web), Ionicons (mobile)                |
| Routing   | React Router 7 (web), React Navigation 7 (mobile)   |

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
| 

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

## Mobile Admin App (iOS + Android)

The mobile app provides a native admin experience for managing orders and inventory on the go. It connects to the same backend API used by the web admin panel.

### Mobile Tech Stack

| Layer       | Technology                                     |
| ----------- | ---------------------------------------------- |
| Framework   | React Native 0.81, Expo SDK 54                 |
| Language    | TypeScript 5.9                                 |
| Navigation  | React Navigation 7 (bottom tabs + native stack)|
| Storage     | AsyncStorage (JWT token persistence)           |
| Icons       | @expo/vector-icons (Ionicons)                  |
| UI          | Plain React Native components + StyleSheet     |

### Mobile Prerequisites

- **Node.js** 18+ (same as the backend)
- **Expo CLI** (installed automatically via npx)
- **For iOS**: macOS with [Xcode](https://developer.apple.com/xcode/) installed (includes iOS Simulator)
- **For Android**: [Android Studio](https://developer.android.com/studio) with:
  - Android SDK (API 36 recommended)
  - Android Emulator with a virtual device created
  - Environment variables configured:
    ```bash
    export ANDROID_HOME=$HOME/Library/Android/sdk
    export PATH=$PATH:$ANDROID_HOME/emulator
    export PATH=$PATH:$ANDROID_HOME/platform-tools
    ```

### Mobile Quick Start

#### 1. Install dependencies

```bash
npm run install:mobile
```

#### 2. Start the backend API

The mobile app needs the backend running:

```bash
npm run dev:api
```

#### 3. Start Expo and launch on a device/simulator

```bash
npm run dev:mobile
```

Once the Expo dev server starts, press:
- **`i`** — open on iOS Simulator
- **`a`** — open on Android Emulator
- Scan the QR code with **Expo Go** on a physical device

#### 4. Login

Use the same admin credentials:

| Email                    | Password     |
| ------------------------ | ------------ |
| admin@pawparadise.com    | admin123     |

### App Features & Navigation

The app uses a bottom tab navigator with 4 tabs:

```
Login Screen
  └── (authenticated) → Bottom Tabs
       ├── Dashboard    — Stats cards, recent orders, category breakdown
       ├── Orders       — Order list with status filters, search, pagination
       │   └── Order Detail — Full order info + status update actions
       ├── Inventory    — Product list with search, sort, stock badges
       │   └── Product Form — Add/Edit product (all fields)
       └── Profile      — User info, role badge, sign out
```

**Dashboard** — Displays 4 stat cards (total products, orders, revenue, users), a recent orders list (tap to view details), and a category breakdown with colored progress bars. Supports pull-to-refresh.

**Orders** — FlatList with horizontal status filter chips (All, Pending, Processing, Shipped, Delivered, Cancelled). Includes search by order ID, customer name, email, or product name. Supports pagination with "Load More". Tap an order to view details and update its status with contextual action buttons (Confirm, Ship, Mark Delivered, Cancel).

**Inventory** — Product list with stock level badges (green for in-stock, amber for low stock, red for out of stock). Search by product name, sort by name/price/category. Tap edit to modify a product or tap "Add Product" to create a new one. Swipe-style delete with confirmation dialog.

**Profile** — Displays the logged-in admin's name, email, role badge, and join date. Sign out button with confirmation alert. Shows app version.

### Mobile API Configuration

The app automatically selects the correct API URL based on the platform:

| Platform          | API URL                        |
| ----------------- | ------------------------------ |
| iOS Simulator     | `http://localhost:3001/api`    |
| Android Emulator  | `http://10.0.2.2:3001/api`    |
| Physical Device   | Set via `app.json` (see below) |

Android emulators cannot reach `localhost` directly — `10.0.2.2` maps to the host machine's loopback address.

**For physical devices** or custom API URLs, add `extra.apiUrl` to `mobile/app.json`:

```json
{
  "expo": {
    "extra": {
      "apiUrl": "http://192.168.1.100:3001/api"
    }
  }
}
```

Replace `192.168.1.100` with your machine's local IP address (find it with `ifconfig | grep inet`).

### Mobile File Structure

```
mobile/
├── App.tsx                          # Root: SafeAreaProvider → AuthProvider → Navigation
├── app.json                         # Expo config (name, icons, bundle IDs)
├── package.json
├── tsconfig.json
├── assets/                          # App icons, splash screen
└── src/
    ├── config/api.ts                # API_BASE_URL (platform-aware)
    ├── types/index.ts               # TypeScript interfaces
    ├── services/
    │   ├── storage.ts               # AsyncStorage token helpers
    │   ├── api.ts                   # Base request<T>() + ApiError class
    │   ├── authApi.ts               # login(), me()
    │   ├── adminApi.ts              # dashboard, orders, inventory, products CRUD
    │   └── productsApi.ts           # Product listing, brands, categories
    ├── context/AuthContext.tsx       # Auth state, login/logout, token persistence
    ├── navigation/
    │   ├── RootNavigator.tsx        # Login vs AppTabs based on auth state
    │   └── AppTabs.tsx              # Bottom tabs + nested stack navigators
    ├── screens/
    │   ├── LoginScreen.tsx          # Dark-themed login form
    │   ├── DashboardScreen.tsx      # Stats, recent orders, category bars
    │   ├── OrdersScreen.tsx         # Order list with filters + search
    │   ├── OrderDetailScreen.tsx    # Order detail + status actions
    │   ├── InventoryScreen.tsx      # Product list + search/sort
    │   ├── ProductFormScreen.tsx    # Add/Edit product form
    │   └── ProfileScreen.tsx        # User info + sign out
    ├── components/                  # StatCard, StatusBadge, SearchBar, etc.
    ├── hooks/useRefresh.ts          # Pull-to-refresh helper
    └── theme/
        ├── colors.ts                # Color constants
        └── spacing.ts               # Spacing & radius constants
```

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

| Script                 | Description                                       |
| ---------------------- | ------------------------------------------------- |
| `npm run install:all`  | Install deps for backend, storefront, and admin   |
| `npm run install:mobile`| Install deps for the mobile app                  |
| `npm run setup`        | Automated database setup (create, migrate, seed)  |
| `npm run dev`          | Start all web services (API + storefront + admin) |
| `npm run dev:api`      | Start backend API only                            |
| `npm run dev:store`    | Start storefront only                             |
| `npm run dev:admin`    | Start standalone admin only                       |
| `npm run dev:mobile`   | Start Expo dev server for the mobile app          |
| `npm run build:all`    | Build backend + storefront + admin for production |
| `npm run db:migrate`   | Run Prisma migrations                             |
| `npm run db:seed`      | Seed demo data                                    |
| `npm run db:reset`     | Reset database (drop + migrate + seed)            |
| `npm run db:studio`    | Open Prisma Studio GUI                            |

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

**Mobile: "Network request failed" on Android emulator**
Android emulators can't reach `localhost`. The app handles this automatically (`10.0.2.2`), but if you previously had `extra.apiUrl` set in `mobile/app.json`, it overrides the platform detection. Remove the `extra` block and restart Expo with cache cleared: `cd mobile && npx expo start --clear`.

**Mobile: Images not loading on Android emulator**
The emulator's DNS may not be resolving external hostnames. Kill the emulator and relaunch it with custom DNS:
```bash
emulator -avd <Your_AVD_Name> -dns-server 8.8.8.8,8.8.4.4
```

**Mobile: Content overlapping the status bar / Dynamic Island**
All screens use `SafeAreaView` from `react-native-safe-area-context`. If you add a new screen, wrap it with `<SafeAreaView edges={['top']}>` — do NOT use the deprecated `SafeAreaView` from `react-native`.

**Mobile: Expo config changes not taking effect**
After modifying `mobile/app.json`, restart Expo with cache cleared:
```bash
cd mobile && npx expo start --clear
```

**Mobile: Android emulator not detected by Expo**
Ensure the emulator is running and detected by ADB:
```bash
adb devices
```
If nothing shows, launch the emulator manually from Android Studio or via CLI:
```bash
emulator -avd <Your_AVD_Name>
```
Then press `a` in the Expo terminal.

## License

Private project. All rights reserved.
# Sandbox_petstore
