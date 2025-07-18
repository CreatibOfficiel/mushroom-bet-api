#!/bin/bash
set -euo pipefail

echo "📡 Waiting for the database to be ready..."
until npx prisma migrate status --schema=./prisma/schema.prisma > /dev/null 2>&1; do
  echo "  ↪︎ still unavailable – retrying in 2s"
  sleep 2
done

echo "🔧 Generating Prisma client..."
npx prisma generate

echo "✅ Database is up – running migrations"
npx prisma migrate deploy --schema=./prisma/schema.prisma

echo "🌱 Checking if database needs seeding..."
# Create a simple check script in the app directory
cat << 'EOF' > ./check-seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAndSeed() {
  try {
    const count = await prisma.skin.count();
    console.log(`Found ${count} skins in database`);
    
    if (count === 0) {
      console.log('🌱 Database is empty, needs seeding');
      process.exit(1); // Exit code 1 means "needs seeding"
    } else {
      console.log('✅ Database already has skins, skipping seed');
      process.exit(0); // Exit code 0 means "no seeding needed"
    }
  } catch (error) {
    console.log('🌱 Error checking database, will seed to be safe:', error.message);
    process.exit(1); // Exit code 1 means "needs seeding"
  } finally {
    await prisma.$disconnect();
  }
}

checkAndSeed();
EOF

# Run the check and seed if needed
if ! node ./check-seed.js; then
  echo "🌱 Seeding database with skins..."
  npm run seed
  echo "✅ Database seeded successfully!"
fi

# Clean up temp file
rm -f ./check-seed.js

if [ "$NODE_ENV" = "production" ]; then
  echo "🚀 Launching API (production)"
  exec npm run start
else
  echo "🚀 Starting application (development)"
  exec npm run start:dev
fi
