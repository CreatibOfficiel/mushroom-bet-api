# ---------------------------------------------------------------------
# 1️⃣  BASE (dependencies shared by every stage)
# ---------------------------------------------------------------------
ARG BUN_VERSION=1.1.29
# The slim tag keeps the image small while still including system libs
FROM oven/bun:${BUN_VERSION}-slim AS base
WORKDIR /app

# Copy lock-file first so we can leverage Docker’s layer-cache
COPY bun.lockb package.json ./

# ---------------------------------------------------------------------
# 2️⃣  DEV STAGE (hot-reload, full tool-chain)
# ---------------------------------------------------------------------
FROM base AS dev

# Cache Bun’s global dir to accelerate rebuilds
RUN --mount=type=cache,target=/root/.bun \
    bun install --frozen-lockfile        
    # dev + prod deps

# Copy source after dependencies to keep cache effective
COPY . .

# Default command for local development
CMD ["bun", "--hot", "src/main.ts"]

# ---------------------------------------------------------------------
# 3️⃣  BUILD STAGE (type-checking + transpile)
# ---------------------------------------------------------------------
FROM base AS builder
ENV NODE_ENV=production

# 1. Install *all* deps because tsc/prisma need types
RUN --mount=type=cache,target=/root/.bun \
    bun install --frozen-lockfile

# 2. Copy code & produce artefacts
COPY . .
RUN bun run prisma:generate && bun run build

# 3. Remove dev-only packages in place
RUN bun install --production --frozen-lockfile --ignore-scripts

# ---------------------------------------------------------------------
# 4️⃣  RUNTIME STAGE (minimal, non-root)
# ---------------------------------------------------------------------
FROM oven/bun:${BUN_VERSION}-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Tiny system layer for curl used by the health-check
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Create non-privileged user (idempotent)
RUN id -u bun &>/dev/null || adduser --disabled-password --uid 10001 bun

# Copy only what the app needs to start
COPY --from=builder --chown=bun:bun /app/dist               ./dist
COPY --from=builder --chown=bun:bun /app/node_modules       ./node_modules
COPY --from=builder --chown=bun:bun /app/prisma/schema.prisma ./prisma/schema.prisma
COPY --from=builder --chown=bun:bun /app/package.json       ./package.json
COPY --from=builder --chown=bun:bun /app/entrypoint.sh      ./entrypoint.sh

# Self-contained health-check (fails container-wide if /health is 500/404)
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

USER bun
EXPOSE 3001
CMD ["./entrypoint.sh"]    