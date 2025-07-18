#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}"
echo "🧹 Mushroom Bet API - Environment Reset"
echo "======================================="
echo -e "${NC}"

echo -e "${RED}⚠️  This will completely reset your development environment!${NC}"
echo -e "${YELLOW}This includes:${NC}"
echo "  • Stopping all Docker containers"
echo "  • Removing Docker volumes (data will be lost)"
echo "  • Cleaning node_modules"
echo "  • Removing generated Prisma client"
echo ""
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${GREEN}Reset cancelled.${NC}"
    exit 0
fi

echo -e "${YELLOW}🛑 Stopping Docker services...${NC}"
docker-compose -f docker-compose.dev.yml down -v

echo -e "${YELLOW}🗑️  Removing Docker volumes...${NC}"
docker volume prune -f

echo -e "${YELLOW}🧹 Cleaning node_modules...${NC}"
rm -rf node_modules

echo -e "${YELLOW}🧹 Cleaning Prisma client...${NC}"
rm -rf node_modules/@prisma node_modules/.prisma

echo -e "${GREEN}✨ Environment reset completed!${NC}"
echo ""
echo -e "${BLUE}To set up again, run:${NC}"
echo "  npm run setup" 