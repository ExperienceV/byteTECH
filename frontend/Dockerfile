# Multi-stage Dockerfile for Next.js frontend (Node 18 Alpine)

# 1) Base dependencies layer
FROM node:18-alpine AS deps
WORKDIR /app

# Install system deps (optional: for sharp or other native deps)
RUN apk add --no-cache libc6-compat

# Copy only package manifests for better caching
COPY package.json package-lock.json* ./

# Install production + dev deps for building
RUN npm ci

# 2) Builder layer
FROM node:18-alpine AS builder
WORKDIR /app

ENV NODE_ENV=production

# Copy node_modules from deps
COPY --from=deps /app/node_modules ./node_modules
# Copy the rest of the app
COPY . .

# Build Next.js app
RUN npm run build

# 3) Runner layer
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create a non-root user for better security
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Copy only the necessary build artifacts
# .next/standalone contains a minimal Node server with compiled app
# .next/static are static assets served by Next.js
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/package.json ./package.json

# If you use env files at runtime, uncomment
# COPY --from=builder /app/.env.production ./.env.production

# Ensure correct permissions
USER nextjs

# Default port for Next.js
EXPOSE 3000

# Start the server from the standalone output
ENV PORT=3000
CMD ["node", "server.js"]
