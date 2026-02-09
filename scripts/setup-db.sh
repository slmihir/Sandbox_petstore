#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────
# PawParadise — Database Setup Script
# Creates a fresh PostgreSQL database, runs migrations, and seeds data.
#
# Usage:
#   chmod +x scripts/setup-db.sh
#   ./scripts/setup-db.sh
#
# Options (via environment variables):
#   DB_NAME     — database name   (default: pawparadise_db)
#   DB_USER     — postgres user   (default: current OS user)
#   DB_HOST     — postgres host   (default: localhost)
#   DB_PORT     — postgres port   (default: 5432)
# ──────────────────────────────────────────────────────────

set -euo pipefail

# ─── Configuration ────────────────────────────────────────
DB_NAME="${DB_NAME:-pawparadise_db}"
DB_USER="${DB_USER:-$(whoami)}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKEND_DIR="$PROJECT_ROOT/backend"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔══════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║       PawParadise — Database Setup           ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════╝${NC}"
echo ""

# ─── Step 1: Check prerequisites ─────────────────────────
echo -e "${YELLOW}[1/6]${NC} Checking prerequisites..."

if ! command -v psql &> /dev/null; then
  echo -e "${RED}Error: PostgreSQL CLI (psql) not found.${NC}"
  echo "  Install PostgreSQL first:"
  echo "    macOS:  brew install postgresql@16"
  echo "    Ubuntu: sudo apt install postgresql postgresql-contrib"
  exit 1
fi

if ! command -v node &> /dev/null; then
  echo -e "${RED}Error: Node.js not found. Please install Node.js 18+.${NC}"
  exit 1
fi

if ! command -v npx &> /dev/null; then
  echo -e "${RED}Error: npx not found. Please install Node.js 18+.${NC}"
  exit 1
fi

# Check if PostgreSQL server is running
if ! pg_isready -h "$DB_HOST" -p "$DB_PORT" -q 2>/dev/null; then
  echo -e "${RED}Error: PostgreSQL server is not running at $DB_HOST:$DB_PORT.${NC}"
  echo "  Start it with:"
  echo "    macOS:  brew services start postgresql@16"
  echo "    Linux:  sudo systemctl start postgresql"
  exit 1
fi

echo -e "  ${GREEN}✓${NC} PostgreSQL is running"
echo -e "  ${GREEN}✓${NC} Node.js $(node --version) found"

# ─── Step 2: Create database ─────────────────────────────
echo ""
echo -e "${YELLOW}[2/6]${NC} Creating database '${DB_NAME}'..."

if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -lqt 2>/dev/null | cut -d\| -f1 | grep -qw "$DB_NAME"; then
  echo -e "  ${YELLOW}⚠${NC}  Database '$DB_NAME' already exists."
  read -p "  Drop and recreate it? (y/N): " CONFIRM
  if [[ "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo "  Dropping existing database..."
    dropdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME" 2>/dev/null || true
    createdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME"
    echo -e "  ${GREEN}✓${NC} Database recreated"
  else
    echo -e "  ${GREEN}✓${NC} Using existing database"
  fi
else
  createdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME"
  echo -e "  ${GREEN}✓${NC} Database created"
fi

# ─── Step 3: Generate .env if not present ─────────────────
echo ""
echo -e "${YELLOW}[3/6]${NC} Configuring environment..."

ENV_FILE="$BACKEND_DIR/.env"
ENV_EXAMPLE="$BACKEND_DIR/.env.example"

# Build the DATABASE_URL
DATABASE_URL="postgresql://${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

# Generate a random JWT secret
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(48).toString('hex'))")

if [ -f "$ENV_FILE" ]; then
  echo -e "  ${YELLOW}⚠${NC}  .env already exists. Updating DATABASE_URL..."
  # Update DATABASE_URL in existing .env
  if grep -q "^DATABASE_URL=" "$ENV_FILE"; then
    sed -i.bak "s|^DATABASE_URL=.*|DATABASE_URL=\"${DATABASE_URL}\"|" "$ENV_FILE" && rm -f "$ENV_FILE.bak"
  else
    echo "DATABASE_URL=\"${DATABASE_URL}\"" >> "$ENV_FILE"
  fi
  echo -e "  ${GREEN}✓${NC} DATABASE_URL updated in .env"
else
  cat > "$ENV_FILE" << EOF
# ─── Database ────────────────────────────────────────
DATABASE_URL="${DATABASE_URL}"

# ─── Authentication ──────────────────────────────────
JWT_SECRET="${JWT_SECRET}"
JWT_EXPIRES_IN="7d"

# ─── Server ──────────────────────────────────────────
PORT=3001
NODE_ENV="development"

# ─── CORS ────────────────────────────────────────────
CORS_ORIGIN="http://localhost:5173,http://localhost:5174"
EOF
  echo -e "  ${GREEN}✓${NC} .env created with a fresh JWT secret"
fi

# ─── Step 4: Install dependencies ─────────────────────────
echo ""
echo -e "${YELLOW}[4/6]${NC} Installing backend dependencies..."

cd "$BACKEND_DIR"
npm install --silent 2>&1 | tail -1
echo -e "  ${GREEN}✓${NC} Dependencies installed"

# ─── Step 5: Run Prisma migrations ────────────────────────
echo ""
echo -e "${YELLOW}[5/6]${NC} Running database migrations..."

npx prisma generate --schema="$BACKEND_DIR/prisma/schema.prisma" 2>&1 | tail -1
npx prisma migrate dev --name init --schema="$BACKEND_DIR/prisma/schema.prisma" 2>&1 | tail -3
echo -e "  ${GREEN}✓${NC} Migrations applied"

# ─── Step 6: Seed the database ────────────────────────────
echo ""
echo -e "${YELLOW}[6/6]${NC} Seeding database with demo data..."

npx tsx "$BACKEND_DIR/prisma/seed.ts"
echo -e "  ${GREEN}✓${NC} Database seeded"

# ─── Done ─────────────────────────────────────────────────
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          Setup Complete!                      ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  Database:  ${BLUE}${DB_NAME}${NC}"
echo -e "  Host:      ${DB_HOST}:${DB_PORT}"
echo -e "  User:      ${DB_USER}"
echo ""
echo -e "  ${YELLOW}Next steps:${NC}"
echo "    1. cd backend && npm run dev     # Start API server"
echo "    2. cd storefront && npm run dev  # Start storefront"
echo "    3. cd admin && npm run dev       # Start admin panel"
echo ""
echo -e "  ${YELLOW}Demo credentials:${NC}"
echo "    Admin:    admin@pawparadise.com / admin123"
echo "    Customer: jane@example.com / password123"
echo ""
