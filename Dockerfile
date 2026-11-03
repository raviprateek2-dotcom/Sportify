# syntax=docker/dockerfile:1.4
# ==============================================================================
# SPORTIFY PRODUCTION MULTI-STAGE DOCKERFILE
# Node 20 Alpine • Standalone Output • Non-Root Security Sandbox
# ==============================================================================

# STAGE 1: Dependency resolution and caching
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
COPY prisma ./prisma/

# Install exact production + build dependencies
RUN \
  if [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  else npm install; \
  fi

# Generate Prisma Client
RUN npx prisma generate

# ------------------------------------------------------------------------------
# STAGE 2: Source compilation and Next.js build
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables for build-time compilation
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Run production build
RUN npm run build

# ------------------------------------------------------------------------------
# STAGE 3: Minimal production runtime container (<120MB)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Enforce non-root execution for enterprise security compliance
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets and standalone server package
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3000

# Healthcheck for AWS ECS / Kubernetes Liveness Probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/products || exit 1

CMD ["node", "server.js"]
