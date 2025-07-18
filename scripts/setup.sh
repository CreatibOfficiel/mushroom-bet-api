#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "🍄 Mushroom Bet API - Development Setup"
echo "======================================"
echo -e "${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker and try again.${NC}"
    exit 1
fi

# Setup environment variables
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}📋 Creating .env file from template...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created${NC}"
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Start Docker services
echo -e "${YELLOW}🐳 Starting Docker services...${NC}"
docker-compose -f docker-compose.dev.yml up -d
echo -e "${GREEN}✓ Docker services started${NC}"

# Setup databases
echo -e "${YELLOW}🗄️  Setting up databases...${NC}"
chmod +x scripts/setup-db.sh
./scripts/setup-db.sh

# Apply migrations to main database
echo -e "${YELLOW}📝 Applying migrations to main database...${NC}"
npx prisma migrate deploy
echo -e "${GREEN}✓ Main database migrations applied${NC}"

# Apply migrations to test database
echo -e "${YELLOW}📝 Applying migrations to test database...${NC}"
DATABASE_URL="postgres://postgres:postgres@localhost:5432/mushroom_test" npx prisma migrate deploy
echo -e "${GREEN}✓ Test database migrations applied${NC}"

# Seed main database
echo -e "${YELLOW}🌱 Seeding main database...${NC}"
npm run seed
echo -e "${GREEN}✓ Main database seeded${NC}"

# Seed test database
echo -e "${YELLOW}🌱 Seeding test database...${NC}"
DATABASE_URL="postgres://postgres:postgres@localhost:5432/mushroom_test" npm run seed
echo -e "${GREEN}✓ Test database seeded${NC}"

# Generate Prisma client
echo -e "${YELLOW}⚙️  Generating Prisma client...${NC}"
npx prisma generate
echo -e "${GREEN}✓ Prisma client generated${NC}"

echo -e "${GREEN}"
echo "🎉 Setup completed successfully!"
echo ""
echo "You can now:"
echo "  • Start the development server: npm run start:dev"
echo "  • Run tests: npm test"
echo "  • Run e2e tests: npm run test:e2e"
echo "  • View the app at: http://localhost:3001"
echo -e "${NC}" 