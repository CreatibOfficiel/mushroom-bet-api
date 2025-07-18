# ---------------------------------------------------------------------
# 1️⃣  BASE (dependencies shared by every stage)
# ---------------------------------------------------------------------
ARG NODE_VERSION=20
# The slim tag keeps the image small while still including system libs
FROM node:${NODE_VERSION}-slim AS base
WORKDIR /app

# Copy lock-file first so we can leverage Docker’s layer-cache
COPY package.json package-lock.json ./

# ---------------------------------------------------------------------
# 2️⃣  DEV STAGE (hot-reload, full tool-chain)
# ---------------------------------------------------------------------
FROM base AS dev

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Install dependencies
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Copy source after dependencies to keep cache effective
COPY . .

# Default command for local development
CMD ["npm", "run", "start:dev"]

# ---------------------------------------------------------------------
# 3️⃣  BUILD STAGE (type-checking + transpile)
# ---------------------------------------------------------------------
FROM base AS builder
ENV NODE_ENV=production

# 1. Install *toutes* les dépendances (dev + prod) :
#    - tsc, @nestjs/cli, prisma CLI, etc.
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# 2. Copie du code source
COPY . .

# 3. Génère le client Prisma **et** applique les migrations
RUN npx prisma generate \
 && npx prisma migrate deploy --schema=./prisma/schema.prisma

# 4. Transpile le projet NestJS
RUN npm run build

# 5. Ne conserve que les dépendances runtime
RUN npm ci --only=production

# ---------------------------------------------------------------------
# 4️⃣  RUNTIME STAGE (minimal, non-root)
# ---------------------------------------------------------------------
FROM node:${NODE_VERSION}-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Tiny system layer for curl used by the health-check
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl ca-certificates openssl \
    && rm -rf /var/lib/apt/lists/*

# Create non-privileged user (idempotent)
RUN id -u node &>/dev/null || adduser --disabled-password --uid 10001 node

# Copy only what the app needs to start
COPY --from=builder --chown=node:node /app/dist               ./dist
COPY --from=builder --chown=node:node /app/node_modules       ./node_modules
COPY --from=builder --chown=node:node /app/prisma/schema.prisma ./prisma/schema.prisma
COPY --from=builder --chown=node:node /app/package.json       ./package.json
COPY --from=builder --chown=node:node /app/entrypoint.sh      ./entrypoint.sh

# Self-contained health-check (fails container-wide if /health is 500/404)
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

USER node
EXPOSE 3001
CMD ["./entrypoint.sh"]    