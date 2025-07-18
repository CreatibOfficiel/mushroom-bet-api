#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Setting up databases...${NC}"

# Function to check if database exists
db_exists() {
    local db_name=$1
    docker-compose -f docker-compose.dev.yml exec -T db psql -U postgres -lqt | cut -d \| -f 1 | grep -qw $db_name
}

# Function to create database if it doesn't exist
create_db_if_not_exists() {
    local db_name=$1
    if db_exists $db_name; then
        echo -e "${GREEN}✓ Database '$db_name' already exists${NC}"
    else
        echo -e "${YELLOW}📝 Creating database '$db_name'...${NC}"
        docker-compose -f docker-compose.dev.yml exec -T db psql -U postgres -c "CREATE DATABASE $db_name;"
        echo -e "${GREEN}✓ Database '$db_name' created${NC}"
    fi
}

# Wait for PostgreSQL to be ready
echo -e "${YELLOW}⏳ Waiting for PostgreSQL to be ready...${NC}"
until docker-compose -f docker-compose.dev.yml exec -T db pg_isready -U postgres > /dev/null 2>&1; do
    sleep 1
done
echo -e "${GREEN}✓ PostgreSQL is ready${NC}"

# Create databases
create_db_if_not_exists "mushroom"
create_db_if_not_exists "mushroom_test"

echo -e "${GREEN}🎉 Database setup completed!${NC}" 