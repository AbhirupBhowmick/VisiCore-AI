# Multi-stage build for Next.js Web App
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package descriptors and lockfiles
COPY package.json package-lock.json ./
RUN npm ci

# Copy source files and build project
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production runner image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy output standalone build and public assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
