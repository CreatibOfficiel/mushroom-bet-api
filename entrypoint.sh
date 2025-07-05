#!/usr/bin/env sh
set -euo pipefail

echo "📡 Waiting for the database to be ready..."
# `bunx` avoid installing prisma-cli globally
until bunx prisma migrate status --schema=./prisma/schema.prisma > /dev/null 2>&1; do
  echo "  ↪︎ still unavailable – retrying in 2s"
  sleep 2
done

echo "✅ Database is up – running migrations"
bunx prisma migrate deploy --schema=./prisma/schema.prisma

echo "🚀 Launching API"
# `exec` replace the shell by the Bun process → signals are correctly propagated
exec bun run start
