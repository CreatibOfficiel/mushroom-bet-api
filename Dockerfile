ARG BUN_VERSION=1.1.29

# ——— Build stage —————————————————————————————————————————————————————
FROM oven/bun:${BUN_VERSION} AS build
WORKDIR /app

# Copy dependencies first to leverage Docker cache
COPY bun.lockb package.json ./
RUN bun install --frozen-lockfile

# Copy the rest of the code
COPY . .

# Generate Prisma client, compile TypeScript, then clean up
RUN bun run prisma:generate \
 && bun run build

# ——— Runtime stage ——————————————————————————————————————————————————
FROM oven/bun:${BUN_VERSION} AS runtime
WORKDIR /app

# Copy compiled artifacts and Prisma client from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma

# Environment variables
ENV NODE_ENV=production \
    PORT=3001 \
    DATABASE_URL=postgresql://postgres:postgres@db:5432/mushroom

EXPOSE 3001
CMD ["bun", "dist/main.js"]
